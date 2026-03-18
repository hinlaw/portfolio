import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import dayjs from 'dayjs';

export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } },
};

const scanBodySchema = z.object({
  media: z.array(z.string()).min(1, 'At least one image is required'),
  locale: z.string().optional(),
  useReceiptLanguage: z.boolean().optional(),
});

const LOCALE_TO_LANGUAGE: Record<string, string> = {
  en: 'English',
  zh: 'Simplified Chinese',
  zh_HK: 'Traditional Chinese',
};

function getExtractPrompt(locale?: string, useReceiptLanguage?: boolean): string {
  let outputLangInstruction: string;
  if (useReceiptLanguage) {
    outputLangInstruction =
      'Output merchant name, description, and any text fields in the SAME language as written on the receipt (preserve the original language of the receipt).';
  } else if (locale && LOCALE_TO_LANGUAGE[locale]) {
    outputLangInstruction = `Output merchant name, description, and any text fields in ${LOCALE_TO_LANGUAGE[locale]}.`;
  } else {
    outputLangInstruction = 'Output merchant name, description, and any text fields in English.';
  }

  return `You are a receipt/invoice parsing assistant. Extract the following information from this receipt/invoice image and return as JSON:
{
  "merchant": "merchant name (string, empty string if unknown)",
  "amount": amount as number (0 if unknown),
  "date": "date in YYYY-MM-DD format (today if unknown)",
  "description": "item description (string, can be empty)"
}
${outputLangInstruction}
Return ONLY valid JSON, no other text or markdown.`;
}

function parseJsonFromContent(content: string): Record<string, unknown> | null {
  const trimmed = content.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
  return null;
}

function toUnixSeconds(dateStr: string): number {
  const parsed = dayjs(dateStr, ['YYYY-MM-DD', 'YYYY/MM/DD', 'DD/MM/YYYY'], true);
  return parsed.isValid() ? parsed.unix() : Math.floor(Date.now() / 1000);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const parsed = scanBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid request body' });
    }

    const { media, locale, useReceiptLanguage } = parsed.data;
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OPENROUTER_API_KEY is not configured' });
    }

    const imageUrl = media[0];
    if (!imageUrl.startsWith('data:') || !imageUrl.includes('base64,')) {
      return res.status(400).json({ error: 'Invalid image format. Expected base64 data URL.' });
    }

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: getExtractPrompt(locale, useReceiptLanguage) },
              { type: 'image_url', image_url: { url: imageUrl } },
            ],
          },
        ],
      }),
    });

    if (!openRouterResponse.ok) {
      const errBody = await openRouterResponse.text();
      console.error('OpenRouter error:', openRouterResponse.status, errBody);

      let errorMessage = `AI service error: ${openRouterResponse.status}`;
      try {
        const errJson = JSON.parse(errBody) as { error?: { message?: string } };
        const openRouterMessage = errJson?.error?.message;
        if (openRouterMessage && typeof openRouterMessage === 'string') {
          errorMessage = openRouterMessage;
        }
      } catch {
        // keep default errorMessage if parse fails
      }

      return res.status(502).json({ error: errorMessage });
    }

    const data = await openRouterResponse.json() as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return res.status(502).json({ error: 'No response from AI service' });
    }

    const extracted = parseJsonFromContent(content);
    if (!extracted) {
      return res.status(502).json({ error: 'Failed to parse AI response as JSON' });
    }

    const merchant = typeof extracted.merchant === 'string' ? extracted.merchant : '';
    const amount = typeof extracted.amount === 'number' ? extracted.amount : 0;
    const dateStr = typeof extracted.date === 'string' ? extracted.date : dayjs().format('YYYY-MM-DD');
    const description = typeof extracted.description === 'string' ? extracted.description : '';

    const result = {
      merchant: merchant || null,
      amount,
      original_amount: amount,
      date: toUnixSeconds(dateStr),
      description: description || undefined,
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error('AI scan error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}

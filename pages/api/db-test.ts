import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

type Expense = {
  id: string;
  merchant: string | null;
  amount: number | null;
  date: string | null;
  imageUrl: string;
  createdAt: string;
};

type Data = {
  success: boolean;
  message: string;
  connectionTest?: boolean;
  expenses?: Expense[];
  count?: number;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    await prisma.$connect();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Connection failed";
    return res.status(500).json({
      success: false,
      message: "Supabase/Prisma 連接失敗",
      error: message,
    });
  }

  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const formatted = expenses.map((e) => ({
      id: e.id,
      merchant: e.merchant,
      amount: e.amount,
      date: e.date,
      imageUrl: e.imageUrl,
      createdAt: e.createdAt.toISOString(),
    }));

    const count = await prisma.expense.count();

    res.status(200).json({
      success: true,
      message: "Supabase + Prisma 連接成功！",
      connectionTest: true,
      expenses: formatted,
      count,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Query failed";
    res.status(500).json({
      success: false,
      message: "查詢失敗",
      connectionTest: true,
      error: message,
    });
  } finally {
    await prisma.$disconnect();
  }
}

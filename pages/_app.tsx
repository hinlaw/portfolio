import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
  const { messages, locale = "en" } = pageProps;

  return (
    <NextIntlClientProvider locale={locale} messages={messages ?? {}}>
      <Component {...pageProps} />
      <Toaster />
    </NextIntlClientProvider>
  );
}

App.getInitialProps = async (context) => {
  const locale = context.ctx.locale ?? context.ctx.router?.locale ?? "en";
  const messages = (await import(`../messages/${locale}.json`)).default;
  const pageProps = await (context.Component as any)?.getInitialProps?.(context.ctx) ?? {};
  return {
    pageProps: { ...pageProps, messages, locale },
  };
};

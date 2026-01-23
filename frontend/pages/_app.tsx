import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Manrope } from 'next/font/google';
import '../styles/globals.css';

const manrope = Manrope({
  subsets: ['latin'],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>AI Support Pro - Intelligent Customer Service Solutions</title>
      </Head>
      <div className={manrope.className}>
        <Component {...pageProps} />
      </div>
    </>
  );
}

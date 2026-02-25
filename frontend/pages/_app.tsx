import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Manrope } from 'next/font/google';
import WithLayout from '@/components/layout/with-layout';
import '../styles/globals.css';

const manrope = Manrope({
  subsets: ['latin'],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Dexter's Portfolio</title>
      </Head>
      <div className={manrope.className}>
        <WithLayout>
          <Component {...pageProps} />
        </WithLayout>
      </div>
    </>
  );
}

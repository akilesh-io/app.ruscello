import "../styles/globals.css";
import type { AppProps } from "next/app";
import Meta from "@/components/meta";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <Meta />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

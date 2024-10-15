import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from 'next-auth/react'
import Head from "next/head";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
            <Head>
              <title>Sedo</title>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" 
          integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
      </Head>
      <main>
        <div>
          <div><Navbar/></div>
          <Component {...pageProps} />
        </div>
      </main>
  </SessionProvider>
  );
}

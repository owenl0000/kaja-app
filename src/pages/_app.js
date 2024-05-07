// pages/_app.js
import '../../styles/globals.css';  // Adjust the path as needed
import '../../styles/Slideshow.css';
import '../../styles/Filter.css';
import '../../styles/Sidebar.css';
import '../../styles/TimePicker.css';
import '../../styles/Header.css';
import '../../styles/Planner.css';
import Head from 'next/head'
import { SessionProvider } from "next-auth/react";
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <Head>
      </Head>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  )
}

export default MyApp;

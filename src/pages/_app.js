// pages/_app.js
import '../../styles/globals.css';  // Adjust the path as needed
import '../../styles/Slideshow.css';
import '../../styles/Filter.css';
import '../../styles/Sidebar.css';
import '../../styles/TimePicker.css';
import '../../styles/Header.css';
import '../../styles/Planner.css';
import Head from 'next/head'
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp;

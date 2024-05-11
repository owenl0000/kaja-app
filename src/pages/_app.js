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
import React, { useEffect } from 'react';
import axios from 'axios';


function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  
  useEffect(() => {
    const initializeDb = async () => {
        try {
            const response = await axios.get('/api/initDb');
            console.log('Database initialized:', response.data.message);
        } catch (error) {
            console.error('Error initializing database:', error);
        }
    };

    initializeDb();
  }, []);

  

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

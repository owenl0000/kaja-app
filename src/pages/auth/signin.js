import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const SignInPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace('/');
    }
  }, [session, router]);

  const handleSignInWithEmail = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    signIn('credentials', { email, password, callbackUrl: '/' });
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-lg border border-gray-200">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignInWithEmail}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:border-indigo-500 rounded-t-md focus:outline-none  focus:z-10 sm:text-sm" placeholder="Email address" />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:border-indigo-500 rounded-b-md focus:outline-none focus:z-10 sm:text-sm" placeholder="Password" />
            </div>
          </div>

          <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-coral hover:bg-[#EE5656] focus:outline-none focus:ring-2 focus:ring-offset-2">
            Sign in with email
          </button>

          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button type="button" onClick={() => signIn('google')} className="w-12 h-12 rounded-full border-2 flex justify-center items-center mx-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg className="w-6 h-6" viewBox="0 0 256 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
              <path d="M255.1 133.6c0-9.3-.8-18.2-2.3-26.8H130v50.8h70.7c-3 15.8-11.8 29.2-25.2 38.2v31.8h40.8c23.9-22 37.8-54.3 37.8-94z" fill="#4285F4"/>
              <path d="M130 262c35.3 0 64.9-11.7 86.5-31.6l-40.8-31.8c-11.7 7.9-26.7 12.5-45.7 12.5-35.1 0-64.9-23.7-75.5-55.6H13.4v34.9c22.2 41.8 66.2 69.6 116.6 69.6z" fill="#34A853"/>
              <path d="M54.5 159.5c-2.2-6.5-3.4-13.5-3.4-20.5s1.2-14 3.4-20.5V83.6H13.4c-8 15.4-12.6 33.3-12.6 52.9s4.6 37.5 12.6 52.9l41.1-34.9z" fill="#FBBC05"/>
              <path d="M130 52.1c19.9 0 37.8 6.8 51.8 20.1l38.8-38.8C202.9 13.7 173.3 2 130 2 79.6 2 35.6 29.8 13.4 71.6l41.1 34.9c10.6-31.9 40.4-55.6 75.5-55.6z" fill="#EB4335"/>
            </svg>
          </button>
        </form>
        <div className="text-center mt-6 text-sm">
          <p>
            Don't have an account?{' '}
            <a href="#" onClick={() => router.push('/register')} className="font-medium text-sm text-indigo-600 hover:text-indigo-500">
              Register Here!
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

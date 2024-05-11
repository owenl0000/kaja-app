// components/SuccessMessage.js
import React from 'react';
import { useRouter } from 'next/router';

const SuccessMessage = ({ message }) => {
    const router = useRouter();

    return (
        <div className="max-w-md w-full space-y-8 p-10 text-center">
            <h2 className="text-lg font-bold text-gray-900">{message}</h2>
            <p className="mt-4 text-sm text-gray-600">
                Ready to sign in?{' '}
                <button onClick={() => router.push('/auth/signin')} className="font-medium text-coral hover:text-[#EE5656]">
                    Click here to sign in
                </button>
            </p>
        </div>
    );
};

export default SuccessMessage;

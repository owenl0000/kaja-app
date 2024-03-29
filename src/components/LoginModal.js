import { useSession, signIn, signOut } from "next-auth/react";

function LoginModal({ isOpen, onClose }) {
  const { data: session } = useSession();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
        {session ? (
          <>
            <p>Welcome, {session.user.email}!</p>
            <button onClick={() => signOut()} className="mt-4 bg-red-500 text-white p-2 rounded">Sign out</button>
          </>
        ) : (
          <>
            <p>Please sign in</p>
            <button onClick={() => signIn()} className="mt-4 bg-blue-500 text-white p-2 rounded">Sign in</button>
          </>
        )}
        <button onClick={onClose} className="mt-4 bg-gray-300 p-2 rounded">Close</button>
      </div>
    </div>
  );
}

export default LoginModal;

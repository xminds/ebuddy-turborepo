'use client';
import Login from "./login/page";
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useFirebaseAuth } from '../firebase/firebase';

export default function Home() {
  const { isInitialized, user } = useFirebaseAuth();

  useEffect(() => {
    if (isInitialized && !user) {
      redirect('/login');
    }
  }, [isInitialized, user]);

  return (
    <>
      <Login />
    </>
  );
}

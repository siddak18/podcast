"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../firebase/firebase.config';
import {withauth} from '../../lib/Withauth'

const Dashboard = () => {

  const router = useRouter();

  useEffect(() => {

    const user = auth.currentUser;
    if (!user) {
      router.push('/pages/login');
    }
    
  }, [router]);

  return (
    <div>
      {auth.currentUser ? 'Welcome to the Dashboard' : 'Redirecting...'}
    </div>
  );
};

export default withauth(Dashboard);

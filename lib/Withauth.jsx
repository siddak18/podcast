"use client";

import { useRouter } from 'next/router';
import { auth } from '../firebase/firebase.config';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

export function withauth(Component) {
  return function WithAuth(props) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      });

      return () => unsubscribe();
    }, []);

    useEffect(() => {
      if (isAuthenticated === false) {
        router.push('pages/login'); // Correct the route here
      }
    }, [isAuthenticated, router]);

    if (isAuthenticated === null) {
      // Optionally, render a loading indicator while checking auth status
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  };
}

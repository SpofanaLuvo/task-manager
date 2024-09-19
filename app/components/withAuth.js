// components/withAuth.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login'); // Redirect to login if no token is found
      } else {
        try {
          jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
        } catch (err) {
          localStorage.removeItem('token');
          router.push('/login'); // Redirect to login if token is invalid
        }
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;

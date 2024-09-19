"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserDetails from "../components/UserDetails";
import MembershipCard from "../components/MembershipCard";
import useAuthStore from '@/store/authStore';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshAccessToken = useAuthStore((state) => state.refreshAccessToken);

  useEffect(() => {
    const verifyAuthentication = async () => {
      if (!accessToken) {
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          router.push('/');
          return;
        }
      }
      setLoading(false);
    };

    verifyAuthentication();
  }, [accessToken, refreshAccessToken, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="max-w-6xl mx-auto mt-4">
      <h1 className="text-3xl font-bold mb-6">Profile Page</h1>
      <div className="flex space-x-4 shadow-md rounded-lg">
        {/* User Details Section */}
        <div className="flex-1">
          <UserDetails />
        </div>
        {/* Membership Card Section */}
        <div className="flex-1">
          <MembershipCard />
        </div>
      </div>
    </main>
  );
};

export default Profile;

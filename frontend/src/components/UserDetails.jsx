import React from 'react';
import { useSelector } from 'react-redux';
import MembershipCard from './MembershipCard';

const UserDetails = () => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <p className="text-center text-gray-600">Loading user details...</p>;
  }

  return (
    <section className="bg-white text-left p-6 mb-6">
      <h2 className="text-2xl font-semibold text-center mb-4">User Details</h2>
      <div className="flex flex-wrap -mx-3">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <div className="space-y-4">
            <div>
              <span className="font-medium text-gray-600">Name:</span>
              <p className="text-gray-800">{user.username}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Email:</span>
              <p className="text-gray-800">{user.user_email}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Membership Code:</span>
              <p className="text-gray-800">{user.membership_code}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Membership Plan:</span>
              <p className="text-gray-800">{user.membership_plan}</p>
            </div>        
          </div>
        </div>
        <div className="w-full md:w-1/2 px-3">
          <MembershipCard 
            name={user.username}
            memberId={user.membership_code}
            tier={user.membership_plan}
          />
        </div>
      </div>
    </section>
  );
};

export default UserDetails;

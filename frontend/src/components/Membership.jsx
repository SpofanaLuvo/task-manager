import React from 'react';
import { useSelector } from 'react-redux';

const UserDetails = () => {
  // Extract user data from the Redux store
//   const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <p className="text-center text-gray-600">Loading user details...</p>;
  }

  return (
    <section className="bg-white p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">User Details</h2>
      <div className="space-y-4">
        <div>
          <span className="font-medium text-gray-600">Name:</span>
          <p className="text-gray-800">{user.name}</p>
        </div>
        <div>
          <span className="font-medium text-gray-600">Email:</span>
          <p className="text-gray-800">{user.email}</p>
        </div>
        <div>
          <span className="font-medium text-gray-600">Membership Plan:</span>
          <p className="text-gray-800">{user.membershipPlan}</p>
        </div>
      </div>
    </section>
  );
};

export default UserDetails;

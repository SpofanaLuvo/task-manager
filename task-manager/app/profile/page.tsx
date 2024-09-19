import UserDetails from '../components/UserDetails';
import MembershipCard from '../components/MembershipCard';

const Profile = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
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
    </div>
  );
};

export default Profile;

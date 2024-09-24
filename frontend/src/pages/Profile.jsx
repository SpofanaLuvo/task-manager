import UserDetails from "../components/UserDetails";
import MembershipCard from "../components/MembershipCard";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  });

  return (
    <>
      <UserDetails />
    </>
  );
};

export default Profile;

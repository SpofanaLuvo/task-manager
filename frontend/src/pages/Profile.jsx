
import UserDetails from "../components/UserDetails";
import MembershipCard from "../components/MembershipCard";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    
    if(!user ) {
        navigate("/login")
        return
      }

  return (
    <>
    <UserDetails />
    </>
  );
};

export default Profile;

import React from "react";
import { backend_url } from "../../server";
import { useSelector } from "react-redux";

const ProfileContent = ({ active }) => {
  const { user } = useSelector((state) => state.user);
console.log(user);
  return (
    <div className="w-full">
      {/* Profile page  */}
      {active === 1 && (
        <div className="flex justify-center w-full">
          <div className="">
            <img
              src={`${backend_url}${user?.avatar}`}
              alt="Profile"
              className="rounded-full w-[50] h-[50] object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileContent;

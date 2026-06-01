import React, { useState } from "react";
import StoreLayout from "../components/ui/StoreLayout";
import ProfileSideBar from "../components/Profile/ProfileSideBar";
import ProfileContent from "../components/Profile/ProfileContent";
import { ui } from "../styles/theme";

const ProfilePage = () => {
  const [active, setActive] = useState(1);

  return (
    <StoreLayout showFooter={false}>
      <div className={`${ui.container} py-8`}>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-72 shrink-0">
            <ProfileSideBar active={active} setActive={setActive} />
          </div>
          <div className={`flex-1 min-w-0 ${ui.card} ${ui.cardPadding}`}>
            <ProfileContent active={active} />
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default ProfilePage;

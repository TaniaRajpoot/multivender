import React from 'react';
import ShopInfo from '../../components/Shop/ShopInfo';
import ShopProfileData from '../../components/Shop/ShopProfileData';
import { ui } from '../../styles/theme';

const ShopPreviewPage = () => {
  return (
    <div className={`${ui.page} py-6`}>
      <div className={ui.containerWide}>
        <div className="w-full flex flex-col md:flex-row py-4 md:justify-between gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-[28%]">
            <ShopInfo isOwner={false} />
          </div>
          {/* Main Content */}
          <div className="w-full md:w-[70%] rounded-xl bg-white border border-gray-200 shadow-sm p-4 sm:p-6">
            <ShopProfileData isOwner={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPreviewPage;
import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSidebar from "../components/Admin/Layout/AdminSidebar";

const AdminDashboardSettingsPage = () => {
    return (
        <div>
            <AdminHeader />
            <div className="w-full flex items-start">
                <div className="w-[80px] lg:w-[330px] sticky top-24 z-20">
                    <AdminSidebar active={8} />
                </div>
                <div className="flex-1 p-4 md:p-8 bg-[#EDE7E3]/30 min-h-screen">
                    <div className="mb-8">
                        <h3 className="text-3xl font-black text-[#16697A] tracking-tighter">Admin Settings</h3>
                        <p className="text-[#489FB5] text-[10px] font-black uppercase tracking-[0.3em] mt-1">System Configuration</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Profile Section */}
                        <div className="bg-white/70 backdrop-blur-xl rounded-[40px] p-8 border border-white shadow-soft">
                            <h4 className="text-xl font-bold text-[#16697A] mb-6 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#FFA62B]" />
                                Personal Information
                            </h4>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest pl-1 mb-2 block">Full Name</label>
                                    <input type="text" className="w-full h-12 bg-[#EDE7E3]/50 border-none rounded-2xl px-4 font-bold text-[#16697A] focus:ring-2 focus:ring-[#16697A] outline-none transition-all" defaultValue="System Admin" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest pl-1 mb-2 block">Email Address</label>
                                    <input type="email" className="w-full h-12 bg-[#EDE7E3]/50 border-none rounded-2xl px-4 font-bold text-[#16697A] focus:ring-2 focus:ring-[#16697A] outline-none transition-all" defaultValue="admin@crownmarket.com" />
                                </div>
                                <button className="bg-[#16697A] text-white font-black uppercase tracking-widest text-[11px] px-8 py-4 rounded-2xl hover:bg-[#FFA62B] transition-all shadow-lg">
                                    Save Changes
                                </button>
                            </div>
                        </div>

                        {/* System Config */}
                        <div className="bg-white/70 backdrop-blur-xl rounded-[40px] p-8 border border-white shadow-soft">
                            <h4 className="text-xl font-bold text-[#16697A] mb-6 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#489FB5]" />
                                System Control
                            </h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-[#EDE7E3]/30 rounded-3xl">
                                    <div>
                                        <h5 className="text-sm font-black text-[#16697A] uppercase tracking-wider">Maintenance Mode</h5>
                                        <p className="text-[10px] font-bold text-[#6B7280]">Restrict public access</p>
                                    </div>
                                    <div className="w-12 h-6 bg-[#EDE7E3] rounded-full relative cursor-pointer">
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-[#EDE7E3]/30 rounded-3xl">
                                    <div>
                                        <h5 className="text-sm font-black text-[#16697A] uppercase tracking-wider">New Seller Auto-approval</h5>
                                        <p className="text-[10px] font-bold text-[#6B7280]">Bypass admin review</p>
                                    </div>
                                    <div className="w-12 h-6 bg-[#16697A] rounded-full relative cursor-pointer">
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardSettingsPage;

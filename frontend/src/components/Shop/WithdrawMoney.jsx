import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import { loadSeller } from "../../redux/actions/seller";
import { AiOutlineDelete, AiOutlineBank, AiOutlineDollar } from "react-icons/ai";
import { MdOutlineSecurity } from "react-icons/md";

const WithdrawMoney = () => {
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(false);
  const dispatch = useDispatch();
  const [withdrawAmount, setWithdrawAmount] = useState(50);
  const { seller } = useSelector((state) => state.seller);

  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    bankCountry: "",
    bankSwiftCode: "",
    bankAccountNumber: "",
    bankHolderName: "",
    bankAddress: "",
  });

  useEffect(() => {
    if (seller?._id) dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch, seller?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const withdrawMethod = { ...bankInfo };
    try {
      await axios.put(`${server}/shop/update-payment-methods`, { withdrawMethod }, { withCredentials: true });
      toast.success("Financial Node Registered");
      setBankInfo({ bankName: "", bankCountry: "", bankSwiftCode: "", bankAccountNumber: "", bankHolderName: "", bankAddress: "" });
      setPaymentMethod(false);
      dispatch(loadSeller());
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const deleteHandler = async () => {
    try {
      await axios.delete(`${server}/shop/delete-withdraw-methods`, { withCredentials: true });
      toast.success("Financial Node Decommissioned");
      dispatch(loadSeller());
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const withdrawHandler = async () => {
    const amount = parseFloat(withdrawAmount);
    const balance = parseFloat(availableBalance);

    if (amount < 50) {
      toast.error("Withdrawal amount must be at least $50.00");
      return;
    }

    if (amount > balance) {
      toast.error("The amount you enter is greater than your available balance");
      return;
    }

    try {
      await axios.post(`${server}/withdraw/create-withdraw-request`, { amount }, { withCredentials: true });
      toast.success("Withdraw request created successfully!");
      setOpen(false);
      dispatch(loadSeller()); // Refresh balance immediately
    } catch (error) {
      toast.error(error.response?.data?.message || "Withdraw request failed");
    }
  };

  const availableBalance = seller?.availableBalance?.toFixed(2) || "0.00";

  return (
    <div className="w-full min-h-[85vh] p-8 md:p-12 font-Inter bg-[#EDE7E3]/30">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center md:text-left">
          <h3 className="text-3xl font-black text-[#16697A] tracking-tighter">Capital Management</h3>
          <p className="text-[#489FB5] text-xs font-black uppercase tracking-[0.3em] mt-1">Financial Operations Console</p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-[48px] p-12 md:p-16 border border-white shadow-soft text-center group transition-all hover:shadow-2xl">
          <div className="w-24 h-24 bg-[#16697A] rounded-[32px] mx-auto mb-8 flex items-center justify-center text-white shadow-xl transform group-hover:rotate-6 transition-transform">
            <AiOutlineDollar size={48} />
          </div>
          <h5 className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.4em] mb-2">Authorized Liquidity</h5>
          <h2 className="text-4xl font-black text-[#16697A] tracking-tighter mb-10 italic">${availableBalance}</h2>

          <button
            onClick={() => (parseFloat(availableBalance) < 50 ? toast.error("Insufficient liquidity for extraction") : setOpen(true))}
            className="px-16 py-6 bg-[#16697A] text-white font-black rounded-3xl hover:bg-[#FFA62B] transition-all transform hover:scale-105 shadow-xl uppercase tracking-[0.2em] text-sm"
          >
            Initiate Extraction
          </button>
          <p className="text-[10px] font-bold text-[#9CA3AF] mt-6 uppercase tracking-widest italic">* Base extraction threshold: $50.00</p>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-8 border border-white flex items-center gap-6">
            <div className="w-12 h-12 bg-[#82C0CC]/20 rounded-2xl flex items-center justify-center text-[#16697A]"><MdOutlineSecurity size={24} /></div>
            <div>
              <h4 className="text-sm font-black text-[#16697A] uppercase">Vault Security</h4>
              <p className="text-xs font-medium text-[#6B7280]">End-to-end encrypted transfers</p>
            </div>
          </div>
          <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-8 border border-white flex items-center gap-6">
            <div className="w-12 h-12 bg-[#FFA62B]/10 rounded-2xl flex items-center justify-center text-[#FFA62B]"><AiOutlineBank size={24} /></div>
            <div>
              <h4 className="text-sm font-black text-[#16697A] uppercase">Global Settlement</h4>
              <p className="text-xs font-medium text-[#6B7280]">Universal bank compatibility</p>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F4D58]/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`w-full max-w-2xl bg-white/90 backdrop-blur-2xl rounded-[48px] shadow-2xl border border-white p-8 md:p-12 relative overflow-hidden transition-all duration-500 ${paymentMethod ? 'max-h-[90vh] overflow-y-auto' : ''}`}>

            <button
              onClick={() => { setOpen(false); setPaymentMethod(false); }}
              className="absolute top-8 right-8 w-12 h-12 bg-[#EDE7E3] text-[#16697A] rounded-2xl flex items-center justify-center hover:rotate-90 transition-all z-20"
            >
              <RxCross1 size={20} />
            </button>

            {paymentMethod ? (
              <div className="animate-in slide-in-from-right duration-500">
                <div className="text-center mb-10">
                  <h3 className="text-2xl font-black text-[#16697A] tracking-tighter uppercase">Financial Protocol</h3>
                  <p className="text-[#489FB5] text-[10px] font-black uppercase tracking-widest mt-1">Define Settlement Bank</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Bank Institution" value={bankInfo.bankName} onChange={(e) => setBankInfo({ ...bankInfo, bankName: e.target.value })} required placeholder="Bank Name" />
                    <FormInput label="Settlement Country" value={bankInfo.bankCountry} onChange={(e) => setBankInfo({ ...bankInfo, bankCountry: e.target.value })} required placeholder="Country" />
                    <FormInput label="Account Holder" value={bankInfo.bankHolderName} onChange={(e) => setBankInfo({ ...bankInfo, bankHolderName: e.target.value })} required placeholder="Name" />
                    <FormInput label="SWIFT / BIC" value={bankInfo.bankSwiftCode} onChange={(e) => setBankInfo({ ...bankInfo, bankSwiftCode: e.target.value })} required placeholder="Swift Code" />
                    <div className="md:col-span-2">
                      <FormInput label="External Account Number" type="number" value={bankInfo.bankAccountNumber} onChange={(e) => setBankInfo({ ...bankInfo, bankAccountNumber: e.target.value })} required placeholder="Account Number" />
                    </div>
                    <div className="md:col-span-2">
                      <FormInput label="Branch Coordinates (Address)" value={bankInfo.bankAddress} onChange={(e) => setBankInfo({ ...bankInfo, bankAddress: e.target.value })} required placeholder="Full Bank Address" />
                    </div>
                  </div>
                  <button type="submit" className="w-full h-16 bg-[#16697A] text-white font-black rounded-3xl hover:bg-[#FFA62B] transition-all shadow-xl uppercase tracking-widest text-sm mt-4">
                    Register Financial Node
                  </button>
                </form>
              </div>
            ) : (
              <div className="animate-in slide-in-from-left duration-500">
                <div className="text-center mb-10">
                  <h3 className="text-2xl font-black text-[#16697A] tracking-tighter uppercase">Extraction Authorization</h3>
                  <p className="text-[#489FB5] text-[10px] font-black uppercase tracking-widest mt-1">Select Liquidation Method</p>
                </div>

                {seller?.withdrawMethod ? (
                  <div className="space-y-8">
                    <div className="bg-[#EDE7E3]/50 rounded-[32px] p-8 border border-white relative group">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#16697A] shadow-md"><AiOutlineBank size={24} /></div>
                          <div>
                            <h4 className="text-sm font-black text-[#16697A] uppercase">{seller.withdrawMethod.bankName}</h4>
                            <p className="text-xs font-bold text-[#6B7280] tracking-widest mt-1">
                              **** {seller.withdrawMethod.bankAccountNumber.slice(-4)}
                            </p>
                          </div>
                        </div>
                        <button onClick={deleteHandler} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all transform hover:rotate-12">
                          <AiOutlineDelete size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-2">Extraction Magnitude ($)</label>
                      <div className="flex gap-4">
                        <input
                          type="number"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          className="flex-1 bg-[#EDE7E3]/50 border border-transparent focus:bg-white focus:border-[#16697A]/20 rounded-2xl px-8 py-5 font-black text-2xl text-[#16697A] shadow-inner transition-all outline-none"
                        />
                        <button
                          onClick={withdrawHandler}
                          className="px-10 bg-[#16697A] text-white font-black rounded-2xl hover:bg-[#FFA62B] transition-all shadow-xl uppercase tracking-widest text-xs"
                        >
                          Execute
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-[#EDE7E3] rounded-full flex items-center justify-center mx-auto mb-6 text-[#16697A]/30"><AiOutlineBank size={40} /></div>
                    <p className="text-sm font-bold text-[#6B7280] mb-8">No verified financial nodes detected in your profile.</p>
                    <button
                      onClick={() => setPaymentMethod(true)}
                      className="px-12 py-5 bg-[#16697A] text-white font-black rounded-2xl hover:bg-[#FFA62B] transition-all shadow-xl uppercase tracking-widest text-xs"
                    >
                      + Add Financial Node
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const FormInput = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] ml-1">{label}</label>
    <input {...props} className="w-full bg-[#EDE7E3]/60 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-2xl px-6 py-4 font-bold text-[#16697A] shadow-inner transition-all outline-none placeholder:text-[#16697A]/20" />
  </div>
);

export default WithdrawMoney;
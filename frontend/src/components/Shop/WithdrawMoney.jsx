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
import { ui } from "../../styles/theme";

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
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      <div>
        <h1 className={ui.title}>Withdraw money</h1>
        <p className={ui.subtitle}>Request payout of your store balance to your bank account.</p>
      </div>

      <div className={`${ui.card} ${ui.cardPadding} text-center max-w-md mx-auto space-y-6`}>
        <div className="w-16 h-16 bg-teal-50 text-teal-700 rounded-2xl mx-auto flex items-center justify-center shadow-inner">
          <AiOutlineDollar size={32} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Available balance</p>
          <h2 className="text-4xl font-semibold text-gray-900 mt-1">${availableBalance}</h2>
        </div>

        <button
          onClick={() => (parseFloat(availableBalance) < 50 ? toast.error("Insufficient liquidity for extraction") : setOpen(true))}
          className={`${ui.btnPrimary} w-full py-3.5`}
        >
          Withdraw funds
        </button>
        <p className={ui.hint}>* Base extraction threshold: $50.00</p>
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`${ui.card} ${ui.cardPadding} flex items-center gap-4`}>
          <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-lg flex items-center justify-center shrink-0">
            <MdOutlineSecurity size={20} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Vault Security</h4>
            <p className="text-xs text-gray-500">End-to-end encrypted transfers</p>
          </div>
        </div>
        <div className={`${ui.card} ${ui.cardPadding} flex items-center gap-4`}>
          <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-lg flex items-center justify-center shrink-0">
            <AiOutlineBank size={20} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Global Settlement</h4>
            <p className="text-xs text-gray-500">Universal bank compatibility</p>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`w-full max-w-lg bg-white rounded-xl shadow-lg p-6 relative overflow-hidden transition-all duration-500 ${paymentMethod ? 'max-h-[90vh] overflow-y-auto' : ''}`}>
            <button
              onClick={() => { setOpen(false); setPaymentMethod(false); }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-20"
            >
              <RxCross1 size={20} />
            </button>

            {paymentMethod ? (
              <div className="animate-in slide-in-from-right duration-500">
                <div className="mb-6">
                  <h3 className={ui.titleSm}>Add bank account</h3>
                  <p className="text-sm text-gray-600 mt-1">Specify settlement details for bank deposits.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormInput label="Bank Institution" value={bankInfo.bankName} onChange={(e) => setBankInfo({ ...bankInfo, bankName: e.target.value })} required placeholder="Bank Name" />
                  <FormInput label="Settlement Country" value={bankInfo.bankCountry} onChange={(e) => setBankInfo({ ...bankInfo, bankCountry: e.target.value })} required placeholder="Country" />
                  <FormInput label="Account Holder" value={bankInfo.bankHolderName} onChange={(e) => setBankInfo({ ...bankInfo, bankHolderName: e.target.value })} required placeholder="Name" />
                  <FormInput label="SWIFT / BIC" value={bankInfo.bankSwiftCode} onChange={(e) => setBankInfo({ ...bankInfo, bankSwiftCode: e.target.value })} required placeholder="Swift Code" />
                  <FormInput label="External Account Number" type="number" value={bankInfo.bankAccountNumber} onChange={(e) => setBankInfo({ ...bankInfo, bankAccountNumber: e.target.value })} required placeholder="Account Number" />
                  <FormInput label="Branch Coordinates (Address)" value={bankInfo.bankAddress} onChange={(e) => setBankInfo({ ...bankInfo, bankAddress: e.target.value })} required placeholder="Full Bank Address" />
                  <button type="submit" className={`${ui.btnPrimary} w-full mt-4`}>
                    Register bank account
                  </button>
                </form>
              </div>
            ) : (
              <div className="animate-in slide-in-from-left duration-500">
                <div className="mb-6">
                  <h3 className={ui.titleSm}>Withdraw funds</h3>
                  <p className="text-sm text-gray-600 mt-1">Specify the amount to transfer to your account.</p>
                </div>

                {seller?.withdrawMethod ? (
                  <div className="space-y-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-lg flex items-center justify-center shadow-inner shrink-0">
                          <AiOutlineBank size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">{seller.withdrawMethod.bankName}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            **** {seller.withdrawMethod.bankAccountNumber.slice(-4)}
                          </p>
                        </div>
                      </div>
                      <button onClick={deleteHandler} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white flex items-center justify-center transition">
                        <AiOutlineDelete size={18} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <FormInput
                        label="Withdraw amount ($)"
                        type="number"
                        min="50"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                      />
                      <button
                        onClick={withdrawHandler}
                        className={`${ui.btnPrimary} w-full`}
                      >
                        Submit request
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                      <AiOutlineBank size={32} />
                    </div>
                    <p className="text-sm text-gray-500 mb-6">No verified bank account details found.</p>
                    <button
                      onClick={() => setPaymentMethod(true)}
                      className={ui.btnPrimary}
                    >
                      Add bank account
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
  <div>
    <label className={ui.label}>{label}</label>
    <input {...props} className={ui.input} />
  </div>
);

export default WithdrawMoney;
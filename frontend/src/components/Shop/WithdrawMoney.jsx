
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { loadSeller } from "../../redux/actions/user";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import { AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const WithdrawMoney = () => {
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);

  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(50);
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    bankCountry: "",
    bankSwiftCode: "",
    bankAccountNumber: "",
    bankHolderName: "",
    bankAddress: "",
  });

  const availableBalance = seller?.availableBalance?.toFixed(2) || 0;

  useEffect(() => {
    if (seller?._id) dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch, seller?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${server}/shop/update-payment-methods`,
        { withdrawMethod: bankInfo },
        { withCredentials: true }
      );
      toast.success("Withdraw method added successfully!");
      dispatch(loadSeller());
      setBankInfo({
        bankName: "",
        bankCountry: "",
        bankSwiftCode: "",
        bankAccountNumber: "",
        bankHolderName: "",
        bankAddress: "",
      });
      setPaymentMethod(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding method");
    }
  };

  const deleteHandler = async () => {
    try {
      await axios.delete(`${server}/shop/delete-withdraw-method`, {
        withCredentials: true,
      });
      toast.success("Withdraw method deleted successfully!");
      dispatch(loadSeller());
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting method");
    }
  };

  const withdrawHandler = async () => {
    if (withdrawAmount < 50 || withdrawAmount > availableBalance) {
      return toast.error("Invalid withdraw amount!");
    }
    try {
      await axios.post(
        `${server}/withdraw/create-withdraw-request`,
        { amount: withdrawAmount },
        { withCredentials: true }
      );
      toast.success("Withdraw request successful!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Withdraw request failed");
    }
  };

  const showError = () => toast.error("You need at least $50 to withdraw!");

  return (
    <div className="w-full h-[90vh] p-8 flex items-center justify-center">
      <div className="w-full bg-white h-full rounded flex flex-col items-center justify-center p-6">
        <h5 className="text-[20px] pb-4">
          Available Balance: ${availableBalance}
        </h5>
        <div
          className={`${styles.button} text-white !h-[42px] !rounded`}
          onClick={() => (availableBalance < 50 ? showError() : setOpen(true))}
        >
          Withdraw
        </div>
      </div>

      {open && (
        <div className="fixed top-0 left-0 w-full h-screen z-[9999] flex items-center justify-center bg-[#0000004e]">
          <div
            className={`bg-white shadow rounded w-[95%] 800px:w-[50%] p-4 ${
              paymentMethod ? "h-[80vh] overflow-y-scroll" : "min-h-[40vh]"
            }`}
          >
            <div className="w-full flex justify-end">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => {
                  setOpen(false);
                  setPaymentMethod(false);
                }}
              />
            </div>

            {paymentMethod ? (
              <div>
                <h3 className="text-[22px] font-[600] text-center pb-4">
                  Add Withdraw Method
                </h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                  {[
                    { label: "Bank Name", key: "bankName", type: "text" },
                    { label: "Bank Country", key: "bankCountry", type: "text" },
                    { label: "Bank Swift Code", key: "bankSwiftCode", type: "text" },
                    { label: "Account Number", key: "bankAccountNumber", type: "number" },
                    { label: "Bank Holder Name", key: "bankHolderName", type: "text" },
                    { label: "Bank Address", key: "bankAddress", type: "text" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label>
                        {field.label} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type={field.type}
                        required
                        placeholder={`Enter ${field.label}`}
                        className={`${styles.input} mt-2`}
                        value={bankInfo[field.key]}
                        onChange={(e) =>
                          setBankInfo({ ...bankInfo, [field.key]: e.target.value })
                        }
                      />
                    </div>
                  ))}
                  <button type="submit" className={`${styles.button} text-white mt-2`}>
                    Add
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <h3 className="text-[22px] font-[600] mb-3">Available Withdraw Methods</h3>
                {seller?.withdrawMethod ? (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h5>
                          Account Number: {"*".repeat(
                            seller.withdrawMethod.bankAccountNumber.length - 3
                          ) + seller.withdrawMethod.bankAccountNumber.slice(-3)}
                        </h5>
                        <h5>Bank Name: {seller.withdrawMethod.bankName}</h5>
                      </div>
                      <AiOutlineDelete
                        size={25}
                        className="cursor-pointer"
                        onClick={deleteHandler}
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        placeholder="Amount..."
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="border p-1 rounded w-[100px]"
                      />
                      <div
                        className={`${styles.button} !h-[42px] text-white cursor-pointer`}
                        onClick={withdrawHandler}
                      >
                        Withdraw
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-[18px]">No Withdraw Methods available!</p>
                    <div
                      className={`${styles.button} text-white mt-4`}
                      onClick={() => setPaymentMethod(true)}
                    >
                      Add New
                    </div>
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

export default WithdrawMoney;
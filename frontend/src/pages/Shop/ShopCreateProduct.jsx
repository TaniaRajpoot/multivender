import React from "react"; 
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader"; 
import DashboardSidebar from "../../components/Shop/Layout/DashboardSideBar"; 
import CreateProduct from "../../components/Shop/CreateProduct.jsx"; 
 
const ShopCreateProduct = () => { 
  return ( 
    <div> 
      <DashboardHeader /> 
      <div className="flex items-start w-full">
        <div className="w-20 md:w-[100px] lg:w-[330px]">
          <DashboardSidebar active={4} /> 
        </div> 
        <div className="flex-1 flex justify-center">
          <CreateProduct /> 
        </div> 
      </div> 
    </div> 
  ); 
}; 
 
export default ShopCreateProduct;
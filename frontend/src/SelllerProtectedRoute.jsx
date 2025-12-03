import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../backend/middlware/auth";

const SellerProtectedRoute = ({ isSeller,seller,children }) => {
    if(!isSeller){
        return <Navigate to={`/`} replace />;
    }
  
    return children;
};
export default SellerProtectedRoute;

    
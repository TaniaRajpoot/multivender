
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";
import {productData} from "../../static/data";

const ShopProfileData = ({ isOwner }) => {
  // const { products } = useSelector((state) => state.products);
  // const { events } = useSelector((state) => state.events);
  // const { id } = useParams();
  const dispatch = useDispatch();
  const [active, setActive] = useState(1);

  // useEffect(() => {
  //   // if (id) {
  //   //   dispatch(getAllProductsShop(id));
  //   //   dispatch(getAllEventsShop(id));
  //   // }
  // }, [dispatch, id]);

  // Flatten all reviews from products
  // const allReviews = products?.flatMap((product) => product.reviews) || [];

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex w-full items-center justify-between">
        <div className="flex space-x-5">
          {[
            { id: 1, label: "Shop Products" },
            { id: 2, label: "Running Events" },
            { id: 3, label: "Shop Reviews" },
          ].map((tab) => (
            <h5
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`font-[600] text-[20px] cursor-pointer ${
                active === tab.id ? "text-red-500" : "text-[#333]"
              }`}
            >
              {tab.label}
            </h5>
          ))}
        </div>

        {/* Dashboard Link */}
        {isOwner && (
          <Link to="/dashboard">
            <div className={`${styles.button} !rounded-[4px] h-[42px]`}>
              <span className="text-white">Go Dashboard</span>
            </div>
          </Link>
        )}
      </div>

      <br />

      {/* Active Tab Content */}
      {active === 1 && (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
          {/* {products?.map((product, index) => (
            <ProductCard key={index} data={product} isShop />
          ))} */}
          {
            productData && productData.map((product, index) => (
              <ProductCard key={index} data={product} isShop />
            ))
          }
        </div>
      )}

      {active === 2 && (
        <div className="w-full">
          {events?.length > 0 ? (
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
              {events.map((event, index) => (
                <ProductCard key={index} data={event} isShop isEvent />
              ))}
            </div>
          ) : (
            <h5 className="w-full text-center py-5 text-[18px]">
              No Events for this shop!
            </h5>
          )}
        </div>
      )}

      {active === 3 && (
        <div className="w-full">
          {allReviews?.length > 0 ? (
            allReviews.map((review, index) => (
              <div key={index} className="w-full flex my-4">
                <img
                  src={review.user.avatar?.url}
                  className="w-[50px] h-[50px] rounded-full"
                  alt={review.user.name}
                />
                <div className="pl-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="font-[600]">
                      {/* {review.user.name} */}

                      </h1>
                    {/* <Ratings rating={review.rating} /> */}
                  </div>
                  <p className="text-[#000000a7]">
                    {/* {review.comment} */}
                    Great products and excellent customer service!
                  </p>
                  <p className="text-[#000000a7] text-[14px]">2 days ago</p>
                </div>
              </div>
            ))
          ) : (
            <h5 className="w-full text-center py-5 text-[18px]">
              No Reviews for this shop!
            </h5>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopProfileData;
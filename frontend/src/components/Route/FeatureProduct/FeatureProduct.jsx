import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from '../../../styles/styles'
import ProductCard from '../ProductCard/ProductCard'
import { getAllProducts } from '../../../redux/actions/product'

const FeatureProduct = () => {
  const dispatch = useDispatch();
  const { allProducts, isLoading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Featured Products</h1>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
            {allProducts && allProducts.length > 0 ? (
              allProducts.map((product, index) => (
                <ProductCard data={product} key={product._id || index} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 text-lg">No products available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default FeatureProduct
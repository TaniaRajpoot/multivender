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
    <div className="py-10 bg-white">
      <div className={`${styles.section}`}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="relative">
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#FFA62B] rounded-full" />
            <span className="text-[11px] font-[700] text-[#489FB5] uppercase tracking-[0.4em] mb-3 block font-sans">Featured</span>
            <h2 className="text-3xl md:text-5xl font-[700] text-[#16697A] tracking-tighter italic font-display">
              Featured <span className="text-[#FFA62B]">Products</span>
            </h2>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16697A]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mb-12 border-0">
            {allProducts && allProducts.length > 0 ? (
              allProducts.map((product, index) => (
                <ProductCard data={product} key={product._id || index} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white/50 backdrop-blur-md rounded-[40px] border border-white">
                <p className="text-[#16697A] font-[600] uppercase tracking-widest opacity-40 italic font-sans">No products found!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default FeatureProduct
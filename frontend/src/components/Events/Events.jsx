import React from 'react'
import styles from '../../styles/styles'
import EventCard from "./EventCard"
import { productData } from "../../static/data"

const Events = () => {
  console.log('===== EVENTS DEBUG =====');
  console.log('productData:', productData);
  console.log('productData length:', productData?.length);
  console.log('First product:', productData?.[0]);
  console.log('========================');

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Popular Events</h1>
        </div>
        <div className="w-full grid">
          {productData && productData.length > 0 ? (
            productData.map((product, index) => {
              console.log(`Rendering product ${index}:`, product);
              return <EventCard key={index} data={product} active={true} />;
            })
          ) : (
            <p>No events available</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Events
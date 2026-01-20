import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from '../../styles/styles'
import EventCard from "./EventCard"
import { getAllEvents } from '../../redux/actions/event'

const Events = () => {
  const dispatch = useDispatch();
  const { allEvents, isLoading } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  // Debug logs
  console.log('===== EVENTS DEBUG =====');
  console.log('allEvents:', allEvents);
  console.log('allEvents length:', allEvents?.length);
  console.log('First event:', allEvents?.[0]);
  console.log('Is Loading:', isLoading);
  console.log('========================');

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Popular Events</h1>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="w-full grid">
            {allEvents && allEvents.length > 0 ? (
              allEvents.map((event, index) => {
                console.log(`Rendering event ${index}:`, event);
                return <EventCard key={event._id || index} data={event} active={true} />;
              })
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg">No events available</p>
                <p className="text-gray-400 text-sm mt-2">Check console for debug info</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Events
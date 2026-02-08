import React, { useEffect, useMemo } from 'react'
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

  // Get the latest event (sort by createdAt or start_Date if available)
  const latestEvent = useMemo(() => {
    if (!allEvents || allEvents.length === 0) return null;
    
    // Sort events by createdAt date (most recent first)
    const sortedEvents = [...allEvents].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.start_Date || 0);
      const dateB = new Date(b.createdAt || b.start_Date || 0);
      return dateB - dateA; // Descending order (newest first)
    });
    
    return sortedEvents[0];
  }, [allEvents]);

  return (
    <div>
      {latestEvent && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading} mb-8`}>
            <h1>Popular Events</h1>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="w-full">
              <EventCard data={latestEvent} active={true} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Events
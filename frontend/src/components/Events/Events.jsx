import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import EventCard from "./EventCard"
import { getAllEvents } from '../../redux/actions/event'

const Events = () => {
  const dispatch = useDispatch();
  const { allEvents, isLoading } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  const latestEvent = useMemo(() => {
    if (!allEvents || allEvents.length === 0) return null;
    return [...allEvents].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.start_Date || 0);
      const dateB = new Date(b.createdAt || b.start_Date || 0);
      return dateB - dateA;
    })[0];
  }, [allEvents]);

  return (
    <div className="bg-[#EDE7E3] min-h-screen font-Inter">
      <div className="max-w-[1400px] mx-auto py-10 px-4 md:px-8">
        <div className="text-center mb-8 animate-in slide-in-from-top-8 duration-700">
          <h2 className="text-3xl md:text-5xl font-[700] text-[#16697A] tracking-tighter leading-none italic font-display">Events</h2>
        </div>

        {isLoading ? (
          <div className="h-[40vh] flex justify-center items-center">
            <div className="animate-spin rounded-2xl h-16 w-16 border-4 border-[#16697A] border-t-transparent shadow-xl"></div>
          </div>
        ) : (
          <div className="w-full">
            {latestEvent ? (
              <EventCard data={latestEvent} active={true} />
            ) : (
              <div className="h-[40vh] flex flex-col items-center justify-center text-center p-12 bg-white/40 backdrop-blur-xl rounded-[48px] border border-white">
                <h2 className="text-2xl font-[700] text-[#16697A] font-display italic">No Events!</h2>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Events;
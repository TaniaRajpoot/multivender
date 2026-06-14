import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import EventCard from "./EventCard"
import { getAllEvents } from '../../redux/actions/event'

const Events = ({ isOnlyOne = false }) => {
  const dispatch = useDispatch();
  const { allEvents, isLoading } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  const sortedEvents = useMemo(() => {
    if (!allEvents || allEvents.length === 0) return [];
    return [...allEvents].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.start_Date || 0);
      const dateB = new Date(b.createdAt || b.start_Date || 0);
      return dateB - dateA;
    });
  }, [allEvents]);

  const latestEvent = sortedEvents[0] || null;

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">Special offers & events</h2>
          <p className="text-gray-600 mt-2 text-sm">Limited-time deals from our sellers</p>
        </div>

        {isLoading ? (
          <div className="h-[40vh] flex justify-center items-center">
            <div className="animate-spin rounded-2xl h-16 w-16 border-4 border-[#16697A] border-t-transparent shadow-xl"></div>
          </div>
        ) : (
          <div className="w-full">
            {isOnlyOne ? (
              latestEvent ? (
                <EventCard data={latestEvent} active={true} />
              ) : (
                <div className="h-[40vh] flex flex-col items-center justify-center text-center p-12 bg-white/40 backdrop-blur-xl rounded-[48px] border border-white">
                  <h2 className="text-2xl font-[700] text-[#16697A] font-display italic">No Events!</h2>
                </div>
              )
            ) : (
              sortedEvents.length > 0 ? (
                <div className="flex flex-col gap-8">
                  {sortedEvents.map((event, index) => (
                    <EventCard key={event._id || index} data={event} active={true} />
                  ))}
                </div>
              ) : (
                <div className="h-[40vh] flex flex-col items-center justify-center text-center p-12 bg-white/40 backdrop-blur-xl rounded-[48px] border border-white">
                  <h2 className="text-2xl font-[700] text-[#16697A] font-display italic">No Events!</h2>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Events;
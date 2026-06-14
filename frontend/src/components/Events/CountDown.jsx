import React, { useEffect, useState } from "react";

const CountDown = ({ data, isDeadline }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  function calculateTimeLeft() {
    const targetDate = new Date(data?.Finish_Date || data?.FinishDate);
    const difference = targetDate - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval] && interval !== 'seconds') return null;

    if (isDeadline) {
      return (
        <span key={interval} className="text-2xl md:text-3xl font-black text-[#E53E3E] drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]">
          {timeLeft[interval]}<span className="text-[10px] font-bold text-[#CA6363] uppercase tracking-widest ml-1">{interval}</span>
        </span>
      );
    }

    return (
      <span key={interval} className="text-lg font-black text-[#82C0CC] group-hover:text-white transition-colors duration-500">
        {timeLeft[interval]}<span className="text-[9px] uppercase tracking-widest ml-1 opacity-70">{interval.charAt(0)}</span>
      </span>
    );
  });

  return (
    <div className={`flex items-center ${isDeadline ? 'justify-between' : 'justify-center gap-4'}`}>
      {timerComponents.length ? (
        timerComponents
      ) : (
        <span className={`text-lg font-black uppercase tracking-[0.2em] animate-pulse ${isDeadline ? 'text-red-500' : 'text-[#16697A]'}`}>Event Concluded</span>
      )}
    </div>
  );
};

export default CountDown;

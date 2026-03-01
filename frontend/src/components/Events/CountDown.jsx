import React, { useEffect, useState } from "react";

const CountDown = ({ data }) => {
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
    if (!timeLeft[interval]) return null;

    return (
      <span key={interval} className="text-xl md:text-2xl font-black text-[#FFA62B] group-hover:text-white transition-colors duration-500 drop-shadow-lg">
        {timeLeft[interval]}<span className="text-[10px] uppercase tracking-widest ml-1 opacity-70">{interval}</span>
      </span>
    );
  });

  return (
    <div className="flex items-center justify-center gap-4">
      {timerComponents.length ? (
        timerComponents
      ) : (
        <span className="text-lg font-black text-[#FFA62B] uppercase tracking-[0.2em] animate-pulse">Event Concluded</span>
      )}
    </div>
  );
};

export default CountDown;

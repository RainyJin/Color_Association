import { useState, useEffect } from "react";
import Calendar from "../assets/Calendar.svg";
const months = [
  { name: "Jan", days: 31 },
  { name: "Feb", days: 28 },
  { name: "Mar", days: 31 },
  { name: "Apr", days: 30 },
  { name: "May", days: 31 },
  { name: "Jun", days: 30 },
  { name: "Jul", days: 31 },
  { name: "Aug", days: 31 },
  { name: "Sep", days: 30 },
  { name: "Oct", days: 31 },
  { name: "Nov", days: 30 },
  { name: "Dec", days: 31 },
];

export default function TestPage() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(8); // 8 for September
  const [currentDay, setCurrentDay] = useState(1);

  const [showRedLine, setShowRedLine] = useState(false);
  const [showYellowLine, setShowYellowLine] = useState(false);

  const handleAdvanceDay = () => {
    setCurrentDay((prevDay) => {
      const monthDays = months[currentMonthIndex].days;
      if (prevDay < monthDays) {
        return prevDay + 1;
      } else {
        // If we're at the last day of the month, reset to day 1
        setCurrentMonthIndex((prevMonthIndex) =>
          prevMonthIndex < 11 ? prevMonthIndex + 1 : 0
        );
        return 1;
      }
    });
  };

  // Handle key press
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "a" || event.key === "A") {
        setShowRedLine(true);
        setShowYellowLine(false);
        setTimeout(() => {
          handleAdvanceDay();
          setShowRedLine(false);
        }, 400);
      } else if (event.key === "d" || event.key === "D") {
        setShowYellowLine(true);
        setShowRedLine(false);
        setTimeout(() => {
          handleAdvanceDay();
          setShowYellowLine(false);
        }, 400);
      }
    };

    // Attach event listener
    window.addEventListener("keydown", handleKeyPress);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="flex flex-row h-screen">
      <div className="basis-1/2 flex items-center justify-center text-7xl">
        <p className="text-center">
          Day 1 Buy <br /> <strong>apple</strong>
        </p>
      </div>
      <div className="basis-1/2 flex items-center justify-center relative">
        <img
          src={Calendar}
          alt="Calendar"
          style={{ width: "60%", height: "60%" }}
          className="relative"
        />
        <p className="absolute text-white text-5xl font-bold top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-28 z-10">
          {months[currentMonthIndex].name}
        </p>
        <p className="absolute text-black text-8xl font-bold top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
          {currentDay}
        </p>

        {/* Red line (only visible when 'A' is pressed) */}
        {showRedLine && (
          <div className="absolute left-1/2 transform -translate-x-1/2 top-[65%] w-1/2 h-4 bg-red-500 rounded-full animate-scroll-line"></div>
        )}

        {/* Yellow line (only visible when 'D' is pressed) */}
        {showYellowLine && (
          <div className="absolute left-1/2 transform -translate-x-1/2 top-[65%] w-1/2 h-4 bg-yellow-500 rounded-full animate-scroll-line"></div>
        )}
      </div>
    </div>
  );
}

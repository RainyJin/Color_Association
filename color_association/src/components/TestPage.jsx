import { useState, useEffect } from "react";
import Calendar from "../assets/Calendar.svg";

export default function TestPage() {
  const [showRedLine, setShowRedLine] = useState(false);
  const [showYellowLine, setShowYellowLine] = useState(false);

  // Handle key press
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "a" || event.key === "A") {
        setShowRedLine(true); // Show red line on 'A' press
        setShowYellowLine(false); // Hide yellow line if it was shown
        setTimeout(() => {
          setShowRedLine(false);
        }, 1000);
      } else if (event.key === "d" || event.key === "D") {
        setShowYellowLine(true); // Show yellow line on 'D' press
        setShowRedLine(false); // Hide red line if it was shown
        setTimeout(() => {
          setShowYellowLine(false);
        }, 1000);
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
          Sep
        </p>
        <p className="absolute text-black text-8xl font-bold top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
          1
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

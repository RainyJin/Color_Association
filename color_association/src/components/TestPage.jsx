import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../assets/Calendar.svg";
import twoKeys from "../assets/2keys.svg";

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

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function TestPage({ colors, texts, numDays }) {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(8); // 8 for September
  const [currentDay, setCurrentDay] = useState(1);
  const [currentItem, setCurrentItem] = useState("");

  const [totalDays, setTotalDays] = useState(0);
  const navigate = useNavigate();

  const [showRedLine, setShowRedLine] = useState(false);
  const [showYellowLine, setShowYellowLine] = useState(false);
  const [showBlueLine, setShowBlueLine] = useState(false);

  const [shuffledColors, setShuffledColors] = useState([]);

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

    setTotalDays((prevDays) => prevDays + 1);
  };

  useEffect(() => {
    if (totalDays >= numDays) {
      if (colors.length === 2) {
        // After 2-color trial, go to start page for 3-color trial
        navigate("/instructionsThreeColors");
      } else {
        // Go to last page
        navigate("/");
      }
    }
  }, [totalDays, numDays, colors.length, navigate]);

  // Randomize text and colors whenever the day changes
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * texts.length);
    setCurrentItem(texts[randomIndex]);

    setShuffledColors(shuffleArray([...colors]));
  }, [currentDay, texts, colors]);

  // Handle key press
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "a" || event.key === "A") {
        setShowRedLine(true);
        setShowYellowLine(false);
        setShowBlueLine(false); // Hide blue line
        setTimeout(() => {
          handleAdvanceDay();
          setShowRedLine(false);
        }, 1000);
      } else if (event.key === "d" || event.key === "D") {
        setShowYellowLine(true);
        setShowRedLine(false);
        setShowBlueLine(false); // Hide blue line
        setTimeout(() => {
          handleAdvanceDay();
          setShowYellowLine(false);
        }, 1000);
      } else if (event.key === "s" || event.key === "S") {
        // New case for 'S' key
        if (colors.length === 3) {
          // Only show blue line if there are 3 colors
          setShowBlueLine(true);
          setShowRedLine(false);
          setShowYellowLine(false);
          setTimeout(() => {
            handleAdvanceDay();
            setShowBlueLine(false);
          }, 1000);
        }
      }
    };

    // Attach event listener
    window.addEventListener("keydown", handleKeyPress);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [shuffledColors.length]);

  return (
    <div
      className="flex flex-row h-screen"
      style={{ backgroundColor: "#aeaeaf" }}
    >
      <div className="basis-1/2 flex items-center justify-center text-7xl grid grid-rows-2">
        <p className="text-center mb-[-200px]">
          Buy <br className="mb-[30px]" /> <strong>{currentItem}</strong>
        </p>
        <div className="flex items-center justify-center relative mt-[-80px]">
          <img
            src={twoKeys}
            alt="2Key Keyboard"
            style={{ width: "60%", height: "60%", opacity: 0 }}
            className="relative"
          />
          {shuffledColors.map((color, index) => {
            let positionClass = "";
            if (colors.length === 2) {
              positionClass = index === 0 ? "left-1/4" : "right-1/4";
            } else if (colors.length === 3) {
              positionClass =
                index === 0
                  ? "left-1/4"
                  : index === 1
                  ? "left-1/5"
                  : "right-1/4";
            }

            return (
              <div
                key={index}
                className={`absolute ${positionClass} w-24 h-24`}
                style={{ backgroundColor: color, borderRadius: "0.5rem" }}
              ></div>
            );
          })}
        </div>
      </div>
      <div className="basis-1/2 flex items-center justify-center relative">
        <img
          src={Calendar}
          alt="Calendar"
          style={{ width: "60%", height: "60%" }}
          className="relative transform translate-x-1"
        />
        <p className="absolute text-black text-5xl font-bold top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-28 z-10">
          {months[currentMonthIndex].name}
        </p>
        <p className="absolute text-black text-8xl font-bold top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
          {currentDay}
        </p>

        {/* Red line (only visible when 'A' is pressed) */}
        {showRedLine && (
          <div
            className="absolute left-1/2 transform -translate-x-1/2 top-[46%]"
            style={{
              backgroundColor: shuffledColors[0],
              width: "360px",
              height: "220px",
            }}
          ></div>
        )}

        {/* Yellow line (only visible when 'D' is pressed and colors.length is 3) */}
        {showYellowLine && colors.length >= 2 && (
          <div
            className="absolute left-1/2 transform -translate-x-1/2 top-[46%]"
            style={{
              backgroundColor: shuffledColors[shuffledColors.length - 1],
              width: "360px",
              height: "220px",
            }}
          ></div>
        )}

        {/* Blue line (only visible when 'S' is pressed and colors.length is 3) */}
        {showBlueLine && colors.length === 3 && (
          <div
            className="absolute left-1/2 transform -translate-x-1/2 top-[46%]"
            style={{
              backgroundColor: shuffledColors[1],
              width: "360px",
              height: "220px",
            }} // Use colors[2] for blue line
          ></div>
        )}
      </div>
    </div>
  );
}

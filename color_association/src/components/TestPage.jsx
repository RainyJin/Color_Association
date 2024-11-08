import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../assets/Calendar.svg";
import Calendar2 from "../assets/Calendar (1).svg";
import twoKeys from "../assets/2keys.svg";
import soundFile from "../assets/t1000Hz.mp3";

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

export default function TestPage({
  trial,
  trialNum,
  numDays,
  recordSelection,
}) {
  const colors = Object.values(trial);
  const texts = Object.keys(trial);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(8); // 8 for September
  const [currentDay, setCurrentDay] = useState(1);
  const [currentItem, setCurrentItem] = useState("");
  const [totalDays, setTotalDays] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const navigate = useNavigate();

  const [showRedLine, setShowRedLine] = useState(false);
  const [showYellowLine, setShowYellowLine] = useState(false);
  const [showBlueLine, setShowBlueLine] = useState(false);

  const [shuffledColors, setShuffledColors] = useState([]);
  const [isSliding, setIsSliding] = useState(false); // Track sliding state
  const [showBlankScreen, setShowBlankScreen] = useState(false); // Track blank screen visibility
  const soundEffect = new Audio(soundFile);

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
      } else if (colors.length === 3) {
        // After 3-color trial, go to the end page
        navigate("/endpage");
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
  }, [currentDay]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (isSliding) return; // Prevent triggering animation during a slide

      let selectedIndex = null;
      let color = "";
      let isCorrect = false;
      let reactionTime = 0; // To be calculated

      const currentTime = Date.now(); // Get current time
      reactionTime = currentTime - startTime; // Calculate reaction time

      if (event.key === "a" || event.key === "A") {
        selectedIndex = 0;
        color = shuffledColors[selectedIndex];
        setShowRedLine(true);
        setShowYellowLine(false);
        setShowBlueLine(false);
      } else if (event.key === "d" || event.key === "D") {
        selectedIndex = colors.length === 2 ? 1 : 2; // Set the index based on color count
        color = shuffledColors[selectedIndex];
        setShowYellowLine(colors.length === 2);
        setShowBlueLine(colors.length === 3);
        setShowRedLine(false);
      } else if (event.key === "s" || event.key === "S") {
        if (colors.length === 3) {
          selectedIndex = 1;
          color = shuffledColors[selectedIndex];
          setShowYellowLine(true);
          setShowRedLine(false);
          setShowBlueLine(false);
        }
      }

      if (selectedIndex !== null) {
        isCorrect = color === trial[currentItem];
        // Play sound if selection is incorrect
        if (!isCorrect) {
          soundEffect.currentTime = 0; // Reset playback position
          soundEffect.play();
        }

        // Trigger the sliding animation
        setIsSliding(true);
        const element = document.getElementById(
          `color-square-${selectedIndex}`
        );
        element.classList.add("slide-to-calendar");

        // Wait for the animation to finish, then show the line
        setTimeout(() => {
          // Remove the sliding class to return the square to its original spot
          setTimeout(() => {
            element.classList.remove("slide-to-calendar");
            setIsSliding(false); // Allow new sliding after reset

            const trialData = {
              trialNum: trialNum,
              colorCount: colors.length,
              displayedColorText: currentItem,
              shuffledColors: shuffledColors,
            };

            // Record the selection
            recordSelection(color, isCorrect, reactionTime, trialData);

            // Show blank screen, advance to the next day after delay, and hide it
            setShowBlankScreen(true); // Show blank screen
            setTimeout(() => {
              handleAdvanceDay();
              setShowRedLine(false);
              setShowYellowLine(false);
              setShowBlueLine(false);
              setShowBlankScreen(false); // Hide blank screen
            }, 100); // Wait for 100ms
          }, 1000); // Wait for slide back to original spot
        }, 1000); // Wait for slide animation (1000ms)
      }
    };

    // Attach event listener
    window.addEventListener("keydown", handleKeyPress);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [shuffledColors, isSliding, startTime]);

  return (
    <div
      className="flex flex-row h-screen"
      style={{ backgroundColor: "#595959" }}
    >
      {/* Blank screen overlay */}
      {showBlankScreen && (
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{ backgroundColor: "#595959", zIndex: 50 }} // Use the same background color
        />
      )}
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
                id={`color-square-${index}`}
                key={index}
                className={`absolute ${positionClass} w-24 h-24`}
                style={{ backgroundColor: color, borderRadius: "0.5rem" }}
              ></div>
            );
          })}
        </div>
      </div>
      <div className="basis-1/2 flex items-center justify-center relative">
        <img src={Calendar2} alt="Calendar" className="w-[60%] h-[60%] z-0" />
        <p className="absolute text-black text-5xl font-bold top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-28 z-10">
          {months[currentMonthIndex].name}
        </p>
        <p className="absolute text-black text-8xl font-bold top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
          {currentDay}
        </p>

        {/* Red line (only visible when 'A' is pressed) */}
        {showRedLine && (
          <div className="absolute left-1/2 transform -translate-x-1/2 top-[65%] w-1/2 h-16 overflow-hidden">
            <div
              className="h-full bg-blue-500 animate-scroll-line"
              style={{
                backgroundColor: shuffledColors[0],
                transform: "translateX(0.6rem)",
              }}
            />
          </div>
        )}

        {showYellowLine && (
          <div className="absolute left-1/2 transform -translate-x-1/2 top-[65%] w-1/2 h-16 overflow-hidden">
            <div
              className="h-full bg-blue-500 animate-scroll-line"
              style={{
                backgroundColor: shuffledColors[1],
                transform: "translateX(0.6rem)",
              }}
            />
          </div>
        )}

        {showBlueLine && (
          <div className="absolute left-1/2 transform -translate-x-1/2 top-[65%] w-1/2 h-16 overflow-hidden">
            <div
              className="h-full bg-blue-500 animate-scroll-line"
              style={{
                backgroundColor: shuffledColors[2],
                transform: "translateX(0.6rem)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

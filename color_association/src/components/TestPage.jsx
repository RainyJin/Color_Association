import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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

export default function TestPage({
  trial,
  trialNum,
  numDays,
  recordSelection,
  correctCombo,
  startDay = 0,
  onComplete,
  trialType,
}) {
  const colors = Object.values(correctCombo);
  const texts = Object.keys(correctCombo);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(8);
  const [currentDay, setCurrentDay] = useState(startDay + 1);
  const [currentItem, setCurrentItem] = useState("");
  const [totalDays, setTotalDays] = useState(startDay);
  const [startTime, setStartTime] = useState(0);
  const [isTrialReady, setIsTrialReady] = useState(false);
  const [currentTrialIndex, setCurrentTrialIndex] = useState(startDay);
  const [canPress, setCanPress] = useState(true);

  const navigate = useNavigate();

  const [showRedLine, setShowRedLine] = useState(false);
  const [showYellowLine, setShowYellowLine] = useState(false);
  const [showBlueLine, setShowBlueLine] = useState(false);

  const [currentColors, setCurrentColors] = useState([]);
  const [isSliding, setIsSliding] = useState(false);
  const [showBlankScreen, setShowBlankScreen] = useState(false);
  const soundEffect = new Audio(soundFile);

  // Refs for calculating distances
  const calendarRef = useRef(null);
  const squareRefs = useRef([]);
  const [slideDistances, setSlideDistances] = useState([]);

  // Calculate distances between squares and calendar
  const calculateSlideDistances = () => {
    if (calendarRef.current && squareRefs.current.length > 0) {
      const calendarRect = calendarRef.current.getBoundingClientRect();
      const calendarCenterX = calendarRect.left + calendarRect.width / 2;

      const newDistances = squareRefs.current.map((ref) => {
        if (ref) {
          const squareRect = ref.getBoundingClientRect();
          const squareRight = squareRect.left + squareRect.width;
          // Calculate the distance to slide so the right edge of the square aligns with calendar center
          return calendarCenterX - squareRight;
        }
        return 0;
      });

      setSlideDistances(newDistances);
    }
  };

  // Recalculate distances on window resize
  useEffect(() => {
    calculateSlideDistances();
    window.addEventListener("resize", calculateSlideDistances);
    return () => window.removeEventListener("resize", calculateSlideDistances);
  }, [currentColors]);

  const handleAdvanceDay = () => {
    setCurrentDay((prevDay) => {
      const monthDays = months[currentMonthIndex].days;
      if (prevDay < monthDays) {
        return prevDay + 1;
      } else {
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
      if (onComplete) {
        onComplete();
      }
      if (colors.length === 2) {
        navigate("/instructionsThreeColors");
      } else if (colors.length === 3) {
        navigate("/endpage");
      } else {
        navigate("/");
      }
    }
  }, [totalDays, numDays, colors.length, navigate, onComplete]);

  const isTrainingPhase = colors.length === 2;

  // Prepare the trial
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * texts.length);
    setCurrentItem(texts[randomIndex]);
    setCurrentColors(Object.values(trial[currentDay]));
    setIsTrialReady(false);

    // Use requestAnimationFrame to ensure the UI has updated
    const rafId = requestAnimationFrame(() => {
      // Set start time after the UI has had a chance to render
      setStartTime(Date.now());
      setIsTrialReady(true);
    });

    return () => cancelAnimationFrame(rafId);
  }, [currentDay]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!isTrialReady || isSliding) return;

      setCanPress(false);
      setTimeout(() => setCanPress(true), 1000); // 1 second cooldown

      let selectedIndex = null;
      let color = "";
      let isCorrect = false;
      const currentTime = Date.now();
      const reactionTime = currentTime - startTime;

      if (event.key === "a" || event.key === "A") {
        selectedIndex = 0;
        color = currentColors[selectedIndex];
      } else if (event.key === "d" || event.key === "D") {
        selectedIndex = colors.length === 2 ? 1 : 2;
        color = currentColors[selectedIndex];
      } else if (event.key === "s" || event.key === "S") {
        if (colors.length === 3) {
          selectedIndex = 1;
          color = currentColors[selectedIndex];
        }
      }

      if (selectedIndex !== null) {
        isCorrect = color === correctCombo[currentItem];

        // Record response data
        const responseData = {
          reactionTime,
          response: color,
          isCorrect,
        };

        if (isTrainingPhase) {
          const trainingResponses = JSON.parse(
            localStorage.getItem("trainingResponses")
          );
          trainingResponses[currentTrialIndex] = responseData;
          localStorage.setItem(
            "trainingResponses",
            JSON.stringify(trainingResponses)
          );
        } else {
          const testingResponses = JSON.parse(
            localStorage.getItem("testingResponses")
          );
          testingResponses[currentTrialIndex] = responseData;
          localStorage.setItem(
            "testingResponses",
            JSON.stringify(testingResponses)
          );
        }

        if (!isCorrect) {
          // Play sound effect and show shake animation for incorrect selection
          soundEffect.currentTime = 0;
          soundEffect.play();

          const selectedElement = squareRefs.current[selectedIndex];
          selectedElement.classList.add("animate-shake");

          // Find correct color and animate after shake
          const correctIndex = currentColors.findIndex(
            (c) => c === correctCombo[currentItem]
          );

          setTimeout(() => {
            selectedElement.classList.remove("animate-shake");
            const correctElement = squareRefs.current[correctIndex];

            if (correctElement) {
              setIsSliding(true);
              // Ensure full slide for incorrect selections
              correctElement.style.transform = `translateX(${
                slideDistances[correctIndex] + 70
              }px)`;

              // Show line for correct color
              setShowRedLine(correctIndex === 0);
              setShowYellowLine(correctIndex === 1);
              setShowBlueLine(correctIndex === 2);
            }

            // Complete trial after animations
            setTimeout(() => {
              squareRefs.current.forEach((ref) => {
                if (ref) ref.style.transform = "translateX(0)";
              });
              setIsSliding(false);

              const trialData = {
                trialNum,
                colorCount: colors.length,
                displayedColorText: currentItem,
                shuffledColors: currentColors,
                day: totalDays,
                trialType: trialType,
              };

              recordSelection(color, isCorrect, reactionTime, trialData);

              setShowBlankScreen(true);
              setTimeout(() => {
                handleAdvanceDay();
                setCurrentTrialIndex((prev) => prev + 1);
                setShowRedLine(false);
                setShowYellowLine(false);
                setShowBlueLine(false);
                setShowBlankScreen(false);
              }, 100);
            }, 800);
          }, 500);
        } else {
          // Animate correct selection
          setIsSliding(true);
          const element = squareRefs.current[selectedIndex];
          if (element) {
            element.style.transform = `translateX(${slideDistances[selectedIndex]}px)`;

            // Show line for correct color
            setShowRedLine(selectedIndex === 0);
            setShowYellowLine(selectedIndex === 1);
            setShowBlueLine(selectedIndex === 2);
          }

          // Complete trial after animation
          setTimeout(() => {
            squareRefs.current.forEach((ref) => {
              if (ref) ref.style.transform = "translateX(0)";
            });
            setIsSliding(false);

            const trialData = {
              trialNum,
              colorCount: colors.length,
              displayedColorText: currentItem,
              shuffledColors: currentColors,
              day: totalDays,
              trialType: isTrainingPhase ? "training" : "testing",
            };

            recordSelection(color, isCorrect, reactionTime, trialData);

            setShowBlankScreen(true);
            setTimeout(() => {
              handleAdvanceDay();
              setCurrentTrialIndex((prev) => prev + 1);
              setShowRedLine(false);
              setShowYellowLine(false);
              setShowBlueLine(false);
              setShowBlankScreen(false);
            }, 100);
          }, 800);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    currentColors,
    isSliding,
    startTime,
    slideDistances,
    currentItem,
    currentTrialIndex,
    isTrainingPhase,
    trialNum,
    totalDays,
    isTrialReady,
  ]);

  if (!isTrialReady) {
    return <div style={{ backgroundColor: "#595959" }} className="h-screen" />;
  }

  return (
    <div
      className="flex flex-row h-screen"
      style={{ backgroundColor: "#595959" }}
    >
      {showBlankScreen && (
        <div className="absolute top-0 left-0 w-full h-full bg-[#595959] z-50" />
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
          {currentColors.map((color, index) => {
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
                ref={(el) => (squareRefs.current[index] = el)}
                className={`absolute ${positionClass} w-24 h-24 transition-transform duration-200 ease-in-out color-square`}
                style={{
                  backgroundColor: color,
                  borderRadius: "0.5rem",
                }}
              ></div>
            );
          })}
        </div>
      </div>
      <div className="basis-1/2 flex items-center justify-center relative">
        <img
          ref={calendarRef}
          src={Calendar2}
          alt="Calendar"
          className="w-[60%] h-[60%] z-0"
        />
        <p className="absolute text-black text-5xl font-bold top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-28 z-10">
          {months[currentMonthIndex].name}
        </p>
        <p className="absolute text-black text-8xl font-bold top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
          {currentDay}
        </p>

        {showRedLine && (
          <div className="absolute left-1/2 transform -translate-x-1/2 top-[65%] w-1/2 h-16 overflow-hidden">
            <div
              className="h-full bg-blue-500 animate-scroll-line"
              style={{
                backgroundColor: currentColors[0],
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
                backgroundColor: currentColors[1],
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
                backgroundColor: currentColors[2],
                transform: "translateX(0.6rem)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

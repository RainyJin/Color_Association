import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import TestPage from "./components/TestPage";
import InitialInstructionPage from "./components/InitialInstructionPage";
import SpecificInstructionsPage from "./components/SpecificInstructionsPage";
import EndPage from "./components/EndPage";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function App() {
  const trials = shuffleArray([
    // #1
    {
      twoColorMapping: { apple: "#990000", banana: "#FFDF00" },
      threeColorMapping: {
        apple: "#990000",
        banana: "#FFDF00",
        blueberry: "#0096FF",
      },
    },
    // #2
    {
      twoColorMapping: { orange: "#FFA500", grape: "#800080" },
      threeColorMapping: {
        orange: "#FFA500",
        grape: "#800080",
        lime: "#00FF00",
      },
    },
    // #3
  ]);
  // const twoColors = ["#990000", "#FFDF00"];
  // const threeColors = ["#990000", "#FFDF00", "#0096FF"];
  // const twoConcepts = ["apple", "banana"];
  // const threeConcepts = ["apple", "banana", "blueberry"];
  const recordSelection = (
    selectedColor,
    isCorrect,
    reactionTime,
    trialData
  ) => {
    const trialDataEntry = {
      trialNum: trialData.trialNum,
      colorCount: trialData.colorCount,
      displayedColorText: trialData.displayedColorText,
      shuffledColors: trialData.shuffledColors,
      selectedColor: selectedColor,
      isCorrect: isCorrect,
      reactionTime: reactionTime,
    };

    // Get existing data from local storage
    const existingData = JSON.parse(localStorage.getItem("trialData")) || [];
    existingData.push(trialDataEntry);
    localStorage.setItem("trialData", JSON.stringify(existingData));
  };

  return (
    <div>
      <Routes>
        <Route path="/" element={<InitialInstructionPage />} />
        <Route
          path="/instructionsTwoColors"
          element={
            <SpecificInstructionsPage trial={trials[0].twoColorMapping} />
          }
        />
        <Route
          path="/trialsTwoColors"
          element={
            <TestPage
              trial={trials[0].twoColorMapping}
              numDays={4}
              recordSelection={recordSelection}
              trialNum={0}
            />
          }
        />
        <Route
          path="/instructionsThreeColors"
          element={
            <SpecificInstructionsPage trial={trials[0].threeColorMapping} />
          }
        />
        <Route
          path="/trialsThreeColors"
          element={
            <TestPage
              trial={trials[0].threeColorMapping}
              numDays={4}
              recordSelection={recordSelection}
              trialNum={0}
            />
          }
        />
        <Route path="/endpage" element={<EndPage />} />
      </Routes>
    </div>
  );
}

export default App;

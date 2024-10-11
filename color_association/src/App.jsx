import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import TestPage from "./components/TestPage";
import InstructionPage from "./components/InstructionPage";
import StartPage from "./components/StartPage";

function App() {
  const twoColors = ["#990000", "#FFDF00"];
  const threeColors = ["#990000", "#FFDF00", "#0096FF"];
  const twoConcepts = ["apple", "banana"];
  const threeConcepts = ["apple", "banana", "blueberry"];

  return (
    <div>
      <Routes>
        <Route path="/" element={<InstructionPage />} />
        <Route
          path="/instructionsTwoColors"
          element={<StartPage colors={twoColors} texts={twoConcepts} />}
        />
        <Route
          path="/trialsTwoColors"
          element={
            <TestPage colors={twoColors} texts={twoConcepts} numDays={10} />
          }
        />
        <Route
          path="/instructionsThreeColors"
          element={<StartPage colors={threeColors} texts={threeConcepts} />}
        />
        <Route
          path="/trialsThreeColors"
          element={
            <TestPage colors={threeColors} texts={threeConcepts} numDays={20} />
          }
        />
      </Routes>
    </div>
  );
}

export default App;

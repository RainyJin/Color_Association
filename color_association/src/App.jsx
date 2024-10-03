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
  const threeconcepts = ["apple", "banana", "blueberry"];

  return (
    <div>
      <Routes>
        <Route path="/" element={<InstructionPage />} />
        <Route
          path="/instructions"
          element={<StartPage colors={threeColors} texts={threeconcepts} />}
        />
        <Route
          path="/trial"
          element={<TestPage colors={threeColors} texts={threeconcepts} />}
        />
      </Routes>
    </div>
  );
}

export default App;

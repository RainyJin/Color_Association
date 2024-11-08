// CombinedColorTrial.jsx
import { initJsPsych } from "jspsych";
import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import "jspsych/css/jspsych.css";
import { useEffect, useRef } from "react";
import StartPage from "../SpecificInstructionsPage";
import TestPage from "../TestPage";

const CombinedColorTrial = ({
  twoColors,
  twoConcepts,
  threeColors,
  threeConcepts,
}) => {
  const jsPsychRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Initialize jsPsych
    jsPsychRef.current = initJsPsych({
      on_finish: () => {
        console.log("Experiment finished");
      },
    });

    // Define the trial sequence
    const timeline = [];

    // First sequence: Two colors
    // Start page for two colors
    timeline.push({
      type: htmlButtonResponse,
      stimulus: () => {
        const startDiv = document.createElement("div");
        startDiv.id = "start-page-container";
        return startDiv;
      },
      choices: ["Start"],
      on_load: () => {
        const container = document.getElementById("start-page-container");
        if (container) {
          const startPage = document.createElement("div");
          container.appendChild(startPage);
          ReactDOM.render(
            <StartPage colors={twoColors} texts={twoConcepts} />,
            startPage
          );
        }
      },
    });

    // Test page for two colors
    timeline.push({
      type: htmlKeyboardResponse,
      stimulus: () => {
        const testDiv = document.createElement("div");
        testDiv.id = "test-page-container";
        return testDiv;
      },
      choices: twoColors.map((_, index) => `${index + 1}`),
      on_load: () => {
        const container = document.getElementById("test-page-container");
        if (container) {
          const testPage = document.createElement("div");
          container.appendChild(testPage);
          ReactDOM.render(
            <TestPage colors={twoColors} texts={twoConcepts} numDays={10} />,
            testPage
          );
        }
      },
    });

    // Second sequence: Three colors
    // Start page for three colors
    timeline.push({
      type: htmlButtonResponse,
      stimulus: () => {
        const startDiv = document.createElement("div");
        startDiv.id = "start-page-container-three";
        return startDiv;
      },
      choices: ["Start"],
      on_load: () => {
        const container = document.getElementById("start-page-container-three");
        if (container) {
          const startPage = document.createElement("div");
          container.appendChild(startPage);
          ReactDOM.render(
            <StartPage colors={threeColors} texts={threeConcepts} />,
            startPage
          );
        }
      },
    });

    // Test page for three colors
    timeline.push({
      type: htmlKeyboardResponse,
      stimulus: () => {
        const testDiv = document.createElement("div");
        testDiv.id = "test-page-container-three";
        return testDiv;
      },
      choices: threeColors.map((_, index) => `${index + 1}`),
      on_load: () => {
        const container = document.getElementById("test-page-container-three");
        if (container) {
          const testPage = document.createElement("div");
          container.appendChild(testPage);
          ReactDOM.render(
            <TestPage
              colors={threeColors}
              texts={threeConcepts}
              numDays={10}
            />,
            testPage
          );
        }
      },
    });

    // Run the experiment
    jsPsychRef.current.run(timeline);

    // Cleanup function
    return () => {
      if (jsPsychRef.current) {
        const displayElement = jsPsychRef.current.getDisplayElement();
        if (displayElement) {
          while (displayElement.firstChild) {
            displayElement.removeChild(displayElement.firstChild);
          }
        }
      }
    };
  }, [twoColors, twoConcepts, threeColors, threeConcepts]);

  return (
    <div
      ref={containerRef}
      id="jspsych-container"
      className="w-full min-h-screen flex items-center justify-center bg-[#595959]"
    />
  );
};

export default CombinedColorTrial;

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

function generatePermutations(colors) {
  if (colors.length === 0) return [];
  if (colors.length === 1) return [colors];

  const permutations = [];
  for (let i = 0; i < colors.length; i++) {
    const remainingColors = colors.slice(0, i).concat(colors.slice(i + 1));
    const subPermutations = generatePermutations(remainingColors);
    for (const perm of subPermutations) {
      permutations.push([colors[i], ...perm]);
    }
  }
  return permutations;
}

function generateOrders(items, mappings) {
  const keys = Object.keys(items);

  // Helper function to get all permutations of an array
  function getPermutations(arr) {
    if (arr.length <= 1) return [arr];

    const result = [];
    for (let i = 0; i < arr.length; i++) {
      const current = arr[i];
      const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
      const perms = getPermutations(remaining);

      for (const perm of perms) {
        result.push([current, ...perm]);
      }
    }
    return result;
  }

  const result = [];
  const keyPermutations = getPermutations(keys);

  // For each key permutation
  for (const keyOrder of keyPermutations) {
    // For each possible starting position of the first color
    for (let i = 0; i < mappings.length; i++) {
      // Rotate the colors array to start with each color
      const rotatedMappings = [...mappings.slice(i), ...mappings.slice(0, i)];

      // Create the combination object
      const combination = {};
      keyOrder.forEach((key, index) => {
        combination[key] = rotatedMappings[index];
      });
      result.push(combination);
    }
  }

  return result;
}

function generateTrialSets(isShortTraining) {
  // placeholder for now
  const twoColorItems = { apple: null, banana: null };
  const twoColorMapping = ["#5E2B3A", "#FCDB42"];
  const twoColorOrders = generateOrders(twoColorItems, twoColorMapping);

  const threeColorItems = { apple: null, banana: null, cherry: null };
  const threeColorMapping = ["#5E2B3A", "#FCDB42", "#0E8A19"];
  const threeColorOrders = generateOrders(threeColorItems, threeColorMapping);

  // Generate training trial sets
  const trainingRepetitions = isShortTraining ? 2 : 4;
  const trainingTrials = [];
  const blockOfTrainingTrials = [];
  // concatenate to form 36 trials
  for (let i = 0; i < 9; i++) {
    blockOfTrainingTrials.push(...twoColorOrders);
  }
  for (let i = 0; i < trainingRepetitions; i++) {
    trainingTrials.push(...shuffleArray([...blockOfTrainingTrials]));
  }

  // Generate testing trial sets with 18 combinations per block
  const testingTrials = [];
  const numberOfTestingBlocks = isShortTraining ? 19 : 15; //

  for (let i = 0; i < numberOfTestingBlocks; i++) {
    testingTrials.push(...shuffleArray([...threeColorOrders]));
  }

  return {
    trainingTrials,
    testingTrials,
  };
}

function App() {
  const trials = [
    // #1 remap assigned to remap
    {
      twoColorMapping: { apple: "#5E2B3A", banana: "#FCDB42" },
      threeColorMapping: {
        apple: "#5E2B3A",
        banana: "#FCDB42",
        cherry: "#0E8A19",
      },
    },
    // TODO: Add the other 3 conditions
  ];
  const [isShortTraining, setIsShortTraining] = useState(true);
  const [trialSets, setTrialSets] = useState({
    trainingTrials: [],
    testingTrials: [],
  });

  useEffect(() => {
    const generatedTrials = generateTrialSets(isShortTraining);
    setTrialSets(generatedTrials);
  }, [isShortTraining]);

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
        <Route
          path="/"
          element={
            <InitialInstructionPage setIsShortTraining={setIsShortTraining} />
          }
        />
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
              trial={trialSets.trainingTrials}
              numDays={trialSets.trainingTrials.length}
              recordSelection={recordSelection}
              trialNum={0}
              correctCombo={trials[0].twoColorMapping}
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
              trial={trialSets.testingTrials}
              numDays={trialSets.testingTrials.length}
              recordSelection={recordSelection}
              trialNum={0}
              correctCombo={trials[0].threeColorMapping}
            />
          }
        />
        <Route path="/endpage" element={<EndPage />} />
      </Routes>
    </div>
  );
}

export default App;

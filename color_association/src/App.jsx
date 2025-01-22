import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import TestPage from "./components/TestPage";
import ParticipantIdPage from "./components/ParticipantIdPage";
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

function generateTrialSets(isShortTraining, currentTrial) {
  if (!currentTrial) return { trainingTrials: [], testingTrials: [] };

  // Get the correct items based on the selected trial
  const twoColorItems = Object.keys(currentTrial.twoColorMapping).reduce(
    (obj, key) => {
      obj[key] = null;
      return obj;
    },
    {}
  );

  const threeColorItems = Object.keys(currentTrial.threeColorMapping).reduce(
    (obj, key) => {
      obj[key] = null;
      return obj;
    },
    {}
  );

  const twoColorMapping = Object.values(currentTrial.twoColorMapping);
  const threeColorMapping = Object.values(currentTrial.threeColorMapping);

  // Rest of the generateTrialSets function remains the same
  const twoColorOrders = generateOrders(twoColorItems, twoColorMapping);
  const threeColorOrders = generateOrders(threeColorItems, threeColorMapping);

  // Generate training trial sets
  const trainingRepetitions = isShortTraining ? 2 : 4;
  const trainingTrials = [];
  const blockOfTrainingTrials = [];

  for (let i = 0; i < 9; i++) {
    blockOfTrainingTrials.push(...twoColorOrders);
  }
  for (let i = 0; i < trainingRepetitions; i++) {
    trainingTrials.push(...shuffleArray([...blockOfTrainingTrials]));
  }

  // Generate testing trial sets
  const testingTrials = [];
  const numberOfTestingBlocks = isShortTraining ? 19 : 15;

  for (let i = 0; i < numberOfTestingBlocks; i++) {
    testingTrials.push(...shuffleArray([...threeColorOrders]));
  }

  return {
    trainingTrials,
    testingTrials,
  };
}

function App() {
  const navigate = useNavigate();
  const trials = [
    // #1 remap assigned to remap
    {
      twoColorMapping: { apple: "#5E2B3A", banana: "#FCDB42" },
      threeColorMapping: {
        apple: "#0E8A19",
        banana: "#FCDB42",
        cherry: "#5E2B3A",
      },
    },
    // #2 remap assigned to fold-in
    {
      twoColorMapping: { apple: "#5E2B3A", banana: "#FCDB42" },
      threeColorMapping: {
        apple: "#5E2B3A",
        banana: "#FCDB42",
        cherry: "#0E8A19",
      },
    },
    // #3 fold-in assigned to fold-in
    {
      twoColorMapping: { apple: "#5E2B3A", banana: "#FCDB42" },
      threeColorMapping: {
        apple: "#5E2B3A",
        banana: "#FCDB42",
        celery: "#0E8A19",
      },
    },
    // #4 fold-in assigned to remap
    {
      twoColorMapping: { apple: "#5E2B3A", banana: "#FCDB42" },
      threeColorMapping: {
        apple: "#0E8A19",
        banana: "#FCDB42",
        celery: "#5E2B3A",
      },
    },
  ];
  const [isShortTraining, setIsShortTraining] = useState(true);
  const [currentTrial, setCurrentTrial] = useState(null);
  const [trialSets, setTrialSets] = useState({
    trainingTrials: [],
    testingTrials: [],
  });
  const [startDay, setStartDay] = useState(0);

  useEffect(() => {
    const generatedTrials = generateTrialSets(isShortTraining, currentTrial);
    setTrialSets(generatedTrials);
  }, [isShortTraining, currentTrial]);

  const selectTrialAndTraining = (participantId) => {
    localStorage.setItem("participantId", participantId);

    const existingProgress = JSON.parse(
      localStorage.getItem(`progress_${participantId}`)
    );
    let selectedTrial;

    if (existingProgress) {
      // Use the existing progress to determine the trial and state
      selectedTrial = trials[existingProgress.trialIndex];
      setCurrentTrial(selectedTrial);
      setIsShortTraining(existingProgress.isShort);

      localStorage.setItem("currentTrial", JSON.stringify(selectedTrial));

      if (!existingProgress.completedTraining) {
        // Navigate to training phase if training isn't complete
        setStartDay(existingProgress.currentTrainingDay || 0);
        if (!existingProgress.startedTraining) {
          navigate("/instructionsTwoColors");
        } else {
          navigate("/trialsTwoColors");
        }
      } else if (!existingProgress.completedTesting) {
        // Navigate to testing phase if training is complete but testing isn't
        setStartDay(existingProgress.currentTestingDay || 0);
        if (!existingProgress.startedTesting) {
          navigate("/instructionsThreeColors");
        } else {
          navigate("/trialsThreeColors");
        }
      } else {
        // Navigate to the end page if both phases are complete
        navigate("/endpage");
      }
    } else {
      // Initialize new participant if no progress exists
      const trialIndex = participantId % 4;
      const isShort = participantId % 2 === 0;

      selectedTrial = trials[trialIndex];
      setStartDay(0);

      const progress = {
        participantId,
        trialIndex,
        isShort,
        startedTraining: false,
        completedTraining: false,
        startedTesting: false,
        completedTesting: false,
        currentTrainingDay: 0,
        currentTestingDay: 0,
      };

      localStorage.setItem(
        `progress_${participantId}`,
        JSON.stringify(progress)
      );
      localStorage.setItem("currentTrial", JSON.stringify(selectedTrial));
      localStorage.setItem(`trialData_${participantId}`, JSON.stringify([]));

      setCurrentTrial(selectedTrial);
      setIsShortTraining(isShort);
      navigate("/instructionsTwoColors");
    }
  };

  const recordSelection = (
    selectedColor,
    isCorrect,
    reactionTime,
    trialData
  ) => {
    const participantId = localStorage.getItem("participantId");

    const trialDataEntry = {
      trialType: trialData.trialType,
      displayedColorText: trialData.displayedColorText,
      shuffledColors: trialData.shuffledColors,
      selectedColor: selectedColor,
      isCorrect: isCorrect,
      reactionTime: reactionTime,
      day: trialData.day,
      timestamp: Date.now(),
    };

    const existingData =
      JSON.parse(localStorage.getItem(`trialData_${participantId}`)) || [];

    // Directly push the new entry without filtering
    existingData.push(trialDataEntry);

    localStorage.setItem(
      `trialData_${participantId}`,
      JSON.stringify(existingData)
    );

    const isTrainingPhase = trialData.colorCount === 2;
    const updates = isTrainingPhase
      ? { currentTrainingDay: trialData.day + 1 }
      : { currentTestingDay: trialData.day + 1 };
    updateProgress(participantId, updates);
  };

  function updateProgress(participantId, updates) {
    const progressKey = `progress_${participantId}`;
    const existingProgress =
      JSON.parse(localStorage.getItem(progressKey)) || {};

    const updatedProgress = {
      ...existingProgress,
      ...updates,
    };

    localStorage.setItem(progressKey, JSON.stringify(updatedProgress));
  }

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <ParticipantIdPage onParticipantIdSubmit={selectTrialAndTraining} />
          }
        />
        <Route
          path="/initialInstruction"
          element={
            <InitialInstructionPage
              onParticipantIdSubmit={selectTrialAndTraining}
            />
          }
        />
        <Route
          path="/instructionsTwoColors"
          element={
            <SpecificInstructionsPage
              trial={currentTrial?.twoColorMapping}
              onStart={() => {
                const participantId = localStorage.getItem("participantId");
                updateProgress(participantId, { startedTraining: true });
              }}
            />
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
              correctCombo={currentTrial?.twoColorMapping}
              startDay={startDay}
              onComplete={() => {
                const participantId = localStorage.getItem("participantId");
                updateProgress(participantId, {
                  completedTraining: true,
                  currentTrainingDay: trialSets.trainingTrials.length,
                });
              }}
              trialType={"training"}
            />
          }
        />
        <Route
          path="/instructionsThreeColors"
          element={
            <SpecificInstructionsPage
              trial={currentTrial?.threeColorMapping}
              onStart={() => {
                const participantId = localStorage.getItem("participantId");
                updateProgress(participantId, { startedTesting: true });
              }}
            />
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
              correctCombo={currentTrial?.threeColorMapping}
              startDay={startDay}
              onComplete={() => {
                const participantId = localStorage.getItem("participantId");
                updateProgress(participantId, {
                  completedTesting: true,
                  currentTestingDay: trialSets.testingTrials.length,
                });
              }}
              trialType={"testing"}
            />
          }
        />
        <Route path="/endpage" element={<EndPage />} />
      </Routes>
    </div>
  );
}

export default App;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SaveDataButton from "./SaveDataButton";

export default function InitialInstructionPage({ onParticipantIdSubmit }) {
  const navigate = useNavigate();
  const handleNext = () => {
    const participantId = localStorage.getItem("participantId");
    onParticipantIdSubmit(participantId);
  };
  // const [participantId, setParticipantId] = useState("");
  // const [error, setError] = useState("");

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   const id = parseInt(participantId);
  //   if (isNaN(id)) {
  //     setError("Please enter a valid number");
  //     return;
  //   }

  //   const storedParticipantId = localStorage.getItem("participantId");
  //   const existingProgress = JSON.parse(localStorage.getItem(`progress_${id}`));

  //   if (storedParticipantId && parseInt(storedParticipantId) === id) {
  //     // Resume based on progress
  //     onParticipantIdSubmit(id);
  //   } else {
  //     // Clear and initialize new participant data
  //     localStorage.clear();

  //     const isShortTraining = id % 2 === 0;
  //     const trainingTrialsCount = isShortTraining ? 72 : 144;
  //     const testingTrialsCount = isShortTraining ? 324 : 270;

  //     const trainingResponses = Array(trainingTrialsCount).fill({
  //       reactionTime: null,
  //       response: null,
  //       isCorrect: null,
  //     });

  //     const testingResponses = Array(testingTrialsCount).fill({
  //       reactionTime: null,
  //       response: null,
  //       isCorrect: null,
  //     });

  //     localStorage.setItem("participantId", id);
  //     localStorage.setItem(
  //       `progress_${id}`,
  //       JSON.stringify({
  //         participantId: id,
  //         trialIndex: id % 4,
  //         isShort: isShortTraining,
  //         startedTraining: false,
  //         completedTraining: false,
  //         startedTesting: false,
  //         completedTesting: false,
  //         currentTrainingDay: 0,
  //         currentTestingDay: 0,
  //       })
  //     );
  //     localStorage.setItem(
  //       "trainingResponses",
  //       JSON.stringify(trainingResponses)
  //     );
  //     localStorage.setItem(
  //       "testingResponses",
  //       JSON.stringify(testingResponses)
  //     );

  //     onParticipantIdSubmit(id);
  //   }
  // };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen p-8 text-white"
      style={{ backgroundColor: "#595959" }}
    >
      <div className="flex flex-col items-center">
        {/* <label className="mb-6">
            Participant ID:
            <input
              type="number"
              value={participantId}
              onChange={(e) => setParticipantId(e.target.value)}
              className="ml-2 px-2 py-1 text-black rounded"
              required
            />
          </label>
          {error && <p className="text-red-500 mt-2">{error}</p>} */}
        <h1 className="text-3xl font-bold mb-6">Instructions</h1>
        <p className="text-xl text-left w-3/5 mx-auto mb-4">
          In the following tasks, you are going to see a series of days from a
          calendar. On each day, you will be instructed to buy a grocery item
          (e.g., Buy Apple or Buy Banana). Below the name of the grocery item,
          you will see two colored squares (e.g., one red and one green). Your
          job is to indicate which of the two colors represents the item to be
          bought as quickly as possible. Press the key on the far left if you
          think it should be the left colored square and the key on the far
          right if you think it should be the right colored square.
          <br />
          Please look at the text and the colors before making any inputs. And
          please don't press any buttons immediately even if you've pressed the
          wrong button, wait for the next day to load before making a choice.
          <br />
          <br />
          You will start with just two possible items to buy and two colors.
          After completing some number of days with those two items and colors,
          a third item and color will be added. Your overall task will be the
          same though, press the key corresponding to the color that goes with
          the to-be-bought item for the day.
        </p>
        <p className="text-xl text-left w-3/5 mx-auto mb-4">
          Press the Next button to see the to-be-bought items and associated
          colors for the first set of calendar days.{" "}
        </p>
        <button
          onClick={handleNext}
          className="bg-white text-black px-6 py-3 rounded-lg mt-4 mb-4"
        >
          Next
        </button>
      </div>
    </div>
  );
}

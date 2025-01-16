import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function InitialInstructionPage({ onParticipantIdSubmit }) {
  const navigate = useNavigate();
  const [participantId, setParticipantId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const id = parseInt(participantId);
    if (isNaN(id)) {
      setError("Please enter a valid number");
      return;
    }

    const storedParticipantId = localStorage.getItem("participantId");
    const existingProgress = JSON.parse(localStorage.getItem(`progress_${id}`));

    if (storedParticipantId && parseInt(storedParticipantId) === id) {
      // Resume based on progress
      onParticipantIdSubmit(id);
    } else {
      // Clear and initialize new participant data
      localStorage.clear();

      const isShortTraining = id % 2 === 0;
      const trainingTrialsCount = isShortTraining ? 72 : 144;
      const testingTrialsCount = isShortTraining ? 324 : 270;

      const trainingResponses = Array(trainingTrialsCount).fill({
        reactionTime: null,
        response: null,
        isCorrect: null,
      });

      const testingResponses = Array(testingTrialsCount).fill({
        reactionTime: null,
        response: null,
        isCorrect: null,
      });

      localStorage.setItem("participantId", id);
      localStorage.setItem(
        `progress_${id}`,
        JSON.stringify({
          participantId: id,
          trialIndex: id % 4,
          isShort: isShortTraining,
          startedTraining: false,
          completedTraining: false,
          startedTesting: false,
          completedTesting: false,
          currentTrainingDay: 0,
          currentTestingDay: 0,
        })
      );
      localStorage.setItem(
        "trainingResponses",
        JSON.stringify(trainingResponses)
      );
      localStorage.setItem(
        "testingResponses",
        JSON.stringify(testingResponses)
      );

      onParticipantIdSubmit(id);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen p-8 text-white"
      style={{ backgroundColor: "#595959" }}
    >
      <h1 className="text-3xl font-bold mb-6">Instructions</h1>
      <p className="text-xl text-left w-3/5 mx-auto mb-4">
        In the following tasks, you are going to fill the calendar with the
        correct item to buy during each day for a number of days. Each item is
        color coded. You will need to color code each day's calendar by pressing
        the key that represents the color for the day's item.
        <br />
        <br />
        Then another item and its color will be added, you will again, fill the
        next n calendar days with the correct item by pressing the key that
        represents the color for the day's item.
      </p>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex flex-col items-center">
          <label className="mb-2">
            Participant ID:
            <input
              type="number"
              value={participantId}
              onChange={(e) => setParticipantId(e.target.value)}
              className="ml-2 px-2 py-1 text-black rounded"
              required
            />
          </label>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <button
            type="submit"
            className="bg-white text-black px-6 py-3 rounded-lg mt-4"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function InitialInstructionPage({ onParticipantIdSubmit }) {
  const navigate = useNavigate();
  const [participantId, setParticipantId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate that participantId is a number
    const id = parseInt(participantId);
    if (isNaN(id)) {
      setError("Please enter a valid number");
      return;
    }

    // Determine training length based on participant ID
    const isShortTraining = id % 2 === 0;

    // Clear all localStorage data
    localStorage.clear();

    // Store participant ID in localStorage
    localStorage.setItem("participantId", id);

    // Preload trial data
    const trialData = [];
    const trainingResponses = [];
    const testingResponses = [];

    // Initialize arrays with empty data
    // Training: 36 trials per block
    // Short training: 2 blocks = 72 trials
    // Long training: 4 blocks = 144 trials
    const trainingTrialsCount = isShortTraining ? 72 : 144;

    // Testing: 18 trials per block
    // Short training: 18 blocks = 324 trials
    // Long training: 15 blocks = 270 trials
    const testingTrialsCount = isShortTraining ? 324 : 270;

    for (let i = 0; i < trainingTrialsCount; i++) {
      trainingResponses.push({
        reactionTime: null,
        response: null,
        isCorrect: null,
      });
    }

    for (let i = 0; i < testingTrialsCount; i++) {
      testingResponses.push({
        reactionTime: null,
        response: null,
        isCorrect: null,
      });
    }

    // Store preloaded data
    localStorage.setItem("trialData", JSON.stringify(trialData));
    localStorage.setItem(
      "trainingResponses",
      JSON.stringify(trainingResponses)
    );
    localStorage.setItem("testingResponses", JSON.stringify(testingResponses));

    // Call the callback to set up the trial and training length
    onParticipantIdSubmit(id);

    // Navigate to next page
    navigate("/instructionsTwoColors");
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

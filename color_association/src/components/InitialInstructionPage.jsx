import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function InitialInstructionPage({ setIsShortTraining }) {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(true);

  const handleTrainingLengthSelection = (isShort) => {
    setIsShortTraining(isShort); // Pass the selection back to parent state
    setShowPopup(false); // Close the popup
  };

  const handleNext = () => {
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
        color coded. You will need to color code each day’s calendar by pressing
        the key that represents the color for the day’s item.
        <br />
        <br />
        Then another item and its color will be added, you will again, fill the
        next n calendar days with the correct item by pressing the key that
        represents the color for the day's item.
      </p>
      <button
        className="bg-white text-black px-6 py-3 rounded-lg"
        onClick={handleNext}
      >
        Next
      </button>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg text-black">
            <h2 className="text-2xl font-bold mb-4">Choose Training Length</h2>
            <p className="mb-4">
              Please select the training length for the experiment.
            </p>
            <div className="flex justify-around">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={() => handleTrainingLengthSelection(true)}
              >
                Short Training
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                onClick={() => handleTrainingLengthSelection(false)}
              >
                Long Training
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

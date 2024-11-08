import { useNavigate } from "react-router-dom";

export default function SpecificInstructionsPage({ trial }) {
  const navigate = useNavigate();

  const handleStart = () => {
    const colorCount = Object.keys(trial).length;
    if (colorCount === 2) {
      navigate("/trialsTwoColors");
    } else if (colorCount === 3) {
      navigate("/trialsThreeColors");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen space-y-8 text-white"
      style={{ backgroundColor: "#595959" }}
    >
      <p className="w-1/2 text-left text-xl">
        In this trial, you will be seeing all of the items assigned to the
        following colors. Press the button to start the trial.
      </p>

      <div className="flex space-x-4">
        {/* {colors.map((color, index) => (
          <div key={index} className="flex flex-col items-center">
            <p className="text-lg">{texts[index]}</p>
            <div
              style={{ backgroundColor: color }}
              className="w-24 h-24 rounded mt-2"
            ></div>
          </div>
        ))} */}
        {Object.entries(trial).map(([fruit, color], index) => (
          <div key={index} className="flex flex-col items-center">
            <p className="text-lg">{fruit}</p> {/* Display fruit name */}
            <div
              style={{ backgroundColor: color }}
              className="w-24 h-24 rounded mt-2"
            ></div>{" "}
            {/* Display corresponding color */}
          </div>
        ))}
      </div>

      <button
        className="px-4 py-2 bg-white text-black rounded"
        onClick={handleStart}
      >
        Start Trial
      </button>
    </div>
  );
}

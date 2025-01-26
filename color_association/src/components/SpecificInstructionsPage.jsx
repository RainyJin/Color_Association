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
      className="flex flex-col items-center justify-center h-screen space-y-4 text-white"
      style={{ backgroundColor: "#595959" }}
    >
      {Object.keys(trial).length === 3 ? (
        <div className="flex flex-col items-center justify-center">
          <p className="flex items-center text-xl">
            Press 'A' if you think it should be the left colored square and 'D'
            if you think it should be the right.{" "}
          </p>
          <p className="flex items-center text-xl">
            Press 'S' if you think it should be the middle colored square.
          </p>
        </div>
      ) : (
        <></>
      )}
      <p className="flex items-center text-xl">
        For the current set of calendar days, you will be seeing the following
        items to buy:
      </p>
      <div className="flex flex-col items-center">
        <p className="text-xl">{Object.keys(trial).join(" & ")}</p>
      </div>
      <div className="mt-8 space-y-8">
        <p className="text-xl">They are assigned to the following colors:</p>
      </div>
      <div className="flex space-x-8">
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
            <p className="text-xl">{fruit}</p> {/* Display item name */}
            <div
              style={{ backgroundColor: color }}
              className="w-24 h-24 rounded mt-2"
            ></div>{" "}
            {/* Display corresponding color */}
          </div>
        ))}
      </div>

      <p className="text-xl">Press the button to start the trial.</p>
      <button
        className="px-4 py-2 bg-white text-black rounded"
        onClick={handleStart}
      >
        Start Trial
      </button>
    </div>
  );
}

import { useNavigate } from "react-router-dom";

export default function InstructionPage() {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/instructions");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Instructions</h1>
      <p className="text-xl text-left w-3/5 mx-auto mb-4">
        In the current task, you are going to fill the calendar with the correct
        item to buy during each day for 50 days. Each item is color coded. You
        will need to color code each day’s calendar by pressing the key that
        represents the color for the day’s item.
        <br />
        <br />
        Then another item and its color will be added, you will again, fill the
        next 50 calendar days with the correct item by pressing the key that
        represents the color for the day's item.
      </p>
      <p className="text-xl text-left w-3/5 mx-auto mb-10">
        You will go through 3 trials of 2 color-concept pairs and 1 added
        color-concept pair.
      </p>
      <button
        className="bg-blue-500 text-white px-6 py-3 rounded-lg"
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EndPage() {
  const navigate = useNavigate();

  // State variables for demographic information
  const [participantId, setParticipantId] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [submitted, setSubmitted] = useState(false); // Track if the form has been submitted

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ participantId, age, gender, ethnicity });
    setSubmitted(true);
  };

  // Function to download trial data as CSV with demographic data
  const downloadCSV = () => {
    // Get trial data from localStorage
    const trialData = JSON.parse(localStorage.getItem("trialData")) || [];

    if (trialData.length === 0) {
      alert("No trial data found.");
      return;
    }

    // Create header row with demographic information and trial data fields
    const csvHeader =
      "Age,Gender,Ethnicity,Trial Number,Color Count,Displayed Color Text,Shuffled Colors,Selected Color,Correct,Reaction Time\n";

    // Map trial data to rows and add demographic info at the beginning of each row
    const csvRows = trialData.map((entry) => {
      return `${age},${gender},${ethnicity},${entry.trialNum},${
        entry.colorCount
      },"${entry.displayedColorText}","${entry.shuffledColors.join(";")}",${
        entry.selectedColor
      },${entry.isCorrect},${entry.reactionTime}`;
    });

    // Combine header and rows into full CSV content
    const csvContent = csvHeader + csvRows.join("\n");

    // Create a downloadable blob
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and click it to download with participant ID in the filename
    const link = document.createElement("a");
    link.href = url;
    link.download = `${participantId || "participant"}_trial_data.csv`; // Default to "participant" if ID is missing
    link.click();

    // Clean up the URL object
    URL.revokeObjectURL(url);

    // Clear trial data from localStorage
    localStorage.removeItem("trialData");
    alert("Trial data downloaded and cleared.");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-8">
      {!submitted ? (
        <>
          <h1 className="text-3xl mb-4">Demographic Information</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="participantId" className="text-lg">
                Participant ID:
              </label>
              <input
                type="text"
                id="participantId"
                value={participantId}
                onChange={(e) => setParticipantId(e.target.value)}
                className="border rounded p-2"
                placeholder="Enter participant ID"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="age" className="text-lg">
                Age:
              </label>
              <input
                type="text"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="border rounded p-2"
                placeholder="Enter your age"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="gender" className="text-lg">
                Gender:
              </label>
              <input
                type="text"
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="border rounded p-2"
                placeholder="Enter your gender"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="ethnicity" className="text-lg">
                Ethnicity:
              </label>
              <input
                type="text"
                id="ethnicity"
                value={ethnicity}
                onChange={(e) => setEthnicity(e.target.value)}
                className="border rounded p-2"
                placeholder="Enter your ethnicity"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-700 transition duration-300"
            >
              Submit
            </button>
          </form>
        </>
      ) : (
        <>
          <p className="w-1/2 text-left text-xl">
            This is the end of the study. Thank you for participating in this
            study.
          </p>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={downloadCSV}
          >
            Download Data as CSV
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => navigate("/")}
          >
            End
          </button>
        </>
      )}
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SaveDataButton from "./SaveDataButton";

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

    // Store demographic data in localStorage
    localStorage.setItem("participant_Id", participantId);
    localStorage.setItem("age", age);
    localStorage.setItem("gender", gender);
    localStorage.setItem("ethnicity", ethnicity);

    setSubmitted(true);
  };

  // Function to download trial data as CSV with demographic data
  const downloadCSV = () => {
    // Get demographic data from localStorage
    const age = localStorage.getItem("age");
    const gender = localStorage.getItem("gender");
    const ethnicity = localStorage.getItem("ethnicity");
    const participantId = localStorage.getItem("participant_Id");
    // Get trial data from localStorage
    const trialData =
      JSON.parse(localStorage.getItem(`trialData_${participantId}`)) || [];
    if (trialData.length === 0) {
      alert("No trial data found.");
      return;
    }

    // Create header row with demographic information and trial data fields
    const csvHeader =
      "Age,Gender,Ethnicity,Trial Type,Day,Displayed Color Text,Shuffled Colors,Selected Color,Correct,Reaction Time,Timestamp\n";

    // Map trial data to rows and add demographic info at the beginning of each row
    const csvRows = trialData.map((entry) => {
      return `${age},${gender},${ethnicity},${entry.trialType},${entry.day}"${
        entry.displayedColorText
      }","${entry.shuffledColors.join(";")}",${entry.selectedColor},${
        entry.isCorrect
      },${entry.reactionTime},${entry.timestamp}`;
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
                Race/Ethnicity:
              </label>
              <input
                type="text"
                id="ethnicity"
                value={ethnicity}
                onChange={(e) => setEthnicity(e.target.value)}
                className="border rounded p-2"
                placeholder="Enter your race/ethnicity"
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
          <h3 className="w-2/3 text-left text-xl">Debrief:</h3>
          <p className="w-2/3 text-left text-xl">
            Thank you for participating in this study. You were assigned to a
            specific training and testing condition as part of our research.
            Please note that other participants may have been assigned to
            different lengths of training and testing. These variations are a
            crucial aspect of our study design and help us explore how different
            training durations affect performance and outcomes.
          </p>
          <h3 className="w-2/3 text-left text-xl">Study Purpose</h3>
          <p className="w-2/3 text-left text-xl">
            Color has long been a tool for visual categorization (e.g., red on a
            calendar may be for “class” and blue may be “work”). Most research
            related to color mapping has been done on static systems, yet
            dynamic systems are more common in real life (e.g., if you need to
            add the new category of “athletics”). The present study aims to
            investigate how to best navigate such dynamic systems, when new
            colors and categories are added and color-category mappings are
            changed.{" "}
          </p>
          <p className="w-2/3 text-left text-xl">
            If you have any questions or would like more information about the
            study, please feel free to contact Rainy Jin at jin252@wisc.edu.
            Your participation is greatly appreciated!
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

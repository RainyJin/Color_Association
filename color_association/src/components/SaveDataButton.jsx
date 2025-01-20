import React from "react";

const SaveDataButton = () => {
  const downloadCSV = () => {
    const participantId = localStorage.getItem("participantId");
    if (!participantId) {
      alert("No participant ID found.");
      return;
    }

    const trialData =
      JSON.parse(localStorage.getItem(`trialData_${participantId}`)) || [];
    if (trialData.length === 0) {
      alert("No trial data found.");
      return;
    }

    // Retrieve demographic information
    const age = localStorage.getItem("age");
    const gender = localStorage.getItem("gender");
    const ethnicity = localStorage.getItem("ethnicity");

    // Ensure demographic data exists
    if (!age || !gender || !ethnicity) {
      alert("Missing demographic information.");
      return;
    }

    // Create header row
    const csvHeader =
      "Age,Gender,Ethnicity,Trial Type,Day,Displayed Color Text,Shuffled Colors,Selected Color,Is Correct,Reaction Time,Timestamp\n";

    // Map trial data to rows and include demographic info
    const csvRows = trialData.map((entry) => {
      return `${age},${gender},${ethnicity},${entry.trialType},${entry.day},"${
        entry.displayedColorText
      }","${entry.shuffledColors.join(";")}","${entry.selectedColor}",${
        entry.isCorrect
      },${entry.reactionTime},${entry.timestamp}`;
    });

    // Combine header and rows
    const csvContent = csvHeader + csvRows.join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `participant_${participantId}_trial_data_with_demographics.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={downloadCSV}
      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
    >
      Save Current Data
    </button>
  );
};

export default SaveDataButton;

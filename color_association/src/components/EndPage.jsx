import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EndPage() {
  const navigate = useNavigate();

  // State variables for demographic information
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [submitted, setSubmitted] = useState(false); // Track if the form has been submitted

  const handleSubmit = (e) => {
    e.preventDefault();

    // Here you can handle the data, like sending it to a server or saving it
    console.log({ age, gender, ethnicity });

    // Show the end text after submission
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-8">
      {!submitted ? (
        <>
          <h1 className="text-3xl mb-4">Demographic Information</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
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

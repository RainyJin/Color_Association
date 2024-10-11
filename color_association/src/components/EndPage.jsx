import { useNavigate } from "react-router-dom";

export default function StartPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-8">
      <p className="w-1/2 text-left text-xl">
        This is the end of the study. Thank you for participating in this study.
      </p>

      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => navigate("/")}
      >
        End
      </button>
    </div>
  );
}

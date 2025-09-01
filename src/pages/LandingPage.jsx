import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <h1 className="text-4xl font-bold mb-6">🌐 JobWeave</h1>
      <p className="text-lg mb-6">
        From Skills to Careers: Finding Your Dream Job
      </p>
      <button
        onClick={() => navigate("/select")}
        className="px-6 py-3 bg-white text-blue-600 rounded-xl shadow-md hover:bg-gray-200"
      >
        Get Started
      </button>
    </div>
  );
}

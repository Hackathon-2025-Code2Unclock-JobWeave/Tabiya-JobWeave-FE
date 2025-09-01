import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Dialog } from "@headlessui/react";

// Dummy skill & job lists (replace later with Tabiya CSV)
const DUMMY_SKILLS = [
  "JavaScript",
  "Python",
  "Data Analysis",
  "UI Design",
  "Project Management",
];
const DUMMY_JOBS = [
  "Frontend Developer",
  "Data Scientist",
  "UI/UX Designer",
  "Project Manager",
];

// Levels
const LEVELS = [
  {
    key: "beginner",
    label: "Beginner",
    desc: "Just starting out, basic knowledge",
  },
  {
    key: "intermediate",
    label: "Intermediate",
    desc: "Some experience, can work independently",
  },
  {
    key: "advanced",
    label: "Advanced",
    desc: "Strong skills, can mentor others",
  },
  {
    key: "expert",
    label: "Expert",
    desc: "Deep expertise, recognized authority",
  },
];

export default function SelectionPage() {
  const navigate = useNavigate();

  // State
  const [skillSearch, setSkillSearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");
  const [skills, setSkills] = useState([]); // [{ name, level }]
  const [jobs, setJobs] = useState([]);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [pendingSkill, setPendingSkill] = useState(null);

  // ✅ Load saved data from localStorage
  useEffect(() => {
    const savedSkills = JSON.parse(localStorage.getItem("skills") || "[]");
    const savedJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    if (savedSkills.length > 0) setSkills(savedSkills);
    if (savedJobs.length > 0) setJobs(savedJobs);
  }, []);

  // ✅ Save to localStorage whenever skills or jobs change
  useEffect(() => {
    localStorage.setItem("skills", JSON.stringify(skills));
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [skills, jobs]);

  // Handlers
  const handleSelectSkill = (skill) => {
    setPendingSkill(skill);
    setShowLevelModal(true);
    setSkillSearch("");
  };

  const confirmLevel = (level) => {
    setSkills((prev) => [...prev, { name: pendingSkill, level }]);
    setPendingSkill(null);
    setShowLevelModal(false);
  };

  const handleSelectJob = (job) => {
    setJobs((prev) => (prev.includes(job) ? prev : [...prev, job]));
    setJobSearch("");
  };

  const removeSkill = (name) =>
    setSkills((prev) => prev.filter((s) => s.name !== name));
  const removeJob = (name) => setJobs((prev) => prev.filter((j) => j !== name));

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:5000/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skills, jobs }),
    });

    const data = await res.json();
    navigate("/results", { state: { results: data } });
  };

  return (
    <div className="p-10 min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-6">Select Your Skills & Jobs</h2>

      {/* Skills */}
      <div className="mb-8">
        <p className="mb-2 font-semibold">Choose your skills:</p>
        <input
          value={skillSearch}
          onChange={(e) => setSkillSearch(e.target.value)}
          type="text"
          placeholder="Search skills..."
          className="border p-2 w-full rounded"
        />
        {skillSearch && (
          <div className="border rounded bg-white mt-1 max-h-40 overflow-y-auto">
            {DUMMY_SKILLS.filter((s) =>
              s.toLowerCase().includes(skillSearch.toLowerCase())
            ).map((skill) => (
              <div
                key={skill}
                onClick={() => handleSelectSkill(skill)}
                className="p-2 hover:bg-blue-100 cursor-pointer"
              >
                {skill}
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2 mt-3">
          {skills.map((s) => (
            <span
              key={s.name}
              className="px-3 py-1 bg-blue-200 text-sm rounded-full flex items-center"
            >
              {s.name} ({s.level})
              <button
                onClick={() => removeSkill(s.name)}
                className="ml-2 text-red-600 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Jobs */}
      <div className="mb-8">
        <p className="mb-2 font-semibold">Preferred job roles:</p>
        <input
          value={jobSearch}
          onChange={(e) => setJobSearch(e.target.value)}
          type="text"
          placeholder="Search job roles..."
          className="border p-2 w-full rounded"
        />
        {jobSearch && (
          <div className="border rounded bg-white mt-1 max-h-40 overflow-y-auto">
            {DUMMY_JOBS.filter((j) =>
              j.toLowerCase().includes(jobSearch.toLowerCase())
            ).map((job) => (
              <div
                key={job}
                onClick={() => handleSelectJob(job)}
                className="p-2 hover:bg-green-100 cursor-pointer"
              >
                {job}
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2 mt-3">
          {jobs.map((j) => (
            <span
              key={j}
              className="px-3 py-1 bg-green-200 text-sm rounded-full flex items-center"
            >
              {j}
              <button
                onClick={() => removeJob(j)}
                className="ml-2 text-red-600 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
      >
        See Matches
      </button>

      {/* ✅ Direct link to results page if data exists */}
      {(skills.length > 0 || jobs.length > 0) && (
        <div className="mt-4">
          <Link
            to="/results"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Continue to Results
          </Link>
        </div>
      )}

      {/* Modal for Level Selection */}
      <Dialog
        open={showLevelModal}
        onClose={() => setShowLevelModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg p-6 max-w-md w-full">
            <Dialog.Title className="text-lg font-bold mb-4">
              Select Your Level
            </Dialog.Title>
            <p className="mb-4">
              How would you rate your skill level in{" "}
              <strong>{pendingSkill}</strong>?
            </p>
            <div className="space-y-3">
              {LEVELS.map((l) => (
                <button
                  key={l.key}
                  className="w-full text-left p-3 border rounded-lg hover:bg-blue-100"
                  onClick={() => confirmLevel(l.label)}
                >
                  <div className="font-semibold">{l.label}</div>
                  <div className="text-sm text-gray-600">{l.desc}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowLevelModal(false)}
              className="mt-4 w-full py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

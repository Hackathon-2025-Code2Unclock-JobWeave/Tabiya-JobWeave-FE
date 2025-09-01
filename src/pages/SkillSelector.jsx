import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

export default function SkillSelector() {
  const navigate = useNavigate();

  // State
  const [skillQuery, setSkillQuery] = useState("");
  const [jobQuery, setJobQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);

  // Suggestions from backend
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [jobSuggestions, setJobSuggestions] = useState([]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [pendingSkill, setPendingSkill] = useState(null);

  // Levels
  const levels = [
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

  // Fetch skills from backend
  useEffect(() => {
    if (skillQuery.trim()) {
      fetch(`http://localhost:5000/api/skills?q=${skillQuery}`)
        .then((res) => res.json())
        .then((data) => setSkillSuggestions(data))
        .catch(() => setSkillSuggestions([]));
    } else {
      setSkillSuggestions([]);
    }
  }, [skillQuery]);

  // Fetch jobs from backend
  useEffect(() => {
    if (jobQuery.trim()) {
      fetch(`http://localhost:5000/api/occupations?q=${jobQuery}`)
        .then((res) => res.json())
        .then((data) => setJobSuggestions(data))
        .catch(() => setJobSuggestions([]));
    } else {
      setJobSuggestions([]);
    }
  }, [jobQuery]);

  const handleSkillClick = (skillLabel) => {
    setPendingSkill(skillLabel);
    setShowModal(true);
    setSkillQuery("");
  };

  const confirmSkill = (level) => {
    setSelectedSkills([...selectedSkills, { name: pendingSkill, level }]);
    setPendingSkill(null);
    setShowModal(false);
  };

  const removeSkill = (skillName) => {
    setSelectedSkills(selectedSkills.filter((s) => s.name !== skillName));
  };

  const handleJobClick = (role) => {
    if (!selectedRoles.includes(role)) {
      setSelectedRoles([...selectedRoles, role]);
    }
    setJobQuery("");
  };

  const removeRole = (role) => {
    setSelectedRoles(selectedRoles.filter((r) => r !== role));
  };

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:5000/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        skillsInput: selectedSkills, // expected shape by backend
        jobsInput: selectedRoles,
      }),
    });

    const data = await res.json();
    navigate("/results", { state: { results: data } });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Select Your Skills</h2>
      <p className="text-gray-600 mb-4">
        Choose skills you already have. We'll analyze job opportunities for you.
      </p>

      {/* Selected Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedSkills.map((skill) => (
          <span
            key={skill.name}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
          >
            {skill.name} <span className="ml-1 text-sm">({skill.level})</span>
            <button
              className="ml-2 text-red-500"
              onClick={() => removeSkill(skill.name)}
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      {/* Skills Autocomplete */}
      <input
        type="text"
        className="w-full border rounded-lg p-2 mb-2"
        placeholder="Type a skill..."
        value={skillQuery}
        onChange={(e) => setSkillQuery(e.target.value)}
      />
      {skillQuery && (
        <div className="border rounded-lg bg-white shadow max-h-40 overflow-y-auto">
          {skillSuggestions.length > 0 ? (
            skillSuggestions.map((s) => (
              <div
                key={s.ID}
                className="p-2 cursor-pointer hover:bg-blue-100"
                onClick={() => handleSkillClick(s.PREFERREDLABEL)}
              >
                {s.PREFERREDLABEL}
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500">No matches</div>
          )}
        </div>
      )}

      {/* Preferred Job Roles */}
      <h3 className="text-xl font-semibold mt-6 mb-2">Preferred Job Roles</h3>

      {/* Selected Roles */}
      <div className="flex flex-wrap gap-2 mb-3">
        {selectedRoles.map((role) => (
          <span
            key={role}
            className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center"
          >
            {role}
            <button
              className="ml-2 text-red-500"
              onClick={() => removeRole(role)}
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      {/* Jobs Autocomplete */}
      <input
        type="text"
        className="w-full border rounded-lg p-2 mb-2"
        placeholder="Type a job role..."
        value={jobQuery}
        onChange={(e) => setJobQuery(e.target.value)}
      />
      {jobQuery && (
        <div className="border rounded-lg bg-white shadow max-h-40 overflow-y-auto">
          {jobSuggestions.length > 0 ? (
            jobSuggestions.map((j) => (
              <div
                key={j.ID}
                className="p-2 cursor-pointer hover:bg-green-100"
                onClick={() => handleJobClick(j.PREFERREDLABEL)}
              >
                {j.PREFERREDLABEL}
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500">No matches</div>
          )}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
      >
        See Matches
      </button>

      {/* Modal for level selection */}
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
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
              {levels.map((l) => (
                <button
                  key={l.key}
                  className="w-full text-left p-3 border rounded-lg hover:bg-blue-100"
                  onClick={() => confirmSkill(l.label)}
                >
                  <div className="font-semibold">{l.label}</div>
                  <div className="text-sm text-gray-600">{l.desc}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowModal(false)}
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

import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ResultsPage() {
  const location = useLocation();
  const { selectedSkills, selectedJobs } = location.state || {
    selectedSkills: [],
    selectedJobs: [],
  };

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchResults() {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skillsInput: selectedSkills, // [{ name, level }]
            jobsInput: selectedJobs, // ["Frontend Developer"]
          }),
        });

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();
        setResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [selectedSkills, selectedJobs]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Results</h2>

      {loading && <p className="text-gray-600">Loading results...</p>}

      {error && <p className="text-red-600">Failed to load results: {error}</p>}

      {!loading && !error && results && (
        <>
          <h3 className="font-semibold text-lg mb-2">Matched Occupations</h3>
          {results.occupations?.length > 0 ? (
            <ul className="list-disc ml-6 space-y-1">
              {results.occupations.map((occ) => (
                <li key={occ.ID}>{occ.PREFERREDLABEL}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No matching occupations found.</p>
          )}
        </>
      )}
    </div>
  );
}

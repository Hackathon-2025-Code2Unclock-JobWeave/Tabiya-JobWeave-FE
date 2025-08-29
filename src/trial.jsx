import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Share2,
  BookOpen,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Users,
  Target,
  TrendingUp,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  Briefcase,
} from "lucide-react";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Advanced Skills Explorer Component
const SkillsExplorer = () => {
  const [skillGroups, setSkillGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSkillGroups = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/skill-groups?includeSkills=true&limit=100`
        );
        const data = await response.json();
        setSkillGroups(data.skillGroups || []);
      } catch (error) {
        console.error("Error fetching skill groups:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkillGroups();
  }, []);

  const toggleGroup = (groupId) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const filteredGroups = skillGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (group.skills || []).some((skill) =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Skills Explorer
        </h3>
        <p className="text-gray-600">
          Browse skills by category to discover new areas for development
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search skills or categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Skill Groups */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredGroups.map((group) => (
          <div key={group.id} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleGroup(group.id)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {expandedGroups.has(group.id) ? (
                  <ChevronDown className="text-gray-400" size={16} />
                ) : (
                  <ChevronRight className="text-gray-400" size={16} />
                )}
                <span className="font-medium">{group.name}</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  {group.skills?.length || 0} skills
                </span>
              </div>
            </button>

            {expandedGroups.has(group.id) && group.skills && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                  {group.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-2 bg-gray-50 rounded text-sm hover:bg-blue-50 cursor-pointer transition-colors"
                      title={skill.description}
                    >
                      <div className="font-medium">{skill.name}</div>
                      {skill.type && (
                        <div className="text-xs text-gray-500">
                          {skill.type}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Career Pathway Visualizer Component
const CareerPathwayVisualizer = ({ userSkills, targetOccupation }) => {
  const [pathwayData, setPathwayData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPathway = async () => {
      if (!userSkills.length || !targetOccupation) {
        setPathwayData(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/career-pathway`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userSkills, targetOccupation }),
        });

        const data = await response.json();
        setPathwayData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPathway();
  }, [userSkills, targetOccupation]);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-6 h-6 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center py-4">Error: {error}</div>;
  }

  if (!pathwayData) {
    return (
      <div className="text-center py-12 text-gray-500">
        <MapPin size={48} className="mx-auto mb-4 text-gray-300" />
        <p>Add skills and target occupation to see career pathway</p>
      </div>
    );
  }

  const { pathway } = pathwayData;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="text-purple-600" size={24} />
        <h3 className="text-xl font-bold">Career Pathway Visualization</h3>
      </div>

      {pathway.directPath ? (
        <div className="text-center py-12">
          <CheckCircle className="text-green-600 mx-auto mb-4" size={64} />
          <h4 className="text-xl font-bold text-green-800 mb-2">
            Direct Path Available!
          </h4>
          <p className="text-green-700">{pathway.recommendation}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="font-medium text-purple-900">Strategy:</div>
            <div className="text-purple-800">{pathway.recommendation}</div>
          </div>

          {pathway.steppingStones.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">
                Recommended Career Steps:
              </h4>

              {/* Visual pathway */}
              <div className="relative">
                {pathway.steppingStones.map((stone, index) => (
                  <div key={index} className="flex items-center mb-6">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>

                    <div className="flex-grow ml-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-lg">
                          {stone.occupation.name}
                        </h5>
                        <div className="flex items-center space-x-2">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                            {stone.readiness}% Ready
                          </span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {stone.timeEstimate}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-3">
                        {stone.occupation.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Skills gained: </span>
                          <span className="font-medium text-purple-600">
                            {stone.skillsGained}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">
                            Progress to target:{" "}
                          </span>
                          <span className="font-medium text-purple-600">
                            {stone.progressValue}%
                          </span>
                        </div>
                      </div>

                      {stone.newSkills.length > 0 && (
                        <div className="mt-3">
                          <div className="text-sm font-medium text-gray-700 mb-1">
                            New skills you'll develop:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {stone.newSkills.map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs"
                              >
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {index < pathway.steppingStones.length - 1 && (
                      <div className="absolute left-4 mt-6 w-0.5 h-6 bg-purple-300"></div>
                    )}
                  </div>
                ))}

                {/* Final target */}
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                    <Target size={16} />
                  </div>
                  <div className="ml-4 p-4 border-2 border-green-500 rounded-lg bg-green-50">
                    <h5 className="font-semibold text-lg text-green-800">
                      Target Achieved!
                    </h5>
                    <p className="text-green-700">{targetOccupation}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Detailed Occupation View Component
const OccupationDetail = ({ occupationId, onClose }) => {
  const [occupation, setOccupation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOccupation = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/occupation/${occupationId}`
        );
        const data = await response.json();
        setOccupation(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (occupationId) {
      fetchOccupation();
    }
  }, [occupationId]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4">Loading occupation details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !occupation) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
          <div className="text-center text-red-600">
            <AlertCircle size={48} className="mx-auto mb-4" />
            <p>Error loading occupation: {error}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {occupation.occupation.name}
            </h2>
            <p className="text-gray-600">{occupation.occupation.code}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          {occupation.occupation.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {occupation.occupation.description}
              </p>
            </div>
          )}

          {/* Skills Requirements */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Required Skills</h3>
              <div className="text-sm text-gray-600">
                Total: {occupation.skillRequirements.total} skills
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Essential Skills */}
              {occupation.occupation.isLocalized !== undefined && (
                <div>
                  <span className="font-medium text-gray-700">Localized: </span>
                  <span>
                    {occupation.occupation.isLocalized ? "Yes" : "No"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skills Dashboard Component
const SkillsDashboard = ({ userSkills, analysisResults }) => {
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/statistics`);
        const data = await response.json();
        setStatistics(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  const skillTypeColors = {
    "skill/competence": "bg-blue-500",
    knowledge: "bg-green-500",
    language: "bg-purple-500",
    attitude: "bg-orange-500",
    unknown: "bg-gray-500",
  };

  return (
    <div className="space-y-6">
      {/* Personal Stats */}
      {userSkills.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Your Skills Profile</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {userSkills.length}
              </div>
              <div className="text-sm text-gray-600">Skills Added</div>
            </div>

            {analysisResults && (
              <>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {analysisResults.skillMatching.totalMatched}
                  </div>
                  <div className="text-sm text-gray-600">Skills Matched</div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {analysisResults.gapAnalysis.readinessScore}%
                  </div>
                  <div className="text-sm text-gray-600">Readiness Score</div>
                </div>

                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {analysisResults.gapAnalysis.skillsCounts.missingSkills}
                  </div>
                  <div className="text-sm text-gray-600">Skills to Learn</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Taxonomy Statistics */}
      {statistics && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Taxonomy Overview</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {statistics.counts.skills.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Skills</div>
            </div>

            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {statistics.counts.occupations.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Occupations</div>
            </div>

            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {statistics.counts.skillOccupationRelations.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Connections</div>
            </div>

            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {statistics.distributions.averageSkillsPerOccupation}
              </div>
              <div className="text-sm text-gray-600">Avg Skills/Job</div>
            </div>
          </div>

          {/* Skill Types Distribution */}
          <div>
            <h4 className="font-semibold mb-3">Skill Types Distribution</h4>
            <div className="space-y-2">
              {Object.entries(statistics.distributions.skillTypes).map(
                ([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded ${
                          skillTypeColors[type] || "bg-gray-500"
                        }`}
                      ></div>
                      <span className="capitalize">
                        {type.replace("/", " / ")}
                      </span>
                    </div>
                    <div className="text-gray-600">
                      {count.toLocaleString()}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Learning Resources Finder Component
const LearningResourcesFinder = ({ missingSkills = [] }) => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchResources = async (skillName) => {
    setIsLoading(true);

    // Simulate learning resource search (in real implementation, this would call external APIs)
    setTimeout(() => {
      const mockResources = [
        {
          title: `Learn ${skillName} - Online Course`,
          type: "course",
          provider: "Education Platform",
          duration: "4-6 weeks",
          level: "Beginner to Advanced",
          url: "#",
        },
        {
          title: `${skillName} Certification Program`,
          type: "certification",
          provider: "Professional Institute",
          duration: "8-12 weeks",
          level: "Professional",
          url: "#",
        },
        {
          title: `${skillName} Tutorial Series`,
          type: "tutorial",
          provider: "YouTube",
          duration: "2-4 weeks",
          level: "Beginner",
          url: "#",
        },
      ];

      setResources(mockResources);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (selectedSkill) {
      searchResources(selectedSkill.name || selectedSkill.PREFERREDLABEL);
    }
  }, [selectedSkill]);

  if (missingSkills.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-500 mb-2">
          No Missing Skills
        </h3>
        <p className="text-gray-400">
          Great job! You have all the required skills for this occupation.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Lightbulb className="text-yellow-600" size={24} />
        <h3 className="text-xl font-bold">Learning Resources</h3>
      </div>

      {/* Skill Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select a skill to find learning resources:
        </label>
        <select
          value={selectedSkill?.id || ""}
          onChange={(e) => {
            const skill = missingSkills.find((s) => s.ID === e.target.value);
            setSelectedSkill(skill);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Choose a skill...</option>
          {missingSkills.map((skill) => (
            <option key={skill.ID} value={skill.ID}>
              {skill.PREFERREDLABEL} ({skill.priority || "optional"})
            </option>
          ))}
        </select>
      </div>

      {/* Learning Resources */}
      {selectedSkill && (
        <div>
          <h4 className="font-medium mb-3">
            Learning Resources for "{selectedSkill.PREFERREDLABEL}"
          </h4>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-6 h-6 border-4 border-yellow-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-gray-600">
                Finding learning resources...
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {resources.map((resource, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-medium text-lg">{resource.title}</h5>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        resource.type === "course"
                          ? "bg-blue-100 text-blue-800"
                          : resource.type === "certification"
                          ? "bg-green-100 text-green-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {resource.type}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="font-medium">Provider:</span>{" "}
                      {resource.provider}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span>{" "}
                      {resource.duration}
                    </div>
                    <div>
                      <span className="font-medium">Level:</span>{" "}
                      {resource.level}
                    </div>
                  </div>

                  <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm">
                    <ExternalLink size={14} />
                    <span>View Resource</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="text-yellow-600" size={16} />
              <span className="font-medium text-yellow-800">Learning Tip</span>
            </div>
            <p className="text-yellow-700 text-sm">
              Focus on essential skills first, then build optional skills to
              strengthen your profile. Consider hands-on projects to apply what
              you learn.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Export & Share Component
const ExportShare = ({ analysisResults, userSkills, targetOccupation }) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    setIsExporting(true);

    // Simulate PDF export (in real implementation, use libraries like jsPDF or html2canvas)
    setTimeout(() => {
      const exportData = {
        timestamp: new Date().toISOString(),
        userSkills,
        targetOccupation,
        analysis: analysisResults,
        metadata: {
          toolUsed: "Skills Gap Analyzer",
          challenge: "Tabiya Hackathon Challenge 2",
        },
      };

      // Create downloadable JSON (in real app, generate PDF)
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute(
        "download",
        `skills-gap-analysis-${new Date().toISOString().split("T")[0]}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setIsExporting(false);
    }, 2000);
  };

  const shareResults = async () => {
    if (navigator.share && analysisResults) {
      try {
        await navigator.share({
          title: "My Skills Gap Analysis",
          text: `I analyzed my skills gap for ${targetOccupation}. Readiness score: ${analysisResults.gapAnalysis.readinessScore}%`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
        // Fallback to clipboard
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    const shareText = `Skills Gap Analysis Results:
Target: ${targetOccupation}
Readiness Score: ${analysisResults?.gapAnalysis.readinessScore}%
Skills Matched: ${analysisResults?.skillMatching.totalMatched}
Skills to Learn: ${analysisResults?.gapAnalysis.skillsCounts.missingSkills}

Generated by Skills Gap Analyzer - Tabiya Hackathon Challenge 2`;

    navigator.clipboard.writeText(shareText).then(() => {
      alert("Results copied to clipboard!");
    });
  };

  if (!analysisResults) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <Download size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-500 mb-2">
          No Analysis to Export
        </h3>
        <p className="text-gray-400">
          Complete a skills gap analysis to export your results.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Share2 className="text-blue-600" size={24} />
        <h3 className="text-xl font-bold">Export & Share</h3>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Analysis Summary</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div>
              Target: <span className="font-medium">{targetOccupation}</span>
            </div>
            <div>
              Readiness Score:{" "}
              <span className="font-medium">
                {analysisResults.gapAnalysis.readinessScore}%
              </span>
            </div>
            <div>
              Skills Matched:{" "}
              <span className="font-medium">
                {analysisResults.skillMatching.totalMatched}
              </span>
            </div>
            <div>
              Skills to Learn:{" "}
              <span className="font-medium">
                {analysisResults.gapAnalysis.skillsCounts.missingSkills}
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={exportToPDF}
            disabled={isExporting}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download size={18} />
                <span>Export Analysis</span>
              </>
            )}
          </button>

          <button
            onClick={shareResults}
            className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Share2 size={18} />
            <span>Share Results</span>
          </button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Export includes complete analysis, skill recommendations, and career
          pathway suggestions
        </div>
      </div>
    </div>
  );
};

// Main Advanced App Component
const AdvancedSkillsGapAnalyzer = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [userSkills, setUserSkills] = useState([]);
  const [targetOccupation, setTargetOccupation] = useState("");
  const [analysisResults, setAnalysisResults] = useState(null);
  const [selectedOccupationId, setSelectedOccupationId] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const views = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "analyzer", label: "Gap Analyzer", icon: Target },
    { id: "explorer", label: "Skills Explorer", icon: Search },
    { id: "pathway", label: "Career Pathway", icon: TrendingUp },
    { id: "resources", label: "Learning Resources", icon: BookOpen },
    { id: "export", label: "Export & Share", icon: Download },
  ];

  const performAnalysis = async () => {
    if (userSkills.length === 0 || !targetOccupation.trim()) {
      setError("Please provide both your skills and a target occupation");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/skills-gap-analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userSkills,
          targetOccupation: targetOccupation.trim(),
          options: {
            skillMatching: { threshold: 0.5, maxResults: 50 },
            pathway: { maxStones: 5, minCurrentMatch: 50 },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      setAnalysisResults(data);
    } catch (error) {
      console.error("Analysis failed:", error);
      setError(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                <Target className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Skills Gap Analyzer
                </h1>
                <p className="text-gray-600">
                  Advanced Career Development Tool
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {analysisResults && (
                <div className="text-right">
                  <div className="text-sm text-gray-600">Readiness Score</div>
                  <div className="text-lg font-bold text-blue-600">
                    {analysisResults.gapAnalysis.readinessScore}%
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* View Navigation */}
          <nav className="mt-6">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {views.map((view) => {
                const Icon = view.icon;
                return (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeView === view.id
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{view.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center">
              <AlertCircle className="text-red-600 mr-3" size={20} />
              <div>
                <h4 className="font-medium text-red-800">Analysis Error</h4>
                <p className="text-red-700">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* View Content */}
        <div className="space-y-8">
          {activeView === "dashboard" && (
            <SkillsDashboard
              userSkills={userSkills}
              analysisResults={analysisResults}
            />
          )}

          {activeView === "analyzer" && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Analysis Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <h2 className="text-xl font-bold mb-4">
                    Skills Gap Analysis
                  </h2>

                  <div className="space-y-6">
                    {/* Skills Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Current Skills
                      </label>
                      <SkillInput
                        skills={userSkills}
                        onSkillsChange={setUserSkills}
                        placeholder="Add your skills..."
                      />
                    </div>

                    {/* Target Occupation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Occupation
                      </label>
                      <OccupationSearch
                        value={targetOccupation}
                        onChange={setTargetOccupation}
                        placeholder="Search for your target job..."
                      />
                    </div>

                    {/* Analysis Button */}
                    <button
                      onClick={performAnalysis}
                      disabled={
                        isAnalyzing ||
                        userSkills.length === 0 ||
                        !targetOccupation.trim()
                      }
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span>Analyzing Skills Gap...</span>
                        </>
                      ) : (
                        <>
                          <BarChart3 size={20} />
                          <span>Analyze Skills Gap</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Analysis Results */}
                {analysisResults && (
                  <GapAnalysisResults results={analysisResults} />
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <SimilarOccupations userSkills={userSkills} />

                {analysisResults && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="font-bold mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setActiveView("pathway")}
                        className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded flex items-center space-x-2"
                      >
                        <TrendingUp size={16} className="text-blue-600" />
                        <span>View Career Pathway</span>
                      </button>

                      <button
                        onClick={() => setActiveView("resources")}
                        className="w-full text-left px-3 py-2 hover:bg-green-50 rounded flex items-center space-x-2"
                      >
                        <BookOpen size={16} className="text-green-600" />
                        <span>Find Learning Resources</span>
                      </button>

                      <button
                        onClick={() => setActiveView("export")}
                        className="w-full text-left px-3 py-2 hover:bg-purple-50 rounded flex items-center space-x-2"
                      >
                        <Download size={16} className="text-purple-600" />
                        <span>Export Results</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeView === "explorer" && <SkillsExplorer />}

          {activeView === "pathway" && (
            <CareerPathwayVisualizer
              userSkills={userSkills}
              targetOccupation={targetOccupation}
            />
          )}

          {activeView === "resources" && (
            <LearningResourcesFinder
              missingSkills={analysisResults?.gapAnalysis.missingSkills || []}
            />
          )}

          {activeView === "export" && (
            <ExportShare
              analysisResults={analysisResults}
              userSkills={userSkills}
              targetOccupation={targetOccupation}
            />
          )}
        </div>
      </main>

      {/* Occupation Detail Modal */}
      {selectedOccupationId && (
        <OccupationDetail
          occupationId={selectedOccupationId}
          onClose={() => setSelectedOccupationId(null)}
        />
      )}

      {/* Status Bar */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 flex items-center space-x-2 text-sm">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-gray-600">Connected to Tabiya API</span>
      </div>
    </div>
  );
};

// export default AdvancedSkillsGapAnalyzer;.skillRequirements.essential.length > 0 && (
//                 <div>
//                   <h4 className="font-medium text-red-700 mb-2 flex items-center">
//                     <AlertCircle size={16} className="mr-1" />
//                     Essential Skills ({occupation.skillRequirements.essentialCount})
//                   </h4>
//                   <div className="space-y-1">
//                     {occupation.skillRequirements.essential.map((skill, index) => (
//                       <div key={index} className="p-2 bg-red-50 rounded text-sm">
//                         <div className="font-medium">{skill.name}</div>
//                         {skill.description && (
//                           <div className="text-gray-600 text-xs mt-1">{skill.description}</div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Optional Skills */}
//               {occupation.skillRequirements.optional.length > 0 && (
//                 <div>
//                   <h4 className="font-medium text-blue-700 mb-2 flex items-center">
//                     <Star size={16} className="mr-1" />
//                     Optional Skills ({occupation.skillRequirements.optionalCount})
//                   </h4>
//                   <div className="space-y-1 max-h-60 overflow-y-auto">
//                     {occupation.skillRequirements.optional.map((skill, index) => (
//                       <div key={index} className="p-2 bg-blue-50 rounded text-sm">
//                         <div className="font-medium">{skill.name}</div>
//                         {skill.description && (
//                           <div className="text-gray-600 text-xs mt-1">{skill.description}</div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Hierarchy Information */}
//           {occupation.hierarchy && (occupation.hierarchy.group || occupation.hierarchy.parents.length > 0) && (
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Classification</h3>
//               <div className="space-y-2">
//                 {occupation.hierarchy.group && (
//                   <div className="flex items-center space-x-2">
//                     <span className="text-gray-600">Group:</span>
//                     <span className="font-medium">{occupation.hierarchy.group.name}</span>
//                     <span className="text-gray-500 text-sm">({occupation.hierarchy.group.code})</span>
//                   </div>
//                 )}

//                 {occupation.hierarchy.parents.length > 0 && (
//                   <div>
//                     <span className="text-gray-600">Parent Categories: </span>
//                     <div className="flex flex-wrap gap-2 mt-1">
//                       {occupation.hierarchy.parents.map((parent, index) => (
//                         <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
//                           {parent.name}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//   {/* Additional Information */}
//   <div className="grid md:grid-cols-2 gap-4 text-sm">
//     <div>
//       <span className="font-medium text-gray-700">Type: </span>
//       <span className="capitalize">{occupation.occupation.type}</span>
//     </div>
//     {occupation

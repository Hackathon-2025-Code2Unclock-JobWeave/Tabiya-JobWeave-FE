import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Target,
  TrendingUp,
  BookOpen,
  BarChart3,
  Users,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus,
  X,
  Filter,
  Lightbulb,
  Download,
  Share2,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  MapPin,
  Briefcase,
  Menu,
  Settings,
  HelpCircle,
  Star,
  Zap,
  Bold,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Utility function for API calls
const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "API call failed");
  }

  return response.json();
};

// Custom hooks
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Reusable Components
const LoadingSpinner = ({ size = "medium", text = "Loading..." }) => (
  <div className="flex items-center justify-center py-8">
    <div
      className={`animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 ${
        size === "small"
          ? "h-6 w-6"
          : size === "large"
          ? "h-12 w-12"
          : "h-8 w-8"
      }`}
    ></div>
    {text && <span className="ml-3 text-gray-600">{text}</span>}
  </div>
);

const Button = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled,
  className = "",
}) => {
  const variants = {
    primary: "bg-green-700 text-white hover:from-blue-700 hover:to-purple-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    success: "bg-green-600 text-white hover:bg-green-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const SkillBadge = ({ skill, onRemove, variant = "default" }) => {
  const variants = {
    default: "bg-blue-100 text-blue-800 border-blue-200",
    critical: "bg-red-100 text-red-800 border-red-200",
    optional: "bg-gray-100 text-gray-700 border-gray-200",
    matched: "bg-green-100 text-green-800 border-green-200",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${variants[variant]}`}
    >
      {typeof skill === "string" ? skill : skill.name || skill.PREFERREDLABEL}
      {onRemove && (
        <button
          onClick={() => onRemove(skill)}
          className="ml-2 hover:bg-red-200 rounded-full p-1"
        >
          <X size={14} />
        </button>
      )}
    </span>
  );
};

const ProgressBar = ({ percentage, label, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    red: "bg-red-600",
    yellow: "bg-yellow-600",
    purple: "bg-purple-600",
  };

  return (
    <div className="w-full">
      {label && (
        <div className="text-sm font-medium text-gray-700 mb-2">{label}</div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${colors[color]}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      <div className="text-sm text-gray-600 mt-1">{percentage}%</div>
    </div>
  );
};

// Skills Input Component
const SkillInput = ({
  skills,
  onSkillsChange,
  placeholder = "Type a skill and press Enter...",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedInput = useDebounce(inputValue, 300);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedInput.trim().length > 2) {
        setIsLoading(true);
        try {
          const response = await apiCall(
            `/skills?q=${encodeURIComponent(debouncedInput)}&limit=20`
          );
          setSuggestions(response.skills || []);
        } catch (error) {
          console.error("Error fetching skill suggestions:", error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedInput]);

  const addSkill = (skill) => {
    const skillName = typeof skill === "string" ? skill : skill.name;
    if (
      skillName &&
      !skills.some((s) => (typeof s === "string" ? s : s.name) === skillName)
    ) {
      onSkillsChange([...skills, skillName]);
      setInputValue("");
      setSuggestions([]);
    }
  };

  const removeSkill = (skillToRemove) => {
    const skillName =
      typeof skillToRemove === "string" ? skillToRemove : skillToRemove.name;
    onSkillsChange(
      skills.filter(
        (skill) =>
          (typeof skill === "string" ? skill : skill.name) !== skillName
      )
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addSkill(inputValue.trim());
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full px-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent"
        />

        {(suggestions.length > 0 || isLoading) && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
            {isLoading ? (
              <div className="p-3">
                <LoadingSpinner size="small" text="Searching skills..." />
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => addSkill(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium">{suggestion.name}</div>
                    {suggestion.type && (
                      <div className="text-sm text-gray-600">
                        {suggestion.type}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {skills.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Your Skills:</div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <SkillBadge key={index} skill={skill} onRemove={removeSkill} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Occupation Search Component
const OccupationSearch = ({
  value,
  onChange,
  placeholder = "Search for your target occupation...",
}) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedInput = useDebounce(inputValue, 300);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedInput.trim().length > 2) {
        setIsLoading(true);
        try {
          const response = await apiCall(
            `/occupations?q=${encodeURIComponent(debouncedInput)}&limit=20`
          );
          setSuggestions(response.occupations || []);
        } catch (error) {
          console.error("Error fetching occupation suggestions:", error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedInput]);

  const selectOccupation = (occupation) => {
    const name = typeof occupation === "string" ? occupation : occupation.name;
    setInputValue(name);
    onChange(name);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={placeholder}
        className="w-full px-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-900 focus:border-transparent"
      />

      {(suggestions.length > 0 || isLoading) && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          {isLoading ? (
            <div className="p-3">
              <LoadingSpinner size="small" text="Searching occupations..." />
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => selectOccupation(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium">{suggestion.name}</div>
                  <div className="text-sm text-gray-600">
                    {suggestion.type}{" "}
                    {suggestion.code && `• ${suggestion.code}`}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Dashboard Component
const COLORS = ["#16a34a", "#dc2626", "#f97316"]; // green, red, orange
const Dashboard = ({ userSkills, analysisResults }) => {
  const [statistics, setStatistics] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, healthResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/statistics`),
          fetch(`${API_BASE_URL}/health`),
        ]);

        const stats = await statsResponse.json();
        const health = await healthResponse.json();

        setStatistics(stats);
        setHealthStatus(health);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner text="Loading Status..." />;
  }

  // Prepare chart data
  const skillDistribution = [
    {
      name: "Skills You Have",
      value: analysisResults?.gapAnalysis.skillsCounts.hasSkills || 0,
    },
    {
      name: "Critical Missing",
      value: analysisResults?.gapAnalysis.skillsCounts.criticalMissing || 0,
    },
    {
      name: "Optional Missing",
      value: analysisResults?.gapAnalysis.skillsCounts.optionalMissing || 0,
    },
  ];

  const readinessRadar = [
    {
      subject: "Readiness",
      A: analysisResults?.gapAnalysis.readinessScore || 0,
    },
    {
      subject: "Critical Gaps",
      A: analysisResults?.gapAnalysis.skillsCounts.criticalMissing || 0,
    },
    {
      subject: "Optional Gaps",
      A: analysisResults?.gapAnalysis.skillsCounts.optionalMissing || 0,
    },
    {
      subject: "Stepping Stones",
      A: analysisResults?.careerPathway.steppingStones.length || 0,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Existing cards here... */}

      {/* Graphs Section */}
      {analysisResults && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-6">Visual Insights</h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Pie Chart */}
            <div className="h-64">
              <h4 className="font-semibold mb-3 text-center">
                Skill Distribution
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={skillDistribution}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {skillDistribution.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Radar Chart */}
            <div className="h-64">
              <h4 className="font-semibold mb-3 text-center">
                Career Readiness Overview
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={readinessRadar}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <Radar
                    name="Readiness"
                    dataKey="A"
                    stroke="#2563eb"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* System Status */}
      {healthStatus && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">System Status</h3>
          <div className="flex items-center space-x-4">
            <div
              className={`w-3 h-3 rounded-full ${
                healthStatus.status === "healthy"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></div>
            <span className="font-medium">
              {healthStatus.status === "healthy"
                ? "All Systems Operational"
                : "System Issues Detected"}
            </span>
            <span className="text-gray-500 text-sm">
              Last updated:{" "}
              {new Date(healthStatus.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Gap Analysis Results Component
const GapAnalysisResults = ({ results }) => {
  if (!results) return null;

  const { targetOccupation, gapAnalysis, careerPathway, learningPath } =
    results;

  const getReadinessColor = (level) => {
    switch (level) {
      case "high":
        return "green";
      case "medium":
        return "yellow";
      case "low":
        return "red";
      default:
        return "gray";
    }
  };

  const getReadinessIcon = (level) => {
    switch (level) {
      case "high":
        return <CheckCircle className="text-green-600" size={20} />;
      case "medium":
        return <Clock className="text-yellow-600" size={20} />;
      case "low":
        return <AlertCircle className="text-red-600" size={20} />;
      default:
        return <AlertCircle className="text-gray-600" size={20} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Target Occupation Header */}
      <div className="bg-green-700 text-white rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-3">
          <Target size={28} />
          <h2 className="text-2xl font-bold">Analysis Results</h2>
        </div>
        <div className="text-lg">
          Target: <span className="font-semibold">{targetOccupation.name}</span>
        </div>
        {targetOccupation.code && (
          <div className="text-blue-100">Code: {targetOccupation.code}</div>
        )}
      </div>

      {/* Readiness Score */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getReadinessIcon(gapAnalysis.readinessLevel)}
            <h3 className="text-xl font-bold">Readiness Assessment</h3>
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {gapAnalysis.readinessScore}%
          </div>
        </div>

        <ProgressBar
          percentage={gapAnalysis.readinessScore}
          color={getReadinessColor(gapAnalysis.readinessLevel)}
          label={`${
            gapAnalysis.readinessLevel.charAt(0).toUpperCase() +
            gapAnalysis.readinessLevel.slice(1)
          } Readiness`}
        />

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="font-medium text-blue-900">Recommendation:</div>
          <div className="text-blue-800">{gapAnalysis.recommendation}</div>
        </div>
      </div>

      {/* Skills Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Skills You Have */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="text-green-600" size={20} />
            <h3 className="text-lg font-bold">Skills You Have</h3>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
              {gapAnalysis.skillsCounts.hasSkills}
            </span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {gapAnalysis.hasSkills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-green-50 rounded"
              >
                <span className="font-medium">{skill.name}</span>
                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                  {skill.importance}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills You Need */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertCircle className="text-red-600" size={20} />
            <h3 className="text-lg font-bold">
              Skills You Need/Missing skills
            </h3>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
              {gapAnalysis.skillsCounts.missingSkills}
            </span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {gapAnalysis.missingSkills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-red-50 rounded"
              >
                <span className="font-medium">{skill.name}</span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    skill.importance === "essential"
                      ? "bg-red-200 text-red-800"
                      : "bg-orange-200 text-orange-800"
                  }`}
                >
                  {skill.importance}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Path */}
      {learningPath && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BookOpen className="text-blue-600" size={20} />
            <h3 className="text-lg font-bold">Learning Path</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {learningPath.totalSkillsToLearn}
              </div>
              <div className="text-sm text-gray-600">Skills to Learn</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {learningPath.priorities?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Priority Skills</div>
            </div>
          </div>

          {learningPath.priorities && learningPath.priorities.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">
                Top Priority Skills:
              </h4>
              <div className="grid gap-2">
                {learningPath.priorities.slice(0, 5).map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{skill.PREFERREDLABEL}</div>
                      <div className="text-sm text-gray-600">
                        {skill.reasoning}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        skill.priority === "critical"
                          ? "bg-red-100 text-red-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {skill.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Career Pathway Preview */}
      {careerPathway &&
        !careerPathway.directPath &&
        careerPathway.steppingStones.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="text-purple-600" size={20} />
              <h3 className="text-lg font-bold">Career Pathway Preview</h3>
            </div>

            <div className="mb-4 p-4 bg-purple-50 rounded-lg">
              <div className="font-medium text-purple-900">Strategy:</div>
              <div className="text-purple-800">
                {careerPathway.recommendation}
              </div>
            </div>

            <div className="space-y-3">
              {careerPathway.steppingStones.slice(0, 2).map((stone, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium">{stone.occupation.name}</div>
                    <div className="text-sm text-gray-600">
                      {stone.readiness}% ready • {stone.timeEstimate} • +
                      {stone.skillsGained} skills toward target
                    </div>
                  </div>
                  <ArrowRight className="text-gray-400" size={16} />
                </div>
              ))}

              <div className="flex items-center space-x-4 p-3 border-2 border-green-500 bg-green-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                  <Target size={16} />
                </div>
                <div className="flex-grow">
                  <div className="font-medium text-green-800">
                    Target Achieved!
                  </div>
                  <div className="text-sm text-green-700">
                    {targetOccupation.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

// Skills Explorer Component
const SkillsExplorer = () => {
  const [skillGroups, setSkillGroups] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
    const fetchSkillGroups = async () => {
      try {
        const response = await apiCall(
          "/skill-groups?includeSkills=true&limit=100"
        );
        setSkillGroups(response.skillGroups || []);
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

  const toggleSkillSelection = (skill) => {
    const isSelected = selectedSkills.some((s) => s.id === skill.id);
    if (isSelected) {
      setSelectedSkills(selectedSkills.filter((s) => s.id !== skill.id));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const filteredGroups = skillGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (group.skills || []).some((skill) =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  if (isLoading) {
    return <LoadingSpinner text="Loading skills taxonomy..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Skills Explorer</h2>
            <p className="text-gray-600">
              Browse and discover skills from the Tabiya taxonomy
            </p>
          </div>

          {selectedSkills.length > 0 && (
            <div className="text-right">
              <div className="text-sm text-gray-600">Selected Skills</div>
              <div className="text-lg font-bold text-blue-600">
                {selectedSkills.length}
              </div>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search skills or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Selected Skills Preview */}
        {selectedSkills.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-900 mb-2">
              Selected Skills:
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <span
                  key={skill.id}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                >
                  {skill.name}
                  <button
                    onClick={() => toggleSkillSelection(skill)}
                    className="ml-1 hover:bg-blue-200 rounded"
                  >
                    <X size={12} color="red" fontWeight="Bold" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Skill Groups */}
      <div className="bg-white rounded-lg shadow-lg p-6">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pt-2">
                    {group.skills.map((skill) => {
                      const isSelected = selectedSkills.some(
                        (s) => s.id === skill.id
                      );
                      return (
                        <div
                          key={skill.id}
                          onClick={() => toggleSkillSelection(skill)}
                          className={`p-3 rounded-lg text-sm cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-blue-100 border border-blue-300"
                              : "bg-gray-50 hover:bg-blue-50 border border-transparent"
                          }`}
                          title={skill.description}
                        >
                          <div className="font-medium">{skill.name}</div>
                          {skill.type && (
                            <div className="text-xs text-gray-500 mt-1">
                              {skill.type}
                            </div>
                          )}
                          {isSelected && (
                            <CheckCircle
                              className="text-blue-600 mt-1"
                              size={14}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
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
        const response = await apiCall("/career-pathway", {
          method: "POST",
          body: JSON.stringify({ userSkills, targetOccupation }),
        });

        setPathwayData(response);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPathway();
  }, [userSkills, targetOccupation]);

  if (!userSkills.length || !targetOccupation) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-12 text-gray-500">
          <MapPin size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">No Pathway to Display</h3>
          <p>Complete a skills gap analysis first to see your career pathway</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <LoadingSpinner text="Calculating career pathway..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-8 text-red-600">
          <AlertCircle size={48} className="mx-auto mb-4" />
          <p>Error loading pathway: {error}</p>
        </div>
      </div>
    );
  }

  if (!pathwayData?.pathway) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-12 text-gray-500">
          <MapPin size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No pathway data available</p>
        </div>
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
          <p className="text-green-700 max-w-md mx-auto">
            {pathway.recommendation}
          </p>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h5 className="font-medium text-green-800 mb-2">
              You're Ready To:
            </h5>
            <ul className="text-green-700 text-sm space-y-1">
              <li>• Apply directly to {targetOccupation} positions</li>
              <li>• Start building a portfolio in this field</li>
              <li>• Network with professionals in this area</li>
              <li>• Look for entry-level opportunities</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="font-medium text-purple-900">
              Recommended Strategy:
            </div>
            <div className="text-purple-800">{pathway.recommendation}</div>
          </div>

          {pathway.steppingStones && pathway.steppingStones.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">
                Your Career Pathway:
              </h4>

              {/* Current Position */}
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-600 text-white rounded-full flex items-center justify-center font-bold">
                  NOW
                </div>
                <div className="ml-4 p-4 bg-gray-100 rounded-lg flex-grow">
                  <h5 className="font-semibold">Your Current Skills</h5>
                  <p className="text-gray-600 text-sm">
                    {userSkills.length} skills ready for career transition
                  </p>
                </div>
              </div>

              {/* Stepping Stones */}
              {pathway.steppingStones.map((stone, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>

                    <div className="flex-grow ml-4 p-4 border border-purple-200 rounded-lg bg-purple-50">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-lg text-purple-900">
                          {stone.occupation.name}
                        </h5>
                        <div className="flex items-center space-x-2">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                            {stone.readiness}% Ready
                          </span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {stone.timeEstimate}
                          </span>
                        </div>
                      </div>

                      <p className="text-purple-700 text-sm mb-3">
                        {stone.occupation.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Zap className="text-purple-600" size={14} />
                          <span className="text-gray-700">
                            +{stone.skillsGained} skills toward target
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="text-purple-600" size={14} />
                          <span className="text-gray-700">
                            {stone.progressValue}% progress
                          </span>
                        </div>
                      </div>

                      {stone.newSkills && stone.newSkills.length > 0 && (
                        <div className="mt-3">
                          <div className="text-sm font-medium text-purple-800 mb-2">
                            Skills you'll gain:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {stone.newSkills
                              .slice(0, 4)
                              .map((skill, skillIndex) => (
                                <span
                                  key={skillIndex}
                                  className="bg-white text-purple-700 px-2 py-1 rounded text-xs border border-purple-200"
                                >
                                  {skill.name}
                                </span>
                              ))}
                            {stone.newSkills.length > 4 && (
                              <span className="text-purple-600 text-xs px-2 py-1">
                                +{stone.newSkills.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Connection line */}
                  {index < pathway.steppingStones.length - 1 && (
                    <div className="absolute left-5 w-0.5 h-6 bg-purple-300"></div>
                  )}
                </div>
              ))}

              {/* Final Target */}
              <div className="flex items-center">
                <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center">
                  <Target size={18} />
                </div>
                <div className="ml-4 p-4 border-2 border-green-500 rounded-lg bg-green-50 flex-grow">
                  <h5 className="font-semibold text-lg text-green-800">
                    Target Achieved!
                  </h5>
                  <p className="text-green-700">
                    {targetOccupation} - Your Dream Career
                  </p>
                  <div className="mt-2 text-green-600 text-sm">
                    Ready to apply with confidence and comprehensive skill set
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

// Learning Resources Component
const LearningResourcesFinder = ({ missingSkills = [] }) => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // =====================
  //  PROVIDER FUNCTIONS
  // =====================

  // Google Books
  const fetchBooks = async (skillName) => {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        skillName
      )}`
    );
    const data = await res.json();

    return (data?.items || []).map((b) => ({
      title: b.volumeInfo.title,
      type: "book",
      provider: "Google Books",
      description: b.volumeInfo.description || "",
      level: "All levels",
      price: "Free",
      url: b.volumeInfo.infoLink,
    }));
  };

  // YouTube
  const fetchYouTube = async (skillName) => {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        skillName
      )}&type=video&maxResults=5&key=${import.meta.env.VITE_YOUTUBE_API_KEY}` // 🔑
    );
    const data = await res.json();

    return (data?.items || []).map((v) => ({
      title: v.snippet.title,
      type: "video",
      provider: "YouTube",
      description: v.snippet.description,
      level: "Beginner-Friendly",
      price: "Free",
      url: `https://www.youtube.com/watch?v=${v.id.videoId}`,
    }));
  };

  // AI Fallback (OpenAI GPT)
  const fetchAIRecommendations = async (skillName) => {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`, // 🔑
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that suggests learning resources (courses, books, videos, docs).",
            },
            {
              role: "user",
              content: `Suggest 5 learning resources for skill: ${skillName}. Include title, type (course/book/video), provider, description, url.`,
            },
          ],
        }),
      });

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || "";

      return text
        .split("\n")
        .filter(Boolean)
        .map((line) => ({
          title: line,
          type: "resource",
          provider: "AI Recommendation",
          description: "",
          level: "All levels",
          price: "Free",
          url: "",
        }));
    } catch (err) {
      console.error("AI fallback failed:", err);
      return [];
    }
  };

  // =====================
  //  MASTER FUNCTION
  // =====================

  const searchResources = async (skillName) => {
    setIsLoading(true);
    setResources([]);

    const providers = [fetchYouTube, fetchBooks];

    let allResults = [];

    for (const provider of providers) {
      try {
        const results = await provider(skillName);
        if (results?.length) {
          allResults = [...allResults, ...results];
        }
      } catch (err) {
        console.error(`Error in ${provider.name}:`, err);
      }
    }

    // 🔥 AI fallback if no results found
    if (allResults.length === 0) {
      const aiResults = await fetchAIRecommendations(skillName);
      allResults = aiResults;
    }

    setResources(allResults);
    setIsLoading(false);
  };

  useEffect(() => {
    if (selectedSkill) {
      searchResources(selectedSkill.name || selectedSkill.PREFERREDLABEL);
    }
  }, [selectedSkill]);

  if (missingSkills.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          No Skills Gap!
        </h3>
        <p className="text-gray-600">
          You have all the required skills for your target occupation.
        </p>
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <p className="text-green-700 text-sm">
            Consider exploring optional skills to further strengthen your
            profile and stand out from other candidates.
          </p>
        </div>
      </div>
    );
  }
  console.log("missingSkills:", missingSkills);
  return (
    <div className="space-y-6">
      {/* Skill Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Lightbulb className="text-yellow-600" size={24} />
          <h3 className="text-xl font-bold">Learning Resources</h3>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select a skill to find learning resources:
          </label>
          <select
            value={selectedSkill?.id || ""}
            onChange={(e) => {
              const skill = missingSkills.find((s) => s.id === e.target.value);
              setSelectedSkill(skill);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a skill to learn...</option>
            {missingSkills.map((skill) => (
              <option key={skill.id} value={skill.id}>
                {skill.PREFERREDLABEL || skill.name || "Unknown"} (
                {skill.priority || "optional"})
              </option>
            ))}
          </select>
        </div>

        {/* Missing Skills Overview */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-red-50 rounded-lg text-center">
            <div className="text-lg font-bold text-red-600">
              {missingSkills.filter((s) => s.priority === "critical").length}
            </div>
            <div className="text-red-700">Critical Skills</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg text-center">
            <div className="text-lg font-bold text-orange-600">
              {missingSkills.filter((s) => s.priority !== "critical").length}
            </div>
            <div className="text-orange-700">Optional Skills</div>
          </div>
        </div>
      </div>

      {/* Learning Resources */}
      {selectedSkill && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h4 className="text-lg font-semibold mb-4">
            Learning Resources for "
            {selectedSkill.PREFERREDLABEL || selectedSkill.name}"
          </h4>

          {isLoading ? (
            <LoadingSpinner text="Finding learning resources..." />
          ) : (
            <div className="space-y-4">
              {resources.length > 0 ? (
                resources.map((resource, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-grow">
                        <h5 className="font-semibold text-lg mb-1">
                          {resource.title}
                        </h5>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center space-x-1">
                            <Users size={14} />
                            <span>{resource.provider}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock size={14} />
                            <span>{resource.duration}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Star size={14} />
                            <span>{resource.rating}/5</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className="px-2 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-800">
                          {resource.type}
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            resource.price === "Free"
                              ? "text-green-600"
                              : "text-gray-700"
                          }`}
                        >
                          {resource.price}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Perfect for{" "}
                        {selectedSkill.priority === "critical"
                          ? "essential"
                          : "optional"}{" "}
                        skill development
                      </div>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <ExternalLink size={14} />
                        <span>View Course</span>
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  No resources found for this skill.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Similar Occupations Component
const SimilarOccupations = ({ userSkills }) => {
  const [similarOccupations, setSimilarOccupations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSimilarOccupations = async () => {
      if (userSkills.length === 0) {
        setSimilarOccupations([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await apiCall("/similar-occupations", {
          method: "POST",
          body: JSON.stringify({
            userSkills,
            options: { limit: 8, minMatch: 25 },
          }),
        });

        setSimilarOccupations(response.similarOccupations || []);
      } catch (error) {
        console.error("Error fetching similar occupations:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimilarOccupations();
  }, [userSkills]);

  if (userSkills.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <Users size={48} className="mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-500 mb-2">
          Discover Career Options
        </h3>
        <p className="text-gray-400">
          Add your skills to see matching career opportunities
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <LoadingSpinner text="Finding matching careers..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
        <p className="text-red-600">Error loading careers: {error}</p>
      </div>
    );
  }

  if (similarOccupations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <Search size={48} className="mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-500 mb-2">
          No Matches Found
        </h3>
        <p className="text-gray-400">
          Try adding more skills or different skill variations
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Users className="text-green-600" size={24} />
        <h3 className="text-xl font-bold">Careers Matching Your Skills</h3>
      </div>

      <div className="space-y-4">
        {similarOccupations.map((occupation, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-lg">{occupation.name}</h4>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 text-sm rounded-full font-medium ${
                    occupation.readinessLevel === "high"
                      ? "bg-green-100 text-green-800"
                      : occupation.readinessLevel === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {occupation.readinessScore}% Match
                </span>
              </div>
            </div>

            {occupation.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {occupation.description}
              </p>
            )}

            <div className="flex items-center justify-between text-sm">
              <div className="flex space-x-4">
                <span className="text-green-600 flex items-center space-x-1">
                  <CheckCircle size={14} />
                  <span>{occupation.hasSkills} skills you have</span>
                </span>
                <span className="text-orange-600 flex items-center space-x-1">
                  <Clock size={14} />
                  <span>{occupation.missingSkills} to learn</span>
                </span>
              </div>

              {occupation.code && (
                <span className="text-gray-500 font-mono text-xs">
                  {occupation.code}
                </span>
              )}
            </div>

            {occupation.nextSteps && occupation.nextSteps.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Next steps:
                </div>
                <div className="flex flex-wrap gap-1">
                  {occupation.nextSteps.slice(0, 5).map((step, stepIndex) => (
                    <span
                      key={stepIndex}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                    >
                      {step}
                    </span>
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

// Main App Component
const SkillsGapAnalyzerApp = () => {
  const [activeView, setActiveView] = useState("analyzer");
  const [userSkills, setUserSkills] = useState([]);
  const [targetOccupation, setTargetOccupation] = useState("");
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const views = [
    { id: "analyzer", label: "Gap Analyzer", icon: Target },
    { id: "dashboard", label: "Current Status", icon: BarChart3 },
    { id: "pathway", label: "Career Pathway", icon: TrendingUp },
    { id: "resources", label: "Learning Resources", icon: BookOpen },
    { id: "explorer", label: "Skills Explorer", icon: Search },
    { id: "similar", label: "Similar Occupations", icon: Users },
  ];

  const performAnalysis = async () => {
    if (userSkills.length === 0 || !targetOccupation.trim()) {
      setError("Please provide both your skills and a target occupation");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await apiCall("/skills-gap-analysis", {
        method: "POST",
        body: JSON.stringify({
          userSkills,
          targetOccupation: targetOccupation.trim(),
          options: {
            skillMatching: { threshold: 0.5, maxResults: 50 },
            pathway: { maxStones: 5, minCurrentMatch: 50 },
          },
        }),
      });

      setAnalysisResults(response);
      setActiveView("results");
    } catch (error) {
      console.error("Analysis failed:", error);
      setError(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAll = () => {
    setUserSkills([]);
    setTargetOccupation("");
    setAnalysisResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r  bg-green-600 p-3 rounded-xl">
                <Target className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">JobWeave</h1>
                <p className="text-gray-600 ">
                  Find your path from skills to career success
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {analysisResults && (
                <div className="text-right">
                  <div className="text-sm text-gray-600">Current Analysis</div>
                  <div className="text-lg font-bold text-blue-600">
                    {analysisResults.gapAnalysis.readinessScore}% Ready
                  </div>
                </div>
              )}
              <ul>
                <li>
                  <a
                    href="#home"
                    className="border font-mono  text-black border-gray-400  rounded-lg py-1.5 px-1.5 hover:text-gray-100 hover:bg-green-900 "
                  >
                    <Link to={"/"}>Back Home</Link>
                  </a>
                </li>
              </ul>
              <Button
                variant="outline"
                className="py-1.5 px-1.5   hover:text-gray-100 hover:bg-red-700 font-semibold"
                onClick={clearAll}
                size="sm"
              >
                Reset Analysis
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-6">
            <div className="hidden md:flex space-x-1 bg-gray-100 rounded-lg p-1">
              {views.map((view) => {
                const Icon = view.icon;
                return (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeView === view.id
                        ? "bg-green-200 text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{view.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-2">
                {views.map((view) => {
                  const Icon = view.icon;
                  return (
                    <button
                      key={view.id}
                      onClick={() => {
                        setActiveView(view.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded text-sm font-medium ${
                        activeView === view.id
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={16} />
                      <span>{view.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Global Error */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center">
              <AlertCircle className="text-red-600 mr-3" size={20} />
              <div className="flex-grow">
                <h4 className="font-medium text-red-800">Error</h4>
                <p className="text-red-700">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* View Content */}
        {activeView === "dashboard" && (
          <Dashboard
            userSkills={userSkills}
            analysisResults={analysisResults}
          />
        )}

        {activeView === "similar" && (
          <SimilarOccupations userSkills={userSkills} />
        )}

        {activeView === "analyzer" && (
          <div className="space-y-8">
            {/* Analysis Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Skills Gap Analysis</h2>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column - Inputs */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Current Skills
                    </label>
                    <SkillInput
                      skills={userSkills}
                      onSkillsChange={setUserSkills}
                      placeholder="Type skills like 'JavaScript', 'Project Management'..."
                    />
                    <p className="hidden  text-sm text-gray-500 mt-2">
                      Add all your relevant skills. We'll match them against
                      14,000+ skills in the taxonomy.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Occupation
                    </label>
                    <OccupationSearch
                      value={targetOccupation}
                      onChange={setTargetOccupation}
                      placeholder="Search for your target job..."
                    />
                    <p className="hidden text-sm text-gray-500 mt-2">
                      Enter the occupation you want to transition to or advance
                      in.
                    </p>
                  </div>

                  <Button
                    onClick={performAnalysis}
                    disabled={
                      isAnalyzing ||
                      userSkills.length === 0 ||
                      !targetOccupation.trim()
                    }
                    className="w-full flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-700"
                    size="md"
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
                  </Button>
                </div>

                {/* Right Column - Quick Stats */}
                <div className="space-y-4">
                  <div className="p-4 bg-gray-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      Ready to Analyze
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-semibold">
                          Skills Added:
                        </span>
                        <span className="font-medium text-gray-900">
                          {userSkills.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-semibold ">
                          Target Set:
                        </span>
                        <span className="font-medium text-gray-900">
                          {targetOccupation ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      What You'll Get
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700 font-semibold">
                      <li>• Detailed readiness assessment</li>
                      <li>• Skills you have vs. skills needed</li>
                      <li>• Learning priorities and timeline</li>
                      <li>• Career pathway with stepping stones</li>
                      <li>• Alternative career suggestions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            {analysisResults && (
              <GapAnalysisResults results={analysisResults} />
            )}
          </div>
        )}

        {activeView === "results" && analysisResults && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Detailed Analysis Results
              </h2>
              <Button
                variant="outline"
                onClick={() => setActiveView("analyzer")}
              >
                New Analysis
              </Button>
            </div>
            <GapAnalysisResults results={analysisResults} />
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
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 ">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Target size={24} className="text-green-500" />
                <span className="text-xl font-bold">JobWeave</span>
              </div>
              <p className="text-gray-400 mb-4">
                Powered by the Tabiya Inclusive Taxonomy with 14,000+ skills and
                3,000+ occupations to help you find the shortest path from your
                current skills to your dream career.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>Tabiya Challenge 2</span>
                <span>•</span>
                <span>React + Express.js</span>
                <span>•</span>
                <span>Open Source Data</span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className=" text-gray-400 text-sm space-y-2">
                <li>Career pathway planning with stepping stones</li>
                <li>Learning resource recommendations</li>
                <li>14,000+ skills taxonomy exploration</li>
                <li>Real-time occupation and skill search</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a
                    href="https://explorer.tabiya.org/"
                    className="hover:text-white flex items-center space-x-1"
                  >
                    <ExternalLink size={12} />
                    <span>Tabiya Taxonomy Explorer</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.tabiya.org/"
                    className="hover:text-white flex items-center space-x-1"
                  >
                    <ExternalLink size={12} />
                    <span>Documentation</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/tabiya-tech/"
                    className="hover:text-white flex items-center space-x-1"
                  >
                    <ExternalLink size={12} />
                    <span>GitHub Repository</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400">
            <p>
              &copy; 2025 JobWeave. Built for Tabiya Hackathon Tabiay Challenge
              2.
            </p>

            <article className="pt-8 pb-4 font-bold text-white text-lg ">
              The Gym
            </article>
          </div>
        </div>
      </footer>

      {/* Quick Action Button */}
      {!analysisResults && userSkills.length > 0 && targetOccupation && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            onClick={performAnalysis}
            disabled={isAnalyzing}
            className="shadow-lg flex items-center space-x-2"
            size="md"
          >
            {isAnalyzing ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <Zap size={20} />
            )}
            <span>{isAnalyzing ? "Analyzing..." : "Quick Analysis"}</span>
          </Button>
        </div>
      )}

      {/* Connection Status */}
      <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 flex items-center space-x-2 text-sm z-30">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-gray-600">Tabiya-LogicHub RP-Kigali College</span>
      </div>
    </div>
  );
};

export default SkillsGapAnalyzerApp;

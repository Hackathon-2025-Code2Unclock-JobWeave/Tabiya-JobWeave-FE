import React, { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";

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
    primary:
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700",
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
            `/skills?q=${encodeURIComponent(debouncedInput)}&limit=8`
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            `/occupations?q=${encodeURIComponent(debouncedInput)}&limit=8`
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
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
const Dashboard = ({ userSkills, analysisResults }) => {
  const [statistics, setStatistics] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, healthResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/statistics`),
          fetch(`${API_BASE_URL}/api/health`),
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
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      {/* <div className="bg-gradient-to-r from-green-600 to-gray-400 text-gray-800 rounded-lg p-8"> */}
      <div className="bg-green-600  text-gray-800 rounded-lg p-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">
            Welcome to Skills Gap Analyzer/JobWeave
          </h2>
          <p className="text-lg text-white mb-6">
            Discover the shortest path from your current skills to your dream
            career. Powered by the Tabiya Inclusive Taxonomy with 14,000+ skills
            and 3,000+ occupations.
          </p>
          <div className="flex items-center space-x-6 text-blue-100">
            <div className="flex items-center space-x-2">
              <CheckCircle size={20} />
              <span>Skills Gap Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp size={20} />
              <span>Career Pathways</span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen size={20} />
              <span>Learning Resources</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <BookOpen className="mx-auto text-blue-600 mb-3" size={32} />
          <div className="text-2xl font-bold text-gray-900">
            {statistics?.counts.skills.toLocaleString() || "14K+"}
          </div>
          <div className="text-gray-600">Skills</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Briefcase className="mx-auto text-green-600 mb-3" size={32} />
          <div className="text-2xl font-bold text-gray-900">
            {statistics?.counts.occupations.toLocaleString() || "3K+"}
          </div>
          <div className="text-gray-600">Occupations</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <TrendingUp className="mx-auto text-purple-600 mb-3" size={32} />
          <div className="text-2xl font-bold text-gray-900">
            {statistics?.counts.skillOccupationRelations.toLocaleString() ||
              "130K+"}
          </div>
          <div className="text-gray-600">Connections</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Users className="mx-auto text-orange-600 mb-3" size={32} />
          <div className="text-2xl font-bold text-gray-900">
            {userSkills.length}
          </div>
          <div className="text-gray-600">№ Your Skills</div>
        </div>
      </div>

      {/* Personal Progress */}
      {analysisResults && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-6">Your Analysis Summary</h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-3">Target Occupation</h4>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-900">
                  {analysisResults.targetOccupation.name}
                </div>
                <div className="text-blue-700 text-sm">
                  {analysisResults.targetOccupation.code}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Readiness Score</h4>
              <ProgressBar
                percentage={analysisResults.gapAnalysis.readinessScore}
                color={
                  analysisResults.gapAnalysis.readinessLevel === "high"
                    ? "green"
                    : analysisResults.gapAnalysis.readinessLevel === "medium"
                    ? "yellow"
                    : "red"
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-3 bg-green-50 rounded">
              <div className="text-lg font-bold text-green-600">
                {analysisResults.gapAnalysis.skillsCounts.hasSkills}
              </div>
              <div className="text-sm text-gray-600">Skills You Have</div>
            </div>

            <div className="text-center p-3 bg-red-50 rounded">
              <div className="text-lg font-bold text-red-600">
                {analysisResults.gapAnalysis.skillsCounts.criticalMissing}
              </div>
              <div className="text-sm text-gray-600">Critical Missing</div>
            </div>

            <div className="text-center p-3 bg-orange-50 rounded">
              <div className="text-lg font-bold text-orange-600">
                {analysisResults.gapAnalysis.skillsCounts.optionalMissing}
              </div>
              <div className="text-sm text-gray-600">Optional Missing</div>
            </div>

            <div className="text-center p-3 bg-purple-50 rounded">
              <div className="text-lg font-bold text-purple-600">
                {analysisResults.careerPathway.steppingStones.length}
              </div>
              <div className="text-sm text-gray-600">Stepping Stones</div>
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
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

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {learningPath.totalSkillsToLearn}
              </div>
              <div className="text-sm text-gray-600">Skills to Learn</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {learningPath.estimatedTime}
              </div>
              <div className="text-sm text-gray-600">Estimated Time</div>
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
            placeholder="👈🏿Search skills or categories..."
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
                    <X size={12} />
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

  const searchResources = async (skillName) => {
    setIsLoading(true);

    // Mock learning resources (in production, integrate with external APIs)
    setTimeout(() => {
      const mockResources = [
        {
          title: `Master ${skillName} - Comprehensive Course`,
          type: "course",
          provider: "TechEd Pro",
          duration: "6-8 weeks",
          level: "Beginner to Advanced",
          rating: 4.8,
          students: "12,500+",
          price: "Free",
          url: "#",
        },
        {
          title: `${skillName} Professional Certification`,
          type: "certification",
          provider: "Industry Institute",
          duration: "10-12 weeks",
          level: "Professional",
          rating: 4.6,
          students: "8,200+",
          price: "$299",
          url: "#",
        },
        {
          title: `${skillName} Practical Tutorial Series`,
          type: "tutorial",
          provider: "DevTube",
          duration: "3-4 weeks",
          level: "Beginner",
          rating: 4.5,
          students: "25,000+",
          price: "Free",
          url: "#",
        },
        {
          title: `Advanced ${skillName} Workshop`,
          type: "workshop",
          provider: "SkillBoost Academy",
          duration: "2 days",
          level: "Advanced",
          rating: 4.9,
          students: "1,500+",
          price: "$199",
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
            value={selectedSkill?.ID || ""}
            onChange={(e) => {
              const skill = missingSkills.find((s) => s.ID === e.target.value);
              setSelectedSkill(skill);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a skill to learn...</option>
            {missingSkills.map((skill) => (
              <option key={skill.ID} value={skill.ID}>
                {skill.PREFERREDLABEL} ({skill.priority || "optional"})
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
            Learning Resources for "{selectedSkill.PREFERREDLABEL}"
          </h4>

          {isLoading ? (
            <LoadingSpinner text="Finding learning resources..." />
          ) : (
            <div className="space-y-4">
              {resources.map((resource, index) => (
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
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          resource.type === "course"
                            ? "bg-blue-100 text-blue-800"
                            : resource.type === "certification"
                            ? "bg-green-100 text-green-800"
                            : resource.type === "workshop"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
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

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <span className="font-medium text-gray-700">Level: </span>
                      <span>{resource.level}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Students:{" "}
                      </span>
                      <span>{resource.students}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Rating:{" "}
                      </span>
                      <span className="text-yellow-600">
                        {resource.rating}/5 ⭐
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
                    <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                      <ExternalLink size={14} />
                      <span>View Course</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Learning Tips */}
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-2">
                  <Lightbulb
                    className="text-yellow-600 flex-shrink-0"
                    size={20}
                  />
                  <div>
                    <div className="font-medium text-yellow-800 mb-1">
                      Learning Strategy Tips
                    </div>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      <li>
                        • Focus on critical skills first - they're essential for
                        the role
                      </li>
                      <li>
                        • Combine theoretical learning with hands-on practice
                      </li>
                      <li>
                        • Build a portfolio project that demonstrates this skill
                      </li>
                      <li>
                        • Join professional communities to network and learn
                      </li>
                      <li>• Consider finding a mentor in your target field</li>
                    </ul>
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
                  {occupation.nextSteps.slice(0, 3).map((step, stepIndex) => (
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

// Export Component
const ExportShare = ({ analysisResults, userSkills, targetOccupation }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState("json");

  const exportData = async (format) => {
    setIsExporting(true);

    const exportData = {
      timestamp: new Date().toISOString(),
      userSkills,
      targetOccupation,
      analysis: analysisResults,
      metadata: {
        toolUsed: "Skills Gap Analyzer",
        challenge: "Tabiya Hackathon Challenge 2",
        version: "1.0.0",
      },
    };

    setTimeout(() => {
      let content, filename, mimeType;

      if (format === "json") {
        content = JSON.stringify(exportData, null, 2);
        filename = `skills-gap-analysis-${
          new Date().toISOString().split("T")[0]
        }.json`;
        mimeType = "application/json";
      } else if (format === "csv") {
        // Convert to CSV format
        const csvData = [
          ["Metric", "Value"],
          ["Target Occupation", targetOccupation],
          ["Readiness Score", `${analysisResults.gapAnalysis.readinessScore}%`],
          ["Skills Matched", analysisResults.skillMatching.totalMatched],
          [
            "Skills to Learn",
            analysisResults.gapAnalysis.skillsCounts.missingSkills,
          ],
          [
            "Critical Skills Missing",
            analysisResults.gapAnalysis.skillsCounts.criticalMissing,
          ],
          ["Analysis Date", new Date().toLocaleDateString()],
        ];

        content = csvData.map((row) => row.join(",")).join("\n");
        filename = `skills-gap-analysis-${
          new Date().toISOString().split("T")[0]
        }.csv`;
        mimeType = "text/csv";
      }

      const dataStr =
        `data:${mimeType};charset=utf-8,` + encodeURIComponent(content);
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", filename);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setIsExporting(false);
    }, 1500);
  };

  const shareResults = async () => {
    if (!analysisResults) return;

    const shareText = `Skills Gap Analysis Results:

Target: ${targetOccupation}
Readiness Score: ${analysisResults.gapAnalysis.readinessScore}%
Skills Matched: ${analysisResults.skillMatching.totalMatched}
Skills to Learn: ${analysisResults.gapAnalysis.skillsCounts.missingSkills}

Generated by Skills Gap Analyzer - Tabiya Hackathon Challenge 2`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Skills Gap Analysis",
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        navigator.clipboard.writeText(shareText).then(() => {
          alert("Results copied to clipboard!");
        });
      }
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        alert("Results copied to clipboard!");
      });
    }
  };

  if (!analysisResults) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <Download size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-500 mb-2">
          No Analysis to Export
        </h3>
        <p className="text-gray-400">
          Complete a skills gap analysis first to export your results.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Export Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Download className="text-blue-600" size={24} />
          <h3 className="text-xl font-bold">Export Analysis</h3>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Analysis Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Target:</span>
                <div className="font-medium">{targetOccupation}</div>
              </div>
              <div>
                <span className="text-gray-600">Readiness Score:</span>
                <div className="font-medium">
                  {analysisResults.gapAnalysis.readinessScore}%
                </div>
              </div>
              <div>
                <span className="text-gray-600">Skills Matched:</span>
                <div className="font-medium">
                  {analysisResults.skillMatching.totalMatched}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Skills to Learn:</span>
                <div className="font-medium">
                  {analysisResults.gapAnalysis.skillsCounts.missingSkills}
                </div>
              </div>
            </div>
          </div>

          {/* Export Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format:
            </label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="json">JSON (Complete Data)</option>
              <option value="csv">CSV (Summary)</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              onClick={() => exportData(exportFormat)}
              disabled={isExporting}
              className="flex items-center justify-center space-x-2"
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
            </Button>

            <Button
              variant="outline"
              onClick={shareResults}
              className="flex items-center justify-center space-x-2"
            >
              <Share2 size={18} />
              <span>Share Results</span>
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Export includes complete analysis, skill recommendations, and career
            pathway suggestions
          </div>
        </div>
      </div>

      {/* Analysis Breakdown */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h4 className="font-semibold mb-4">What's Included in Export</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle className="text-green-600" size={14} />
              <span>Complete skills gap analysis</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle className="text-green-600" size={14} />
              <span>Readiness assessment and scoring</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle className="text-green-600" size={14} />
              <span>Skills you have vs. skills needed</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle className="text-green-600" size={14} />
              <span>Learning priorities and recommendations</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle className="text-green-600" size={14} />
              <span>Career pathway with stepping stones</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle className="text-green-600" size={14} />
              <span>Time estimates for skill development</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle className="text-green-600" size={14} />
              <span>Alternative career suggestions</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle className="text-green-600" size={14} />
              <span>Analysis metadata and timestamps</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const SkillsGapAnalyzerApp = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [userSkills, setUserSkills] = useState([]);
  const [targetOccupation, setTargetOccupation] = useState("");
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                <Target className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Skills Gap Analyzer
                </h1>
                <p className="text-gray-600">
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

              <Button variant="outline" onClick={clearAll} size="sm">
                Clear All
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
                    <p className="text-sm text-gray-500 mt-2">
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
                    <p className="text-sm text-gray-500 mt-2">
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
                    className="w-full flex items-center justify-center space-x-2"
                    size="lg"
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
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      Ready to Analyze
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-700">Skills Added:</span>
                        <span className="font-medium text-blue-900">
                          {userSkills.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-700">Target Set:</span>
                        <span className="font-medium text-blue-900">
                          {targetOccupation ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">
                      What You'll Get
                    </h4>
                    <ul className="space-y-1 text-sm text-green-700">
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

        {activeView === "export" && (
          <ExportShare
            analysisResults={analysisResults}
            userSkills={userSkills}
            targetOccupation={targetOccupation}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Target size={24} />
                <span className="text-xl font-bold">Skills Gap Analyzer</span>
              </div>
              <p className="text-gray-400 mb-4">
                Built for Tabiya Hackathon Challenge 2. Powered by the Tabiya
                Inclusive Taxonomy with 14,000+ skills and 3,000+ occupations to
                help you find the shortest path from your current skills to your
                dream career.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>Challenge 2</span>
                <span>•</span>
                <span>React + Express.js</span>
                <span>•</span>
                <span>Open Source Data</span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Skills gap analysis with AI-powered matching</li>
                <li>Career pathway planning with stepping stones</li>
                <li>14,000+ skills taxonomy exploration</li>
                <li>Learning resource recommendations</li>
                <li>Export and share analysis results</li>
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

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 Skills Gap Analyzer. Built for Tabiya Hackathon
              Challenge 2.
            </p>
            <p className="text-sm mt-2">
              Empowering career development through data-driven insights.
            </p>
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
            size="lg"
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
        <span className="text-gray-600">Connected to Tabiya API</span>
      </div>
    </div>
  );
};

export default SkillsGapAnalyzerApp;

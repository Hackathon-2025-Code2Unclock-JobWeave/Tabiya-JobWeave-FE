// JobWeave-FE/src/utils/helpers.js
export const formatPercentage = (value) => {
  return Math.round(value * 10) / 10;
};

export const getReadinessColor = (level) => {
  switch (level) {
    case "high":
      return "green";
    case "medium":
      return "yellow";
    case "low":
      return "red";
    case "very_low":
      return "red";
    default:
      return "gray";
  }
};

export const getSkillTypeColor = (type) => {
  switch (type) {
    case "skill/competence":
      return "blue";
    case "knowledge":
      return "green";
    case "language":
      return "purple";
    case "attitude":
      return "orange";
    default:
      return "gray";
  }
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substr(0, maxLength) + "...";
};

export const formatDuration = (weeks) => {
  if (weeks < 4) return `${weeks} weeks`;
  if (weeks < 52) return `${Math.round(weeks / 4)} months`;
  return `${Math.round(weeks / 52)} years`;
};

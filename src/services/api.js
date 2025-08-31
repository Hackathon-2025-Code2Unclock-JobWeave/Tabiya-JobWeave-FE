// JobWeave-FE/src/components/SkillsGapAnalyzerApp.js
// (Use the complete React component from the previous artifacts)

// JobWeave-FE/src/services/api.js
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

class ApiService {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Skills Gap Analysis
  static async analyzeSkillsGap(userSkills, targetOccupation, options = {}) {
    return this.request("/skills-gap-analysis", {
      method: "POST",
      body: JSON.stringify({
        userSkills,
        targetOccupation,
        options,
      }),
    });
  }

  // Similar Occupations
  static async findSimilarOccupations(userSkills, options = {}) {
    return this.request("/similar-occupations", {
      method: "POST",
      body: JSON.stringify({
        userSkills,
        options,
      }),
    });
  }

  // Career Pathway
  static async getCareerPathway(userSkills, targetOccupation, options = {}) {
    return this.request("/career-pathway", {
      method: "POST",
      body: JSON.stringify({
        userSkills,
        targetOccupation,
        options,
      }),
    });
  }

  // Search APIs
  static async searchSkills(query, limit = 20) {
    const params = new URLSearchParams({ q: query, limit });
    return this.request(`/skills?${params}`);
  }

  static async searchOccupations(query, limit = 20, type = null) {
    const params = new URLSearchParams({ q: query, limit });
    if (type) params.append("type", type);
    return this.request(`/occupations?${params}`);
  }

  // Detailed Information
  static async getOccupationDetails(occupationId) {
    return this.request(`/occupation/${occupationId}`);
  }

  static async getSkillSuggestions(
    occupationId,
    exclude = [],
    priority = "all"
  ) {
    const params = new URLSearchParams({ priority });
    if (exclude.length > 0) params.append("exclude", exclude.join(","));
    return this.request(`/skill-suggestions/${occupationId}?${params}`);
  }

  // Taxonomy Data
  static async getSkillGroups(includeSkills = false, limit = 50) {
    const params = new URLSearchParams({ includeSkills, limit });
    return this.request(`/skill-groups?${params}`);
  }

  static async getOccupationGroups(includeOccupations = false, limit = 50) {
    const params = new URLSearchParams({ includeOccupations, limit });
    return this.request(`/occupation-groups?${params}`);
  }

  // System Information
  static async getStatistics() {
    return this.request("/statistics");
  }

  static async getHealth() {
    return this.request("/health");
  }
}

export default ApiService;

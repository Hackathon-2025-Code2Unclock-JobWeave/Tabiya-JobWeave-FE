import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SkillsGapAnalyzerApp from "./SkillGapAnalyzer";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page at root */}
        <Route index element={<LandingPage />} />

        {/* Analyzer page */}
        <Route path="skillgapanalyser" element={<SkillsGapAnalyzerApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

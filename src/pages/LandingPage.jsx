import { Target, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
const LandingPage = () => {
  return (
    <div className="font-inter text-gray-900">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          {/* <a href="#" className="flex items-center text-xl font-bold">
            <img src="/Screenshot 2025-09-08 201718.png" alt="Logo" className="h-8 w-8 mr-3" />
            Job Weave <br />
            <p className="mt-6 ml-2  text-gray-600">
            Find your path from skills to career success</p>
            
          </a> */}
          <a href="#" className="flex items-center text-xl font-bold">
        <img
             src="/Screenshot 2025-09-08 201718.png"alt="Logo" className="size-14 mr-3 bg-green-500"/>
         <div className="flex flex-col">
         <span>Job Weave</span>
         <p className="text-sm font-normal text-gray-600">
           Find your path from skills to career success
        </p>
               </div>
            </a>
           <ul className="hidden md:flex space-x-6 text-gray-600 font-medium">
            <li>
              <a href="#home" className="hover:text-gray-900">
                Home
              </a>
            </li>
            <li>
              <Link to="/skillgapanalyser" className="navbar__link">
                Find My Career
              </Link>
            </li>
            <li>
              <a href="#about" className="hover:text-gray-900">
                About Us
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-gray-900">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#help" className="hover:text-gray-900">
                Help ?
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6">
          <div>
            <h1 className="text-5xl font-bold leading-tight">
              Map Your Skills <br />
              to Your <br />
              <span className="text-green-600">Dream Career</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Turn your skills into a career. PathFinder guides you from today's
              skills to tomorrow's job.
            </p>
            <div className="mt-6 flex space-x-4">
              <a className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">
                <Link to="/skillgapanalyser" className="navbar__link">
                  Get Started
                </Link>
              </a>

              <a
                href="#learn-more"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
              >
                Learn More
              </a>
            </div>
          </div>
          <div>
            <img src="/images/meta.png" alt="Illustration" className="w-full" />
          </div>
        </div>
      </section>

      {/* Barriers Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-12">
            From Barriers to <br /> Breakthroughs
          </h2>
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">⚠️</span>
                <h3 className="font-semibold text-lg">Barriers On Your Path</h3>
              </div>
              <p className="text-gray-600">
                Many people can't find decent jobs and aren’t sure where their
                skills fit best or how to grow into new opportunities.
              </p>
            </div>

            <div className="flex justify-center items-center text-4xl text-gray-400">
              →
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">⚡</span>
                <h3 className="font-semibold text-lg">Solution</h3>
              </div>
              <p className="text-gray-600">
                PathFinder maps your skills to jobs and career opportunities,
                showing your best match to a dream career.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bridge Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-4">
            Let PathFinder Bridge Your Career Gap
          </h2>
          <p className="text-gray-600 mb-12">
            Built on the world's most comprehensive skills and occupation
            taxonomy
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold text-lg">Precise Matching</h3>
              <p className="text-gray-600 mt-2 text-sm">
                3,000+ occupations and 14,000+ skills ensure accurate career
                mapping
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold text-lg">Fastest Path</h3>
              <p className="text-gray-600 mt-2 text-sm">
                AI-powered recommendations for the most efficient skill
                development
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl mb-2">🌟</div>
              <h3 className="font-semibold text-lg">Inclusive Recognition</h3>
              <p className="text-gray-600 mt-2 text-sm">
                Values both formal and informal work experience and capabilities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-20 bg-green-600 text-center text-white">
        <h2 className="text-4xl font-bold">
          Ready to Map Your <br /> Career Journey?
        </h2>
      </section> */}

      {/* Footer (from JobWeave) */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                {/* <img src="/Screenshot 2025-09-08 201718.png" alt="Logo" className="h-6 w-6"/> */}
                <img src="/Screenshot 2025-09-08 201718.png" alt="Logo"
                       className="h-6 w-6 bg-transparent"/>

              <span className="text-xl font-bold">JobWeave</span>
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
            <p>&copy; 2025 JobWeave. Built for Tabiya Hackathon Challenge 2.</p>
            <p className="text-sm mt-2">
              Empowering career development through data-driven insights.
            </p>
          </div>
        </div>
        <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 flex items-center space-x-2 text-sm z-30">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-600">
            Tabiya-LogicHub RP-Kigali College
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

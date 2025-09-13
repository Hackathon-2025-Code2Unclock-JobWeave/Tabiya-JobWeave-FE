import { useState } from "react";
import { Target, ExternalLink, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="font-inter text-gray-900">
      {/* Navigation */}
      <nav className="bg-white shadow fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <a href="#" className="flex items-center text-xl font-bold">
            <img
              src="/images/Screenshot 2025-09-08 201718.png"
              alt="Logo"
              className="size-10 mr-3 rounded bg-green-600"
            />
            <div className="flex flex-col">
              <span>Job Weave</span>
              <p className="text-sm font-normal text-gray-600">
                Find your path from skills to career success
              </p>
            </div>
          </a>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6 text-gray-600 font-medium">
            <li>
              <a href="#home" className="hover:text-green-700">
                Home
              </a>
            </li>
            <li>
              <Link to="/skillgapanalyser" className="hover:text-green-700">
                Find My Career
              </Link>
            </li>
            <li>
              <a href="#about" className="hover:text-green-700">
                About Us
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-green-700">
                Contact
              </a>
            </li>
            <li>
              <a href="#help" className="hover:text-green-700">
                Help?
              </a>
            </li>
          </ul>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-white shadow px-6 py-4 space-y-4 text-gray-600 font-medium">
            <a href="#home" className="block hover:text-green-700">
              Home
            </a>
            <Link to="/skillgapanalyser" className="block hover:text-green-700">
              Find My Career
            </Link>
            <a href="#about" className="block hover:text-green-700">
              About Us
            </a>
            <a href="#contact" className="block hover:text-green-700">
              Contact
            </a>
            <a href="#help" className="block hover:text-green-700">
              Help?
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="bg-gray-50 pt-28 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-4 sm:px-6">
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
              Map Your Skills <br /> To Your <br />
              <span className="text-green-900">Dream Career</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-gray-600">
              JobWeave helps you turn today’s skills into tomorrow’s success 🚀
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                to="/skillgapanalyser"
                className="px-6 py-3 bg-green-800 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
              >
                Get Started
              </Link>
              <a
                href="#learn-more"
                className="px-6 py-3 border border-gray-300 font-semibold text-gray-700 rounded-lg hover:bg-gray-100 transition"
              >
                Learn More
              </a>
            </div>
          </motion.div>

          {/* Right Image Slider */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Slider
              {...sliderSettings}
              className="rounded-2xl overflow-hidden shadow-lg"
            >
              {[1, 2, 3, 4].map((num) => (
                <div key={num}>
                  <img
                    src={`/images/Image_fx (${num}).jpg`}
                    alt={`slide-${num}`}
                    className="w-full h-[250px] sm:h-[350px] md:h-[400px] object-cover"
                  />
                </div>
              ))}
            </Slider>
          </motion.div>
        </div>
      </section>

      {/* Problem → Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-4 sm:px-6">
          {/* PROBLEM */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-50 p-6 rounded-lg shadow"
          >
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🚧</span>
              <h3 className="font-semibold text-lg">The Challenge</h3>
            </div>
            <p className="text-gray-600">
              Many workers struggle to connect their current skills with real
              career opportunities.
            </p>
          </motion.div>

          {/* SOLUTION */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-50 p-6 rounded-lg shadow"
          >
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">⚡</span>
              <h3 className="font-semibold text-lg">The Solution</h3>
            </div>
            <p className="text-gray-600">
              Job Weave highlights your missing skills, suggests stepping-stone
              roles, and connects you with learning to grow faster.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Challenge 2 Section */}
      <section
        id="challenge2"
        className="py-20 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:grid md:grid-cols-2 gap-12 items-center px-4 sm:px-6">
          {/* SLIDER */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Slider
              {...sliderSettings}
              className="rounded-2xl overflow-hidden shadow-lg"
            >
              {[2, 3, 4].map((num) => (
                <div key={num}>
                  <img
                    src={`/images/Image_fx (${num}).jpg`}
                    alt={`challenge-slide-${num}`}
                    className="w-full h-[250px] sm:h-[350px] md:h-[400px] object-cover"
                  />
                </div>
              ))}
            </Slider>
          </motion.div>

          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
              Tabiya Challenge 2:{" "}
              <span className="text-green-700">JobWeave</span>
            </h2>
            <p className="text-gray-600 mb-8">
              Find the shortest path from the skills you have to the job you
              want. Identify missing skills, explore steppingstone roles, and
              discover learning resources — powered by Tabiya’s taxonomy.
            </p>

            <div className="space-y-6">
              {[
                {
                  icon: "🧩",
                  title: "Identify Missing Skills",
                  desc: "Compare your skills with a target occupation.",
                },
                {
                  icon: "🛤️",
                  title: "Suggest Pathways",
                  desc: "Discover stepping-stone roles to grow faster.",
                },
                {
                  icon: "📚",
                  title: "Find Training",
                  desc: "Get course recommendations to close your skill gaps.",
                },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  className="flex items-start space-x-4"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-2xl">{step.icon}</span>
                  <div>
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bridge Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Let Job Weave Bridge Your Career Gap
          </h2>
          <p className="text-gray-600 mb-12">
            Built on the world’s most comprehensive skills + occupation taxonomy
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🎯",
                title: "Precise Matching",
                desc: "3,000+ jobs and 14,000+ skills ensure accurate career mapping",
              },
              {
                icon: "⚡",
                title: "Fastest Path",
                desc: "Smart recommendations for efficient skill growth",
              },
              {
                icon: "🌟",
                title: "Inclusive Recognition",
                desc: "We value both formal & informal experience",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white p-6 rounded-lg shadow"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-gray-600 mt-2 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
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
              <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                <span>Tabiya Challenge 2</span>
                <span>•</span>
                <span>React + Express.js</span>
                <span>•</span>
                <span>Open Source Data</span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="text-gray-400 text-sm space-y-2">
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
                    <ExternalLink size={12} /> <span>Tabiya Explorer</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.tabiya.org/"
                    className="hover:text-white flex items-center space-x-1"
                  >
                    <ExternalLink size={12} /> <span>Documentation</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/tabiya-tech/"
                    className="hover:text-white flex items-center space-x-1"
                  >
                    <ExternalLink size={12} /> <span>GitHub Repository</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400">
            <p>
              &copy; 2025 JobWeave. Built for Tabiya Hackathon Tabiya Challenge
              2.
            </p>
            <article className="pt-8 pb-4 font-bold text-white text-lg">
              The Gym
            </article>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

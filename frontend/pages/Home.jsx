import { useState } from "react";
import { useNavigate } from "react-router-dom";

const categories = {
  sorting: {
    title: "Sorting Algorithms",
    icon: "🔄",
    description: "Learn how data gets organized",
    algorithms: [
      "Bubble Sort",
      "Selection Sort", 
      "Insertion Sort",
      "Merge Sort",
      "Quick Sort",
      "Heap Sort",
      "Radix Sort"
    ]
  },
  searching: {
    title: "Searching Algorithms",
    icon: "🔍",
    description: "Find elements efficiently",
    algorithms: ["Linear Search", "Binary Search", "Jump Search"]
  },
  graph: {
    title: "Graph Algorithms",
    icon: "🕸️",
    description: "Navigate complex relationships",
    algorithms: ["BFS", "DFS", "Dijkstra's", "A* Search"]
  },
  recursion: {
    title: "Recursion",
    icon: "🔄",
    description: "Solve problems by breaking them down",
    algorithms: ["Factorial", "Fibonacci", "N-Queens", "Tower of Hanoi"]
  },
  dp: {
    title: "Dynamic Programming",
    icon: "⚡",
    description: "Optimize with memoization",
    algorithms: ["0/1 Knapsack", "LCS", "Grid Paths", "Coin Change"]
  },
};

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat === selectedCategory ? null : cat);
  };

  const handleAlgorithmClick = (algo, e) => {
    e.stopPropagation();
    navigate(`/visualizer?algorithm=${encodeURIComponent(algo)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Master Algorithms Through Visualization
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Interactive step-by-step animations to understand how algorithms work. 
            Perfect for students, developers, and algorithm enthusiasts.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate("/visualizer")}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
            >
              🚀 Start Learning
            </button>
            <button
              onClick={() => navigate("/submit")}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
            >
              📝 Submit Algorithm
            </button>
          </div>
        </div>
      </div>

      {/* Algorithm Categories */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Explore Algorithm Categories
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(categories).map(([key, category]) => (
            <div
              key={key}
              className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                selectedCategory === key ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleCategoryClick(key)}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{category.icon}</span>
                  <h3 className="text-xl font-bold text-gray-800">
                    {category.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">{category.description}</p>
                
                {selectedCategory === key && (
                  <div className="mt-4 space-y-2">
                    {category.algorithms.map((algo) => (
                      <button
                        key={algo}
                        className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        onClick={(e) => handleAlgorithmClick(algo, e)}
                      >
                        {algo}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose AlgoViz?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Learning</h3>
              <p className="text-gray-600">Step-by-step animations with pause, play, and speed controls</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💻</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Code Integration</h3>
              <p className="text-gray-600">View and understand the actual implementation alongside visualizations</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Comprehensive Coverage</h3>
              <p className="text-gray-600">From basic sorting to advanced graph algorithms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

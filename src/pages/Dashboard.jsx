import { useState } from "react";
import { useNavigate } from "react-router-dom";

const categories = {
  sorting: [
    "Bubble Sort",
    "Selection Sort",
    "Insertion Sort",
    "Merge Sort",
    "Quick Sort",
  ],
  searching: ["Linear Search", "Binary Search"],
  recursion: ["Factorial", "Fibonacci"],
  dp: ["0/1 Knapsack", "Longest Common Subsequence"],
};

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("sorting");
  const navigate = useNavigate();

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat === selectedCategory ? null : cat);
  };

  const handleAlgorithmClick = (algo, e) => {
    // Stop propagation to prevent the parent category box from closing
    e.stopPropagation();
    navigate(`/visualizer?algorithm=${encodeURIComponent(algo)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
           {" "}
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
                Explore Algorithms      {" "}
      </h1>
           {" "}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
               {" "}
        {Object.keys(categories).map((cat) => (
          <div
            key={cat}
            className="p-6 rounded-lg shadow-md bg-white cursor-pointer hover:shadow-lg transition"
            onClick={() => handleCategoryClick(cat)}
          >
                       {" "}
            <h2 className="text-xl font-semibold capitalize text-gray-800">
                            {cat} Algorithms            {" "}
            </h2>
                       {" "}
            {selectedCategory === cat && (
              <ul className="mt-4 space-y-2">
                               {" "}
                {categories[cat].map((algo) => (
                  <li
                    key={algo}
                    // 🎯 THE FIX: Add 'inline-block' to limit the width of the <li> element.
                    className="text-blue-600 cursor-pointer inline-block"
                    onClick={(e) => handleAlgorithmClick(algo, e)}
                  >
                                        {algo}                 {" "}
                  </li>
                ))}
                             {" "}
              </ul>
            )}
                     {" "}
          </div>
        ))}
             {" "}
      </div>
           {" "}
      <div className="mt-12 text-center">
               {" "}
        <button
          onClick={() => navigate("/submit")}
          className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
                    Submit Your Own Algorithm        {" "}
        </button>
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default Dashboard;

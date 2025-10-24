import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState({
    totalAlgorithms: 25,
    completedAlgorithms: 8,
    masteredAlgorithms: 3,
    totalTimeSpent: 120, // minutes
    currentStreak: 5,
  });

  const [recentActivity] = useState([
    { algorithm: 'Bubble Sort', status: 'completed', time: '2 hours ago' },
    { algorithm: 'Quick Sort', status: 'in-progress', time: '1 day ago' },
    { algorithm: 'Binary Search', status: 'completed', time: '2 days ago' },
    { algorithm: 'Merge Sort', status: 'started', time: '3 days ago' },
  ]);

  const [achievements] = useState([
    {
      name: 'First Steps',
      description: 'Complete your first algorithm',
      earned: true,
    },
    {
      name: 'Sorting Master',
      description: 'Complete 5 sorting algorithms',
      earned: true,
    },
    {
      name: 'Speed Demon',
      description: 'Complete an algorithm in under 5 minutes',
      earned: false,
    },
    {
      name: 'Consistency King',
      description: 'Maintain a 7-day streak',
      earned: false,
    },
  ]);

  useEffect(() => {
    // Simulate fetching user data
    setUser({
      name: 'John Doe',
      email: 'john@example.com',
      joinDate: '2024-01-15',
      level: 'Intermediate',
    });
  }, []);

  const completionPercentage = Math.round(
    (progress.completedAlgorithms / progress.totalAlgorithms) * 100
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.name || 'User'}!
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/visualizer')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue Learning
              </button>
              <button
                onClick={() => navigate('/submit')}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Submit Algorithm
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {completionPercentage}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {progress.completedAlgorithms}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mastered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {progress.masteredAlgorithms}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">🔥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Streak</p>
                <p className="text-2xl font-bold text-gray-900">
                  {progress.currentStreak} days
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Learning Progress
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Overall Progress</span>
                  <span>
                    {progress.completedAlgorithms}/{progress.totalAlgorithms}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Time Spent</span>
                  <span>{progress.totalTimeSpent} min</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: '60%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-3 ${
                        activity.status === 'completed'
                          ? 'bg-green-500'
                          : activity.status === 'in-progress'
                            ? 'bg-yellow-500'
                            : 'bg-blue-500'
                      }`}
                    ></div>
                    <span className="text-sm font-medium text-gray-900">
                      {activity.algorithm}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Achievements
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 ${
                    achievement.earned
                      ? 'border-yellow-400 bg-yellow-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <span className="text-lg">
                      {achievement.earned ? '🏆' : '🔒'}
                    </span>
                    <span
                      className={`text-sm font-medium ml-2 ${
                        achievement.earned ? 'text-yellow-800' : 'text-gray-500'
                      }`}
                    >
                      {achievement.name}
                    </span>
                  </div>
                  <p
                    className={`text-xs ${
                      achievement.earned ? 'text-yellow-700' : 'text-gray-400'
                    }`}
                  >
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/visualizer?algorithm=Bubble Sort')}
                className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <div className="font-medium text-blue-900">
                  Continue Bubble Sort
                </div>
                <div className="text-sm text-blue-700">
                  Resume where you left off
                </div>
              </button>

              <button
                onClick={() => navigate('/visualizer')}
                className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <div className="font-medium text-green-900">
                  Explore New Algorithm
                </div>
                <div className="text-sm text-green-700">
                  Discover something new
                </div>
              </button>

              <button
                onClick={() => navigate('/submit')}
                className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <div className="font-medium text-purple-900">
                  Submit Your Algorithm
                </div>
                <div className="text-sm text-purple-700">
                  Share your implementation
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

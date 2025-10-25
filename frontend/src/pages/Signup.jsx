import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Using the most standard path structure for sibling directories (pages/ -> utils/api)
import API from '../utils/api.js'; // FIX: Explicitly adding .js extension

// Simple Modal Component for Alerts (since window.alert is prohibited)
const CustomAlert = ({ message, onClose, onAction, actionMessage }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full rounded-xl">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification</h3>
      <p className="text-gray-600 mb-6" style={{ whiteSpace: 'pre-wrap' }}>
        {message}
      </p>
      <button
        // Use onAction if a success action is pending (like navigation), otherwise just onClose
        onClick={onAction || onClose}
        className="w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200"
      >
        {actionMessage || 'OK'}
      </button>
    </div>
  </div>
);

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  // Using a unified state to manage the message and the success/failure state
  const [alertState, setAlertState] = useState({
    message: null,
    isSuccess: false,
  });
  const navigate = useNavigate();

  // Helper function to close the alert and handle success action (navigation)
  const handleCloseAlert = () => {
    if (alertState.isSuccess) {
      navigate('/login');
    }
    setAlertState({ message: null, isSuccess: false });
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    })); // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, username, ...restData } = formData;

      // FIX: Clean the username by replacing spaces with underscores
      const cleanedUsername = username.replace(/\s/g, '_');
      //
      const signupData = {
        ...restData,
        username: cleanedUsername,
      };

      //const response = await(index.postBinaryVisit("http://localhost:5000/api/visualize/traversals/binary-traversal",{algCode,travTypee,headNodee}));
      try {
        const respone = await API.post('/auth/register', signupData);
      } catch (err) {
        console.log(err);
      }

      // SUCCESS: Set alert and flag for navigation upon user interaction
      setAlertState({
        message: 'Signup successful! Please log in with your new account.',
        isSuccess: true,
      });
    } catch (error) {
      // ERROR HANDLING: If the response is not a 2xx status code

      let displayMessage = 'Signup failed. Please try again.';
      const responseData = error.response?.data;

      // Check for specific backend errors (e.g., 400 or 409)
      if (responseData) {
        if (
          responseData.message === 'User already exists' &&
          responseData.field
        ) {
          displayMessage = `Registration failed: The ${responseData.field} is already taken.`;
        } else if (responseData.errors && responseData.errors.length > 0) {
          // Mongoose validation errors
          displayMessage =
            'Validation Errors:\n' + responseData.errors.join('\n');
        } else if (responseData.message) {
          displayMessage = responseData.message;
        }
      }

      setAlertState({ message: displayMessage, isSuccess: false });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-200">
      {/* CustomAlert is rendered at the top level */}
      {alertState.message && (
        <CustomAlert
          message={alertState.message}
          onClose={handleCloseAlert} // Handles closure for failure
          onAction={alertState.isSuccess ? handleCloseAlert : null} // Handles navigation for success
          actionMessage={alertState.isSuccess ? 'Proceed to Login' : 'OK'}
        />
      )}
           {' '}
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
               {' '}
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
                    Create Your Account        {' '}
        </h2>
               {' '}
        <form onSubmit={handleSignup} className="space-y-4">
                   {' '}
          <div>
                       {' '}
            <input
              type="text"
              name="username"
              placeholder="Username (use letters, numbers, or _)"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
            />
                       {' '}
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
                     {' '}
          </div>
                   {' '}
          <div>
                       {' '}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
                       {' '}
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
                     {' '}
          </div>
                   {' '}
          <div className="grid grid-cols-2 gap-4">
                       {' '}
            <div>
                           {' '}
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
                           {' '}
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
                         {' '}
            </div>
                       {' '}
            <div>
                           {' '}
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
                           {' '}
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
                         {' '}
            </div>
                     {' '}
          </div>
                   {' '}
          <div>
                       {' '}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
                       {' '}
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
                     {' '}
          </div>
                   {' '}
          <div>
                       {' '}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            />
                       {' '}
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                                {errors.confirmPassword}             {' '}
              </p>
            )}
                     {' '}
          </div>
                   {' '}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}       
             {' '}
          </button>
                 {' '}
        </form>
               {' '}
        <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?          {' '}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate('/login')}
          >
                        Log in          {' '}
          </span>
                 {' '}
        </p>
                     {' '}
      </div>
         {' '}
    </div>
  );
};

export default Signup;

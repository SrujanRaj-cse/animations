import { useState } from 'react';
import API from '../utils/api';

const SubmitAlgorithm = () => {
  const [form, setForm] = useState({
    name: '',
    category: '',
    code: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await API.post('/user/submit', form);
      setMessage('Algorithm submitted successfully! 🎉');
      setForm({ name: '', category: '', code: '' });
    } catch {
      setMessage('Submission failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Submit Your Algorithm</h2>
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Algorithm Name"
          className="input"
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category (e.g., sorting, dp)"
          className="input"
        />
        <textarea
          name="code"
          value={form.code}
          onChange={handleChange}
          placeholder="Paste your algorithm code here"
          className="input h-40"
        />
        <button onClick={handleSubmit} className="btn bg-blue-600 hover:bg-blue-700 w-full">
          Submit
        </button>
        {message && <p className="text-center text-sm text-green-600 mt-2">{message}</p>}
      </div>
    </div>
  );
};

export default SubmitAlgorithm;
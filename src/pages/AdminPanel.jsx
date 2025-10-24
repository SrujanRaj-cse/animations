import { useEffect, useState } from 'react';
import API from '../utils/api';

const AdminPanel = () => {
  const [requests, setRequests] = useState([]);
  const [algorithms, setAlgorithms] = useState([]);
  const [newAlgo, setNewAlgo] = useState({ name: '', category: '', code: '' });

  useEffect(() => {
    API.get('/admin/requests').then(res => setRequests(res.data));
    API.get('/admin/algorithms').then(res => setAlgorithms(res.data));
  }, []);

  const approveRequest = (id) => {
    API.post(`/admin/requests/${id}/approve`).then(() => {
      setRequests(prev => prev.filter(r => r._id !== id));
    });
  };

  const rejectRequest = (id) => {
    API.post(`/admin/requests/${id}/reject`).then(() => {
      setRequests(prev => prev.filter(r => r._id !== id));
    });
  };

  const deleteAlgorithm = (id) => {
    API.delete(`/admin/algorithms/${id}`).then(() => {
      setAlgorithms(prev => prev.filter(a => a._id !== id));
    });
  };

  const addAlgorithm = () => {
    API.post('/admin/algorithms', newAlgo).then(res => {
      setAlgorithms(prev => [...prev, res.data]);
      setNewAlgo({ name: '', category: '', code: '' });
    });
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Submissions */}
        <div>
          <h3 className="text-lg font-semibold mb-2">User Submissions</h3>
          <ul className="space-y-4">
            {requests.map((req) => (
              <li key={req._id} className="bg-white p-4 rounded shadow">
                <p><strong>{req.name}</strong> ({req.category})</p>
                <pre className="text-sm bg-gray-100 p-2 rounded mt-2">{req.code}</pre>
                <div className="mt-2 flex gap-2">
                  <button className="btn bg-green-600 hover:bg-green-700" onClick={() => approveRequest(req._id)}>Approve</button>
                  <button className="btn bg-red-600 hover:bg-red-700" onClick={() => rejectRequest(req._id)}>Reject</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Manage Algorithms */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Manage Algorithms</h3>
          <ul className="space-y-4 mb-6">
            {algorithms.map((algo) => (
              <li key={algo._id} className="bg-white p-4 rounded shadow">
                <p><strong>{algo.name}</strong> ({algo.category})</p>
                <pre className="text-sm bg-gray-100 p-2 rounded mt-2">{algo.code}</pre>
                <button className="btn bg-red-600 hover:bg-red-700 mt-2" onClick={() => deleteAlgorithm(algo._id)}>Delete</button>
              </li>
            ))}
          </ul>

          {/* Add New Algorithm */}
          <div className="bg-white p-4 rounded shadow">
            <h4 className="text-md font-semibold mb-2">Add New Algorithm</h4>
            <input
              className="input mb-2"
              placeholder="Name"
              value={newAlgo.name}
              onChange={(e) => setNewAlgo({ ...newAlgo, name: e.target.value })}
            />
            <input
              className="input mb-2"
              placeholder="Category"
              value={newAlgo.category}
              onChange={(e) => setNewAlgo({ ...newAlgo, category: e.target.value })}
            />
            <textarea
              className="input mb-2 h-32"
              placeholder="Code"
              value={newAlgo.code}
              onChange={(e) => setNewAlgo({ ...newAlgo, code: e.target.value })}
            />
            <button className="btn bg-blue-600 hover:bg-blue-700" onClick={addAlgorithm}>Add Algorithm</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
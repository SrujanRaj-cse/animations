import { useNavigate, useLocation } from "react-router-dom";

const AlgorithmSelector = ({ selected }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelect = (algo) => {
    navigate(`${location.pathname}?algorithm=${encodeURIComponent(algo)}`);
  };

  return (
    <select value={selected} onChange={(e) => handleSelect(e.target.value)}>
      <option value="">Select Algorithm</option>
      <option value="Bubble Sort">Bubble Sort</option>
      <option value="Quick Sort">Quick Sort</option>
    </select>
  );
};

export default AlgorithmSelector;

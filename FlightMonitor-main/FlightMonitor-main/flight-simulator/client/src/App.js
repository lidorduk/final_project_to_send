import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// General component for input form
const InputForm = ({ inputData, handleChange, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    {/* Input field for Altitude */}
    <input
      type="number"
      name="altitude"
      value={inputData.altitude}
      onChange={handleChange}
      placeholder="Altitude (0-3000)"
      min="0"
      max="3000"
      required
    />
    {/* Input field for HIS */}
    <input
      type="number"
      name="his"
      value={inputData.his}
      onChange={handleChange}
      placeholder="HIS (0-360)"
      min="0"
      max="360"
      required
    />
    {/* Input field for ADI */}
    <input
      type="number"
      name="adi"
      value={inputData.adi}
      onChange={handleChange}
      placeholder="ADI (-100 to 100)"
      min="-100"
      max="100"
      required
    />
    <button type="submit">Submit</button>
  </form>
);

// Text mode component displays form and data in text format
const TextMode = ({ data, onSubmit }) => {
  // Local state to hold form data
  const [inputData, setInputData] = useState({ altitude: '', his: '', adi: '' });

  // Handle changes in form inputs
  const handleInputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(inputData);
  };

  return (
    <div>
      {/* Display the data */}
      <div className="data-display">
        <div className="text-data-display"><p>Altitude</p><p>{data.altitude}</p></div>
        <div className="text-data-display"><p>HIS</p><p>{data.his}</p></div>
        <div className="text-data-display"><p>ADI</p><p>{data.adi}</p></div>
      </div>
    </div>
  );
};

// Visual mode component displays data using visual indicators
const VisualMode = ({ data }) => {
  return (
    <div className="visual-mode">
      <div className="indicators">
        {/* Altitude indicator bar */}
        <div className="altitude-indicator">

          <div className="bar-container">
          <div className="scale">
            <span>3000</span>
            <span>2000</span>
            <span>1000</span>
            <span>0</span>
          </div>
            <div className="bar" style={{ height: `${(data.altitude / 3000) * 100}%` }}></div>
          </div>
        </div>
        {/* HIS indicator - rotates based on HIS value */}
        <div className="his-indicator">
          <div className="circle">
            <div className="marker" style={{ transform: `rotate(${data.his}deg)` }}></div>
            <span className="degree deg-0">0</span>
            <span className="degree deg-90">90</span>
            <span className="degree deg-180">180</span>
            <span className="degree deg-270">270</span>
          </div>
        </div>
        {/* ADI indicator - changes color based on ADI value */}
        <div className="adi-indicator">
          <div
            className="circle"
            style={{ backgroundColor: data.adi == 100 ? 'blue' : data.adi == 0 ? 'green' : 'white' }}
          ></div>
        </div>
      </div>
      {/* Display labels for the data */}
      <div className="labels">
        <div>Altitude: {data.altitude}</div>
        <div>HIS: {data.his}</div>
        <div>ADI: {data.adi}</div>
      </div>
    </div>
  );
};

// Modal component for adding new data entries
const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [entry, setEntry] = useState({ altitude: '', his: '', adi: '' });

  // Handle changes in modal inputs
  const handleChange = (e) => {
    setEntry({ ...entry, [e.target.name]: e.target.value });
  };

  // Handle form submission in modal
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(entry);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add New Entry</h2>
        {/* Render the input form inside the modal */}
        <InputForm
          inputData={entry}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

// Main App component
function App() {
  // State to manage the current mode (TEXT or VISUAL)
  const [mode, setMode] = useState('VISUAL');
  // State to store flight data
  const [flightData, setFlightData] = useState({
    altitude: 0,
    his: 0,
    adi: 0,
  });
  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(true);

  // Fetch flight data from the server on initial load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/flightData');
        if (response.data.length > 0) {
          setFlightData(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000000); // Fetch data every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle form submission and send data to the server
  const handleSubmit = async (data) => {
    try {
      await axios.post('http://localhost:5000/api/flightData', data);
      setFlightData(data);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  // Handle adding a new entry through the modal
  const handleAddEntry = (entry) => {
    setFlightData(entry);
    try {
      axios.post('http://localhost:5000/api/flightData', entry);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className="App">
      <h1>Flight Simulator</h1>
      <div className="mode-toggle">
        {/* Buttons to toggle between TEXT and VISUAL modes */}
        <button
          className={mode === 'TEXT' ? 'active' : ''}
          onClick={() => setMode('TEXT')}
        >
          TEXT
        </button>
        <button
          className={mode === 'VISUAL' ? 'active' : ''}
          onClick={() => setMode('VISUAL')}
        >
          VISUAL
        </button>
        <button onClick={() => setIsModalOpen(true)}>+</button>
      </div>
      {/* Render the appropriate mode component */}
      {mode === 'TEXT' ? (
        <TextMode data={flightData} onSubmit={handleSubmit} />
      ) : (
        <VisualMode data={flightData} />
      )}
      {/* Render the modal component */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddEntry}
      />
    </div>
  );
}

export default App;
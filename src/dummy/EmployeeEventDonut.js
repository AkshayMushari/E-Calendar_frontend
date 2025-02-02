import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const EmployeeEventDonut = ({ employeeId }) => {
  const [eventData, setEventData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeEvents = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/employee-events/${employeeId}`, {
          validateStatus: (status) => status >= 200 && status < 500
        });

        if (response.status === 404) {
          setEventData({});
          setError('No event data found for this employee');
        } else if (response.status === 200) {
          setEventData(response.data);
          setError(null);
        }
      } catch (err) {
        if (err.response) {
          // Server responded with error status
          setError(`Server Error: ${err.response.status} - ${err.response.data.message}`);
        } else if (err.request) {
          // No response received
          setError('Network Error: Could not connect to server');
        } else {
          // Setup error
          setError(`Request Error: ${err.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (employeeId) fetchEmployeeEvents();
  }, [employeeId]);

  const getChartData = () => ({
    labels: Object.keys(eventData),
    datasets: [{
      data: Object.values(eventData),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
      ],
      hoverOffset: 4
    }]
  });

  return (
    <div style={{ width: '400px', margin: '20px auto' }}>
      <h3>Event Distribution</h3>
      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : error ? (
        <div className="error-message" style={{ color: 'red' }}>
          {error}
          <button onClick={() => window.location.reload()} style={{ marginLeft: '10px' }}>
            Retry
          </button>
        </div>
      ) : (
        Object.keys(eventData).length > 0 ? (
          <Doughnut 
            data={getChartData()} 
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'right' },
                tooltip: { enabled: true }
              }
            }}
          />
        ) : (
          <div>No events recorded for this employee</div>
        )
      )}
    </div>
  );
};

export default EmployeeEventDonut;

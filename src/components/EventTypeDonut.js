import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const EventTypeDonut = () => {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/schedules');
        setSchedules(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch schedule data. Please try again later.');
        console.error('Error fetching schedule data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDonutChartData = () => {
    const eventTypes = [...new Set(schedules.map(s => s.eventType))];
    const eventCounts = eventTypes.reduce((acc, type) => {
      acc[type] = schedules.filter(s => s.eventType === type).length;
      return acc;
    }, {});

    const totalEvents = Object.values(eventCounts).reduce((sum, count) => sum + count, 0);

    return {
      labels: eventTypes,
      datasets: [{
        data: Object.values(eventCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      }]
    };
  };

  if (isLoading) return <div>Loading data...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ width: '400px', margin: '20px auto' }}>
      <h2>Event Type Distribution</h2>
      <Doughnut 
        data={getDonutChartData()}
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((acc, current) => acc + current, 0);
                  const percentage = ((value / total) * 100).toFixed(2);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            },
            title: {
              display: true,
              text: 'Event Type Allocation'
            }
          }
        }}
      />
      
    </div>
  );
};

export default EventTypeDonut;

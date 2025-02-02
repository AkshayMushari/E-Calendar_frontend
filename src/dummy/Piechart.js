import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const Piechart = () => {
  // Example data
  const presentDays = 20; // Number of days present
  const absentDays = 5;   // Number of days absent
  const month = 'October';
  const year = 2023;

  // Data for the pie chart
  const data = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [presentDays, absentDays],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Employee Attendance for ${month} ${year}`,
      },
    },
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Employee Attendance Overview</h1>
      <div style={{ width: '400px', height: '400px', margin: 'auto' }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default Piechart;
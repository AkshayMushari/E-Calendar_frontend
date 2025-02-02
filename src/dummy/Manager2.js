import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Manager2 = () => {
  // Example data: List of employees and their attendance
  const employees = [
    { name: 'John Doe', presentDays: 22, absentDays: 3 },
    { name: 'Jane Smith', presentDays: 20, absentDays: 5 },
    { name: 'Alice Johnson', presentDays: 18, absentDays: 7 },
    { name: 'Bob Brown', presentDays: 23, absentDays: 2 },
    { name: 'Charlie Davis', presentDays: 19, absentDays: 6 },
  ];

  // Extract employee names, present days, and absent days
  const employeeNames = employees.map((emp) => emp.name);
  const presentDays = employees.map((emp) => emp.presentDays);
  const absentDays = employees.map((emp) => emp.absentDays);

  // Data for the bar chart
  const data = {
    labels: employeeNames,
    datasets: [
      {
        label: 'Present Days',
        data: presentDays,
        backgroundColor: 'rgba(9, 230, 49, 0.6)',
        borderColor: 'rgb(15, 202, 77)',
        borderWidth: 1,
      },
      {
        label: 'Absent Days',
        data: absentDays,
        backgroundColor: 'rgba(197, 12, 52, 0.6)',
        borderColor: 'rgb(193, 17, 55)',
        borderWidth: 1,
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
        text: 'Employee Attendance Overview',
      },
    },
    scales: {
      x: {
        stacked: true, // Stack bars for each employee
      },
      y: {
        stacked: true, // Stack bars for each employee
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Manager Dashboard</h1>
      <h2>Employee Attendance</h2>
      <div style={{ width: '800px', margin: 'auto' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default Manager2;
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OverallAttendanceBarGraph = () => {
  const [employees, setEmployees] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/employees')
      .then(res => {
        setEmployees(res.data);
        setSelectedEmployees(res.data.map(emp => emp.name));
      })
      .catch(err => console.error('Error fetching employees:', err));
    
    axios.get('http://localhost:8080/schedules')
      .then(res => setSchedules(res.data))
      .catch(err => console.error('Error fetching schedules:', err));
  }, []);

  const handleCheckboxChange = (name) => {
    setSelectedEmployees(prev => 
      prev.includes(name) ? prev.filter(emp => emp !== name) : [...prev, name]
    );
  };

  const getEmployeeSchedule = (id) => schedules.filter(sch => sch.employee.id === id);

  const getBarChartData = () => {
    const filteredEmployees = employees.filter(emp => selectedEmployees.includes(emp.name));
    return {
      labels: filteredEmployees.map(emp => emp.name),
      datasets: [
        {
          label: 'Present Days',
          data: filteredEmployees.map(emp => getEmployeeSchedule(emp.id).filter(sch => !sch.leave).length),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1,
        },
        {
          label: 'Absent Days',
          data: filteredEmployees.map(emp => getEmployeeSchedule(emp.id).filter(sch => sch.leave).length),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Overall Attendance Overview</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', height: 'calc(100vh - 100px)' }}>
        <div style={{ width: '25%', backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflowY: 'auto' }}>
          <h3 style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '15px' }}>Select Employees:</h3>
          {employees.map(emp => (
            <label key={emp.name} style={{ display: 'block', margin: '10px 0' }}>
              <input
                type="checkbox"
                checked={selectedEmployees.includes(emp.name)}
                onChange={() => handleCheckboxChange(emp.name)}
              />
              <span style={{ marginLeft: '10px' }}>{emp.name}</span>
            </label>
          ))}
        </div>
        <div style={{ width: '72%', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
          <Bar 
            data={getBarChartData()} 
            options={{ 
              responsive: true,
              maintainAspectRatio: false,
              plugins: { 
                legend: { position: 'top' },
                title: {
                  display: true,
                  text: 'Employee Attendance Overview',
                  font: { size: 18 }
                }
              },
              scales: {
                x: {
                  ticks: {
                    font: { size: 14 }
                  }
                },
                y: {
                  ticks: {
                    font: { size: 14 }
                  }
                }
              }
            }} 
            style={{ flexGrow: 1 }}
          />
        </div>
      </div>
    </div>
  );
};

export default OverallAttendanceBarGraph;

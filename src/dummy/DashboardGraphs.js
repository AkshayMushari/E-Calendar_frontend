import React, { useState, useEffect } from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const DashboardGraphs = () => {
  const [schedules, setSchedules] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState({ present: 0, absent: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [schedulesRes, todayRes] = await Promise.all([
          axios.get('http://localhost:8080/schedules'),
          axios.get('http://localhost:8080/schedules/today')
        ]);
        setSchedules(schedulesRes.data);
        setTodayAttendance(todayRes.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getBarChartData = () => {
    const dates = [...new Set(schedules.map(s => s.date))].sort();
    const employees = [...new Set(schedules.map(s => s.employee.name))];
    
    return {
      labels: dates,
      datasets: employees.map((emp, index) => ({
        label: emp,
        data: dates.map(date => 
          schedules.some(s => s.date === date && s.employee.name === emp && !s.leave) ? 1 : 0
        ),
        backgroundColor: `hsl(${index * 30}, 70%, 60%)`,
      }))
    };
  };

  const getPieChartData = () => ({
    labels: ['Present', 'Absent'],
    datasets: [{
      data: [todayAttendance.present, todayAttendance.absent],
      backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
    }]
  });

  const getDonutChartData = () => {
    const eventTypes = [...new Set(schedules.map(s => s.eventType))];
    const eventCounts = eventTypes.reduce((acc, type) => {
      acc[type] = schedules.filter(s => s.eventType === type).length;
      return acc;
    }, {});

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
    <div style={{ padding: '20px' }}>
      <h1>Attendance Dashboard</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>All Days Attendance</h2>
        <Bar 
          data={getBarChartData()} 
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                max: 1,
                ticks: {
                  stepSize: 1
                }
              }
            },
            plugins: {
              legend: { position: 'top' },
              title: {
                display: true,
                text: 'Employee Attendance Over Time'
              }
            }
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <div style={{ width: '45%' }}>
          <h2>Today's Overall Attendance</h2>
          <Pie 
            data={getPieChartData()}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom' },
                title: {
                  display: true,
                  text: 'Today\'s Attendance'
                }
              }
            }}
          />
        </div>
        <div style={{ width: '45%' }}>
          <h2>Event Type Distribution</h2>
          <Doughnut 
            data={getDonutChartData()}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom' },
                title: {
                  display: true,
                  text: 'Event Type Allocation'
                }
              }
            }}
          />
        </div>
      </div>
      <hr>
      </hr>
    </div>
  );
};

export default DashboardGraphs;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GaugeChart from 'react-gauge-chart';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './EmployeeDetails.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const EmployeeDetails = () => {
  const [employee, setEmployee] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [timeDivision, setTimeDivision] = useState(null);

  const loggedInUser = JSON.parse(localStorage.getItem('user'));

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateAttendancePercentage = (schedules) => {
    if (!schedules || schedules.length === 0) return 0;
    const totalDays = schedules.length;
    const presentDays = schedules.filter(schedule => !schedule.leave).length;
    return presentDays / totalDays;
  };

  const calculateTimeDivision = (schedules) => {
    const division = {
      work: 0,
      meetings: 0,
      breaks: 0,
      other: 0
    };

    schedules.forEach(schedule => {
      switch (schedule.scheduleOfDay?.toLowerCase()) {
        case 'work':
          division.work++;
          break;
        case 'meeting':
          division.meetings++;
          break;
        case 'break':
          division.breaks++;
          break;
        default:
          division.other++;
      }
    });

    return {
      labels: ['Work', 'Meetings', 'Breaks', 'Other'],
      datasets: [{
        data: Object.values(division),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }]
    };
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          generateLabels: (chart) => {
            const data = chart.data;
            const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
            
            return data.labels.map((label, index) => {
              const value = data.datasets[0].data[index];
              const percentage = ((value / total) * 100).toFixed(1);
              return {
                text: `${label}: ${percentage}%`,
                fillStyle: data.datasets[0].backgroundColor[index],
                hidden: false,
                index: index
              };
            });
          },
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${percentage}%`;
          }
        }
      }
    },
    cutout: '60%',
    responsive: true,
    maintainAspectRatio: false
  };

  useEffect(() => {
    if (!loggedInUser?.id) return;

    axios.get(`http://localhost:8080/employees/${loggedInUser.id}`)
      .then(res => setEmployee(res.data))
      .catch(err => console.error("Error fetching employee details:", err));

    axios.get(`http://localhost:8080/schedules/employee/${loggedInUser.id}`)
      .then(res => {
        const allSchedules = res.data;
        setSchedules(allSchedules);
        
        const today = new Date().toISOString().split('T')[0];
        const todaySchedules = allSchedules.filter(schedule => 
          schedule.date?.startsWith(today)
        );
        
        const upcomingSchedules = allSchedules.filter(schedule => 
          schedule.date && new Date(schedule.date) > new Date(today)
        );

        setTodaySchedule(todaySchedules);
        setUpcomingSchedules(upcomingSchedules);
        setAttendancePercentage(calculateAttendancePercentage(allSchedules));
        setTimeDivision(calculateTimeDivision(allSchedules));
      })
      .catch(err => console.error("Error fetching employee schedules:", err));
  }, [loggedInUser?.id]);

  if (!loggedInUser) return <div>Please login first</div>;
  if (!employee) return <div>Loading employee data...</div>;

  return (
    <div className="employee-details">
      <h2>Employee Dashboard</h2>
      <div className="employee-info">
        <p><strong>Name:</strong> {employee.name}</p>
        <p><strong>Employee ID:</strong> {employee.id}</p>
        <p><strong>Position:</strong> {employee.position || 'Not specified'}</p>
        <p><strong>Email:</strong> {employee.email}</p>
      </div>

      <div className="charts-container">
        <div className="attendance-chart">
          <h3>Attendance Overview</h3>
          <GaugeChart 
            id="attendance-gauge"
            nrOfLevels={3}
            colors={["#FF5F6D", "#FFC371", "#00C9FF"]}
            percent={attendancePercentage}
            textColor="#000000"
          />
          <p>Attendance: {(attendancePercentage * 100).toFixed(2)}%</p>
        </div>

        <div className="time-division-chart">
          <h3>Time Division</h3>
          {timeDivision && (
            <div style={{ height: '300px' }}>
              <Doughnut data={timeDivision} options={chartOptions} />
            </div>
          )}
        </div>
      </div>

      <div className="schedules-container">
        <div className="today-schedule">
          <h3>Today's Schedule</h3>
          {todaySchedule.length > 0 ? (
            <ul>
              {todaySchedule.map(schedule => (
                <li key={schedule.id}>
                  <p><strong>Event:</strong> {schedule.scheduleOfDay || 'No Event'}</p>
                  <p><strong>Time:</strong> 
                    {schedule.startTime && schedule.endTime 
                      ? `${formatTime(schedule.startTime)} - ${formatTime(schedule.endTime)}` 
                      : 'No Time Specified'}
                  </p>
                  <p><strong>Leave:</strong> {schedule.leave ? 'Yes' : 'No'}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No schedules for today</p>
          )}
        </div>

        <div className="upcoming-schedules">
          <h3>Upcoming Schedules</h3>
          {upcomingSchedules.length > 0 ? (
            <ul>
              {upcomingSchedules.map(schedule => (
                <li key={schedule.id}>
                  <p><strong>Date:</strong> {formatDate(schedule.date)}</p>
                  <p><strong>Event:</strong> {schedule.scheduleOfDay || 'Not specified'}</p>
                  <p><strong>Time:</strong> 
                    {schedule.startTime && schedule.endTime 
                      ? `${formatTime(schedule.startTime)} - ${formatTime(schedule.endTime)}` 
                      : 'Time not specified'}
                  </p>
                  <p><strong>Leave:</strong> {schedule.leave ? 'Yes' : 'No'}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming schedules</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;

import React, { useState, useEffect } from 'react';
import GaugeChart from 'react-gauge-chart';
import axios from 'axios';

const Gauge = ({ employeeId }) => {
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/employee-attendance/${employeeId}`);
        setAttendancePercentage(response.data.attendancePercentage);
        setError(null);
      } catch (err) {
        setError('Failed to fetch attendance data');
        console.error('Error fetching attendance data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (employeeId) {
      fetchAttendanceData();
    }
  }, [employeeId]);

  const getColor = (percentage) => {
    if (percentage < 0.6) return "#FF0000";  // Red for low attendance
    if (percentage < 0.8) return "#FFA500";  // Orange for medium attendance
    return "#00FF00";  // Green for high attendance
  };

  if (isLoading) return <div>Loading attendance data...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ width: '300px', margin: '20px auto' }}>
      <h3>Employee Attendance</h3>
      <GaugeChart 
        id={`gauge-chart-${employeeId}`}
        nrOfLevels={3}
        colors={["#FF0000", "#FFA500", "#00FF00"]}
        percent={attendancePercentage / 100}
        arcWidth={0.3}
        textColor={getColor(attendancePercentage / 100)}
        needleColor="#345243"
        needleBaseColor="#345243"
        animDelay={0}
        animateDuration={2000}
      />
      <div style={{ textAlign: 'center', fontSize: '1.2em', fontWeight: 'bold' }}>
        {attendancePercentage}%
      </div>
    </div>
  );
};

export default Gauge;

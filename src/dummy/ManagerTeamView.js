import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManagerTeamView = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/manager/1/team');
        setEmployees(response.data);
        
        // Initialize attendance state
        const initialAttendance = {};
        response.data.forEach(emp => {
          initialAttendance[emp.id] = emp.attendanceStatus || 'present'; // Default to present
        });
        setAttendance(initialAttendance);
        
      } catch (err) {
        setError('Failed to fetch team data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  const handleAttendanceChange = (employeeId, status) => {
    setAttendance(prev => ({
      ...prev,
      [employeeId]: status
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/api/attendance', {
        managerId: 1,
        attendanceData: attendance
      });
      alert('Attendance submitted successfully!');
    } catch (err) {
      console.error('Error submitting attendance:', err);
      alert('Failed to submit attendance');
    }
  };

  if (loading) return <div>Loading team data...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ 
        textAlign: 'center', 
        color: '#2c3e50',
        marginBottom: '30px',
        borderBottom: '2px solid #3498db',
        paddingBottom: '10px'
      }}>
        Team Members under Manager ID 1
      </h2>

      <div style={{ 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '20px'
      }}>
        {employees.map(employee => (
          <div key={employee.id} style={{ 
            padding: '15px',
            marginBottom: '15px',
            backgroundColor: 'white',
            borderRadius: '6px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, color: '#2c3e50' }}>{employee.name}</h3>
                <p style={{ margin: '5px 0', color: '#7f8c8d' }}>{employee.role}</p>
                <p style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9em' }}>
                  {employee.email} | {employee.department}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={attendance[employee.id] === 'present'}
                    onChange={() => handleAttendanceChange(employee.id, 'present')}
                    style={{ 
                      width: '18px',
                      height: '18px',
                      marginRight: '8px',
                      accentColor: '#27ae60'
                    }}
                  />
                  <span style={{ color: '#27ae60', fontWeight: '500' }}>Present</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={attendance[employee.id] === 'absent'}
                    onChange={() => handleAttendanceChange(employee.id, 'absent')}
                    style={{ 
                      width: '18px',
                      height: '18px',
                      marginRight: '8px',
                      accentColor: '#e74c3c'
                    }}
                  />
                  <span style={{ color: '#e74c3c', fontWeight: '500' }}>Absent</span>
                </label>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={handleSubmit}
          style={{
            marginTop: '25px',
            padding: '12px 30px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1em',
            fontWeight: 'bold',
            transition: 'background-color 0.2s',
            ':hover': {
              backgroundColor: '#2980b9'
            }
          }}
        >
          Submit Attendance
        </button>
      </div>
    </div>
  );
};

export default ManagerTeamView;

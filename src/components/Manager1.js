import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './ManagerDashboard.css'; // Import CSS for styling
import EmployeeEventDonut from '../dummy/EmployeeEventDonut';

const ManagerDashboard = () => {
    const [events, setEvents] = useState([
        { title: 'Meeting with Team', date: '2025-01-30' },
        { title: 'Project Deadline', date: '2025-02-05' },
        { title: 'Daily Standup', date: new Date().toISOString().split('T')[0] }, // Today's event
    ]);
    
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventDate, setNewEventDate] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility

    const handleAddEvent = () => {
        if (newEventTitle && newEventDate) {
            setEvents([...events, { title: newEventTitle, date: newEventDate }]);
            setNewEventTitle('');
            setNewEventDate('');
        }
    };

    // Sample data for team members and attendance insights
    const teamMembers = [
        { name: 'Alice Johnson', attendance: 8 }, // Attendance for today
        { name: 'Bob Smith', attendance: 7 },
        { name: 'Charlie Brown', attendance: 6 }
    ];

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Filter today's events
    const todaysEvents = events.filter(event => event.date === today);

    return (
        <div className="dashboard-container">
            <div className={`sidebar left-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <button className="toggle-button" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? 'Hide Team Members' : 'Show Team Members'}
                </button>
                {isSidebarOpen && (
                    <>
                        <h2>Team Members</h2>
                        <ul>
                            {teamMembers.map((member, index) => (
                                <li key={index}>
                                    {member.name}
                                    <div className="attendance-insights">
                                        <span>Attendance Today: {member.attendance}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <h3>Attendance Graph</h3>
                        <div className="attendance-graph">
                            <p>Graph of Attendance for Today</p>
                        </div>
                    </>
                )}
            </div>

            <div className="main-content">
                <h1>Manager Dashboard</h1>
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    height="auto"
                />
            </div>

            <div className="sidebar right-sidebar">
                <h2>Today's Events</h2>
                <div className="todays-events">
                    {todaysEvents.length > 0 ? (
                        <ul>
                            {todaysEvents.map((event, index) => (
                                <li key={index}>{event.title} - {event.date}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No events for today.</p>
                    )}
                </div>

                <h2>Add Event</h2>
                <div className="event-form">
                    <input 
                        type="text" 
                        placeholder="Event Title" 
                        value={newEventTitle} 
                        onChange={(e) => setNewEventTitle(e.target.value)} 
                    />
                    <input 
                        type="date" 
                        value={newEventDate} 
                        onChange={(e) => setNewEventDate(e.target.value)} 
                    />
                    <button onClick={handleAddEvent}>Add Event</button>
                </div>

                <h3>Upcoming Events</h3>
                <div className="event-list">
                    <ul>
                        {events.map((event, index) => (
                            <li key={index}>{event.title} - {event.date}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <EmployeeEventDonut employeeId={1} />
        </div>
    );
};

export default ManagerDashboard;

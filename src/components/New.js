import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import axios from "axios";
import "./Calendar1.css";
import LogoutButton from "./LogoutButton";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const EventTypeDonut = ({ selectedEmployeeIds, events }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: []
    }]
  });

  useEffect(() => {
    const filteredEvents = selectedEmployeeIds.length > 0
      ? events.filter(event => selectedEmployeeIds.includes(event.resourceId))
      : events;

    const eventTypes = {};
    filteredEvents.forEach(event => {
      const type = event.title;
      eventTypes[type] = (eventTypes[type] || 0) + 1;
    });

    const totalEvents = filteredEvents.length;
    const labels = Object.keys(eventTypes);
    const data = Object.values(eventTypes).map(count => 
      totalEvents > 0 ? ((count / totalEvents) * 100).toFixed(1) : 0
    );
    
    const backgroundColor = labels.map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`);
    const hoverBackgroundColor = backgroundColor.map(color => color + "CC");

    setChartData({
      labels,
      datasets: [{
        data,
        backgroundColor,
        hoverBackgroundColor
      }]
    });
  }, [selectedEmployeeIds, events]);

  return (
    <div className="donut-chart">
    <LogoutButton/>
      <h2>Event Type Distribution</h2>
      <Doughnut 
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right' },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || '';
                  const value = context.parsed || 0;
                  return `${label}: ${value}%`;
                }
              }
            }
          }
        }}
      />
    </div>
  );
};

const NCalendarAndAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
  const [manager, setManager] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    startTime: "",
    endTime: "",
    employeeId: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDateTime = (date, time) => {
    if (!date || !time) return null;
    const [hours, minutes] = time.split(':');
    const dateObj = new Date(date);
    dateObj.setHours(parseInt(hours), parseInt(minutes));
    return dateObj.toISOString();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const loggedInUser = JSON.parse(localStorage.getItem('user'));

        
        const managerResponse = await axios.get(`http://localhost:8080/manager/findemployee/${loggedInUser.id}`);
        setManager(managerResponse.data);

        const teamResponse = await axios.get(`http://localhost:8080/manager/${loggedInUser.id}/team`);
        const managerTeam = teamResponse.data || [];
        setEmployees([managerResponse.data, ...managerTeam]);

        const schedulesResponse = await axios.get("http://localhost:8080/schedules");
        const scheduleData = schedulesResponse.data;

        const transformedEvents = scheduleData
          .filter(schedule => schedule.employee && schedule.employee.id)
          .map(schedule => ({
            id: schedule.id,
            title: schedule.scheduleOfDay || 'Scheduled',
            start: formatDateTime(schedule.date, schedule.startTime),
            end: formatDateTime(schedule.date, schedule.endTime),
            resourceId: schedule.employee.id,
            extendedProps: {
              leave: schedule.leave,
              leaveType: schedule.leaveType,
              employeeName: schedule.employee.name
            },
            backgroundColor: schedule.leave ? '#ff9f89' : '#4CAF50',
            borderColor: schedule.leave ? '#ff7f6e' : '#45a049'
          }));

        setEvents(transformedEvents);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load calendar data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEmployeeClick = (employeeId) => {
    setSelectedEmployeeIds(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime || !newEvent.employeeId) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const startDateTime = new Date(newEvent.startTime);
      const endDateTime = new Date(newEvent.endTime);

      const newEventData = {
        employee: { id: Number(newEvent.employeeId) },
        date: startDateTime.toISOString().split('T')[0],
        startTime: startDateTime.toTimeString().split(' ')[0],
        endTime: endDateTime.toTimeString().split(' ')[0],
        eventType: "MEETING",
        leave: false,
        leaveType: null,
        scheduleOfDay: newEvent.title
      };

      const response = await axios.post(
        "http://localhost:8080/schedules",
        newEventData,
        { headers: { "Content-Type": "application/json" }}
      );

      const newCalendarEvent = {
        id: response.data.id,
        title: response.data.scheduleOfDay,
        start: formatDateTime(response.data.date, response.data.startTime),
        end: formatDateTime(response.data.date, response.data.endTime),
        resourceId: response.data.employee.id,
        backgroundColor: '#4CAF50',
        borderColor: '#45a049'
      };

      setEvents([...events, newCalendarEvent]);
      setNewEvent({ title: "", startTime: "", endTime: "", employeeId: "" });
    } catch (err) {
      console.error("Error adding event:", err);
      alert("Failed to add event. Please try again.");
    }
  };

  const filteredEvents = selectedEmployeeIds.length > 0
    ? events.filter(event => selectedEmployeeIds.includes(event.resourceId))
    : events;

  const resources = employees.map(emp => ({
    id: emp.id,
    title: emp.name
  }));

  const getEmployeeSchedule = (id) => events.filter(event => event.resourceId === id);

  const getBarChartData = () => {
    const filteredEmployees = employees.filter(emp =>
      selectedEmployeeIds.includes(emp.id)
    );

    return {
      labels: filteredEmployees.map(emp => emp.name),
      datasets: [
        {
          label: "Present Days",
          data: filteredEmployees.map(emp =>
            getEmployeeSchedule(emp.id).filter(sch => !sch.extendedProps?.leave).length
          ),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
        {
          label: "Absent Days",
          data: filteredEmployees.map(emp =>
            getEmployeeSchedule(emp.id).filter(sch => sch.extendedProps?.leave).length
          ),
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
      ],
    };
  };

  if (loading) return <div>Loading calendar data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="calendar-container">
      <div className="left-column">
        <div className="event-form">
          <h3>Add Event</h3>
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={handleInputChange}
            className="form-input"
          />
          <input
            type="datetime-local"
            name="startTime"
            value={newEvent.startTime}
            onChange={handleInputChange}
            className="form-input"
          />
          <input
            type="datetime-local"
            name="endTime"
            value={newEvent.endTime}
            onChange={handleInputChange}
            className="form-input"
          />
          <select
            name="employeeId"
            value={newEvent.employeeId}
            onChange={handleInputChange}
            className="form-input"
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name} {emp.id === manager.id ? '(You)' : ''}
              </option>
            ))}
          </select>
          <button onClick={handleAddEvent} className="add-event-btn">
            Add Event
          </button>
        </div>

        <div className="employee-column">
          <h3>Team Members</h3>
          {employees.length > 0 ? (
            employees.map(emp => (
              <div
                key={emp.id}
                className={`employee-box ${selectedEmployeeIds.includes(emp.id) ? "selected" : ""}`}
                onClick={() => handleEmployeeClick(emp.id)}
              >
                {emp.name} {emp.id === manager.id ? '(You)' : ''}
                {selectedEmployeeIds.includes(emp.id) && (
                  <span className="checkmark">✓</span>
                )}
              </div>
            ))
          ) : (
            <p>No team members found</p>
          )}
        </div>
      </div>

      <div className="calendar-view">
        <FullCalendar
          plugins={[resourceTimeGridPlugin, dayGridPlugin, interactionPlugin]}
          initialView="resourceTimeGridWeek"
          events={filteredEvents}
          resources={resources}
          resourceAreaHeaderContent="Team Members"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,resourceTimeGridWeek,resourceTimeGridDay"
          }}
          slotMinTime="09:00:00"
          slotMaxTime="18:00:00"
          allDaySlot={false}
          height="auto"
          eventContent={(eventInfo) => {
            return (
              <div className="fc-event-main-inner">
                <strong>{eventInfo.event.title}</strong>
                <br />
                {new Date(eventInfo.event.start).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
                {" - "}
                {new Date(eventInfo.event.end).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </div>
            );
          }}
        />
      </div>

      <div className="attendance-chart">
        <h2>Team Attendance Overview</h2>
        <div className="chart-container">
          <Bar
            data={getBarChartData()}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    font: {
                      size: 14
                    }
                  }
                },
                title: {
                  display: true,
                  text: 'Attendance Statistics (Based on selected team members)',
                  font: {
                    size: 18
                  }
                }
              },
              scales: {
                x: {
                  ticks: {
                    font: {
                      size: 12
                    }
                  }
                },
                y: {
                  ticks: {
                    font: {
                      size: 12
                    }
                  }
                }
              }
            }}
          />
        </div>
      </div>
      
      <EventTypeDonut selectedEmployeeIds={selectedEmployeeIds} events={events} />
    </div>
  );
};

export default NCalendarAndAttendance;

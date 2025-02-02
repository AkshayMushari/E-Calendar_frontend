import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import "./Calendar.css";
import EventTypeDonut from "../components/EventTypeDonut";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CalendarAndAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: "", startTime: "", endTime: "", employeeId: "" });
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/manager/1/team")
      .then(res => {
        const managerTeam = res.data || [];
        setEmployees(managerTeam);
        setSelectedEmployees(managerTeam.map(emp => emp.name));
      })
      .catch(err => console.error("Error fetching manager team:", err));

    axios.get("http://localhost:8080/schedules")
      .then(res => {
        const validEvents = res.data
          .map(event => ({
            id: event.id,
            title: event.scheduleOfDay,
            start: `${event.date}T${event.startTime}`,
            end: `${event.date}T${event.endTime}`,
            resourceId: event.employee?.id || null,
            leave: event.leave
          }))
          .filter(event => event.resourceId !== null);
        setEvents(validEvents);
      })
      .catch(err => console.error("Error fetching schedules:", err));
  }, []);

  const handleEmployeeClick = (employeeId) => {
    setSelectedEmployee(employeeId === selectedEmployee ? null : employeeId);
  };

  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.startTime && newEvent.endTime && newEvent.employeeId) {
      const newEventData = {
        employee: { id: Number(newEvent.employeeId) },
        date: new Date(newEvent.startTime).toISOString().split("T")[0],
        startTime: new Date(newEvent.startTime).toLocaleTimeString("en-GB"),
        endTime: new Date(newEvent.endTime).toLocaleTimeString("en-GB"),
        eventType: "MEETING",
        leave: false,
        leaveType: null,
        scheduleOfDay: newEvent.title,
      };

      axios.post("http://localhost:8080/schedules", newEventData, { headers: { "Content-Type": "application/json" } })
        .then(response => {
          setEvents([...events, {
            ...response.data,
            start: `${response.data.date}T${response.data.startTime}`,
            end: `${response.data.date}T${response.data.endTime}`,
            resourceId: response.data.employee.id
          }]);
          setNewEvent({ title: "", startTime: "", endTime: "", employeeId: "" });
        })
        .catch(error => console.error("Error adding event:", error));
    }
  };

  const filteredEvents = selectedEmployee ? 
    events.filter(event => event.resourceId === selectedEmployee) : 
    events;

  const resources = employees.map(emp => ({ id: emp.id, title: emp.name }));

  const handleCheckboxChange = (name) => {
    setSelectedEmployees(prev => prev.includes(name) ? 
      prev.filter(emp => emp !== name) : 
      [...prev, name]
    );
  };

  const getEmployeeSchedule = (id) => events.filter(event => event.resourceId === id);

  const getBarChartData = () => {
    const filteredEmployees = employees.filter(emp => 
      selectedEmployees.includes(emp.name)
    );
    
    return {
      labels: filteredEmployees.map(emp => emp.name),
      datasets: [
        {
          label: "Present Days",
          data: filteredEmployees.map(emp => 
            getEmployeeSchedule(emp.id).filter(sch => !sch.leave).length
          ),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
        {
          label: "Absent Days",
          data: filteredEmployees.map(emp => 
            getEmployeeSchedule(emp.id).filter(sch => sch.leave).length
          ),
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
      ],
    };
  };

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
          />
          <input
            type="datetime-local"
            name="startTime"
            value={newEvent.startTime}
            onChange={handleInputChange}
          />
          <input
            type="datetime-local"
            name="endTime"
            value={newEvent.endTime}
            onChange={handleInputChange}
          />
          <select
            name="employeeId"
            value={newEvent.employeeId}
            onChange={handleInputChange}
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
          <button onClick={handleAddEvent}>Add Event</button>
        </div>

        <div className="employee-column">
          <h3>Team Members (Manager ID 1)</h3>
          {employees.length > 0 ? (
            employees.map(emp => (
              <div
                key={emp.id}
                className={`employee-box ${selectedEmployee === emp.id ? "selected" : ""}`}
                onClick={() => handleEmployeeClick(emp.id)}
              >
                {emp.name}
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
          initialView="dayGridMonth"
          events={filteredEvents}
          resources={resources}
          resourceAreaHeaderContent="Team Members"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,resourceTimeGridWeek,resourceTimeGridDay"
          }}
        />
      </div>

      <div className="attendance-chart" style={{ width: "100%", maxWidth: "400px", height: "250px", padding: "10px" }}>
        <h2>Team Attendance Overview</h2>
        <div className="employee-select">
          {employees.map(emp => (
            <label key={emp.id}>
              <input
                type="checkbox"
                checked={selectedEmployees.includes(emp.name)}
                onChange={() => handleCheckboxChange(emp.name)}
              />
              {emp.name}
            </label>
          ))}
        </div>
        <div style={{ height: "200px" }}>
          <Bar 
            data={getBarChartData()} 
            options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Attendance Statistics'
                }
              }
            }} 
          />
        </div>
      </div>
      <hr></hr>
      <EventTypeDonut />
    </div>
  );
};

export default CalendarAndAttendance;

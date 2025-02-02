import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import "./Calendar.css";

const Calendar = () => {
  const [employees, setEmployees] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: "", startTime: "", endTime: "", employeeId: "" });

  // Fetch Employees under Manager ID 1
  useEffect(() => {
    axios.get("http://localhost:8080/manager/1/team")
      .then((response) => {
        console.log("Fetched Employees:", response.data);
        setEmployees(response.data || []); // Ensure it's an array
      })
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  // Fetch Employee Schedules
  useEffect(() => {
    axios.get("http://localhost:8080/schedules")
      .then((response) => {
        console.log("Raw API Response:", response.data);
        const formattedEvents = response.data.map(event => ({
          id: event.id,
          title: event.scheduleOfDay,
          start: `${event.date}T${event.startTime}`, // Ensure correct format
          end: `${event.date}T${event.endTime}`,
          resourceId: event.employee?.id || null, // Ensure employee exists
        })).filter(event => event.resourceId !== null); // Remove invalid events

        console.log("Formatted Events:", formattedEvents);
        setEvents(formattedEvents);
      })
      .catch((error) => console.error("Error fetching schedules:", error));
  }, []);

  // Handle Employee Selection
  const handleEmployeeClick = (employeeId) => {
    setSelectedEmployee(employeeId === selectedEmployee ? null : employeeId);
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  // Handle Add Event
  const handleAddEvent = () => {
    if (newEvent.title && newEvent.startTime && newEvent.endTime && newEvent.employeeId) {
      const newEventData = {
        employee: { id: Number(newEvent.employeeId) }, // Ensure ID is a number
        date: new Date(newEvent.startTime).toISOString().split("T")[0], // YYYY-MM-DD
        startTime: new Date(newEvent.startTime).toLocaleTimeString("en-GB"), // HH:mm:ss
        endTime: new Date(newEvent.endTime).toLocaleTimeString("en-GB"), // HH:mm:ss
        eventType: "MEETING",
        leave: false,
        leaveType: null,
        scheduleOfDay: newEvent.title
      };

      axios.post("http://localhost:8080/schedules", newEventData, {
        headers: { "Content-Type": "application/json" }
      })
      .then(response => {
        console.log("Event Added:", response.data);
        setEvents([...events, response.data]); // Update state
        setNewEvent({ title: "", startTime: "", endTime: "", employeeId: "" }); // Reset form
      })
      .catch(error => console.error("Error adding event:", error));
    }
  };

  // Filter Events for Selected Employee
  const filteredEvents = selectedEmployee ? events.filter(event => event.resourceId === selectedEmployee) : events;

  // Map Employees to Resources
  const resources = employees.map(emp => ({ id: emp.id, title: emp.name }));

  return (
    <div className="calendar-container">
      {/* Left Sidebar: Event Form & Employee List */}
      <div className="left-column">
        <div className="event-form">
          <h3>Add Event</h3>
          <input type="text" name="title" placeholder="Event Title" value={newEvent.title} onChange={handleInputChange} />
          <input type="datetime-local" name="startTime" value={newEvent.startTime} onChange={handleInputChange} />
          <input type="datetime-local" name="endTime" value={newEvent.endTime} onChange={handleInputChange} />
          <select name="employeeId" value={newEvent.employeeId} onChange={handleInputChange}>
            <option value="">Select Employee</option>
            {employees.length > 0 ? (
              employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))
            ) : (
              <option disabled>No Employees Available</option>
            )}
          </select>
          <button onClick={handleAddEvent}>Add Event</button>
        </div>

        {/* Employee Selection */}
        <div className="employee-column">
          <h3 className="employee-title">Employees</h3>
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
            <p>No employees found.</p>
          )}
        </div>
      </div>

      {/* Calendar View */}
      <div className="calendar-view">
        <FullCalendar
          plugins={[resourceTimeGridPlugin, dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={filteredEvents}
          resources={resources}
          resourceAreaHeaderContent="Employees"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,resourceTimeGridWeek,resourceTimeGridDay",
          }}
        />
      </div>
    </div>
  );
};

export default Calendar;

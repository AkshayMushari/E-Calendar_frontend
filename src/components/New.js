import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import "./Calendar1.css";
import EventTypeDonut from "./EventTypeDonut";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const NCalendarAndAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    startTime: "",
    endTime: "",
    employeeId: ""
  });
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to format date and time for FullCalendar
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
        // Fetch employees
        const teamResponse = await axios.get("http://localhost:8080/manager/1/team");
        const managerTeam = teamResponse.data || [];
        setEmployees(managerTeam);
        setSelectedEmployees(managerTeam.map(emp => emp.name));

        // Fetch schedules
        const schedulesResponse = await axios.get("http://localhost:8080/schedules");
        const scheduleData = schedulesResponse.data;

        // Transform schedules into FullCalendar events
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
    setSelectedEmployee(employeeId === selectedEmployee ? null : employeeId);
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

  const filteredEvents = selectedEmployee
    ? events.filter(event => event.resourceId === selectedEmployee)
    : events;

  const resources = employees.map(emp => ({
    id: emp.id,
    title: emp.name
  }));

  const handleCheckboxChange = (name) => {
    setSelectedEmployees(prev =>
      prev.includes(name)
        ? prev.filter(emp => emp !== name)
        : [...prev, name]
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
                {emp.name}
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
        <div className="employee-select">
          {employees.map(emp => (
            <label key={emp.id} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedEmployees.includes(emp.name)}
                onChange={() => handleCheckboxChange(emp.name)}
              />
              {emp.name}
            </label>
          ))}
        </div>
        <div className="chart-container">
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
      
      <EventTypeDonut />
    </div>
  );
};

export default NCalendarAndAttendance;
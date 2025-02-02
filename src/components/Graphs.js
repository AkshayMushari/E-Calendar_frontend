import React, { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import CanvasJSReact from '@canvasjs/react-charts';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import graphData from './graphData';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Graphs = () => {
  const [selectedEmployees, setSelectedEmployees] = useState(graphData.employees.map(emp => emp.name));
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);

  // Handle checkbox selection for filtering graphs
  const handleCheckboxChange = (name) => {
    setSelectedEmployees((prev) =>
      prev.includes(name) ? prev.filter(emp => emp !== name) : [...prev, name]
    );
  };

  // Show details of a clicked employee
  const handleEmployeeClick = (name) => {
    const employee = graphData.employees.find(emp => emp.name === name);
    setSelectedEmployeeDetails(employee);
  };

  // Filtered Employees Data
  const filteredEmployees = graphData.employees.filter(emp => selectedEmployees.includes(emp.name));

  // Filtered Bar Chart Data
  const getFilteredBarChartData = () => ({
    labels: filteredEmployees.map(emp => emp.name),
    datasets: [
      {
        label: 'Present Days',
        data: filteredEmployees.map(emp => emp.presentDays),
        backgroundColor: 'rgba(9, 230, 49, 0.6)',
        borderColor: 'rgb(15, 202, 77)',
        borderWidth: 1,
      },
      {
        label: 'Absent Days',
        data: filteredEmployees.map(emp => emp.absentDays),
        backgroundColor: 'rgba(197, 12, 52, 0.6)',
        borderColor: 'rgb(193, 17, 55)',
        borderWidth: 1,
      },
    ],
  });

  const getFilteredStackedBarChartData = () => ({
    theme: 'light2',
    title: { text: 'Employee Time Division' },
    animationEnabled: true,
    axisY: { title: 'Percent', suffix: '%' },
    legend: { horizontalAlign: 'center', verticalAlign: 'bottom' },
    toolTip: { shared: true },
    data: [
      { type: 'stackedBar100', showInLegend: true, name: 'Work', color: '#4CAF50', indexLabel: '#percent%', dataPoints: filteredEmployees.map(emp => ({ y: emp.work, label: emp.name })) },
      { type: 'stackedBar100', showInLegend: true, name: 'Meetings', color: '#FF9800', indexLabel: '#percent%', dataPoints: filteredEmployees.map(emp => ({ y: emp.meetings, label: emp.name })) },
      { type: 'stackedBar100', showInLegend: true, name: 'Leaves', color: '#F44336', indexLabel: '#percent%', dataPoints: filteredEmployees.map(emp => ({ y: emp.leaves, label: emp.name })) },
      { type: 'stackedBar100', showInLegend: true, name: 'Other', color: '#9C27B0', indexLabel: '#percent%', dataPoints: filteredEmployees.map(emp => ({ y: emp.other, label: emp.name })) },
    ],
  });

  const getFilteredPieChartData = () => {
    const totalPresent = filteredEmployees.reduce((sum, emp) => sum + emp.presentDays, 0);
    const totalAbsent = filteredEmployees.reduce((sum, emp) => sum + emp.absentDays, 0);

    return {
      labels: ['Present', 'Absent'],
      datasets: [
        {
          data: [totalPresent, totalAbsent],
          backgroundColor: ['#36A2EB', '#FF6384'],
          hoverBackgroundColor: ['#36A2EB', '#FF6384'],
        },
      ],
    };
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Manager Dashboard</h1>

      {/* Employee Selection */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2>Select Employees:</h2>
          {graphData.employees.map(emp => (
            <label key={emp.name} style={{ display: 'block', cursor: 'pointer', marginBottom: '5px' }}>
              <input
                type="checkbox"
                checked={selectedEmployees.includes(emp.name)}
                onChange={() => handleCheckboxChange(emp.name)}
              />{' '}
              <span onClick={() => handleEmployeeClick(emp.name)} style={{ color: 'blue', textDecoration: 'underline' }}>
                {emp.name}
              </span>
            </label>
          ))}
        </div>

        {/* Employee Details Section */}
        {selectedEmployeeDetails && (
          <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', maxWidth: '300px' }}>
            <h2>{selectedEmployeeDetails.name} Details</h2>
            <p><strong>Present Days:</strong> {selectedEmployeeDetails.presentDays}</p>
            <p><strong>Absent Days:</strong> {selectedEmployeeDetails.absentDays}</p>
            <p><strong>Leaves Left:</strong> {selectedEmployeeDetails.leavesLeft}</p>
            <p><strong>Work Hours:</strong> {selectedEmployeeDetails.work} hrs</p>
            <p><strong>Meeting Hours:</strong> {selectedEmployeeDetails.meetings} hrs</p>
            <p><strong>Other Activities:</strong> {selectedEmployeeDetails.other} hrs</p>
          </div>
        )}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <h2>Attendance Overview</h2>
          <Bar data={getFilteredBarChartData()} options={graphData.chartOptions.bar} />
        </div>
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <h2>Time Division</h2>
          <CanvasJSChart options={getFilteredStackedBarChartData()} />
        </div>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2>Monthly Attendance</h2>
          <Pie data={getFilteredPieChartData()} options={graphData.chartOptions.pie} />
        </div>
      </div>
    </div>
  );
};

export default Graphs;

//     borderColor: 'rgb(255, 99, 132)',
//           backgroundColor: 'rgba(255, 99, 132, 0.5)',
//           fill: true,
//         }
//       ]
//     };
//   };

//   const getHeatmapData = () => {
//     const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
//     const weeksData = Array(5).fill().map(() => Array(5).fill(0));

//     schedules.forEach(sch => {
//       const date = new Date(sch.date);
//       const dayIndex = date.getDay() - 1;
//       const weekIndex = Math.floor((date.getDate() - 1) / 7);
//       if (dayIndex >= 0 && dayIndex < 5 && weekIndex < 5) {
//         weeksData[weekIndex][dayIndex] += sch.leave ? 0 : 1;
//       }
//     });

//     return {
//       labels: daysOfWeek,
//       datasets: weeksData.map((week, index) => ({
//         label: `Week ${index + 1}`,
//         data: week,
//         backgroundColor: 'rgba(75, 192, 192, 0.6)',
//         borderColor: 'rgb(75, 192, 192)',
//         borderWidth: 1,
//       }))
//     };
//   };

//   if (isLoading) return <div>Loading data...</div>;
//   if (error) return <div style={{ color: 'red' }}>{error}</div>;

//   return (
//     <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
//       <h1 style={{ textAlign: 'center', color: '#333' }}>Manager Dashboard</h1>
//       <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
//         {currentDate}
//       </p>

//       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
//         <div style={{ width: '30%', backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
//           <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>Select Employees:</h2>
//           {employees.map(emp => (
//             <label key={emp.name} style={{ display: 'block', margin: '10px 0' }}>
//               <input
//                 type="checkbox"
//                 checked={selectedEmployees.includes(emp.name)}
//                 onChange={() => handleCheckboxChange(emp.name)}
//               />
//               <span 
//                 onClick={() => handleEmployeeClick(emp.name)} 
//                 style={{ 
//                   color: '#0066cc', 
//                   cursor: 'pointer', 
//                   marginLeft: '10px',
//                   fontWeight: selectedEmployeeDetails?.name === emp.name ? 'bold' : 'normal'
//                 }}
//               >
//                 {emp.name}
//               </span>
//             </label>
//           ))}
//         </div>

//         {selectedEmployeeDetails && (
//           <div style={{ width: '65%', backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
//             <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>
//               {selectedEmployeeDetails.name} Details
//             </h2>
//             <p><strong>Email:</strong> {selectedEmployeeDetails.email}</p>
//             <p><strong>Role:</strong> {selectedEmployeeDetails.role}</p>
//             <p><strong>Department:</strong> {selectedEmployeeDetails.department}</p>
//           </div>
//         )}
//       </div>

//       <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
//         <div style={{ width: '100%', height: '500px', backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
//           <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>Overall Attendance Overview</h2>
//           <Bar 
//             data={getBarChartData()} 
//             options={{ 
//               responsive: true,
//               maintainAspectRatio: false,
//               plugins: { 
//                 legend: { position: 'top' },
//                 tooltip: {
//                   callbacks: {
//                     label: (context) => {
//                       const label = context.dataset.label || '';
//                       const value = context.raw || 0;
//                       return `${label}: ${value} days`;
//                     }
//                   }
//                 }
//               }
//             }}
//           />
//         </div>

//         <div style={{ width: '48%', height: '400px', backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
//           <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>Today's Attendance</h2>
//           <Pie 
//             data={getPieChartData()}
//             options={{
//               responsive: true,
//               maintainAspectRatio: false,
//               plugins: {
//                 legend: { position: 'right' },
//                 tooltip: {
//                   callbacks: {
//                     label: (context) => {
//                       const label = context.label || '';
//                       const value = context.raw || 0;
//                       const total = context.dataset.data.reduce((a, b) => a + b, 0);
//                       const percentage = ((value * 100) / total).toFixed(1);
//                       return `${label}: ${value} (${percentage}%)`;
//                     }
//                   }
//                 }
//               }
//             }}
//           />
//         </div>

//         <div style={{ width: '48%', height: '400px', backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
//           <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>Attendance Trends</h2>
//           <Line 
//             data={getLineChartData()}
//             options={{
//               responsive: true,
//               maintainAspectRatio: false,
//               plugins: {
//                 legend: { position: 'top' }
//               }
//             }}
//           />
//         </div>

//         <div style={{ width: '100%', height: '500px', backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
//           <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>Weekly Attendance Pattern</h2>
//           <Bar 
//             data={getHeatmapData()} 
//             options={{ 
//               responsive: true,
//               maintainAspectRatio: false,
//               scales: { 
//                 x: { stacked: true }, 
//                 y: { stacked: true } 
//               },
//               plugins: { 
//                 legend: { display: false },
//                 tooltip: {
//                   callbacks: {
//                     title: (context) => `Week ${context[0].datasetIndex + 1}, ${context[0].label}`,
//                     label: (context) => `Attendance: ${context.raw} employees`
//                   }
//                 }
//               }
//             }} 
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Graphs;

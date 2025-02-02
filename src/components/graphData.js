const graphData = {
    employees: [
      { name: 'person1', presentDays: 22, absentDays: 3, work: 500, meetings: 120, leaves: 80, other: 100 },
      { name: 'person2', presentDays: 20, absentDays: 5, work: 400, meetings: 200, leaves: 100, other: 80 },
      { name: 'person3', presentDays: 18, absentDays: 7, work: 450, meetings: 180, leaves: 120, other: 90 },
      { name: 'person4', presentDays: 23, absentDays: 2, work: 480, meetings: 140, leaves: 150, other: 60 },
      { name: 'person5', presentDays: 19, absentDays: 6, work: 420, meetings: 160, leaves: 90, other: 70 },
    ],
  
    getBarChartData() {
      const labels = this.employees.map(emp => emp.name);
      return {
        labels,
        datasets: [
          {
            label: 'Present Days',
            data: this.employees.map(emp => emp.presentDays),
            backgroundColor: 'rgba(9, 230, 49, 0.6)',
            borderColor: 'rgb(15, 202, 77)',
            borderWidth: 1,
          },
          {
            label: 'Absent Days',
            data: this.employees.map(emp => emp.absentDays),
            backgroundColor: 'rgba(197, 12, 52, 0.6)',
            borderColor: 'rgb(193, 17, 55)',
            borderWidth: 1,
          },
        ],
      };
    },
  
    getStackedBarChartData() {
      return {
        theme: 'light2',
        title: { text: 'Employee Time Division' },
        animationEnabled: true,
        axisY: { title: 'Percent', suffix: '%' },
        legend: { horizontalAlign: 'center', verticalAlign: 'bottom' },
        toolTip: { shared: true },
        data: [
          { type: 'stackedBar100', showInLegend: true, name: 'Work', color: '#4CAF50', indexLabel: '#percent%', dataPoints: this.employees.map(emp => ({ y: emp.work, label: emp.name })) },
          { type: 'stackedBar100', showInLegend: true, name: 'Meetings', color: '#FF9800', indexLabel: '#percent%', dataPoints: this.employees.map(emp => ({ y: emp.meetings, label: emp.name })) },
          { type: 'stackedBar100', showInLegend: true, name: 'Leaves', color: '#F44336', indexLabel: '#percent%', dataPoints: this.employees.map(emp => ({ y: emp.leaves, label: emp.name })) },
          { type: 'stackedBar100', showInLegend: true, name: 'Other', color: '#9C27B0', indexLabel: '#percent%', dataPoints: this.employees.map(emp => ({ y: emp.other, label: emp.name })) },
        ],
      };
    },
  
    getPieChartData() {
      const totalPresent = this.employees.reduce((sum, emp) => sum + emp.presentDays, 0);
      const totalAbsent = this.employees.reduce((sum, emp) => sum + emp.absentDays, 0);
  
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
    },
  
    chartOptions: {
      bar: {
        responsive: true,
        plugins: { legend: { position: 'top' }, title: { display: true, text: 'Employee Attendance Overview' } },
        scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } },
      },
      pie: {
        responsive: true,
        plugins: { legend: { position: 'top' }, title: { display: true, text: 'Employee Attendance for October 2023' } },
      },
    },
  };
  
  export default graphData;
  
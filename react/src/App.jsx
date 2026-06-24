import React, { useState, useMemo } from 'react';

const INITIAL_BATCHES = ['Batch A (React Frontend)', 'Batch B (Node Backend)', 'Batch C (Data Science)'];

const INITIAL_STUDENTS = [
  { id: 1, name: 'Alex Johnson', batch: 'Batch A (React Frontend)' },
  { id: 2, name: 'Emma Watson', batch: 'Batch A (React Frontend)' },
  { id: 3, name: 'Liam Neeson', batch: 'Batch A (React Frontend)' },
  { id: 4, name: 'Sophia Loren', batch: 'Batch B (Node Backend)' },
  { id: 5, name: 'Michael Jordan', batch: 'Batch B (Node Backend)' },
  { id: 6, name: 'Diana Prince', batch: 'Batch C (Data Science)' },
];

const INITIAL_ATTENDANCE = {
  '2026-06-22': { 1: 'Present', 2: 'Present', 3: 'Absent', 4: 'Present', 5: 'Absent', 6: 'Present' },
  '2026-06-21': { 1: 'Present', 2: 'Present', 3: 'Present', 4: 'Present', 5: 'Present', 6: 'Absent' },
};

export default function App() {
  const [selectedBatch, setSelectedBatch] = useState(INITIAL_BATCHES[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState(INITIAL_ATTENDANCE);

  // Filter students based on batch selection
  const filteredStudents = useMemo(() => {
    return INITIAL_STUDENTS.filter(student => student.batch === selectedBatch);
  }, [selectedBatch]);

  // Dynamic calculations for historic batch attendance rate
  const batchMetrics = useMemo(() => {
    let totalPossibleSlots = 0;
    let totalPresentSlots = 0;
    const allDates = Object.keys(attendance);

    filteredStudents.forEach(student => {
      allDates.forEach(date => {
        const status = attendance[date]?.[student.id];
        if (status) {
          totalPossibleSlots++;
          if (status === 'Present') totalPresentSlots++;
        }
      });
    });

    const percentage = totalPossibleSlots > 0 
      ? Math.round((totalPresentSlots / totalPossibleSlots) * 100) 
      : 0;

    return { percentage };
  }, [filteredStudents, attendance]);

  const toggleAttendance = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [selectedDate]: {
        ...(prev[selectedDate] || {}),
        [studentId]: status
      }
    }));
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">2. Trainer Session Attendance Dashboard</h1>
        <p className="dashboard-subtitle">Track daily student attendance across multiple live training batches.</p>
      </header>

      <div className="filter-bar">
        <div className="form-group">
          <label className="filter-label">Select Batch</label>
          <select 
            value={selectedBatch} 
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="filter-select"
          >
            {INITIAL_BATCHES.map(batch => (
              <option key={batch} value={batch}>{batch}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="filter-label">Select Date</label>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            className="filter-date"
          />
        </div>
      </div>

      <div className="metrics-card">
        <div className="metrics-info">
          <h3 className="metrics-heading">Batch Attendance Summary</h3>
          <p className="metrics-subheading">Overall dynamic percentage index recorded across all saved logs.</p>
        </div>
        <div className="percentage-badge">
          <span className="percentage-num">{batchMetrics.percentage}%</span>
          <span className="percentage-lbl">Attendance</span>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Assigned Batch</th>
              <th className="text-center">Status ({selectedDate})</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => {
              const currentStatus = attendance[selectedDate]?.[student.id] || 'Not Marked';
              
              return (
                <tr key={student.id}>
                  <td className="student-name">{student.name}</td>
                  <td className="student-batch">{student.batch}</td>
                  <td className="text-center">
                    <div className="btn-group">
                      <button 
                        onClick={() => toggleAttendance(student.id, 'Present')}
                        className={`status-btn present-btn ${currentStatus === 'Present' ? 'active' : 'inactive'}`}
                      >
                        Present
                      </button>
                      <button 
                        onClick={() => toggleAttendance(student.id, 'Absent')}
                        className={`status-btn absent-btn ${currentStatus === 'Absent' ? 'active' : 'inactive'}`}
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredStudents.length === 0 && (
          <div className="no-data">No student registration parameters match this batch sequence.</div>
        )}
      </div>
    </div>
  );
}
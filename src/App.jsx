import './App.css'

const student = {
  id: '22-47752-2',
  cgpa: 0.00,
  semester: 'Spring',
  credit: 14,
  courses: [
    'Advanced web technology',
    'Management Information systems',
    'Computer Networks',
    'Engineering Ethics',
    'Data science',
  ],
}

function App() {
  return (
    <div className="app">
      <header className="header">
        <p className="eyebrow">Lab 01</p>
        <h1>Student Dashboard</h1>
        <p className="subtitle">Simple UI with props and basic styling.</p>
      </header>

      <section className="cards">
        <InfoCard title="Student ID" value={student.id} />
        <InfoCard title="CGPA" value={student.cgpa.toFixed(2)} />
      </section>

      <section className="course-section">
        <h2>Courses This Semester</h2>
        <div className="course-meta">
          <span>Semester: {student.semester}</span>
          <span>Credit: {student.credit}</span>
        </div>
        <ul className="course-list">
          {student.courses.map((course) => (
            <li key={course}>{course}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function InfoCard({ title, value }) {
  return (
    <article className="info-card">
      <p className="label">{title}</p>
      <p className="value">{value}</p>
    </article>
  )
}

export default App

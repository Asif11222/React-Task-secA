import { useEffect, useMemo, useState } from 'react'
import './App.css'

const defaultStudent = {
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
  const [student, setStudent] = useState(() => {
    const saved = localStorage.getItem('student-dashboard')
    return saved ? JSON.parse(saved) : defaultStudent
  })
  const [newCourse, setNewCourse] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    document.title = `Student ${student.id} | Dashboard`
    localStorage.setItem('student-dashboard', JSON.stringify(student))
  }, [student])

  const filteredCourses = useMemo(() => {
    return student.courses.filter((course) =>
      course.toLowerCase().includes(filter.trim().toLowerCase()),
    )
  }, [student.courses, filter])

  const handleFieldChange = (event) => {
    const { name, value } = event.target
    setStudent((prev) => ({
      ...prev,
      [name]: name === 'cgpa' || name === 'credit' ? Number(value) : value,
    }))
  }

  const handleAddCourse = (event) => {
    event.preventDefault()
    const trimmed = newCourse.trim()
    if (!trimmed || student.courses.includes(trimmed)) {
      return
    }
    setStudent((prev) => ({
      ...prev,
      courses: [...prev.courses, trimmed],
    }))
    setNewCourse('')
  }

  const handleRemoveCourse = (course) => {
    setStudent((prev) => ({
      ...prev,
      courses: prev.courses.filter((item) => item !== course),
    }))
  }

  const handleReset = () => {
    setStudent(defaultStudent)
    setNewCourse('')
    setFilter('')
  }

  return (
    <div className="app">
      <header className="header">
        <p className="eyebrow">Lab 02</p>
        <h1>Student Dashboard</h1>
        <p className="subtitle">State, effects, and interactivity.</p>
      </header>

      <section className="cards">
        <InfoCard title="Student ID" value={student.id} />
        <InfoCard title="CGPA" value={student.cgpa.toFixed(2)} />
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Student Info</h2>
          <button className="ghost" type="button" onClick={handleReset}>
            Reset
          </button>
        </div>
        <form className="form-grid">
          <label>
            Student ID
            <input
              name="id"
              value={student.id}
              onChange={handleFieldChange}
              placeholder="22-47752-2"
            />
          </label>
          <label>
            CGPA
            <input
              name="cgpa"
              type="number"
              step="0.01"
              value={student.cgpa}
              onChange={handleFieldChange}
            />
          </label>
          <label>
            Semester
            <input
              name="semester"
              value={student.semester}
              onChange={handleFieldChange}
            />
          </label>
          <label>
            Credit
            <input
              name="credit"
              type="number"
              value={student.credit}
              onChange={handleFieldChange}
            />
          </label>
        </form>
      </section>

      <section className="course-section">
        <div className="panel-header">
          <h2>Courses This Semester</h2>
          <span className="pill">{filteredCourses.length} courses</span>
        </div>
        <div className="course-meta">
          <span>Semester: {student.semester}</span>
          <span>Credit: {student.credit}</span>
        </div>
        <div className="course-actions">
          <input
            placeholder="Filter courses"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
          <form className="course-form" onSubmit={handleAddCourse}>
            <input
              placeholder="Add course"
              value={newCourse}
              onChange={(event) => setNewCourse(event.target.value)}
            />
            <button type="submit">Add</button>
          </form>
        </div>
        <ul className="course-list">
          {filteredCourses.map((course) => (
            <li key={course}>
              <span>{course}</span>
              <button type="button" onClick={() => handleRemoveCourse(course)}>
                Remove
              </button>
            </li>
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

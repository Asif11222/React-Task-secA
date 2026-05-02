import { useContext, useMemo, useState } from 'react'
import './App.css'
import { StudentContext } from './StudentContext.jsx'

function App() {
  const {
    students,
    search,
    setSearch,
    favorites,
    toggleFavorite,
    sortKey,
    setSortKey,
    sortDir,
    setSortDir,
    theme,
    setTheme,
    addStudent,
  } = useContext(StudentContext)
  const [form, setForm] = useState({
    name: '',
    id: '',
    major: '',
    gpa: '',
    courses: '',
  })
  const [errors, setErrors] = useState({})

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase()
    const matchesQuery = (student) => {
      if (!query) return true
      return (
        student.name.toLowerCase().includes(query) ||
        student.id.toLowerCase().includes(query) ||
        student.major.toLowerCase().includes(query)
      )
    }

    const sorted = [...students].filter(matchesQuery).sort((a, b) => {
      const valueA = a[sortKey]
      const valueB = b[sortKey]
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortDir === 'asc' ? valueA - valueB : valueB - valueA
      }
      const textA = String(valueA).toLowerCase()
      const textB = String(valueB).toLowerCase()
      if (textA === textB) return 0
      const order = textA > textB ? 1 : -1
      return sortDir === 'asc' ? order : order * -1
    })

    return sorted
  }, [students, search, sortKey, sortDir])

  const stats = useMemo(() => {
    const total = students.length
    const favoriteCount = favorites.length
    const averageGpa =
      total === 0
        ? 0
        : students.reduce((sum, student) => sum + student.gpa, 0) / total

    return {
      total,
      favoriteCount,
      averageGpa,
    }
  }, [students, favorites])

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const nextErrors = {}
    const trimmedName = form.name.trim()
    const trimmedMajor = form.major.trim()
    const trimmedId = form.id.trim()
    const gpaValue = Number(form.gpa)

    if (!trimmedName) {
      nextErrors.name = 'Name is required.'
    }

    if (!trimmedMajor) {
      nextErrors.major = 'Major is required.'
    }

    if (!trimmedId) {
      nextErrors.id = 'ID is required.'
    } else if (!/^\d+$/.test(trimmedId)) {
      nextErrors.id = 'ID must be numeric.'
    } else if (students.some((student) => student.id === trimmedId)) {
      nextErrors.id = 'ID must be unique.'
    }

    if (form.gpa === '') {
      nextErrors.gpa = 'GPA is required.'
    } else if (Number.isNaN(gpaValue) || gpaValue < 0 || gpaValue > 4) {
      nextErrors.gpa = 'GPA must be between 0 and 4.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleAddStudent = (event) => {
    event.preventDefault()
    if (!validateForm()) return

    const courses = form.courses
      .split(',')
      .map((course) => course.trim())
      .filter(Boolean)

    addStudent({
      id: form.id.trim(),
      name: form.name.trim(),
      major: form.major.trim(),
      gpa: Number(form.gpa),
      courses,
    })

    setForm({ name: '', id: '', major: '', gpa: '', courses: '' })
    setErrors({})
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="eyebrow">Lab 03</p>
          <h1>Student Command Center</h1>
          <p className="subtitle">Context-driven directory with live form validation.</p>
        </div>
        <button
          className="theme-toggle"
          type="button"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
        </button>
      </header>

      <section className="cards">
        <InfoCard title="Total Students" value={stats.total} />
        <InfoCard title="Favorites" value={stats.favoriteCount} />
        <InfoCard title="Average GPA" value={stats.averageGpa.toFixed(2)} />
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Directory Controls</h2>
          <span className="pill">{filteredStudents.length} results</span>
        </div>
        <div className="control-grid">
          <label>
            Search students
            <input
              name="search"
              placeholder="Search by name, major, or ID"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <label>
            Sort by
            <select value={sortKey} onChange={(event) => setSortKey(event.target.value)}>
              <option value="name">Name</option>
              <option value="gpa">GPA</option>
              <option value="major">Major</option>
              <option value="id">ID</option>
            </select>
          </label>
          <label>
            Direction
            <select value={sortDir} onChange={(event) => setSortDir(event.target.value)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Add Student</h2>
          <span className="pill soft">Validation active</span>
        </div>
        <form className="form-grid" onSubmit={handleAddStudent}>
          <label className={errors.name ? 'has-error' : ''}>
            Name
            <input
              name="name"
              value={form.name}
              onChange={handleFormChange}
              placeholder="Full name"
            />
            {errors.name ? <span className="error">{errors.name}</span> : null}
          </label>
          <label className={errors.id ? 'has-error' : ''}>
            ID
            <input
              name="id"
              value={form.id}
              onChange={handleFormChange}
              placeholder="Numeric ID"
            />
            {errors.id ? <span className="error">{errors.id}</span> : null}
          </label>
          <label className={errors.major ? 'has-error' : ''}>
            Major
            <input
              name="major"
              value={form.major}
              onChange={handleFormChange}
              placeholder="Major or program"
            />
            {errors.major ? <span className="error">{errors.major}</span> : null}
          </label>
          <label className={errors.gpa ? 'has-error' : ''}>
            GPA
            <input
              name="gpa"
              type="number"
              step="0.01"
              min="0"
              max="4"
              value={form.gpa}
              onChange={handleFormChange}
              placeholder="0 - 4"
            />
            {errors.gpa ? <span className="error">{errors.gpa}</span> : null}
          </label>
          <label>
            Courses
            <input
              name="courses"
              value={form.courses}
              onChange={handleFormChange}
              placeholder="Comma-separated list"
            />
            <span className="helper">Example: Web Apps, AI, Databases</span>
          </label>
          <div className="form-actions">
            <button className="primary" type="submit">
              Add Student
            </button>
          </div>
        </form>
      </section>

      <section className="directory">
        {filteredStudents.map((student) => (
          <article key={student.id} className="student-card">
            <div className="student-header">
              <div>
                <p className="label">{student.major}</p>
                <h3>{student.name}</h3>
                <p className="meta">ID {student.id}</p>
              </div>
              <button
                className={favorites.includes(student.id) ? 'favorite active' : 'favorite'}
                type="button"
                onClick={() => toggleFavorite(student.id)}
              >
                {favorites.includes(student.id) ? 'Favorited' : 'Favorite'}
              </button>
            </div>
            <div className="student-stats">
              <span>GPA {student.gpa.toFixed(2)}</span>
              <span>{student.courses.length} courses</span>
            </div>
            <div className="course-tags">
              {student.courses.map((course) => (
                <span key={`${student.id}-${course}`} className="tag">
                  {course}
                </span>
              ))}
            </div>
          </article>
        ))}
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

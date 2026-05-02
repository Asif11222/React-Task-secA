import { createContext, useEffect, useMemo, useState } from 'react'

const StudentContext = createContext(null)

const defaultStudents = [
  {
    id: '1001',
    name: 'Anika Rahman',
    major: 'Computer Science',
    gpa: 3.78,
    courses: ['Advanced Web', 'Data Structures', 'Networks'],
  },
  {
    id: '1002',
    name: 'Jared Kim',
    major: 'Information Systems',
    gpa: 3.42,
    courses: ['UX Design', 'Project Management', 'Databases'],
  },
  {
    id: '1003',
    name: 'Maya Chen',
    major: 'Software Engineering',
    gpa: 3.91,
    courses: ['Cloud Computing', 'Security', 'AI Fundamentals'],
  },
]

const defaultState = {
  students: defaultStudents,
  search: '',
  favorites: [],
  sortKey: 'name',
  sortDir: 'asc',
  theme: 'light',
}

function StudentProvider({ children }) {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('lab03-students')
    return saved ? JSON.parse(saved) : defaultState.students
  })
  const [search, setSearch] = useState(defaultState.search)
  const [favorites, setFavorites] = useState(defaultState.favorites)
  const [sortKey, setSortKey] = useState(defaultState.sortKey)
  const [sortDir, setSortDir] = useState(defaultState.sortDir)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('lab03-theme')
    return saved ? saved : defaultState.theme
  })

  useEffect(() => {
    localStorage.setItem('lab03-students', JSON.stringify(students))
  }, [students])

  useEffect(() => {
    localStorage.setItem('lab03-theme', theme)
    document.body.dataset.theme = theme
  }, [theme])

  const addStudent = (student) => {
    setStudents((prev) => [student, ...prev])
  }

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const value = useMemo(
    () => ({
      students,
      setStudents,
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
    }),
    [
      students,
      search,
      favorites,
      sortKey,
      sortDir,
      theme,
    ],
  )

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
}

export { StudentContext, StudentProvider }

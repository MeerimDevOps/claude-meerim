async function loadCourses() {

  try {

    const response = await fetch('/api/courses')

    const data = await response.json()

    console.log('Courses:', data)

  } catch (error) {

    console.log(error)
  }
}

async function loadStudents() {

  try {

    const response = await fetch('/api/students')

    const data = await response.json()

    console.log('Students:', data)

  } catch (error) {

    console.log(error)
  }
}

loadCourses()
loadStudents()

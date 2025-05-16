window.courses = [
  { name: 'Programming Fundamentals', capacity: 30, prerequisites: [], minSemester: 1, enrolled: [] },
  { name: 'Discrete Structures', capacity: 30, prerequisites: [], minSemester: 2, enrolled: [] },
  { name: 'Object Oriented Programming', capacity: 30, prerequisites: ['Programming Fundamentals'], minSemester: 3, enrolled: [] },
  { name: 'Data Structures & Algorithms', capacity: 30, prerequisites: ['Object Oriented Programming'], minSemester: 4, enrolled: [] },
  { name: 'Operating Systems', capacity: 30, prerequisites: ['Data Structures & Algorithms'], minSemester: 5, enrolled: [] },
  { name: 'Database Systems', capacity: 30, prerequisites: ['Data Structures & Algorithms'], minSemester: 5, enrolled: [] },
  { name: 'Artificial Intelligence', capacity: 30, prerequisites: ['Data Structures & Algorithms'], minSemester: 6, enrolled: [] },
  { name: 'Machine Learning', capacity: 30, prerequisites: ['Artificial Intelligence'], minSemester: 7, enrolled: [] },
  { name: 'Final Year Project I', capacity: 30, prerequisites: ['Artificial Intelligence'], minSemester: 7, enrolled: [] },
  { name: 'Final Year Project II', capacity: 30, prerequisites: ['Final Year Project I'], minSemester: 8, enrolled: [] }
];

window.students = [
  { rollNo: 71005, name: 'Abdul Rehamn Butt', semester: 1, completed: [] },
  { rollNo: 71009, name: 'Muhammad Ahmed', semester: 2, completed:[] },
  { rollNo: 71028, name: 'Muhammad Rayyan Khan', semester: 3, completed: [] },
  { rollNo: 21029, name: 'Muhammad Ahsan Arshad', semester: 4, completed: [] },
  { rollNo: 71007, name: 'Abdul Hayy', semester: 5, completed: [] },
  { rollNo: 71037, name: 'Muhammad Ahmed', semester: 6, completed: [] },
  { rollNo: 71035, name: 'Farjad Aleem', semester: 7, completed: [] },
  { rollNo: 71425, name: 'Muhammad Ahmed', semester: 8, completed: [] },

];

function autoAssignCompletedCourses() {
  function getCourseByName(name) {
    return window.courses.find(c => c.name === name);
  }

  function canComplete(course, completedCourses) {
    return course.prerequisites.every(prereq => completedCourses.includes(prereq));
  }

  window.students.forEach(student => {
    const completed = [];
    let madeProgress = true;

    while (madeProgress) {
      madeProgress = false;
      for (const course of window.courses) {
        if (
          student.semester > course.minSemester &&
          !completed.includes(course.name) &&
          canComplete(course, completed)
        ) {
          completed.push(course.name);
          madeProgress = true;
        }
      }
    }

    student.completed = completed;
  });
}

autoAssignCompletedCourses();

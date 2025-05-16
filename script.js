document.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("output");
  const studentForm = document.getElementById("studentForm");
  const editStudentIndexInput = document.getElementById("editStudentIndex");
  const rollNoInput = document.getElementById("rollNo");
  const studentNameInput = document.getElementById("studentName");
  const semesterInput = document.getElementById("semester");
  const completedInput = document.getElementById("completed");
  let myChart;

  function allocateCourses() {
    window.courses.forEach((course) => (course.enrolled = []));

    let report = `<table>
      <thead>
        <tr>
          <th>Roll No</th>
          <th>Student</th>
          <th>Semester</th>
          <th>Completed Courses</th>
          <th>Allocated Courses</th>
          <th>Ineligible Courses</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>`;

    window.students.forEach((student, index) => {
      let allocated = [];
      let ineligible = [];

      window.courses.forEach((course) => {
        if (student.completed.includes(course.name)) return;

        const hasPrereqs = course.prerequisites.every((p) =>
          student.completed.includes(p)
        );
        const hasSpace = course.enrolled.length < course.capacity;
        const meetsSemester = student.semester >= course.minSemester;

        if (hasPrereqs && hasSpace && meetsSemester) {
          allocated.push(course.name);
          course.enrolled.push(student.name);
        } else {
          let reasons = [];
          if (!hasPrereqs) reasons.push("Missing prerequisites");
          if (!hasSpace) reasons.push("Course full");
          if (!meetsSemester) reasons.push("Semester too low");
          ineligible.push(`${course.name} (${reasons.join(", ")})`);
        }
      });

      report += `<tr>
        <td>${student.rollNo}</td>
        <td>${student.name}</td>
        <td>${student.semester}</td>
        <td>${student.completed.join(", ") || "None"}</td>
        <td>${allocated.join(", ") || "None"}</td>
        <td>${ineligible.join(", ") || "None"}</td>
        <td>
          <button class="action-btn" onclick="editStudent(${index})">Edit</button>
          <button class="action-btn" onclick="deleteStudent(${index})">Delete</button>
        </td>
      </tr>`;
    });

    report += "</tbody></table>";
    output.innerHTML = report;

    if (myChart) myChart.destroy();

    const ctx = document.getElementById("chart").getContext("2d");
    myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: window.courses.map((c) => c.name),
        datasets: [
          {
            label: "Enrolled Students",
            data: window.courses.map((c) => c.enrolled.length),
            backgroundColor: "rgba(54, 162, 235, 0.7)",
            borderRadius: 5,
          },
          {
            label: "Capacity",
            data: window.courses.map((c) => c.capacity),
            backgroundColor: "rgba(255, 99, 132, 0.4)",
            borderRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
          },
        },
        plugins: {
          legend: { position: "bottom" },
          title: {
            display: true,
            text: "Course Enrollment vs Capacity",
            font: { size: 18 },
          },
        },
      },
    });
  }

  studentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const rollNo = rollNoInput.value.trim();
    const name = studentNameInput.value.trim();
    const semester = parseInt(semesterInput.value);
    const completed = completedInput.value
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c);

    const editIndex = parseInt(editStudentIndexInput.value);

    if (editIndex === -1) {
      if (window.students.some((s) => s.rollNo === rollNo)) {
        alert("Roll No already exists!");
        return;
      }
      window.students.push({ rollNo, name, semester, completed });
    } else {
      window.students[editIndex] = { rollNo, name, semester, completed };
      editStudentIndexInput.value = -1;
    }

    studentForm.reset();
    allocateCourses();
  });

  allocateCourses();
});

window.editStudent = function (index) {
  const student = window.students[index];
  document.getElementById("rollNo").value = student.rollNo;
  document.getElementById("studentName").value = student.name;
  document.getElementById("semester").value = student.semester;
  document.getElementById("completed").value = student.completed.join(", ");
  document.getElementById("editStudentIndex").value = index;
};

window.deleteStudent = function (index) {
  if (confirm(`Are you sure you want to delete ${window.students[index].name}?`)) {
    window.students.splice(index, 1);
    document.getElementById("studentForm").reset();
    document.getElementById("editStudentIndex").value = -1;
    allocateCourses();
  }
};

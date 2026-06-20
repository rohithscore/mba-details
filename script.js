
document.addEventListener("DOMContentLoaded", function () {
  const studentsList = document.querySelector(".students-list");

  if (!students || !marksData) {
    console.error("Data not loaded! Check data.js inclusion order.");
    return;
  }

  // Render student list
  students.forEach(student => {
    const studentDiv = document.createElement("div");
    studentDiv.classList.add("student-container");
    if (student.name === 'PENUGONDA ROHAN') {
      studentDiv.classList.add("rohan-card");
    }

    // Split name into individual characters
    const nameChars = student.name.split('').map((char, index) =>
      `<span class="name-char" style="animation-delay: ${index * 0.1}s">${char}</span>`
    ).join('');

    studentDiv.innerHTML = `
      <img src="${student.image}" alt="${student.name}">
      <p class="student-name">${nameChars}</p>
      <p>${student.rollNumber}</p>
    `;
    studentDiv.addEventListener("click", () => openModal(student.id));
    studentsList.appendChild(studentDiv);
  });

  const modal = document.getElementById("marksModal");
  const modalImage = document.getElementById("modalImage");
  const modalName = document.getElementById("modalName");
  const modalRoll = document.getElementById("modalRoll");
  const modalEmail = document.getElementById("modalEmail");
  const modalNumber = document.getElementById("modalNumber");
  const modalResume = document.getElementById("modalResume");
  const semesterCarousel = document.querySelector(".semester-carousel");

  let currentStudentId = null;
  let currentSemesterIndex = 0;

  // Calculate results
  function calculateResults(studentId) {
    const studentMarks = marksData[studentId];
    const results = {};
    for (const sem in studentMarks) {
      const subjects = studentMarks[sem];
      const totalMarks = subjects.reduce((sum, s) => sum + s.total, 0);
      const obtainedMarks = subjects.reduce((sum, s) => sum + s.obtained, 0);
      const percentage = ((obtainedMarks / totalMarks) * 100).toFixed(2);
      results[sem] = { totalMarks, obtainedMarks, percentage };
    }
    return results;
  }

  // Open modal
  function openModal(studentId) {
    currentStudentId = studentId;
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    modal.style.display = "flex";
    modalImage.src = student.image;
    modalName.textContent = student.name;
    modalRoll.textContent = student.rollNumber;
    modalEmail.textContent = student.emailId || "N/A"; 
    modalNumber.textContent = student.phoneNumber || "N/A"; 
    

    if (student.resume) {
      modalResume.href = student.resume;
      modalResume.style.display = "inline-block";
    } else {
      modalResume.style.display = "none";
}

    currentSemesterIndex = 0;
    renderSemester();
  }

function renderSemester() {
  const semesters = Object.keys(marksData[currentStudentId]);
  if (semesters.length === 0) return;

  const currentSem = semesters[currentSemesterIndex];
  const subjects = marksData[currentStudentId][currentSem];
  const results = calculateResults(currentStudentId)[currentSem];

  // Arrow references
  const leftArrow = semesterCarousel.querySelector(".semester-arrow.left");
  const rightArrow = semesterCarousel.querySelector(".semester-arrow.right");

  // Disable arrows at boundaries
  leftArrow.disabled = currentSemesterIndex === 0;
  rightArrow.disabled = currentSemesterIndex === semesters.length - 1;

  leftArrow.style.opacity = leftArrow.disabled ? "0.4" : "1";
  rightArrow.style.opacity = rightArrow.disabled ? "0.4" : "1";

  const colors = ["#d3e913", "#4ee6e6", "#bf62db", "#47e76f"];
  const bgColor = colors[currentSemesterIndex % colors.length];

  const existingDiv = semesterCarousel.querySelector(".semester-content");
  if (existingDiv) existingDiv.remove();

  const semDiv = document.createElement("div");
  semDiv.classList.add("semester-content");
  semDiv.style.backgroundColor = bgColor;

  semDiv.innerHTML = `
    <h3>${currentSem.toUpperCase()}</h3>
    <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
      <tr style="background-color:#ddd;">
        <th>Subject</th>
        <th>Total</th>
        <th>Obtained</th>
      </tr>
      ${subjects.map((s, index) => `
        <tr class="table-row" style="animation: rowFadeIn 0.5s ease ${index * 0.1}s both;">
          <td>${s.subject}</td>
          <td>${s.total}</td>
          <td>${s.obtained}</td>
        </tr>
      `).join("")}
    </table>

    <p><strong>Total:</strong> ${results.obtainedMarks}/${results.totalMarks}</p>
    <p><strong>Percentage:</strong> ${results.percentage}%</p>
  `;

  semesterCarousel.insertBefore(
    semDiv,
    semesterCarousel.querySelector(".semester-arrow.right")
  );
}

  // Change semester
  window.changeSemester = function (direction) {
    const semesters = Object.keys(marksData[currentStudentId]);
    currentSemesterIndex = (currentSemesterIndex + direction + semesters.length) % semesters.length;
    renderSemester();
  };

  // Close modal
  window.closeModal = function () {
    modal.style.display = "none";
  };
});

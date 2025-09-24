let studentsData = [];

async function loadData() {
  const res = await fetch("data.json");
  studentsData = await res.json();

  // Auto-suggest list
  const datalist = document.getElementById("students");
  studentsData.forEach(s => {
    let option = document.createElement("option");
    option.value = s.name;
    datalist.appendChild(option);
  });
}

function showStudent(name) {
  const student = studentsData.find(s => s.name.toLowerCase() === name.toLowerCase());
  const resultDiv = document.getElementById("result");
  const chartDiv = document.getElementById("chartContainer");

  if (!student) {
    resultDiv.innerHTML = `<p class="text-red-600">No record found for "${name}"</p>`;
    resultDiv.classList.remove("hidden");
    chartDiv.classList.add("hidden");
    return;
  }

  // Table with Tailwind styling
  let table = `
    <h2 class="text-xl font-semibold text-gray-700 mb-4">${student.name}</h2>
    <table class="w-full text-left border border-gray-200 rounded-lg overflow-hidden">
      <thead class="bg-blue-100 text-blue-800">
        <tr>
          <th class="py-2 px-3">Question</th>
          <th class="py-2 px-3">Marks</th>
        </tr>
      </thead>
      <tbody>
  `;
  for (let q in student.marks) {
    table += `
      <tr class="border-b">
        <td class="py-2 px-3">${q}</td>
        <td class="py-2 px-3">${student.marks[q]}</td>
      </tr>`;
  }
  table += `
      </tbody>
    </table>
    <div class="mt-4 p-3 bg-gray-50 rounded-lg shadow-sm">
      <p><b>Out of:</b> ${student.out_of}</p>
      <p><b>Grace:</b> ${student.grace}</p>
      <p><b>Total:</b> <span class="font-bold text-green-600">${student.total}</span></p>
    </div>
  `;

  resultDiv.innerHTML = table;
  resultDiv.classList.remove("hidden");

  // Chart
  chartDiv.classList.remove("hidden");
  const ctx = document.getElementById("chart").getContext("2d");

  if (window.myChart) window.myChart.destroy(); // reset previous chart

  window.myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(student.marks),
      datasets: [{
        label: "Marks",
        data: Object.values(student.marks),
        backgroundColor: "rgba(59,130,246,0.6)",
        borderColor: "rgba(59,130,246,1)",
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

document.getElementById("searchBar").addEventListener("change", (e) => {
  showStudent(e.target.value);
});

loadData();

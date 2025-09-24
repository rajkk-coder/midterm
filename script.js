async function loadData() {
  const response = await fetch("data.json");
  return await response.json();
}

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

async function showResult() {
  const name = getQueryParam("name");
  const data = await loadData();

  const student = data.find(s => s.name.toLowerCase() === name.toLowerCase());

  const title = document.getElementById("studentTitle");
  const container = document.getElementById("resultContainer");

  if (!student) {
    title.textContent = `No record found for "${name}"`;
    return;
  }

  title.textContent = `Result for ${student.name}`;

  // Create table
  let tableHTML = `
    <table class="w-full border-collapse border border-gray-300 text-center">
      <thead class="bg-blue-200">
        <tr>
          <th class="border p-2">Question</th>
          <th class="border p-2">Marks</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (const [q, mark] of Object.entries(student.marks)) {
    tableHTML += `
      <tr>
        <td class="border p-2">${q}</td>
        <td class="border p-2">${mark}</td>
      </tr>
    `;
  }

  tableHTML += `
        <tr class="bg-green-200 font-bold">
          <td class="border p-2">Out Of</td>
          <td class="border p-2">${student.out_of}</td>
        </tr>
        <tr class="bg-yellow-200 font-bold">
          <td class="border p-2">Grace</td>
          <td class="border p-2">${student.grace}</td>
        </tr>
        <tr class="bg-blue-300 font-bold">
          <td class="border p-2">Total</td>
          <td class="border p-2">${student.total}</td>
        </tr>
      </tbody>
    </table>
  `;

  container.innerHTML = tableHTML;

  // Chart
  const ctx = document.getElementById("marksChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(student.marks),
      datasets: [{
        label: "Marks per Question",
        data: Object.values(student.marks),
        backgroundColor: "rgba(54, 162, 235, 0.6)"
      }]
    }
  });
}

showResult();

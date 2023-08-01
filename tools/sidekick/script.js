const errorContainer = document.getElementById("errorContainer");
const tableContainer = document.getElementById("tableContainer");
const spinner = document.getElementById("spinner");

document
  .getElementById("formBuilderForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const formPath = document.getElementById("formPath").value;
    spinner.style.display = "block";

    creteFormSheet(title, formPath)
      .then((response) => {
        console.log("Form created successfully");
        displayTable(title);
      })
      .catch((error) => {
        displayError(error);
      })
      .finally(() => {
        spinner.style.display = "none";
      });
  });

function displayError(error) {
  errorContainer.innerText = error;
  errorContainer.style.display = "block";
  tableContainer.style.display = "none";
}

async function creteFormSheet(title, formPath) {
  try {
    const response = await fetch("http://localhost:3001/createform", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accesstoken:
          "ya29.a0AbVbY6PB0voea_ooNWdPYNTFj4Gli2m6J0E0sHVJa23UcKkGoRSJsXsjH5haXN-H79V68aFrDnJhd3c5Ov-3QKh70LNqqp9CQ3tKHc1TCmGWN4kaIpr6KFRJAMqjH1ZcQy_lZCLE_PpeDvzQxdAn-EaKLRyRaCgYKAT0SARISFQFWKvPlqyO1s2YmB9gEWO4Ap_YEIQ0163",
      },
      body: JSON.stringify({
        fileName: title,
        data: "hello",
        parentFolderId: "1FXVZK1KrI7rEVUZ5kbCqSz4at-HHaYTI",
      }),
    });

    if (!response.ok) {
      throw new Error(
        "Failed to create form. Server returned status: " + response.status
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

function displayTable(title) {
  errorContainer.style.display = "none";
  const tableData = [
    ["Form"],
    [`https://main--testingngg--neerajadobe93.hlx.page/forms/${title}.json`],
  ];

  const generatedTable = document.getElementById("generatedTable");

  // Clear any existing table data
  generatedTable.innerHTML = "";

  // Generate the table rows and cells from the data
  tableData.forEach((rowData, rowIndex) => {
    const row = document.createElement("tr");
    rowData.forEach((cellData, cellIndex) => {
      const cell =
        rowIndex === 0
          ? document.createElement("th")
          : document.createElement("td");
      cell.textContent = cellData;
      row.appendChild(cell);
    });
    generatedTable.appendChild(row);
  });

  // Display the generated table and the "Copy to Clipboard" button
  tableContainer.style.display = "block";
  const copyToClipboardBtn = document.getElementById("copyToClipboardBtn");
  copyToClipboardBtn.addEventListener("click", copyTableToClipboard);
}

function copyTableToClipboard() {
  const generatedTable = document.getElementById("generatedTable");
  const range = document.createRange();
  range.selectNode(generatedTable);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
  alert("Table copied to clipboard!");
}

const errorContainer = document.getElementById("errorContainer");
const tableContainer = document.getElementById("tableContainer");
const spinner = document.getElementById("spinner");
const TOKEN = localStorage.getItem("accessToken") || "";
const LOCAL_HOST_URL = "http://localhost:3001";
const REMOTE_HOST_URL = window.Location.name.includes("localhost")
  ? LOCAL_HOST_URL
  : "http://no1010042040188.corp.adobe.com:3001";

window.onload = async function () {
  // check if url params contains request type edit form
  const urlParams = new URLSearchParams(window.location.search);
  const type = urlParams.get("action");
  if (type != null && type === "edit") {
    const ref = urlParams.get("ref");
    const repo = urlParams.get("repo");
    const owner = urlParams.get("owner");
    const referrer = urlParams.get("referrer");

    const sitePage = await getSitePageFromPath(owner, repo, ref, referrer);
    //open sitepage in new tab
    window.open(sitePage, "_blank");
  }
};

async function getSitePageFromPath(userName, project, ref, docURL) {
  const helixStatusResponse = await fetch(
    `https://admin.hlx.page/status/${userName}/${project}/${ref}?editUrl=${docURL}`
  );
  const helixStatusResponseJson = await helixStatusResponse.json();
  return helixStatusResponseJson.preview.url;
}

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
    const sheetsJsonArray = [
      {
        name: "helix-default",
        data: [
          ["A1", "B1"],
          ["A2", "B2"],
        ],
      },
      {
        name: "incoming",
        data: [
          ["C1", "D1"],
          ["C2", "D2"],
        ],
      },
    ];
    const response = await fetch(`${REMOTE_HOST_URL}/createform`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accesstoken: TOKEN,
      },
      body: JSON.stringify({
        fileName: title,
        data: sheetsJsonArray,
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

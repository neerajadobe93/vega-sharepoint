const errorContainer = document.getElementById("errorContainer");
const tableContainer = document.getElementById("tableContainer");
const spinner = document.getElementById("cover-spin");
const spinnerText = document.querySelector("#cover-spin span");
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
    spinnerText.textContent = "Opening UE";
    spinner.style.display = "block";
    const ref = urlParams.get("ref");
    const repo = urlParams.get("repo");
    const owner = urlParams.get("owner");
    const referrer = urlParams.get("referrer");

    const sitePage = await getSitePageFromPath(owner, repo, ref, referrer);
    //open sitepage in new tab
    const imsOrgId = "@formsinternal01";
    const editorUrl = `https://experience.adobe.com/#/${imsOrgId}/aem/editor/canvas/${sitePage}`;

    window.open(editorUrl, "_blank");
    spinner.style.display = "none";
  }
};

async function getSitePageFromPath(userName, project, ref, docURL) {
  const helixStatusResponse = await fetch(
    `https://admin.hlx.page/status/${userName}/${project}/${ref}?editUrl=${docURL}`
  );
  const helixStatusResponseJson = await helixStatusResponse.json();
  const previewURL = helixStatusResponseJson.preview.url;
  return previewURL.replace("https://", "");
}

document
  .getElementById("formBuilderForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const formPath = document.getElementById("formPath").value;
    spinnerText.textContent = "Creating Form";
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
          ["Name", "Type", "Label", "Placeholder", "Mandatory"],
          ["Question-1", "text", "Name", "Enter your Name here", "false"],
          ["Question-2", "text", "Email", "Enter your Email here", "true"],
          ["Question-3", "text", "Comments", "Enter your text here", "false"],
          ["submit", "submit", "Submit", "", ""],
        ],
      },
      {
        name: "incoming",
        data: [["Name", "Question-1", "Question-2", "Question-3"]],
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
      if (rowIndex === 1) {
        cell.innerHTML = `<a href="${cellData}" target="_blank">${cellData}</a>`;
      } else {
        cell.textContent = cellData;
      }
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

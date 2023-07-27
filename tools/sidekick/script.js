document.getElementById("formBuilderForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const formPath = document.getElementById("formPath").value;
    const formLink = "https://www.google.com";
    
    const dummyTableData = [
      ["Form"],
      [formLink]
    ];
  
    displayTable(dummyTableData);
  });
  
  function displayTable(tableData) {
    const tableContainer = document.getElementById("tableContainer");
    const generatedTable = document.getElementById("generatedTable");
  
    // Clear any existing table data
    generatedTable.innerHTML = "";
  
    // Generate the table rows and cells from the data
    tableData.forEach((rowData, rowIndex) => {
      const row = document.createElement("tr");
      rowData.forEach((cellData, cellIndex) => {
        const cell = rowIndex === 0 ? document.createElement("th") : document.createElement("td");
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
  
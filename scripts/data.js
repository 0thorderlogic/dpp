async function loadData(file) {
    const response = await fetch(file);
    const data = await response.text();
    const lines = data.trim().split('\n');
    const headers = lines[0].split(',');
    const rows = lines.slice(1).map(line => {
        const values = line.split(',');
        const row = {};
        headers.forEach((header, i) => {
            row[header.trim()] = values[i].trim();
        });
        return row;
    });
    return rows;
}

function createTable(data, tableId) {
    const tableContainer = document.getElementById(tableId);
    if (!tableContainer) return;

    tableContainer.innerHTML = '';
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const headers = Object.keys(data[0]);
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    data.forEach(rowData => {
        const row = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = rowData[header];
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    tableContainer.appendChild(table);
}

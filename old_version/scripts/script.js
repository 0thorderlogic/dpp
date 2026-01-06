
const parts = [
    "Frame",
    "Flight Controller",
    "Battery (LiPo)",
    "Battery Connector",
    "Wiring",
    "Radio Transmitter",
    "Radio Receiver",
    "Power Distribution Board",
    "Voltage Regulator / BEC",
    "Payload"
];

document.addEventListener('DOMContentLoaded', main);

async function main() {
    const motors = await loadData('data/motors.csv');
    const escs = await loadData('data/esc.csv');
    const propellers = await loadData('data/propellers.csv');

    createTable(motors, 'motors-table');
    createTable(escs, 'esc-table');
    createTable(propellers, 'propellers-table');

    populateSelect('motor-select', motors, 'Name');
    populateSelect('esc-select', escs, 'Name');
    populateSelect('propeller-select', propellers, 'Name');

    updateWeightDisplay(document.getElementById('motor-select'), motors, 'Weight (g)', 'motor-weight');
    updateWeightDisplay(document.getElementById('esc-select'), escs, 'Weight (g)', 'esc-weight');
    updateWeightDisplay(document.getElementById('propeller-select'), propellers, 'Weight_g', 'propeller-weight');

    document.getElementById('motor-select').addEventListener('change', (e) => updateWeightDisplay(e.target, motors, 'Weight (g)', 'motor-weight'));
    document.getElementById('esc-select').addEventListener('change', (e) => updateWeightDisplay(e.target, escs, 'Weight (g)', 'esc-weight'));
    document.getElementById('propeller-select').addEventListener('change', (e) => updateWeightDisplay(e.target, propellers, 'Weight_g', 'propeller-weight'));

    createWeightInputs();

    document.getElementById('calculate-weight').addEventListener('click', () => {
        calculateTotalWeight(motors, escs, propellers);
    });

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });
}

function populateSelect(selectId, data, nameKey) {
    const select = document.getElementById(selectId);
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item[nameKey];
        option.textContent = item[nameKey];
        select.appendChild(option);
    });
}

function updateWeightDisplay(selectElement, data, weightKey, spanId) {
    const selectedName = selectElement.value;
    const selectedItem = data.find(item => item['Name'] === selectedName);
    const weight = selectedItem ? selectedItem[weightKey] : 0;
    document.getElementById(spanId).innerHTML = `<strong>Weight:</strong> ${(parseFloat(weight) || 0).toFixed(2)}g`;
}


function createWeightInputs() {
    const container = document.getElementById('weight-inputs');
    parts.forEach(part => {
        const div = document.createElement('div');
        div.classList.add('weight-input-group');
        const label = document.createElement('label');
        label.textContent = `${part} Weight (g):`;
        const input = document.createElement('input');
        input.type = 'number';
        input.id = `${part.toLowerCase().replace(/ /g, '-')}-weight`;
        input.value = 0;
        div.appendChild(label);
        div.appendChild(input);
        container.appendChild(div);
    });
}

function calculateTotalWeight(motors, escs, propellers) {
    let totalWeight = 0;

    const motorName = document.getElementById('motor-select').value;
    const selectedMotor = motors.find(m => m['Name'] === motorName);
    totalWeight += (parseFloat(selectedMotor ? selectedMotor['Weight (g)'] : 0) || 0) * 4; // 4 motors

    const escName = document.getElementById('esc-select').value;
    const selectedEsc = escs.find(e => e['Name'] === escName);
    totalWeight += (parseFloat(selectedEsc ? selectedEsc['Weight (g)'] : 0) || 0) * 4; // 4 ESCs (assuming 0 if no weight column)

    const propellerName = document.getElementById('propeller-select').value;
    const selectedPropeller = propellers.find(p => p['Name'] === propellerName);
    totalWeight += (parseFloat(selectedPropeller ? selectedPropeller['Weight_g'] : 0) || 0); // Weight is for a set of 4

    parts.forEach(part => {
        const input = document.getElementById(`${part.toLowerCase().replace(/ /g, '-')}-weight`);
        totalWeight += (parseFloat(input.value) || 0);
    });

    document.getElementById('total-weight').textContent = `Total Estimated Weight: ${totalWeight.toFixed(2)}g`;
}


import PieChart3d, { COLORS } from './PieChart3d';

const chart = new PieChart3d(600, 500);
const chartRow = document.getElementById('chartRow');
const chartKey = document.getElementById('chartKey');
chart.addRenderer(chartRow, chartKey);

window.updateChart = function updateChart(event=null) {
    if (event) {
        event.preventDefault();
    }

    chart.clearScene();
    let form = document.querySelector('#chartForm');
    let formData = new FormData(form);

    const cleanData = processData(formData.get('data'));

    // Create chart function
    createChart(cleanData);

    document.getElementById('chartTitle').innerHTML = formData.get('title');
    
    let keyData = '';
    for (let i = 0; i < cleanData.length; i++) {
        keyData+= `
        <div class="keyPair">
            <div class="colorSwatch" style="background-color: #${COLORS[i][0].toString(16)}"></div>
            ${cleanData[i][0]}
        </div>`
    }

    document.getElementById('chartKey').innerHTML = keyData;
};

function processData(textData) {
    const lines = textData.split('\n');
    const cleanLines = [];

    for (const line of lines) {
        const cleanLine = line.trim().split(',');
        if (cleanLine.length !== 2) {
            continue;
        } else {
            const lineVal = parseFloat(cleanLine[1].trim());
            cleanLines.push([cleanLine[0].trim(), lineVal]);
        }
    }

    cleanLines.sort(function(a, b) {
        return b[1] - a[1];
    });

    let others = 0;
    while (cleanLines.length >= 6) {
        others += cleanLines.pop()[1];
    }

    if (others > 0) {
        cleanLines.push(["Other", others]);
    }

    return cleanLines;
}

function createChart(data) {
    // TODO: Clear Chart
    let startAngle = 0;
    let total = 0;

    for (const slice of data) {
        total += slice[1];
    }
    
    for (let i = 0; i < data.length; i++) {
        const sliceWidth = data[i][1]/total * 2 * Math.PI;
        chart.createSlice([startAngle, startAngle + sliceWidth]);
        startAngle += sliceWidth;
    }

    chart.populateScene();
}

window.updateChart();
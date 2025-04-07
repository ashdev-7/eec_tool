function generateInputsForProblem(problem) {
  let inputsHTML = "";
  if (problem === "1") {
    inputsHTML = `
      <label for="numInsulators">Number of Insulators:</label>
      <input type="number" id="numInsulators" value="3" />
      <label for="capacitance">Capacitance between each insulator and ground (as % of self-capacitance):</label>
      <input type="number" id="capacitance" value="11" />
      <label for="lineVoltage">Line Voltage (in kV):</label>
      <input type="number" id="lineVoltage" value="33" />
      <label for="selfCapacitance">Self-Capacitance of Each Insulator (in µF or similar units):</label>
      <input type="number" id="selfCapacitance" value="1" />
      <label for="shuntCapacitance">Shunt Capacitance (in µF or similar units):</label>
      <input type="number" id="shuntCapacitance" value="0.11" />
    `;
  } else if (problem === "2") {
    inputsHTML = `
      <label for="topElementVoltage">Voltage across top element (kV):</label>
      <input type="number" id="topElementVoltage" value="8" />
      <label for="middleElementVoltage">Voltage across middle element (kV):</label>
      <input type="number" id="middleElementVoltage" value="11" />
      <label for="lineVoltage2">Line Voltage (in kV):</label>
      <input type="number" id="lineVoltage2" value="33" />
      <label for="capacitanceRatio">Capacitance Ratio between Pin and Ground to Self-Capacitance:</label>
      <input type="number" id="capacitanceRatio" value="1" />
    `;
  } else if (problem === "3") {
    inputsHTML = `
      <label for="lineUnitVoltage">Voltage across line unit (kV):</label>
      <input type="number" id="lineUnitVoltage" value="17.5" />
      <label for="shuntCapacitanceRatio">Shunt capacitance ratio to self-capacitance (denominator, e.g., 8 for 1/8):</label>
      <input type="number" id="shuntCapacitanceRatio" value="8" />
      <label for="selfCapacitance3">Self-Capacitance of Each Insulator (in µF or similar units):</label>
      <input type="number" id="selfCapacitance3" value="1" />
    `;
  } else if (problem === "4") {
    inputsHTML = `
      <label for="lowestInsulatorVoltage">Voltage across lowest insulator (kV):</label>
      <input type="number" id="lowestInsulatorVoltage" value="13.1" />
      <label for="nextElementVoltage">Voltage across next element (kV):</label>
      <input type="number" id="nextElementVoltage" value="11" />
      <label for="busBarVoltage">Bus-bar Voltage (in kV):</label>
      <input type="number" id="busBarVoltage" value="33" />
    `;
  } else if (problem === "5") {
    inputsHTML = `
      <label for="safeVoltage">Safe Working Voltage per Element (kV):</label>
      <input type="number" id="safeVoltage" value="15" />
      <label for="capacitanceRatio5">Ratio of self-capacitance to shunt capacitance:</label>
      <input type="number" id="capacitanceRatio5" value="8" />
      <label for="selfCapacitance5">Self-Capacitance of Each Insulator (in µF or similar units):</label>
      <input type="number" id="selfCapacitance5" value="1" />
    `;
  } else if (problem === "6") {
    inputsHTML = `
      <label for="selfCapacitance6">Self-Capacitance (C):</label>
      <input type="number" id="selfCapacitance6" value="1" />
      <label for="shuntCapacitance1">Shunt Capacitance for Connecting Metal (0.15C):</label>
      <input type="number" id="shuntCapacitance1" value="0.15" />
      <label for="shuntCapacitance2">Shunt Capacitance for Line (0.1C):</label>
      <input type="number" id="shuntCapacitance2" value="0.1" />
      <label for="lineVoltage6">Line Voltage (kV):</label>
      <input type="number" id="lineVoltage6" value="33" />
    `;
  }
  // Insert the generated inputs into the problemInputs div
  document.getElementById("problemInputs").innerHTML = inputsHTML;
}

function calculateProblem() {
  const problemType = document.getElementById("problemType").value;
  let resultHTML = "";

  if (problemType === "1") {
    resultHTML = calculateProblem1();
  } else if (problemType === "2") {
    resultHTML = calculateProblem2();
  } else if (problemType === "3") {
    resultHTML = calculateProblem3();
  } else if (problemType === "4") {
    resultHTML = calculateProblem4();
  } else if (problemType === "5") {
    resultHTML = calculateProblem5();
  } else if (problemType === "6") {
    resultHTML = calculateProblem6();
  }
  document.getElementById("result").innerHTML = resultHTML;
}

// Problem 1 - Calculation of voltage distribution across insulator string
function calculateProblem1() {
    const numInsulators = parseInt(
      document.getElementById("numInsulators").value
    );
    const capacitancePercentage =
      parseFloat(document.getElementById("capacitance").value) / 100;
    const lineVoltage = parseFloat(document.getElementById("lineVoltage").value);
    const selfCapacitance = parseFloat(
      document.getElementById("selfCapacitance").value
    );
    const shuntCapacitance = parseFloat(
      document.getElementById("shuntCapacitance").value
    );
  
    // Create corrected capacitance matrix
    let C = [];
    for (let i = 0; i < numInsulators; i++) {
      C[i] = [];
      for (let j = 0; j < numInsulators; j++) {
        C[i][j] = 0;
      }
    }
    
    // Fixed matrix population logic
    for (let i = 0; i < numInsulators; i++) {
      C[i][i] = shuntCapacitance;
      if (i > 0) {
        C[i][i] += selfCapacitance;
        C[i][i-1] = -selfCapacitance;
      }
      if (i < numInsulators - 1) {
        C[i][i] += selfCapacitance;
        C[i][i+1] = -selfCapacitance;
      }
    }
  
    // Voltage solving remains same in structure
    let voltages = solveVoltageDistribution(C, numInsulators, lineVoltage);
    
    // Fixed efficiency calculation
    const maxVoltage = Math.max(...voltages);
    const stringEfficiency = (lineVoltage / (numInsulators * maxVoltage)) * 100;
  
    return `
      <h3>Problem 1 Results:</h3>
      <p><strong>Voltage Distribution:</strong></p>
      <ul>
        ${voltages
          .map(
            (voltage, index) =>
              `<li>Insulator ${index + 1}: ${voltage.toFixed(2)} kV</li>`
          )
          .join("")}
      </ul>
      <p><strong>String Efficiency:</strong> ${stringEfficiency.toFixed(2)}%</p>
    `;
  }
  

// Problem 2 - Calculation based on known voltage distribution
function calculateProblem2() {
  const topElementVoltage = parseFloat(
    document.getElementById("topElementVoltage").value
  );
  const middleElementVoltage = parseFloat(
    document.getElementById("middleElementVoltage").value
  );
  const lineVoltage = parseFloat(document.getElementById("lineVoltage2").value);
  const bottomElementVoltage =
    lineVoltage - (topElementVoltage + middleElementVoltage);
  const stringEfficiency =
    (lineVoltage /
      (topElementVoltage + middleElementVoltage + bottomElementVoltage)) *
    100;
  return `
    <h3>Problem 2 Results:</h3>
    <p><strong>Bottom Element Voltage:</strong> ${bottomElementVoltage.toFixed(
      2
    )} kV</p>
    <p><strong>Total Insulator Voltage:</strong> ${(
      topElementVoltage +
      middleElementVoltage +
      bottomElementVoltage
    ).toFixed(2)} kV</p>
    <p><strong>String Efficiency:</strong> ${stringEfficiency.toFixed(2)}%</p>
  `;
}

// Problem 3 - Calculate line voltage from line unit voltage
function calculateProblem3() {
  const lineUnitVoltage = parseFloat(
    document.getElementById("lineUnitVoltage").value
  );
  const shuntCapacitanceRatio = parseFloat(
    document.getElementById("shuntCapacitanceRatio").value
  );
  const lineVoltage = lineUnitVoltage * (1 + 1 / shuntCapacitanceRatio);
  const stringEfficiency = (lineUnitVoltage / lineVoltage) * 100;
  return `
    <h3>Problem 3 Results:</h3>
    <p><strong>Line Voltage:</strong> ${lineVoltage.toFixed(2)} kV</p>
    <p><strong>String Efficiency:</strong> ${(
      100 /
      (1 + 1 / shuntCapacitanceRatio)
    ).toFixed(2)}%</p>
  `;
}

// Problem 4 - Bus-bar voltage calculation
function calculateProblem4() {
  const lowestInsulatorVoltage = parseFloat(
    document.getElementById("lowestInsulatorVoltage").value
  );
  const nextElementVoltage = parseFloat(
    document.getElementById("nextElementVoltage").value
  );
  const busBarVoltage = parseFloat(
    document.getElementById("busBarVoltage").value
  );
  const topElementVoltage =
    busBarVoltage - (lowestInsulatorVoltage + nextElementVoltage);
  const lowestPercentage = (lowestInsulatorVoltage / busBarVoltage) * 100;
  const middlePercentage = (nextElementVoltage / busBarVoltage) * 100;
  const topPercentage = (topElementVoltage / busBarVoltage) * 100;
  return `
    <h3>Problem 4 Results:</h3>
    <p><strong>Top Element Voltage:</strong> ${topElementVoltage.toFixed(
      2
    )} kV</p>
    <p><strong>Voltage Distribution:</strong></p>
    <ul>
      <li>Lowest Element: ${lowestInsulatorVoltage.toFixed(
        2
      )} kV (${lowestPercentage.toFixed(2)}%)</li>
      <li>Middle Element: ${nextElementVoltage.toFixed(
        2
      )} kV (${middlePercentage.toFixed(2)}%)</li>
      <li>Top Element: ${topElementVoltage.toFixed(
        2
      )} kV (${topPercentage.toFixed(2)}%)</li>
    </ul>
  `;
}

// Problem 5 - Maximum safe voltage calculation
function calculateProblem5() {
  const safeVoltage = parseFloat(document.getElementById("safeVoltage").value);
  const capacitanceRatio = parseFloat(
    document.getElementById("capacitanceRatio5").value
  );
  const stringEfficiency = 100 / (1 + 1 / capacitanceRatio);
  const maxSafeVoltage = safeVoltage * (100 / stringEfficiency);
  return `
    <h3>Problem 5 Results:</h3>
    <p><strong>String Efficiency:</strong> ${stringEfficiency.toFixed(2)}%</p>
    <p><strong>Max Safe System Voltage:</strong> ${maxSafeVoltage.toFixed(
      2
    )} kV</p>
  `;
}

// Problem 6 - Calculation with multiple shunt capacitances
function calculateProblem6() {
  const selfCapacitance = parseFloat(
    document.getElementById("selfCapacitance6").value
  );
  const shuntCapacitance1 =
    selfCapacitance *
    parseFloat(document.getElementById("shuntCapacitance1").value);
  const shuntCapacitance2 =
    selfCapacitance *
    parseFloat(document.getElementById("shuntCapacitance2").value);
  const lineVoltage = parseFloat(document.getElementById("lineVoltage6").value);
  const numInsulators = 3;
  let C = [];
  for (let i = 0; i < numInsulators; i++) {
    C[i] = [];
    for (let j = 0; j < numInsulators; j++) {
      C[i][j] = 0;
    }
  }
  for (let i = 0; i < numInsulators; i++) {
    C[i][i] = selfCapacitance;
  }
  C[0][0] += shuntCapacitance1; // For connecting metal
  C[numInsulators - 1][numInsulators - 1] += shuntCapacitance2; // For line
  let voltages = solveVoltageDistribution(C, numInsulators, lineVoltage);
  let totalVoltageAcrossInsulators = voltages.reduce(
    (sum, voltage) => sum + voltage,
    0
  );
  const stringEfficiency = (lineVoltage / totalVoltageAcrossInsulators) * 100;
  return `
    <h3>Problem 6 Results:</h3>
    <p><strong>Voltage Distribution:</strong></p>
    <ul>
      ${voltages
        .map(
          (voltage, index) =>
            `<li>Insulator ${index + 1}: ${voltage.toFixed(2)} kV</li>`
        )
        .join("")}
    </ul>
    <p><strong>String Efficiency:</strong> ${stringEfficiency.toFixed(2)}%</p>
  `;
}

// Helper function to solve for voltage distribution using the capacitive divider principle
function solveVoltageDistribution(C, numInsulators, lineVoltage) {
  let voltages = [];
  let totalReciprocal = 0;
  for (let i = 0; i < numInsulators; i++) {
    totalReciprocal += 1 / C[i][i];
  }
  let totalCapacitance = 1 / totalReciprocal;
  for (let i = 0; i < numInsulators; i++) {
    voltages[i] = lineVoltage * (totalCapacitance / C[i][i]);
  }
  return voltages;
}

// Initialize with default problem and add change listener
document.addEventListener("DOMContentLoaded", function () {
  generateInputsForProblem("1");
  document
    .getElementById("problemType")
    .addEventListener("change", function () {
      generateInputsForProblem(this.value);
    });
});

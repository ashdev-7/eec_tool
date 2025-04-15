document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("calculate")
    .addEventListener("click", calculateUnevenSupports);
});

function calculateUnevenSupports() {
  // Get input values
  const w = parseFloat(document.getElementById("w").value);
  const wi = parseFloat(document.getElementById("wi").value) || 0;
  const ww = parseFloat(document.getElementById("ww").value) || 0;
  const span = parseFloat(document.getElementById("span").value);
  const tension = parseFloat(document.getElementById("tension").value);
  const height1 = parseFloat(document.getElementById("support-height1").value);
  const height2 = parseFloat(document.getElementById("support-height2").value);

  // Validate inputs
  if (!validateInputs(w, span, tension, height1, height2)) return;

  // Calculate total weight and angle
  const wt = calculateTotalWeight(w, wi, ww);
  const thetaRadians = Math.atan2(ww, w + wi); // Angle with horizontal
  const thetaDegrees = thetaRadians * (180 / Math.PI);

  // Calculate sags (CRITICAL FIX: Basic sag uses 8*T)
  const basicSag = (wt * Math.pow(span, 2)) / (8 * tension); // Corrected formula
  const heightDifference = height2 - height1;
  const c = (heightDifference * 2 * tension) / (wt * span);

  if (Math.abs(c) >= span) {
    showResult(
      `<p class="error">Error: Height difference too large for span/tension</p>`
    );
    return;
  }

  // Calculate lowest point positions
  const x1 = span / 2 - c / 2;
  const x2 = span - x1; // More accurate calculation

  // Calculate sags from supports (FIXED: Uses correct 2*T formula)
  const sag1 = (wt * Math.pow(x1, 2)) / (2 * tension);
  const sag2 = (wt * Math.pow(x2, 2)) / (2 * tension);

  // Final validation (should always be equal)
  const clearance1 = height1 - sag1;
  const clearance2 = height2 - sag2;

  if (Math.abs(clearance1 - clearance2) > 0.001) {
    showResult(
      `<p class="error">Calculation mismatch: ${clearance1.toFixed(
        3
      )} vs ${clearance2.toFixed(3)}</p>`
    );
    return;
  }

  displayResults(
    wt,
    thetaDegrees,
    basicSag,
    heightDifference,
    x1,
    sag1,
    sag2,
    clearance1
  );
}

// Rest of helper functions remain unchanged
function validateInputs(w, span, tension, height1, height2) {
  if ([w, span, tension, height1, height2].some(isNaN)) {
    showResult("<p class='error'>All fields require valid numbers</p>");
    return false;
  }
  if ([w, span, tension].some((v) => v <= 0) || height1 < 0 || height2 < 0) {
    showResult("<p class='error'>Values must be positive</p>");
    return false;
  }
  return true;
}

function calculateTotalWeight(w, wi, ww) {
  return Math.sqrt((w + wi) ** 2 + ww ** 2);
}

function displayResults(
  wt,
  thetaDeg,
  basicSag,
  hDiff,
  x1,
  sag1,
  sag2,
  clearance
) {
  const resultHTML = `
        <h3>Basic Parameters:</h3>
        <p>Total weight (w<sub>t</sub>): ${wt.toFixed(3)} kg/m</p>
        <p>Wind angle with horizontal (θ): ${thetaDeg.toFixed(2)}°</p>
        <p>Level span sag: ${basicSag.toFixed(3)} m</p>
        
        <h3>Uneven Supports:</h3>
        <p>Height difference: ${hDiff.toFixed(2)} m</p>
        <p>Lowest point from left: ${x1.toFixed(2)} m</p>
        <p>Left sag: ${sag1.toFixed(3)} m</p>
        <p>Right sag: ${sag2.toFixed(3)} m</p>
        <p>Ground clearance: ${clearance.toFixed(3)} m</p>
    `;
  showResult(resultHTML);
}

function showResult(html) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = html;
  resultDiv.style.display = "block";
}

/**
 * Updates the "Checkout Page" sheet in SunnyDiamonds_v2.xlsx
 * with test results from checkout-not-tested-results.json.
 * Only updates rows where Status was "Not Tested".
 */
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const EXCEL = path.join(__dirname, 'TestCase', 'SunnyDiamonds_v2.xlsx');
const RESULTS = path.join(__dirname, 'checkout-not-tested-results.json');

if (!fs.existsSync(RESULTS)) {
  console.error('Results file not found:', RESULTS);
  process.exit(1);
}

const results = JSON.parse(fs.readFileSync(RESULTS, 'utf-8'));
console.log(`Loaded ${results.length} test results.`);

const wb = XLSX.readFile(EXCEL);
const sheetName = 'Checkout Page';
const ws = wb.Sheets[sheetName];

if (!ws) {
  console.error(`Sheet "${sheetName}" not found.`);
  process.exit(1);
}

const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
const headerRow = 4; // Row index 4 is the header row
const header = data[headerRow];

// Find column indices
const colActual = header.indexOf('Actual Result');   // column F (index 6)
const colStatus = header.indexOf('Status');           // column H (index 7)

console.log(`Header row: ${headerRow}. Actual Result col: ${colActual}. Status col: ${colStatus}.`);
console.log(`Header: ${JSON.stringify(header)}`);

let updated = 0;
let notFound = [];

for (const result of results) {
  const tcId = result.tcId;
  let found = false;

  for (let i = headerRow + 1; i < data.length; i++) {
    const row = data[i];
    if (row && row[0] === tcId) {
      // Only update if current status is "Not Tested"
      const currentStatus = row[colStatus] ? String(row[colStatus]).trim() : '';
      if (currentStatus.toLowerCase() === 'not tested' || currentStatus === '') {
        // Write Actual Result (column index 6)
        const actualCell = XLSX.utils.encode_cell({ r: i, c: colActual });
        ws[actualCell] = { t: 's', v: result.actualResult };

        // Write Status (column index 7)
        const statusCell = XLSX.utils.encode_cell({ r: i, c: colStatus });
        ws[statusCell] = { t: 's', v: result.status };

        updated++;
        console.log(`  ✓ ${tcId} → ${result.status}`);
      } else {
        console.log(`  ⊘ ${tcId} — skipped (Status: "${currentStatus}", not "Not Tested")`);
      }
      found = true;
      break;
    }
  }

  if (!found) {
    notFound.push(tcId);
  }
}

// Write back to Excel — try original path first, fallback to new file
try {
  XLSX.writeFile(wb, EXCEL);
  console.log('Written to:', EXCEL);
} catch (e) {
  const altPath = EXCEL.replace('.xlsx', '_updated.xlsx');
  XLSX.writeFile(wb, altPath);
  console.log('Original file locked. Written to:', altPath);
}

console.log(`\n=== Excel Update Complete ===`);
console.log(`Updated: ${updated} rows`);
console.log(`Results loaded: ${results.length}`);
if (notFound.length > 0) {
  console.log(`Not found in Excel: ${notFound.join(', ')}`);
}

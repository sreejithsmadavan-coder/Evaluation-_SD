"""
Updates ONLY the 'Home Page' sheet in SunnyDiamonds_v2.xlsx with test results.
Col A(1)=Test Case ID, Col G(7)=Actual Result, Col H(8)=Status.
Does NOT modify any other sheet or data.
"""
import json, openpyxl, os, shutil

RESULTS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'home-test-results.json')
EXCEL_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'TestCase', 'SunnyDiamonds_v2.xlsx')
TEMP_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'TestCase', 'SunnyDiamonds_v2_home_updated.xlsx')
SHEET_NAME = 'Home Page'

TC_ID_COL = 1
ACTUAL_RESULT_COL = 7
STATUS_COL = 8

def main():
    with open(RESULTS_FILE, 'r', encoding='utf-8') as f:
        results = json.load(f)
    results_map = {r['tcId']: r for r in results}
    print(f"Loaded {len(results)} test results")

    # Copy to temp first (in case original is locked)
    shutil.copy2(EXCEL_FILE, TEMP_FILE)
    wb = openpyxl.load_workbook(TEMP_FILE)
    ws = wb[SHEET_NAME]
    print(f"Opened sheet: {SHEET_NAME}")

    header_row = None
    for row in range(1, ws.max_row + 1):
        if ws.cell(row=row, column=TC_ID_COL).value and 'Test Case ID' in str(ws.cell(row=row, column=TC_ID_COL).value):
            header_row = row
            break

    if not header_row:
        print("ERROR: Header row not found")
        return

    updated = 0
    for row in range(header_row + 1, ws.max_row + 1):
        tc_id = ws.cell(row=row, column=TC_ID_COL).value
        if tc_id and str(tc_id).strip() in results_map:
            result = results_map[str(tc_id).strip()]
            ws.cell(row=row, column=ACTUAL_RESULT_COL).value = result['actualResult']
            ws.cell(row=row, column=STATUS_COL).value = result['status']
            updated += 1
            print(f"  Row {row}: {tc_id} -> {result['status']}")

    wb.save(TEMP_FILE)
    print(f"\nUpdated {updated} test cases. Saved to temp file.")

    # Try to replace original
    try:
        shutil.move(TEMP_FILE, EXCEL_FILE)
        print(f"Original file replaced successfully: {EXCEL_FILE}")
    except Exception as e:
        print(f"Could not replace original (may be open): {e}")
        print(f"Results saved to: {TEMP_FILE}")

if __name__ == '__main__':
    main()

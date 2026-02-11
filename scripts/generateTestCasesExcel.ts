import * as XLSX from 'xlsx';
import * as path from 'path';

interface TestCase {
  tcId: string;
  category: string;
  title: string;
  priority: string;
  precondition: string;
  steps: string;
  expectedResult: string;
  testData: string;
  status: string;
}

const testCases: TestCase[] = [
  // 1. Login & Authentication
  {
    tcId: 'TC-1.1',
    category: 'Login & Authentication',
    title: 'Valid Login',
    priority: 'P0 (Critical)',
    precondition: 'Valid student account exists',
    steps: '1. Open application URL\n2. Enter valid email (textfield)\n3. Enter valid password (textfield)\n4. Click "Agree to terms" checkbox\n5. Click Login button',
    expectedResult: 'Login successful\nRedirect to Dashboard within 15 seconds\nDashboard visible',
    testData: 'Student-Email-ID, Student-PassWord from Excel',
    status: '✅ Pass'
  },
  {
    tcId: 'TC-1.2',
    category: 'Login & Authentication',
    title: 'Invalid Email Format',
    priority: 'P1 (High)',
    precondition: 'None',
    steps: '1. Open application\n2. Enter invalid email (e.g., student@, student.com)\n3. Enter any password\n4. Click checkbox\n5. Click Login',
    expectedResult: 'Error: "Please enter a valid email address"\nLogin blocked',
    testData: 'N/A',
    status: '❌ Negative'
  },
  {
    tcId: 'TC-1.3',
    category: 'Login & Authentication',
    title: 'Empty Credentials',
    priority: 'P1 (High)',
    precondition: 'None',
    steps: '1. Open application\n2. Leave email empty\n3. Leave password empty\n4. Click Login',
    expectedResult: 'Error: "This field is required" for both fields\nLogin blocked',
    testData: 'N/A',
    status: '❌ Negative'
  },
  {
    tcId: 'TC-1.4',
    category: 'Login & Authentication',
    title: 'Terms Checkbox Not Selected',
    priority: 'P1 (High)',
    precondition: 'None',
    steps: '1. Open application\n2. Enter valid email and password\n3. Do NOT click terms checkbox\n4. Click Login',
    expectedResult: 'Login blocked\nUser prompted to accept terms',
    testData: 'N/A',
    status: '❌ Negative'
  },

  // 2. Resume Navigation
  {
    tcId: 'TC-2.1',
    category: 'Resume Navigation',
    title: 'Navigate to My Resume',
    priority: 'P0 (Critical)',
    precondition: 'User logged in, Dashboard visible',
    steps: '1. Verify Dashboard is loaded\n2. Click "My Resume" button',
    expectedResult: 'Resume page loads successfully\nAll section icons visible',
    testData: 'N/A',
    status: '✅ Pass'
  },
  {
    tcId: 'TC-2.2',
    category: 'Resume Navigation',
    title: 'Resume Section Icons Clickable',
    priority: 'P0 (Critical)',
    precondition: 'On Resume page',
    steps: '1. Click Personal Information icon\n2. Verify modal opens\n3. Close modal\n4. Repeat for each section icon',
    expectedResult: 'Each icon opens corresponding section modal\nModal closes properly',
    testData: 'N/A',
    status: '✅ Pass'
  },

  // 3. Personal Information
  {
    tcId: 'TC-3.1',
    category: 'Personal Information',
    title: 'Fill Personal Information - Valid Data',
    priority: 'P0 (Critical)',
    precondition: 'Personal Info modal open',
    steps: '1. Click Additional Information icon\n2. Select Country (textfield dropdown)\n3. Select State (cascades from Country)\n4. Select City (cascades from State)\n5. Enter 6-digit Pincode (textfield)\n6. Check "Permanent Address" checkbox\n7. Check "Same as Permanent Address" checkbox\n8. Click Update',
    expectedResult: 'Data saved successfully\nModal closes within 3 seconds',
    testData: 'Country, State, City, Pincode from Excel',
    status: '✅ Pass'
  },
  {
    tcId: 'TC-3.2',
    category: 'Personal Information',
    title: 'Invalid Pincode - Less Than 6 Digits',
    priority: 'P1 (High)',
    precondition: 'Personal Info modal open',
    steps: '1. Fill all fields with valid data\n2. Enter Pincode with less than 6 digits (e.g., 1234)\n3. Click Update',
    expectedResult: 'Error: "Pincode must be 6 digits"\nUpdate blocked',
    testData: 'N/A',
    status: '❌ Negative'
  },
  {
    tcId: 'TC-3.3',
    category: 'Personal Information',
    title: 'Invalid Pincode - Non-Numeric',
    priority: 'P1 (High)',
    precondition: 'Personal Info modal open',
    steps: '1. Fill all fields with valid data\n2. Enter non-numeric Pincode (e.g., ABC123)\n3. Click Update',
    expectedResult: 'Error: "Pincode must be 6 digits"\nUpdate blocked',
    testData: 'N/A',
    status: '❌ Negative'
  },
  {
    tcId: 'TC-3.4',
    category: 'Personal Information',
    title: 'Cascading Dropdown Validation',
    priority: 'P1 (High)',
    precondition: 'Personal Info modal open',
    steps: '1. Select Country\n2. Verify State dropdown shows only states of selected Country\n3. Select State\n4. Verify City dropdown shows only cities of selected State',
    expectedResult: 'Dropdowns cascade correctly\nNo invalid options shown',
    testData: 'N/A',
    status: '✅ Pass'
  },
  {
    tcId: 'TC-3.5',
    category: 'Personal Information',
    title: 'Same as Permanent Address Checkbox',
    priority: 'P2 (Medium)',
    precondition: 'Personal Info modal open',
    steps: '1. Fill permanent address fields\n2. Check "Same as Permanent Address" checkbox',
    expectedResult: 'Current address fields auto-filled with permanent address values',
    testData: 'N/A',
    status: '✅ Pass'
  },

  // 4. Education - 10th Standard
  {
    tcId: 'TC-4.1',
    category: 'Education - 10th Standard',
    title: 'Fill 10th Standard - Valid Data',
    priority: 'P0 (Critical)',
    precondition: 'Education section open',
    steps: '1. Click Education icon\n2. Select Board (textfield dropdown)\n3. Select Year (textfield dropdown)\n4. Enter Percentage (textfield, 0-100)\n5. Click Update',
    expectedResult: '10th data saved successfully\nModal closes',
    testData: '10th-Board, 10th-Year, 10th-percentage',
    status: '✅ Pass'
  },
  {
    tcId: 'TC-4.2',
    category: 'Education - 10th Standard',
    title: 'Invalid Percentage - Above 100',
    priority: 'P1 (High)',
    precondition: 'Education section open',
    steps: '1. Enter percentage value > 100 (e.g., 105)\n2. Click Update',
    expectedResult: 'Error: "Percentage must be between 0 and 100"\nUpdate blocked',
    testData: 'N/A',
    status: '❌ Negative'
  },
  {
    tcId: 'TC-4.3',
    category: 'Education - 10th Standard',
    title: 'Invalid Percentage - Negative Value',
    priority: 'P1 (High)',
    precondition: 'Education section open',
    steps: '1. Enter negative percentage (e.g., -5)\n2. Click Update',
    expectedResult: 'Error: "Percentage must be between 0 and 100"\nUpdate blocked',
    testData: 'N/A',
    status: '❌ Negative'
  },
  {
    tcId: 'TC-4.4',
    category: 'Education - 10th Standard',
    title: 'Required Fields Empty',
    priority: 'P1 (High)',
    precondition: 'Education section open',
    steps: '1. Leave Board empty\n2. Click Update',
    expectedResult: 'Error: "This field is required"\nUpdate blocked',
    testData: 'N/A',
    status: '❌ Negative'
  },

  // 5. Education - 12th Standard
  {
    tcId: 'TC-5.1',
    category: 'Education - 12th Standard',
    title: 'Select 12th Path',
    priority: 'P0 (Critical)',
    precondition: '10th data filled',
    steps: '1. Select "12th" from path selector\n2. Verify 12th fields appear\n3. Verify Diploma fields hidden',
    expectedResult: 'Only 12th fields visible\nDiploma section hidden',
    testData: '12th-Diploma = "12th"',
    status: '✅ Pass'
  },
  {
    tcId: 'TC-5.2',
    category: 'Education - 12th Standard',
    title: 'Fill 12th Standard - Valid Data',
    priority: 'P0 (Critical)',
    precondition: '12th path selected',
    steps: '1. Select Board (textfield dropdown)\n2. Select Year (must be after 10th year)\n3. Enter Percentage (textfield)\n4. Click Update',
    expectedResult: '12th data saved\nModal closes',
    testData: '12th-Board, 12th-Year, 12th-percentage',
    status: '✅ Pass'
  },
  {
    tcId: 'TC-5.3',
    category: 'Education - 12th Standard',
    title: '12th Year Before 10th Year',
    priority: 'P1 (High)',
    precondition: '10th Year = 2018',
    steps: '1. Select 12th Year = 2017 (before 10th)\n2. Click Update',
    expectedResult: 'Error: "12th year must be after 10th year"\nUpdate blocked',
    testData: 'N/A',
    status: '❌ Negative'
  },

  // 6. Education - Diploma
  {
    tcId: 'TC-6.1',
    category: 'Education - Diploma',
    title: 'Select Diploma Path',
    priority: 'P0 (Critical)',
    precondition: '10th data filled',
    steps: '1. Select "Diploma" from path selector\n2. Verify Diploma fields appear\n3. Verify 12th fields hidden',
    expectedResult: 'Only Diploma fields visible\n12th section hidden',
    testData: '12th-Diploma = "Diploma"',
    status: '✅ Pass'
  },
  {
    tcId: 'TC-6.2',
    category: 'Education - Diploma',
    title: 'Fill Diploma - Valid Data (Percentage)',
    priority: 'P0 (Critical)',
    precondition: 'Diploma path selected',
    steps: '1. Select State (textfield dropdown)\n2. Select City (cascades)\n3. Select College\n4. Enter Institution Name\n5. Select Year\n6. Select Mark Type = Percentage\n7. Enter Percentage\n8. Select Degree\n9. Select Department\n10. Click Update',
    expectedResult: 'Diploma data saved\nModal closes',
    testData: 'Diploma-State, Diploma-City, Diploma-College, Diploma-Year, Diploma-percentage, Diploma-Degree, Diploma-Department',
    status: '✅ Pass'
  },
  {
    tcId: 'TC-6.3',
    category: 'Education - Diploma',
    title: 'Fill Diploma - Valid Data (CGPA)',
    priority: 'P0 (Critical)',
    precondition: 'Diploma path selected',
    steps: '1. Fill all fields as TC-6.2\n2. Select Mark Type = CGPA\n3. Enter CGPA value ≤ Scale\n4. Click Update',
    expectedResult: 'Diploma data saved with CGPA',
    testData: 'Diploma-CGPA',
    status: '✅ Pass'
  },
  {
    tcId: 'TC-6.4',
    category: 'Education - Diploma',
    title: 'CGPA Exceeds Scale',
    priority: 'P1 (High)',
    precondition: 'Diploma path selected',
    steps: '1. Select Mark Type = CGPA\n2. Enter CGPA Scale = 10\n3. Enter CGPA value = 11\n4. Click Update',
    expectedResult: 'Error: "CGPA cannot exceed scale value"\nUpdate blocked',
    testData: 'N/A',
    status: '❌ Negative'
  },

  // 7. Internship Section
  {
    tcId: 'TC-7.1',
    category: 'Internship',
    title: 'Add Internship - Valid Data',
    priority: 'P0 (Critical)',
    precondition: 'Internship section open',
    steps: '1. Click Internship icon\n2. Click "Add Internship"\n3. Select Role (dropdown)\n4. Select Company (dropdown)\n5. Select Function (dropdown)\n6. Select Industry (dropdown)\n7. Select Start Date\n8. Select End Date (≥ Start)\n9. Select Skills (min 1)\n10. Click Update',
    expectedResult: 'Internship saved successfully\nModal closes',
    testData: 'Intern-Role, Intern-Company, Intern-Function, Intern-Industry, Intern-Started, Intern-Ended, Intern-Skills',
    status: '✅ Pass'
  },
  {
    tcId: 'TC-7.2',
    category: 'Internship',
    title: 'Industry = Other - Text Field Required',
    priority: 'P1 (High)',
    precondition: 'Internship section open',
    steps: '1. Select Industry = "Other"\n2. Verify Industry Text field appears\n3. Enter custom industry text\n4. Click Update',
    expectedResult: 'Custom industry saved',
    testData: 'Intern-Text-Industry',
    status: '✅ Pass'
  },
  {
    tcId: 'TC-7.3',
    category: 'Internship',
    title: 'End Date Before Start Date',
    priority: 'P1 (High)',
    precondition: 'Internship section open',
    steps: '1. Select Start Date = Jan 2024\n2. Select End Date = Dec 2023\n3. Click Update',
    expectedResult: 'Error: "End date must be after start date"\nUpdate blocked',
    testData: 'N/A',
    status: '❌ Negative'
  },
  {
    tcId: 'TC-7.4',
    category: 'Internship',
    title: 'No Skills Selected',
    priority: 'P1 (High)',
    precondition: 'Internship section open',
    steps: '1. Fill all fields except Skills\n2. Click Update',
    expectedResult: 'Error: "Select at least one skill"\nUpdate blocked',
    testData: 'N/A',
    status: '❌ Negative'
  },

  // 8. Certificate Section
  {
    tcId: 'TC-8.1',
    category: 'Certificate',
    title: 'Add Certificate - Valid Data',
    priority: 'P0 (Critical)',
    precondition: 'Certificate section open',
    steps: '1. Click Certificate icon\n2. Click "Add Certification"\n3. Enter Organization (dropdown)\n4. Enter Course Title (textfield)\n5. Select Start Date\n6. Select End Date\n7. Select Skills (min 1)\n8. Click Submit',
    expectedResult: 'Certificate saved\nVisible in resume',
    testData: 'Certificate-Institute, Certificate-Course, Certificate-Started, Certificate-Ended, Certificate-Skills',
    status: '✅ Pass'
  },
  {
    tcId: 'TC-8.2',
    category: 'Certificate',
    title: 'End Date Before Start Date',
    priority: 'P1 (High)',
    precondition: 'Certificate section open',
    steps: '1. Select Start Date = Jun 2024\n2. Select End Date = Jan 2024\n3. Click Submit',
    expectedResult: 'Error: "End date must be after start date"',
    testData: 'N/A',
    status: '❌ Negative'
  },
  {
    tcId: 'TC-8.3',
    category: 'Certificate',
    title: 'No Skills Selected',
    priority: 'P1 (High)',
    precondition: 'Certificate section open',
    steps: '1. Fill all fields except Skills\n2. Click Submit',
    expectedResult: 'Error: "Select at least one skill"',
    testData: 'N/A',
    status: '❌ Negative'
  },

  // 9. Project Section
  {
    tcId: 'TC-9.1',
    category: 'Project',
    title: 'Add Project - Valid Data',
    priority: 'P0 (Critical)',
    precondition: 'Project section open',
    steps: '1. Click Project icon\n2. Click "Add Project"\n3. Enter Project Title (textfield)\n4. Enter Company (optional)\n5. Select Start Date\n6. Select End Date\n7. Select Skills (min 1)\n8. Click Submit',
    expectedResult: 'Project saved successfully',
    testData: 'Project Title, Project-Company, Project-Started, Project-Ended, Project-Skills',
    status: '✅ Pass'
  },
  {
    tcId: 'TC-9.2',
    category: 'Project',
    title: 'Project Without Company (Optional)',
    priority: 'P2 (Medium)',
    precondition: 'Project section open',
    steps: '1. Fill all required fields\n2. Leave Company field empty\n3. Click Submit',
    expectedResult: 'Project saved (Company is optional)',
    testData: 'N/A',
    status: '✅ Pass'
  },
  {
    tcId: 'TC-9.3',
    category: 'Project',
    title: 'End Date Before Start Date',
    priority: 'P1 (High)',
    precondition: 'Project section open',
    steps: '1. Select Start Date = Mar 2024\n2. Select End Date = Feb 2024\n3. Click Submit',
    expectedResult: 'Error: "End date must be after start date"',
    testData: 'N/A',
    status: '❌ Negative'
  },

  // 10. Work Experience
  {
    tcId: 'TC-10.1',
    category: 'Work Experience',
    title: 'Add Work Experience - Valid Data',
    priority: 'P0 (Critical)',
    precondition: 'Work Experience section open',
    steps: '1. Click Work Experience icon\n2. Click "Add Work Experience"\n3. Select Role (dropdown)\n4. Select Company (dropdown)\n5. Select Function\n6. Select Industry\n7. Select Start/End Date\n8. Select Employment Type\n9. Enter Job Title\n10. Select Skills\n11. Click Submit',
    expectedResult: 'Work experience saved\nData persisted correctly',
    testData: 'Work-Role, Work-Company, Work-Function, Work-Industry, Work-Started, Work-Ended, Work-Job-Title, Work-Skills',
    status: '✅ Pass'
  },
  {
    tcId: 'TC-10.2',
    category: 'Work Experience',
    title: 'Industry = Other - Text Field Required',
    priority: 'P1 (High)',
    precondition: 'Work Experience section open',
    steps: '1. Select Industry = "Other"\n2. Enter custom industry text\n3. Complete other fields\n4. Click Submit',
    expectedResult: 'Custom industry saved',
    testData: 'Work-Text-Industry',
    status: '✅ Pass'
  },
  {
    tcId: 'TC-10.3',
    category: 'Work Experience',
    title: 'End Date Before Start Date',
    priority: 'P1 (High)',
    precondition: 'Work Experience section open',
    steps: '1. Select Start Date = Jul 2024\n2. Select End Date = Jun 2024',
    expectedResult: 'Error: "End date must be after start date"',
    testData: 'N/A',
    status: '❌ Negative'
  },
  {
    tcId: 'TC-10.4',
    category: 'Work Experience',
    title: 'No Skills Selected',
    priority: 'P1 (High)',
    precondition: 'Work Experience section open',
    steps: '1. Fill all fields except Skills\n2. Click Submit',
    expectedResult: 'Error: "Select at least one skill"',
    testData: 'N/A',
    status: '❌ Negative'
  },

  // 11. Non-Functional
  {
    tcId: 'TC-11.1',
    category: 'Non-Functional',
    title: 'Page Load Performance',
    priority: 'P1 (High)',
    precondition: 'None',
    steps: '1. Login and navigate to Dashboard\n2. Measure time to Dashboard visible',
    expectedResult: 'Dashboard visible within 15 seconds',
    testData: 'N/A',
    status: '✅ Pass'
  },
  {
    tcId: 'TC-11.2',
    category: 'Non-Functional',
    title: 'Modal Close Performance',
    priority: 'P2 (Medium)',
    precondition: 'Any section modal open',
    steps: '1. Open any section modal\n2. Fill and save data\n3. Measure modal close time',
    expectedResult: 'Modal closes within 3 seconds after save',
    testData: 'N/A',
    status: '✅ Pass'
  },
  {
    tcId: 'TC-11.3',
    category: 'Non-Functional',
    title: 'Dropdown Searchable',
    priority: 'P1 (High)',
    precondition: 'Any dropdown field',
    steps: '1. Click any textfield dropdown\n2. Type search text\n3. Verify filtered results',
    expectedResult: 'All dropdowns are searchable\nResults filter based on input',
    testData: 'N/A',
    status: '✅ Pass'
  },
  {
    tcId: 'TC-11.4',
    category: 'Non-Functional',
    title: 'Headless Browser Execution',
    priority: 'P1 (High)',
    precondition: 'Test environment ready',
    steps: '1. Run: npx playwright test tests/login-test.spec.ts',
    expectedResult: 'All tests pass in headless mode',
    testData: 'N/A',
    status: '✅ Pass'
  },
  {
    tcId: 'TC-11.5',
    category: 'Non-Functional',
    title: 'Network Delay Handling',
    priority: 'P2 (Medium)',
    precondition: 'Slow network simulated',
    steps: '1. Simulate slow network\n2. Perform save operations',
    expectedResult: 'Flow not broken\nWaits for networkidle state',
    testData: 'N/A',
    status: '✅ Pass'
  },

  // 12. Data Persistence
  {
    tcId: 'TC-12.1',
    category: 'Data Persistence',
    title: 'Saved Data Retained on Reopen',
    priority: 'P0 (Critical)',
    precondition: 'Any section saved',
    steps: '1. Fill and save any section\n2. Close modal\n3. Reopen same section',
    expectedResult: 'Previously saved data displayed correctly',
    testData: 'N/A',
    status: '✅ Pass'
  },
  {
    tcId: 'TC-12.2',
    category: 'Data Persistence',
    title: 'Multiple Section Updates',
    priority: 'P0 (Critical)',
    precondition: 'Resume page open',
    steps: '1. Fill Personal Info → Save\n2. Fill Education → Save\n3. Fill Internship → Save\n4. Fill Certificate → Save\n5. Fill Project → Save\n6. Fill Work Experience → Save',
    expectedResult: 'All sections saved independently\nNo data loss between sections',
    testData: 'All Excel fields',
    status: '✅ Pass'
  },

  // 13. Error Handling
  {
    tcId: 'TC-13.1',
    category: 'Error Handling',
    title: 'Screenshot on Failure',
    priority: 'P1 (High)',
    precondition: 'Test failure scenario',
    steps: '1. Trigger a test failure',
    expectedResult: 'Screenshot captured automatically\nAvailable in test report',
    testData: 'N/A',
    status: '✅ Pass'
  },
  {
    tcId: 'TC-13.2',
    category: 'Error Handling',
    title: 'Graceful UI Close',
    priority: 'P2 (Medium)',
    precondition: 'Modal already closed',
    steps: '1. Attempt to close already-closed modal',
    expectedResult: 'No error thrown\nAction ignored gracefully',
    testData: 'N/A',
    status: '✅ Pass'
  },
  {
    tcId: 'TC-13.3',
    category: 'Error Handling',
    title: 'Dropdown Option Not Found',
    priority: 'P2 (Medium)',
    precondition: 'Any dropdown field',
    steps: '1. Search for non-existent option in dropdown',
    expectedResult: 'Logged and continues\nNo crash',
    testData: 'N/A',
    status: '⚠️ Warning'
  }
];

function generateExcel() {
  const worksheetData = testCases.map(tc => ({
    'TC ID': tc.tcId,
    'Category': tc.category,
    'Test Case Title': tc.title,
    'Priority': tc.priority,
    'Precondition': tc.precondition,
    'Steps': tc.steps,
    'Expected Result': tc.expectedResult,
    'Test Data': tc.testData,
    'Status': tc.status
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 10 },  // TC ID
    { wch: 25 },  // Category
    { wch: 40 },  // Title
    { wch: 15 },  // Priority
    { wch: 30 },  // Precondition
    { wch: 60 },  // Steps
    { wch: 50 },  // Expected Result
    { wch: 40 },  // Test Data
    { wch: 12 }   // Status
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Test Cases');

  // Add summary sheet
  const summaryData = [
    { Category: 'Login & Authentication', 'Total Tests': 4, 'P0': 1, 'P1': 3, 'P2': 0 },
    { Category: 'Resume Navigation', 'Total Tests': 2, 'P0': 2, 'P1': 0, 'P2': 0 },
    { Category: 'Personal Information', 'Total Tests': 5, 'P0': 1, 'P1': 2, 'P2': 2 },
    { Category: 'Education - 10th Standard', 'Total Tests': 4, 'P0': 1, 'P1': 3, 'P2': 0 },
    { Category: 'Education - 12th Standard', 'Total Tests': 3, 'P0': 2, 'P1': 1, 'P2': 0 },
    { Category: 'Education - Diploma', 'Total Tests': 4, 'P0': 2, 'P1': 2, 'P2': 0 },
    { Category: 'Internship', 'Total Tests': 4, 'P0': 1, 'P1': 3, 'P2': 0 },
    { Category: 'Certificate', 'Total Tests': 3, 'P0': 1, 'P1': 2, 'P2': 0 },
    { Category: 'Project', 'Total Tests': 3, 'P0': 1, 'P1': 1, 'P2': 1 },
    { Category: 'Work Experience', 'Total Tests': 4, 'P0': 1, 'P1': 3, 'P2': 0 },
    { Category: 'Non-Functional', 'Total Tests': 5, 'P0': 0, 'P1': 3, 'P2': 2 },
    { Category: 'Data Persistence', 'Total Tests': 2, 'P0': 2, 'P1': 0, 'P2': 0 },
    { Category: 'Error Handling', 'Total Tests': 3, 'P0': 0, 'P1': 1, 'P2': 2 },
    { Category: 'TOTAL', 'Total Tests': 46, 'P0': 15, 'P1': 24, 'P2': 7 }
  ];

  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  summarySheet['!cols'] = [
    { wch: 30 },
    { wch: 12 },
    { wch: 8 },
    { wch: 8 },
    { wch: 8 }
  ];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  const outputPath = path.join(__dirname, '..', 'docs', 'TestCases-Student-Resume-Builder.xlsx');
  XLSX.writeFile(workbook, outputPath);

  console.log(`✅ Excel file generated: ${outputPath}`);
  console.log(`📊 Total Test Cases: ${testCases.length}`);
}

generateExcel();

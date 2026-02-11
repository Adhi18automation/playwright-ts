---
description: Run student onboarding E2E test suite for resume builder
---

# Student Onboarding Workflow

This workflow runs the complete student onboarding test automation suite for the Resume Builder platform.

## Prerequisites

1. Ensure Node.js and npm are installed
2. Ensure Playwright browsers are installed
3. Test data Excel file exists at `testdata/testdata.xlsx` with sheet `StudentData`

## Test Data Setup

The test data Excel file should contain these columns:
- **Authentication**: `Student-Email-ID`, `Student-PassWord`
- **Address**: `Country`, `State`, `City`, `Pincode`
- **10th Standard**: `10th-Board`, `10th-Year`, `10th-percentage`
- **12th/Diploma**: `12th-Diploma` (value: "12th" or "Diploma")
- **12th Details** (if 12th): `12th-Board`, `12th-Year`, `12th-percentage`
- **Diploma Details** (if Diploma): `Diploma-State`, `Diploma-City`, `Diploma-College`, `Diploma-Year`, `Diploma-markType`, `Diploma-percentage`, `Diploma-CGPA`, `Diploma-Degree`, `Diploma-Department`
- **Internship**: `Intern-Role`, `Intern-Company`, `Intern-Function`, `Intern-Industry`, `Intern-Text-Industry`, `Intern-Started`, `Intern-Ended`, `Intern-Skills`
- **Certificate**: `Certificate-Institute`, `Certificate-Course`, `Certificate-Started`, `Certificate-Ended`, `Certificate-Skills`
- **Project**: `Project Title`, `Project-Company`, `Project-Started`, `Project-Ended`, `Project-Skills`
- **Work Experience**: `Work-Role`, `Work-Company`, `Work-Function`, `Work-Industry`, `Work-Text-Industry`, `Work-Started`, `Work-Ended`, `Work-Job-Title`, `Work-Skills`

## Steps to Run

// turbo
1. Install dependencies:
```bash
npm install
```

// turbo
2. Install Playwright browsers (if not already installed):
```bash
npx playwright install
```

3. Run the student onboarding test suite:
```bash
npx playwright test tests/login-test.spec.ts --headed
```

4. Run in headless mode (CI/CD):
```bash
npx playwright test tests/login-test.spec.ts
```

5. Run with specific worker count:
```bash
npx playwright test tests/login-test.spec.ts --workers=1
```

6. View test report after execution:
```bash
npx playwright show-report
```

## Test Sections Covered

The test suite covers these sections in order (serial execution):

| # | Section | Page Object | Test Actions |
|---|---------|-------------|--------------|
| 1 | **Personal Information** | `PersonalInformationPage` | Fill address, set "Anywhere" preference |
| 2 | **Education - 10th** | `EducationalPage` | Board, Year, Marks |
| 3 | **Education - 12th/Diploma** | `TwelfthInformationPage` / `DiplomaInformationPage` | Conditional path based on data |
| 4 | **Internship** | `InternshipPage` | Role, Company, Function, Industry, Dates, Skills |
| 5 | **Certificate** | `CertificatePage` | Organization, Title, Dates, Skills |
| 6 | **Project** | `ProjectPage` | Title, Company, Dates, Skills |
| 7 | **Work Experience** | `WorkExperiencePage` | Role, Company, Function, Industry, Dates, Title, Skills |

## Debugging Failed Tests

1. Check screenshots in `test-results/screenshots/` folder
2. Review console logs for step-by-step progress
3. Run with debug mode:
```bash
npx playwright test tests/login-test.spec.ts --debug
```

4. Run with UI mode for interactive debugging:
```bash
npx playwright test tests/login-test.spec.ts --ui
```

## Environment

- **UAT URL**: https://auth.uat.pluginlive.com/
- **Framework**: Playwright + TypeScript
- **Pattern**: Page Object Model (POM)
- **UI Library**: Ant Design components

## Utilities Used

- `excelReader` - Read test data from Excel
- `closeUi` - Close dialog/drawer after form submission
- `AntdDropdownUtil` - Handle Ant Design dropdowns
- `AntdMonthPickerUtil` - Handle Ant Design date pickers
- `AntdMultiSelectUtil` - Handle multi-select dropdowns

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Login timeout | Check network connectivity, verify credentials in Excel |
| Dropdown not selecting | Increase wait time, check if dropdown options loaded |
| Date picker issues | Verify date format (YYYY-MM) in Excel data |
| Institution name field not appearing | Wait 2 seconds after college selection |
| Form submission fails | Check for validation errors, verify all required fields |

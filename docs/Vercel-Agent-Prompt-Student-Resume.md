# 🤖 Vercel Browser Agent Prompt - Student Resume Builder

**Application URL:** https://auth.uat.pluginlive.com/

---

## Master Prompt

```
You are a browser automation agent testing the Student Resume Builder application.
Your task is to complete the student resume onboarding flow by filling all sections with the provided test data.
Execute each step carefully, wait for elements to load, and verify success after each action.
```

---

## 1. Login Flow Prompt

```
TASK: Login to Student Portal

STEPS:
1. Navigate to https://auth.uat.pluginlive.com/
2. Wait for the login page to fully load
3. Find the email input field and enter: {{STUDENT_EMAIL}}
4. Find the password input field and enter: {{STUDENT_PASSWORD}}
5. Find and click the "Agree to terms and conditions" checkbox
6. Click the Login button
7. Wait for redirect to Dashboard
8. Verify Dashboard is visible

SUCCESS CRITERIA:
- Dashboard page is displayed
- URL contains "/dashboard"
- No error messages visible

TEST DATA:
- STUDENT_EMAIL: "test@example.com"
- STUDENT_PASSWORD: "TestPass123"
```

---

## 2. Navigate to Resume Prompt

```
TASK: Navigate to My Resume Section

PRECONDITION: User is logged in and on Dashboard

STEPS:
1. Wait for Dashboard to fully load
2. Find and click the "My Resume" button
3. Wait for Resume page to load
4. Verify all section icons are visible (Personal, Education, Internship, Certificate, Project, Work Experience)

SUCCESS CRITERIA:
- Resume page is displayed
- All section icons are clickable
```

---

## 3. Personal Information Prompt

```
TASK: Fill Personal Information Section

STEPS:
1. Click on the Personal Information section icon
2. Wait for the modal/drawer to open
3. Click on "Additional Information" icon if present
4. Find the Country dropdown (searchable textfield dropdown)
   - Click on it
   - Type "{{COUNTRY}}" to search
   - Select the matching option
5. Find the State dropdown (cascades from Country)
   - Click on it
   - Type "{{STATE}}" to search
   - Select the matching option
6. Find the City dropdown (cascades from State)
   - Click on it
   - Type "{{CITY}}" to search
   - Select the matching option
7. Find the Pincode textfield
   - Clear existing value
   - Enter "{{PINCODE}}" (6 digits)
8. Find and check the "Permanent Address" checkbox if not checked
9. Find and check the "Same as Permanent Address" checkbox
10. Click the "Update" button
11. Wait for modal to close

SUCCESS CRITERIA:
- Modal closes within 3 seconds
- No error messages displayed
- Data saved successfully

TEST DATA:
- COUNTRY: "India"
- STATE: "Tamil Nadu"
- CITY: "Chennai"
- PINCODE: "600001"
```

---

## 4. Education - 10th Standard Prompt

```
TASK: Fill 10th Standard Education Details

STEPS:
1. Click on the Education section icon
2. Wait for the education modal to open
3. Find the Board dropdown (textfield dropdown)
   - Click on it
   - Type "{{10TH_BOARD}}" to search
   - Select the matching option
4. Find the Year dropdown (textfield dropdown)
   - Click on it
   - Select "{{10TH_YEAR}}"
5. Find the Percentage textfield
   - Clear existing value
   - Enter "{{10TH_PERCENTAGE}}"
6. Click the "Update" button
7. Wait for save confirmation

SUCCESS CRITERIA:
- 10th standard data saved
- Percentage is between 0-100
- No validation errors

TEST DATA:
- 10TH_BOARD: "CBSE"
- 10TH_YEAR: "2018"
- 10TH_PERCENTAGE: "85"
```

---

## 5. Education - 12th Standard Prompt

```
TASK: Fill 12th Standard Education Details

PRECONDITION: 10th standard data is filled

STEPS:
1. Find the path selector (12th / Diploma toggle)
2. Select "12th" option
3. Verify 12th fields are visible and Diploma fields are hidden
4. Find the Board dropdown (textfield dropdown)
   - Click on it
   - Type "{{12TH_BOARD}}" to search
   - Select the matching option
5. Find the Year dropdown (textfield dropdown)
   - Click on it
   - Select "{{12TH_YEAR}}" (must be after 10th year)
6. Find the Percentage textfield
   - Clear existing value
   - Enter "{{12TH_PERCENTAGE}}"
7. Click the "Update" button
8. Wait for modal to close

SUCCESS CRITERIA:
- 12th data saved
- Year is after 10th year
- Modal closes properly

TEST DATA:
- 12TH_BOARD: "CBSE"
- 12TH_YEAR: "2020"
- 12TH_PERCENTAGE: "88"
```

---

## 6. Education - Diploma Prompt (Alternative Path)

```
TASK: Fill Diploma Education Details

PRECONDITION: 10th standard data is filled

STEPS:
1. Find the path selector (12th / Diploma toggle)
2. Select "Diploma" option
3. Verify Diploma fields are visible and 12th fields are hidden
4. Find the State dropdown (textfield dropdown)
   - Click on it
   - Type "{{DIPLOMA_STATE}}" to search
   - Select the matching option
5. Find the City dropdown (cascades from State)
   - Click on it
   - Type "{{DIPLOMA_CITY}}" to search
   - Select the matching option
6. Find the College dropdown (textfield dropdown)
   - Click on it
   - Type "{{DIPLOMA_COLLEGE}}" to search
   - Select the matching option
7. Find the Institution Name textfield
   - Wait for field to appear after college selection
   - Enter "{{INSTITUTION_NAME}}"
8. Find the Year dropdown
   - Select "{{DIPLOMA_YEAR}}"
9. Find the Mark Type dropdown
   - Select "{{MARK_TYPE}}" (Percentage or CGPA)
10. If Percentage selected:
    - Enter "{{DIPLOMA_PERCENTAGE}}" in percentage field
11. If CGPA selected:
    - Enter "{{DIPLOMA_CGPA}}" (must be ≤ scale value)
12. Find the Degree dropdown
    - Type "{{DIPLOMA_DEGREE}}" to search
    - Select the matching option
13. Find the Department dropdown
    - Type "{{DIPLOMA_DEPARTMENT}}" to search
    - Select the matching option
14. Click the "Update" button
15. Wait for modal to close

SUCCESS CRITERIA:
- Diploma data saved
- All cascading dropdowns work correctly
- Modal closes properly

TEST DATA:
- DIPLOMA_STATE: "Tamil Nadu"
- DIPLOMA_CITY: "Chennai"
- DIPLOMA_COLLEGE: "Anna University"
- INSTITUTION_NAME: "Anna University Main Campus"
- DIPLOMA_YEAR: "2021"
- MARK_TYPE: "Percentage"
- DIPLOMA_PERCENTAGE: "82"
- DIPLOMA_DEGREE: "Diploma in Computer Science"
- DIPLOMA_DEPARTMENT: "Computer Science"
```

---

## 7. Internship Section Prompt

```
TASK: Add Internship Experience

STEPS:
1. Click on the Internship section icon
2. Wait for the internship modal to open
3. Click "Add Internship" button
4. Find the Role dropdown (textfield dropdown)
   - Click on it
   - Type "{{INTERN_ROLE}}" to search
   - Select the matching option
5. Find the Company dropdown (textfield dropdown)
   - Click on it
   - Type "{{INTERN_COMPANY}}" to search
   - Select the first matching option
6. Find the Function dropdown (textfield dropdown)
   - Click on it
   - Type "{{INTERN_FUNCTION}}" to search
   - Select the matching option
7. Find the Industry dropdown (textfield dropdown)
   - Click on it
   - Type "{{INTERN_INDUSTRY}}" to search
   - Select the matching option
8. If Industry is "Other":
   - Find the Industry Text field
   - Enter "{{INTERN_TEXT_INDUSTRY}}"
9. Find the Start Date picker (Month-Year)
   - Click on it
   - Select year "{{INTERN_START_YEAR}}"
   - Select month "{{INTERN_START_MONTH}}"
10. Find the End Date picker (Month-Year)
    - Click on it
    - Select year "{{INTERN_END_YEAR}}"
    - Select month "{{INTERN_END_MONTH}}"
11. Find the Skills multi-select dropdown
    - Click on it
    - Type "{{INTERN_SKILL}}" to search
    - Select at least one skill
12. Click the "Update" button
13. Wait for modal to close

SUCCESS CRITERIA:
- Internship entry saved
- End date is after start date
- At least 1 skill selected
- Modal closes properly

TEST DATA:
- INTERN_ROLE: "Software Developer"
- INTERN_COMPANY: "TCS"
- INTERN_FUNCTION: "Engineering"
- INTERN_INDUSTRY: "IT Services"
- INTERN_START_YEAR: "2023"
- INTERN_START_MONTH: "Jun"
- INTERN_END_YEAR: "2023"
- INTERN_END_MONTH: "Aug"
- INTERN_SKILL: "JavaScript"
```

---

## 8. Certificate Section Prompt

```
TASK: Add Certification

STEPS:
1. Click on the Certificate section icon
2. Wait for the certificate modal to open
3. Click "Add Certification" button
4. Find the Organization/Institute dropdown (textfield dropdown)
   - Click on it
   - Type "{{CERT_INSTITUTE}}" to search
   - Select the matching option
5. Find the Course Title textfield
   - Enter "{{CERT_COURSE}}"
6. Find the Start Date picker
   - Select "{{CERT_START_YEAR}}" and "{{CERT_START_MONTH}}"
7. Find the End Date picker
   - Select "{{CERT_END_YEAR}}" and "{{CERT_END_MONTH}}"
8. Find the Skills multi-select dropdown
   - Click on it
   - Type "{{CERT_SKILL}}" to search
   - Select at least one skill
9. Click the "Submit" button
10. Wait for modal to close

SUCCESS CRITERIA:
- Certificate entry saved
- Visible in resume
- Modal closes properly

TEST DATA:
- CERT_INSTITUTE: "Coursera"
- CERT_COURSE: "Python for Data Science"
- CERT_START_YEAR: "2023"
- CERT_START_MONTH: "Jan"
- CERT_END_YEAR: "2023"
- CERT_END_MONTH: "Mar"
- CERT_SKILL: "Python"
```

---

## 9. Project Section Prompt

```
TASK: Add Project Details

STEPS:
1. Click on the Project section icon
2. Wait for the project modal to open
3. Click "Add Project" button
4. Find the Project Title textfield
   - Enter "{{PROJECT_TITLE}}"
5. Find the Company textfield (optional)
   - Enter "{{PROJECT_COMPANY}}" or leave empty
6. Find the Start Date picker
   - Select "{{PROJECT_START_YEAR}}" and "{{PROJECT_START_MONTH}}"
7. Find the End Date picker
   - Select "{{PROJECT_END_YEAR}}" and "{{PROJECT_END_MONTH}}"
8. Find the Skills multi-select dropdown
   - Click on it
   - Type "{{PROJECT_SKILL}}" to search
   - Select at least one skill
9. Click the "Submit" button
10. Wait for modal to close

SUCCESS CRITERIA:
- Project entry saved
- Modal closes properly

TEST DATA:
- PROJECT_TITLE: "E-commerce Website"
- PROJECT_COMPANY: "Personal Project"
- PROJECT_START_YEAR: "2023"
- PROJECT_START_MONTH: "Sep"
- PROJECT_END_YEAR: "2023"
- PROJECT_END_MONTH: "Dec"
- PROJECT_SKILL: "React"
```

---

## 10. Work Experience Section Prompt

```
TASK: Add Work Experience

STEPS:
1. Click on the Work Experience section icon
2. Wait for the work experience modal to open
3. Click "Add Work Experience" button
4. Find the Role dropdown (textfield dropdown)
   - Click on it
   - Type "{{WORK_ROLE}}" to search
   - Select the matching option
5. Find the Company dropdown (textfield dropdown)
   - Click on it
   - Type "{{WORK_COMPANY}}" to search
   - Select the first matching option
6. Find the Function dropdown (textfield dropdown)
   - Click on it
   - Type "{{WORK_FUNCTION}}" to search
   - Select the matching option
7. Find the Industry dropdown (textfield dropdown)
   - Click on it
   - Type "{{WORK_INDUSTRY}}" to search
   - Select the matching option
8. If Industry is "Other":
   - Find the Industry Text field
   - Enter "{{WORK_TEXT_INDUSTRY}}"
9. Find the Start Date picker
   - Select "{{WORK_START_YEAR}}" and "{{WORK_START_MONTH}}"
10. Find the End Date picker
    - Select "{{WORK_END_YEAR}}" and "{{WORK_END_MONTH}}"
11. Find the Employment Type dropdown
    - Select "{{EMPLOYMENT_TYPE}}" (Full-time or Part-time)
12. Find the Job Title textfield
    - Enter "{{WORK_JOB_TITLE}}"
13. Find the Skills multi-select dropdown
    - Click on it
    - Type "{{WORK_SKILL}}" to search
    - Select at least one skill
14. Click the "Submit" button
15. Wait for modal to close

SUCCESS CRITERIA:
- Work experience entry saved
- End date is after start date
- At least 1 skill selected
- Modal closes properly

TEST DATA:
- WORK_ROLE: "Software Engineer"
- WORK_COMPANY: "Infosys"
- WORK_FUNCTION: "Engineering"
- WORK_INDUSTRY: "IT Services"
- WORK_START_YEAR: "2024"
- WORK_START_MONTH: "Jan"
- WORK_END_YEAR: "2024"
- WORK_END_MONTH: "Present"
- EMPLOYMENT_TYPE: "Full-time"
- WORK_JOB_TITLE: "Junior Software Engineer"
- WORK_SKILL: "TypeScript"
```

---

## Complete E2E Flow Prompt

```
TASK: Complete Student Resume Onboarding (End-to-End)

You are testing the Student Resume Builder application. Execute all steps in sequence:

1. LOGIN
   - Go to https://auth.uat.pluginlive.com/
   - Enter email: {{STUDENT_EMAIL}}
   - Enter password: {{STUDENT_PASSWORD}}
   - Check "Agree to terms" checkbox
   - Click Login
   - Wait for Dashboard

2. NAVIGATE TO RESUME
   - Click "My Resume" button
   - Wait for Resume page

3. PERSONAL INFORMATION
   - Click Personal Info icon
   - Select Country: {{COUNTRY}}
   - Select State: {{STATE}}
   - Select City: {{CITY}}
   - Enter Pincode: {{PINCODE}}
   - Check "Permanent Address" checkbox
   - Check "Same as Permanent Address" checkbox
   - Click Update

4. EDUCATION - 10TH
   - Click Education icon
   - Select Board: {{10TH_BOARD}}
   - Select Year: {{10TH_YEAR}}
   - Enter Percentage: {{10TH_PERCENTAGE}}
   - Click Update

5. EDUCATION - 12TH (or Diploma based on path)
   - Select "12th" path
   - Select Board: {{12TH_BOARD}}
   - Select Year: {{12TH_YEAR}}
   - Enter Percentage: {{12TH_PERCENTAGE}}
   - Click Update

6. INTERNSHIP
   - Click Internship icon
   - Click "Add Internship"
   - Select Role: {{INTERN_ROLE}}
   - Select Company: {{INTERN_COMPANY}}
   - Select Function: {{INTERN_FUNCTION}}
   - Select Industry: {{INTERN_INDUSTRY}}
   - Select Start Date: {{INTERN_STARTED}}
   - Select End Date: {{INTERN_ENDED}}
   - Select Skills: {{INTERN_SKILLS}}
   - Click Update

7. CERTIFICATE
   - Click Certificate icon
   - Click "Add Certification"
   - Enter Organization: {{CERT_INSTITUTE}}
   - Enter Course: {{CERT_COURSE}}
   - Select Start/End Dates
   - Select Skills: {{CERT_SKILLS}}
   - Click Submit

8. PROJECT
   - Click Project icon
   - Click "Add Project"
   - Enter Title: {{PROJECT_TITLE}}
   - Enter Company: {{PROJECT_COMPANY}}
   - Select Start/End Dates
   - Select Skills: {{PROJECT_SKILLS}}
   - Click Submit

9. WORK EXPERIENCE
   - Click Work Experience icon
   - Click "Add Work Experience"
   - Select Role: {{WORK_ROLE}}
   - Select Company: {{WORK_COMPANY}}
   - Select Function: {{WORK_FUNCTION}}
   - Select Industry: {{WORK_INDUSTRY}}
   - Select Start/End Dates
   - Select Employment Type: Full-time
   - Enter Job Title: {{WORK_JOB_TITLE}}
   - Select Skills: {{WORK_SKILLS}}
   - Click Submit

VALIDATION RULES:
- Email must be valid format
- Pincode must be 6 digits numeric
- Percentage must be 0-100
- End Date must be >= Start Date
- At least 1 skill required for Internship, Certificate, Project, Work
- 12th Year must be after 10th Year

ERROR HANDLING:
- If element not found, wait 5 seconds and retry
- If dropdown option not found, log and continue
- If modal doesn't close, click outside to dismiss
- Take screenshot on any failure

SUCCESS CRITERIA:
- All sections completed without errors
- Resume data persisted correctly
- UI remains stable throughout
```

---

## UI Component Reference

| Component Type | Interaction Method |
|---------------|-------------------|
| Textfield Dropdown | Click → Type to search → Select from filtered list |
| Dropdown | Click → Select option |
| Textfield | Click → Clear → Type value |
| Checkbox | Click to toggle |
| Month-Year Picker | Click → Select Year → Select Month |
| Multi-select | Click → Type to search → Select multiple options → Click outside to close |
| Button | Wait for enabled → Click |
| Modal/Drawer | Wait for animation → Interact → Wait for close |

---

## Notes for Agent

1. **Wait Strategy:** Always wait for elements to be visible and interactive before clicking
2. **Dropdown Handling:** All dropdowns are searchable - type to filter options
3. **Cascading Dropdowns:** State depends on Country, City depends on State
4. **Modal Behavior:** Modals close automatically after successful save
5. **Network Handling:** Wait for network idle after save operations
6. **Error Recovery:** If action fails, wait and retry up to 3 times

# 📄 Product Requirement Document (PRD)

**Feature:** Student Resume Onboarding (My Resume Module)

---

## 1. Overview

- **Feature Name:** Student Resume Onboarding
- **Module:** My Resume
- **Target Users:** Logged-in Students
- **Platform:** Student Portal
- **URL:** https://auth.uat.pluginlive.com/

**Purpose:**
Allow students to complete and update all resume-related information including personal details, education, internship, projects, certificates, and work experience.

---

## 2. User Story

> As a logged-in student,
> I want to fill and update my resume information,
> So that my profile is complete and ready for opportunities.

---

## 3. Preconditions

- Student has a valid account
- Student can log in successfully
- Student is redirected to Dashboard
- Student has access to My Resume module
- Student data is available (Excel / backend source)

---

## 4. High-Level Flow

1. Student logs in
2. Student navigates to Dashboard
3. Student clicks My Resume
4. Student fills each resume section
5. System saves data successfully
6. UI closes after update

---

## 5. Functional Requirements (Mapped to Your Code)

### 5.1 Login & Resume Navigation

**Description:** System must allow student to log in and access My Resume.

**Steps:**
1. Open application ✅
2. Enter email and password ✅
3.click checkbox ✅ (Agree to all the terms and conditions)
4. Click Login ✅
5. Redirect to Dashboard ✅
6. Click My Resume ✅

**Expected Result:**
- Dashboard is visible ✅
- Resume page loads successfully ✅

---

### 5.2 Personal Information Section

**Description:** Student must be able to update personal and address details.

**Fields:**
- Country ✅ (textfield dropdown)
- State ✅ (textfield dropdown)
- City ✅ (textfield dropdown)
- Pincode ✅ (textfield)
- Permanent Address (checkbox) ✅ 
- Same as Permanent Address (checkbox) ✅

**Behavior:**
- Selecting "Anywhere" enables permanent address ✅
- Same-as-permanent copies address ✅

**Expected Result:**
- Data is saved successfully ✅
- UI closes after update ✅

---

### 5.3 Education Section (10th + 12th / Diploma)

**Description:** Student must add educational qualifications.

**Common (10th):**
- Board ✅  (textfield dropdown)
- Year ✅ (textfield dropdown)
- Percentage ✅ (textfield)

**Conditional Logic:**

If **12th** selected:
- Board ✅  (textfield dropdown)
- Year ✅ (textfield dropdown)
- Percentage ✅ (textfield)

If **Diploma** selected:
- State ✅  (textfield dropdown)
- City ✅ (textfield dropdown)
- College ✅ (textfield dropdown)
- Institution Name ✅ (textfield)
- Year ✅ (textfield dropdown)
- Marks Type (Percentage / CGPA) ✅ (textfield dropdown)
- Degree ✅  (textfield dropdown)
- Department ✅ (textfield dropdown)

**Expected Result:**
- Education details saved ✅
- Conditional fields handled correctly ✅

---

### 5.4 Internship Section

**Description:** Student must add internship experience.

**Fields:**
- Role ✅ (textfield dropdown)
- Company ✅ (textfield dropdown) 
- Function ✅ (textfield dropdown)
- Industry ✅ (textfield dropdown)
- Industry Text (if Other) ✅ (textfield)
- Start Date ✅ (dropdown)
- End Date ✅ (dropdown)
- Skills ✅ (textfield dropdown)

**Expected Result:**
- Internship entry saved successfully ✅

---

### 5.5 Certificate Section

**Description:** Student must add certifications.

**Fields:**
- Organization / Institute ✅ (textfield dropdown)
- Course Title ✅ (textfield)
- Start Date ✅ (dropdown)
- End Date ✅ (dropdown)
- Skills ✅ (textfield dropdown)

**Expected Result:**
- Certificate saved and visible in resume ✅

---

### 5.6 Project Section

**Description:** Student must add project details.

**Fields:**
- Project Title ✅ (textfield)
- Company (optional) ✅ (textfield)
- Start Date ✅ (dropdown)
- End Date ✅ (dropdown)
- Skills ✅ (textfield dropdown)

**Expected Result:**
- Project saved successfully ✅

---

### 5.7 Work Experience Section

**Description:** Student must add work experience.

**Fields:**
- Role ✅   (textfield dropdown)
- Company ✅ (textfield dropdown)
- Function ✅ (textfield dropdown)
- Industry ✅ (textfield dropdown)
- Industry Text (if Other) ✅ (textfield)
- Start Date ✅ (dropdown)
- End Date ✅ (dropdown)
- Employment Type (Full-time / Part-time) ✅ (textfield dropdown)
- Job Title ✅ (textfield)
- Skills ✅ (textfield dropdown)

**Expected Result:**
- Work experience saved ✅
- Data persisted correctly ✅

---

## 6. Non-Functional Requirements

- Page must load reliably without hard waits
- All dropdowns must be searchable
- Network delays must not break flow
- Errors must not crash the session
- Works in headless browser execution
- Dashboard visible within 15 seconds
- Modal closes within 3 seconds after save

---

## 7. Validation Rules

- **Email**
  - Rule: Must be valid email format
  - Example: `student@example.com`
  - Error: "Please enter a valid email address"

- **Required Fields**
  - Rule: Cannot be empty or null
  - Applies to: All mandatory fields (Country, State, City, Board, Year, etc.)
  - Error: "This field is required"

- **Dates (Start/End)**
  - Rule: End date must be greater than or equal to Start date
  - Format: YYYY-MM (Month-Year picker)
  - Error: "End date must be after start date"

- **Marks/Percentage**
  - Rule: Numeric value between 0 and 100
  - Applies to: 10th percentage, 12th percentage, Diploma percentage
  - Error: "Percentage must be between 0 and 100"

- **CGPA**
  - Rule: Must be less than or equal to Scale value
  - Example: If Scale = 10, CGPA cannot exceed 10
  - Error: "CGPA cannot exceed scale value"

- **Pincode**
  - Rule: Exactly 6 digits numeric
  - Regex: `/^\d{6}$/`
  - Error: "Pincode must be 6 digits"

- **Skills**
  - Rule: Minimum 1 skill must be selected
  - Applies to: Internship, Certificate, Project, Work Experience
  - Error: "Select at least one skill"

- **12th Year**
  - Rule: Must be after 10th passing year
  - Example: If 10th = 2018, 12th must be ≥ 2019
  - Error: "12th year must be after 10th year"

---

## 8. Acceptance Criteria (Direct Automation Mapping)

### AC-1: Successful Resume Completion

- **Given** student logs in
- **When** student fills all resume sections
- **Then** resume data is saved successfully
- ✅ Resume update successful

### AC-2: Conditional Education Logic

- **Given** student selects 12th
- **Then** Diploma fields are hidden

- **Given** student selects Diploma
- **Then** 12th fields are hidden

### AC-3: UI Stability

- **After** each update
- **Then** Resume drawer/modal closes safely

### AC-4: Data Persistence

- **Given** student saves a section
- **When** student reopens the section
- **Then** Previously saved data is displayed

---

## 9. Error Handling

- If page load fails → retry waits with timeout
- If UI already closed → ignore close action gracefully
- If dropdown option not found → log and continue
- If network timeout → wait for networkidle state
- Screenshot captured on failures
- Console logs for debugging

---

## 10. Test Data Source

- **Excel file:** `testdata/testdata.xlsx`
- **Sheet:** `StudentData`
- **Structure:** One row per student

**Authentication Fields:**
- `Student-Email-ID` — Student login email
- `Student-PassWord` — Student login password

**Address Fields:**
- `Country` — Country selection for address
- `State` — State selection (cascades from Country)
- `City` — City selection (cascades from State)
- `Pincode` — 6-digit postal code

**10th Standard Fields:**
- `10th-Board` — Education board (CBSE, ICSE, State Board, etc.)
- `10th-Year` — Passing year
- `10th-percentage` — Marks obtained (0-100)

**Path Selection:**
- `12th-Diploma` — Value "12th" or "Diploma" determines which education path to fill

**12th Standard Fields (if path = 12th):**
- `12th-Board` — Education board
- `12th-Year` — Passing year (must be after 10th)
- `12th-percentage` — Marks obtained (0-100)

**Diploma Fields (if path = Diploma):**
- `Diploma-State` — State where college is located
- `Diploma-City` — City of college (cascades from State)
- `Diploma-College` — College name (searchable dropdown)
- `Diploma-Year` — Passing year
- `Diploma-markType` — "Percentage" or "CGPA"
- `Diploma-percentage` — Marks if markType is Percentage
- `Diploma-CGPA` — CGPA scale value if markType is CGPA
- `Diploma-Degree` — Degree name
- `Diploma-Department` — Department/Branch

**Internship Fields:**
- `Intern-Role` — Job role (searchable dropdown)
- `Intern-Company` — Company name (searchable dropdown)
- `Intern-Function` — Job function category
- `Intern-Industry` — Industry type
- `Intern-Text-Industry` — Custom industry text (if Industry = "Other")
- `Intern-Started` — Start date (YYYY-MM)
- `Intern-Ended` — End date (YYYY-MM)
- `Intern-Skills` — Skills used (multi-select)

**Certificate Fields:**
- `Certificate-Institute` — Organization/Institute name
- `Certificate-Course` — Course/Certification title
- `Certificate-Started` — Start date
- `Certificate-Ended` — End date
- `Certificate-Skills` — Skills gained

**Project Fields:**
- `Project Title` — Name of the project
- `Project-Company` — Associated company (optional)
- `Project-Started` — Start date
- `Project-Ended` — End date
- `Project-Skills` — Technologies/Skills used

**Work Experience Fields:**
- `Work-Role` — Job role
- `Work-Company` — Company name
- `Work-Function` — Job function
- `Work-Industry` — Industry type
- `Work-Text-Industry` — Custom industry (if Other)
- `Work-Started` — Start date
- `Work-Ended` — End date
- `Work-Job-Title` — Official job title
- `Work-Skills` — Skills used

---

## 11. Automation Readiness

✅ **This PRD is fully automation-ready**

Can be used by:
- Vercel Browser Agent
- Playwright (TypeScript)
- Windsurf AI
- Any BDD/TDD framework

**Test Execution Commands:**
```bash
# Run all tests
npx playwright test tests/login-test.spec.ts --headed

# Run specific section
npx playwright test tests/login-test.spec.ts -g "Personal Information" --headed

# Debug mode
npx playwright test tests/login-test.spec.ts --debug

# Headless CI mode
npx playwright test tests/login-test.spec.ts
```

---

## 12. PRD → Your Code Mapping (Proof)

**Page Objects:**

- **Login**
  - Page Object: `LoginPage`
  - File: `pages/loginPage.ts`
  - Actions: `openApplication()`, `login(email, password)`

- **Resume Navigation**
  - Page Object: `HomePage`
  - File: `pages/homePage.ts`
  - Actions: `clickResumeButton()` — navigates to My Resume

- **Section Icons**
  - Page Object: `InsideMyResumePage`
  - File: `pages/insideMyResume.ts`
  - Actions: `clickEducationsIcon()`, `clickInternshipIcon()`, `clickCertificationIcon()`, `clickProjectsIcon()`, `clickWorkExperienceIcon()`

- **Personal Info**
  - Page Object: `PersonalInformationPage`
  - File: `pages/personalinformationpage.ts`
  - Actions: `clickAdditionalInformationIcon()`, `fillCountryDropdown()`, `fillStateDropdown()`, `fillCityDropdown()`, `fillPincode()`, `clickUpdateButton()`

- **Education (10th)**
  - Page Object: `EducationalPage`
  - File: `pages/educational.ts`
  - Actions: `fillBoardDropdown()`, `selectYear()`, `fillMarks()`, `clickUpdateButton()`, `selectQualificationPath()`

- **Education (12th)**
  - Page Object: `TwelfthInformationPage`
  - File: `pages/12thinformation.ts`
  - Actions: `fillBoardDropdown()`, `selectYear()`, `fillMarks()`, `clickUpdateButton()`

- **Education (Diploma)**
  - Page Object: `DiplomaInformationPage`
  - File: `pages/diplomainformation.ts`
  - Actions: `fillStateDropdown()`, `fillCityDropdown()`, `fillCollegeDropdown()`, `fillInstitutionName()`, `selectYear()`, `selectMarkType()`, `fillMarks()`, `fillDegreeDropdown()`, `fillDepartmentDropdown()`, `clickUpdateButton()`

- **Internship**
  - Page Object: `InternshipPage`
  - File: `pages/internship.ts`
  - Actions: `clickAddInternshipButton()`, `fillRoleDropdown()`, `fillCompanyDropdownByIndex()`, `fillFunctionDropdown()`, `fillIndustryDropdown()`, `fillIndustryTextfield()`, `selectInternshipStartDate()`, `selectInternshipEndDate()`, `fillSingleSkill()`, `clickUpdateButton()`

- **Certificate**
  - Page Object: `CertificatePage`
  - File: `pages/certificate.ts`
  - Actions: `clickAddCertificationButton()`, `fillOrganizationField()`, `fillTitleField()`, `selectStartDate()`, `selectEndDate()`, `fillSkillsDropdown()`, `clickSubmitButton()`

- **Project**
  - Page Object: `ProjectPage`
  - File: `pages/project.ts`
  - Actions: `clickAddProjectButton()`, `fillProjectTitle()`, `fillCompanyNameDropdown()`, `selectProjectStartDate()`, `selectProjectEndDate()`, `fillSkillsDropdown()`, `clickSubmitButton()`

- **Work Experience**
  - Page Object: `WorkExperiencePage`
  - File: `pages/workexperience.ts`
  - Actions: `clickAddWorkExperienceButton()`, `fillRoleDropdown()`, `fillCompanyDropdownByIndex()`, `fillFunctionDropdown()`, `fillIndustryDropdown()`, `fillIndustryTextfield()`, `selectWorkExperienceStartDate()`, `selectWorkExperienceEndDate()`, `selectFullTimeEmployment()`, `fillTitleTextfield()`, `fillSingleSkill()`, `clickSubmitButton()`

**Utilities:**

- **readExcelData**
  - File: `utils/excelReader.ts`
  - Purpose: Read test data from Excel file
  - Usage: `readExcelData('./testdata/testdata.xlsx', 'StudentData')`

- **closeUi**
  - File: `utils/closeUi.ts`
  - Purpose: Close modal/drawer after form submission
  - Usage: Called after each section update

- **AntdDropdownUtil**
  - File: `utils/AntdDropdownUtil.ts`
  - Purpose: Handle Ant Design dropdown interactions
  - Actions: Click dropdown, wait for options, select by text

- **AntdMonthPickerUtil**
  - File: `utils/AntdMonthPickerUtil.ts`
  - Purpose: Handle Ant Design month-year picker
  - Actions: Open picker, select year, select month

- **AntdMultiSelectUtil**
  - File: `utils/AntdMultiSelectUtil.ts`
  - Purpose: Handle Ant Design multi-select components
  - Actions: Open dropdown, select multiple options, close

---

## 🏁 Final Verdict

🔥 **This PRD exactly matches your automation code**

You are already working at PRD-driven automation level.

**Ready for:**
- ✅ Vercel Browser Agent prompt generation
- ✅ Auto-generate test cases
- ✅ Windsurf AI integration
- ✅ CI/CD pipeline integration

# PRD: Role Application Flow — Student Portal (v2)

**Application:** PluginLive Student Portal  
**URL:** https://auth.uat.pluginlive.com/  
**Version:** 2.0  
**Author:** QA Lead / Product Manager  
**Last Updated:** February 2026  
**Status:** Final  

---

## 1. Overview

This document defines the end-to-end functional requirements for the **Role Application Flow** in the PluginLive Student Portal. The flow covers:

- Student login and dashboard navigation
- Role search and eligibility check
- **Skill selection via 5 categories** (Academics, Internship, Work Experience, Training Course, Project) — each with category-specific checkbox behavior
- **Additional skill input** via dedicated pages (Add Academics, Add Project, Add Internship, Add Certification, Add Work Experience) using Ant Design UI components
- Skill confirmation, role application, resume upload, and success verification

This PRD is designed to be consumed by:
- **Developers** — for feature implementation and integration
- **Manual Testers** — for step-by-step test case execution
- **Automation Engineers** — Playwright, Windsurf AI, Vercel Browser Agent

---

## 2. User Story

**As a** registered student on the PluginLive platform,  
**I want to** search for a role, check my eligibility, add required skills from one or more categories, and apply with my resume,  
**So that** I can successfully apply for job roles and track my application status.

---

## 3. Preconditions

- A valid student account must exist with active credentials (email + password)
- The student must have completed basic profile onboarding
- The application URL (https://auth.uat.pluginlive.com/) must be accessible
- At least one role must be available and searchable in the system
- The student must have a resume file ready for upload (PDF/DOC/DOCX format)
- The student should have at least one qualifying entry in their profile (e.g., Work Experience, Internship, Project, Certification, or Education record) to satisfy eligibility via skill selection
- Browser: Desktop Chrome/Edge (latest). Mobile is out of scope.

---

## 4. Navigation Flow

The user journey follows this sequential path:

- **Login Page** → Enter email → Enter password → Click Agree checkbox → Click Login
  - Redirects to **Dashboard (Home Page)**
- **Home Page** → Side menu visible with 7 options + 2 action buttons
  - User clicks **"Roles"** from side menu
- **Role Page** → Search bar visible → User searches for a role → Clicks **"Check Eligibility"**
- **Check Eligibility Page** → User clicks on **"Skills"** section
- **Skills Page (Mandatory Skills)** → User clicks **"+" (Add Skill)** icon
- **Add Skill Page** → 10 options displayed in two sections. User picks **any ONE** option:
  - **Skill Category Selection (5):** Academics (10th/12th) | Internship | Work Experience | Training Course | Project
  - **Additional Skill Input (5):** Add Academics | Add Project | Add Internship | Add Certification | Add Work Experience
  - User selects **exactly one** option, checks the corresponding checkbox (or fills the form), then proceeds
- **Add Skill Confirmation** → User clicks **"Add"** → System shows **"Added Successfully"** → User clicks **"Update & Apply"**
- **Role Page (Post Eligibility)** → User clicks **"Apply"** button
- **Upload Resume Page** → User clicks **"Upload Resume"** → Uploads file → Clicks **"Apply"**
  - System displays **"Applied Successfully"** green label
  - User clicks **"Close"** button
- **End State** → Role application completed successfully

---

## 5. Functional Requirements (Step-by-Step)

### 5.1 Login Page

- **Step 1:** Open application URL: https://auth.uat.pluginlive.com/
  - The login page loads with email textfield, password textfield, Agree checkbox, and Login button
- **Step 2:** Enter valid email address in the email textfield
  - Email is accepted and displayed in the field
- **Step 3:** Enter valid password in the password textfield
  - Password is accepted and masked (shown as dots/asterisks)
- **Step 4:** Click on the "Agree" checkbox (Terms & Conditions)
  - Checkbox becomes checked/ticked
- **Step 5:** Click on the Login button
  - Login request is sent to the server
- **Step 6:** Wait for redirect to Dashboard
  - User is redirected to the Dashboard page
  - URL changes to contain `/dashboard`
  - Dashboard content becomes visible within 15 seconds

### 5.2 Home Page (Dashboard)

- **Step 7:** Verify Dashboard page is fully loaded
  - The side menu is visible on the left with the following options:
    - Dashboard (selected by default, highlighted)
    - Roles
    - Applied Roles
    - Assessment
    - Interview / Drive
    - Offer Received
    - Events
  - Additional action buttons are visible on the page:
    - "Complete Now" button
    - "My Resume" button
- **Step 8:** Click on "Roles" from the side menu
  - The Roles page loads successfully
  - The side menu highlights "Roles" as the active selection
  - URL changes to reflect the Roles page

### 5.3 Role Page

- **Step 9:** Verify the Role search bar is displayed
  - A search input field is visible at the top of the Roles page
  - The search bar accepts text input
- **Step 10:** Enter the role name in the search bar
  - The typed text appears in the search field
  - The system filters or searches for matching roles
- **Step 11:** Search results are displayed
  - Matching role cards/listings appear below the search bar
  - Each role card displays the role name and relevant details
- **Step 12:** Click on the "Check Eligibility" button on the desired role card
  - The Check Eligibility page/modal opens
  - The system evaluates the student's current eligibility status

### 5.4 Check Eligibility Page

- **Step 13:** The Check Eligibility page displays eligibility criteria sections
  - Sections may include: Skills, Education, Experience, etc.
  - Each section shows the student's current status (met / not met)
- **Step 14:** Click on the "Skills" section
  - The Skills section expands or navigates to the Skills page
  - Mandatory skills required for the role are displayed

### 5.5 Skills Page (Mandatory Skills)

- **Step 15:** Verify the Mandatory Skills section is visible
  - A list of required skills for the role is shown
  - Each skill shows whether it has been fulfilled or is pending
- **Step 16:** Click on the "+" (Add Skill) icon
  - The Add Skill page/modal opens
  - **10 options** are displayed in two sections:
    - **Skill Category Selection** (top section) — 5 options
    - **Additional Skill Input Options** (bottom section) — 5 options
  - The user must choose **any ONE** of these 10 options to proceed

### 5.6 Add Skill Page — Skill Category Selection

This section displays 5 skill categories. The user selects **any ONE** category for the eligibility check.

- **Step 17:** Verify all 5 skill categories are displayed and selectable:
  - Academics
  - Internship
  - Work Experience
  - Training Course
  - Project

- **Step 18 (Option A): Select "Academics" category**
  - On click, the Academics section expands
  - **Two checkboxes** are displayed:
    - 10th
    - 12th
  - User selects the relevant checkbox (10th, 12th, or both within this category)
  - Selecting a checkbox automatically picks academic skills for eligibility

- **Step 18 (Option B): Select "Internship" category**
  - On click, the Internship section expands
  - **One checkbox** is displayed
  - Selecting the checkbox automatically picks internship skills for eligibility

- **Step 18 (Option C): Select "Work Experience" category**
  - On click, the Work Experience section expands
  - **One checkbox** is displayed
  - Selecting the checkbox automatically picks work experience skills for eligibility

- **Step 18 (Option D): Select "Training Course" category**
  - On click, the Training Course section expands
  - **One checkbox** is displayed
  - Selecting the checkbox automatically picks training course skills for eligibility

- **Step 18 (Option E): Select "Project" category**
  - On click, the Project section expands
  - **One checkbox** is displayed
  - Selecting the checkbox automatically picks project skills for eligibility

**Important:** The user selects **any ONE** of these 5 categories per session. The selected skills are used **only for the eligibility check** — they link existing profile entries to the role's skill requirements. If the user does not have an existing entry for the chosen category, they should use the Additional Skill Input Options (Section 5.7) instead.

### 5.7 Add Skill Page — Additional Skill Input Options

Below the Skill Category Selection section, the following **5 options** are available. If the user does not have an existing profile entry, they choose **any ONE** of these options to add a new entry. After adding, the entry becomes available for selection in the Skill Category section above.

- **Option 1: "Add Academics"**
  - On click, opens the **Education page**
  - User can add skills from:
    - 10th standard fields
    - 12th standard fields
  - UI Components: Ant Design dropdown selects and text fields
  - User fills the required fields and saves

- **Option 2: "Add Project"**
  - On click, opens the **Project page**
  - User adds project details using Ant Design dropdown selects and text fields
  - User fills the required fields and saves

- **Option 3: "Add Internship"**
  - On click, opens the **Internship page**
  - User adds internship details using Ant Design dropdown selects and text fields
  - User fills the required fields and saves

- **Option 4: "Add Certification"**
  - On click, opens the **Certification page**
  - User adds certification details using Ant Design dropdown selects and text fields
  - User fills the required fields and saves

- **Option 5: "Add Work Experience"**
  - On click, opens the **Work Experience page**
  - User adds work experience details using Ant Design dropdown selects and text fields
  - A checkbox is displayed within the form
  - User selects the checkbox to confirm the entry
  - User fills the required fields and saves

**Example Flow (Add Work Experience):**
1. User clicks "Add Work Experience"
2. Work Experience page opens with Ant Design form fields
3. User fills in role, company, duration, skills, etc.
4. A checkbox is displayed — user selects it
5. User saves the entry
6. User returns to the Add Skill page with the new entry available for selection

### 5.8 Add Skill Confirmation

- **Step 19:** After selecting a skill category checkbox OR adding a new entry via Additional Skill Input, click the "Add" button
  - The system processes the skill addition
  - A confirmation label **"Added Successfully"** is displayed on screen
  - This label **must be verified/asserted** during testing
- **Step 20:** Click on the "Update & Apply" button
  - The system updates the eligibility status with the newly added skills
  - The user is redirected back to the Role page
  - The eligibility status now reflects the added skills

### 5.9 Role Page (Post Eligibility)

- **Step 21:** Verify the user is back on the Role page
  - The role card is visible
  - The eligibility status shows as "Eligible" or the "Apply" button is now enabled
- **Step 22:** Click on the "Apply" button
  - The Upload Resume page/modal opens
  - The system prompts the user to upload their resume

### 5.10 Upload Resume Page

- **Step 23:** Verify the Upload Resume page/modal is displayed
  - An "Upload Resume" button or file input area is visible
  - Instructions for file upload may be displayed (e.g., accepted formats)
- **Step 24:** Click on the "Upload Resume" button
  - A file picker dialog opens (OS-level file browser)
  - The user selects a resume file
- **Step 25:** Upload the resume file
  - The selected file is uploaded to the system
  - A progress indicator or file name confirmation is shown
  - The file is accepted (valid format and size)
- **Step 26:** Click on the "Apply" button
  - The system submits the role application with the uploaded resume
  - A confirmation label **"Applied Successfully"** is displayed in **green** color
  - This green label **must be verified/asserted** during testing
- **Step 27:** Click on the "Close" button
  - The Upload Resume page/modal closes
  - The user is returned to the Roles page or Applied Roles page
  - The applied role appears in the student's application history

---

## 6. Skill Selection Logic

This section provides a detailed breakdown of how skill selection works for the eligibility check.

### 6.1 Single-Choice Rule (Choose Any ONE of 10)

The Add Skill page presents **10 options** in two sections. The user must choose **any ONE** option to satisfy the eligibility requirement:

**Skill Category Selection (5 options — link existing profile entries):**

| # | Option | Checkbox Behavior | Purpose |
|---|--------|-------------------|----------|
| 1 | Academics | Expands to show **2 checkboxes**: 10th and 12th (user can select one or both within this single category) | Links existing 10th/12th education records |
| 2 | Internship | Expands to show **1 checkbox** | Links existing internship record |
| 3 | Work Experience | Expands to show **1 checkbox** | Links existing work experience record |
| 4 | Training Course | Expands to show **1 checkbox** | Links existing training course record |
| 5 | Project | Expands to show **1 checkbox** | Links existing project record |

**Additional Skill Input Options (5 options — create new profile entries):**

| # | Option | Opens Page | UI Components |
|---|--------|-----------|---------------|
| 6 | Add Academics | Education page | 10th/12th fields, Ant Design dropdowns |
| 7 | Add Project | Project page | Ant Design dropdowns and text fields |
| 8 | Add Internship | Internship page | Ant Design dropdowns and text fields |
| 9 | Add Certification | Certification page | Ant Design dropdowns and text fields |
| 10 | Add Work Experience | Work Experience page | Ant Design dropdowns, text fields + checkbox |

### 6.2 Selection Rules

- The user picks **exactly ONE** of the 10 options — not multiple
- If the user picks a **Skill Category** (options 1–5): they check the checkbox within that category, then click "Add"
- If the user picks an **Additional Skill Input** (options 6–10): they fill the form, save, return to Add Skill page, then select the newly created entry's checkbox and click "Add"
- Selecting one option does NOT require selecting others
- The system only needs ONE qualifying skill to satisfy the eligibility check

### 6.3 Skill Selection vs. Skill Addition — Key Distinction

- **Skill Category Selection (Options 1–5):** Selects **existing** profile records to satisfy eligibility. No new data is created.
- **Additional Skill Input (Options 6–10):** Creates **new** profile records (Education, Project, Internship, Certification, Work Experience). After creation, the user must still select the new entry via the corresponding category checkbox.
- If a category has no existing entries, the checkbox will be disabled — the user should use the corresponding "Add" option (6–10) first.

---

## 7. Validation Rules

### 7.1 Login Validations
- Email field is required — empty email shows "This field is required" error
- Password field is required — empty password shows "This field is required" error
- Email must be in valid format (e.g., user@domain.com) — invalid format shows "Please enter a valid email address"
- Agree checkbox must be checked before Login button is clickable or functional
- Invalid credentials (wrong email/password) show an authentication error message

### 7.2 Role Search Validations
- Search bar must accept alphanumeric characters
- Empty search may show all available roles or a prompt to enter a search term
- No matching role shows "No roles found" or equivalent message

### 7.3 Eligibility Validations
- "Check Eligibility" button is only visible/enabled for roles that require eligibility verification
- Skills section must display mandatory skills required for the specific role
- A skill can only be selected if the student has a corresponding profile entry

### 7.4 Skill Selection Validations (Choose Any ONE of 10)
- The user must choose **exactly one** of the 10 options before clicking "Add"
- All 10 options must be visible on the Add Skill page (5 category selections + 5 additional inputs)
- Academics category must show exactly 2 checkboxes: 10th and 12th
- Internship, Work Experience, Training Course, and Project categories must each show exactly 1 checkbox
- Checkboxes for categories with no existing profile entries should be disabled or show an empty state
- Only ONE category or ONE additional input should be selected at a time
- "Added Successfully" label must appear after clicking "Add" — this confirms backend processing
- "Update & Apply" button should only be enabled after one skill is successfully added

### 7.5 Additional Skill Input Validations
- Each "Add" option (Add Academics, Add Project, etc.) must open the correct corresponding page
- All Ant Design dropdown fields must be searchable and show filtered options
- Required fields must be validated before saving a new entry
- After saving, the user must be returned to the Add Skill page
- The newly created entry must appear under the corresponding skill category for selection

### 7.6 Resume Upload Validations
- Resume file must be in an accepted format (PDF, DOC, DOCX)
- Resume file must not exceed the maximum allowed size (system-defined limit)
- "Upload Resume" must complete before the "Apply" button becomes clickable
- Empty upload (no file selected) should prevent submission

### 7.7 Application Submission Validations
- "Applied Successfully" green label must appear after clicking "Apply" on the Upload Resume page
- The application must be recorded in the system — visible under "Applied Roles" in the side menu
- Duplicate application for the same role should be prevented or show a warning

---

## 8. Success & Error Messages

### Success Messages
- **"Added Successfully"** — Displayed after skills are successfully added via the Add Skill page. This is a confirmation label that must be visible on screen and asserted during testing.
- **"Applied Successfully"** — Displayed in **green color** after the role application is submitted with the uploaded resume. This is the final confirmation of a successful application and must be asserted during testing.

### Error Messages
- **"This field is required"** — Shown when email or password fields are left empty on the Login page
- **"Please enter a valid email address"** — Shown when email format is invalid
- **"Invalid credentials"** — Shown when email/password combination is incorrect
- **"No roles found"** — Shown when role search returns no matching results
- **"Please select at least one skill"** — Shown when user clicks "Add" without selecting any skill checkbox
- **"Please upload a resume"** — Shown when the user tries to apply without uploading a file
- **"File format not supported"** — Shown when the uploaded file is not in an accepted format (PDF/DOC/DOCX)
- **"File size exceeds limit"** — Shown when the uploaded file exceeds the maximum allowed size
- **"You have already applied for this role"** — Shown when the user attempts to apply for a role they have already applied to

---

## 9. Acceptance Criteria

### AC-1: Successful Login
- **Given** a valid student account exists
- **When** the user enters valid email, password, checks Agree, and clicks Login
- **Then** the user is redirected to the Dashboard within 15 seconds

### AC-2: Side Menu Navigation to Roles
- **Given** the user is on the Dashboard
- **When** the user clicks "Roles" from the side menu
- **Then** the Roles page loads with a search bar and available roles

### AC-3: Role Search
- **Given** the user is on the Roles page
- **When** the user enters a role name in the search bar
- **Then** matching roles are displayed in the results

### AC-4: Check Eligibility
- **Given** the user found a desired role
- **When** the user clicks "Check Eligibility"
- **Then** the eligibility page opens showing criteria sections including Skills

### AC-5: Add Skill via Academics (Option 1)
- **Given** the user is on the Add Skill page and chooses Academics
- **When** the user selects the "10th" and/or "12th" checkbox, then clicks "Add"
- **Then** the system displays "Added Successfully" label

### AC-6: Add Skill via Internship (Option 2)
- **Given** the user is on the Add Skill page and chooses Internship
- **When** the user selects the checkbox, then clicks "Add"
- **Then** the system displays "Added Successfully" label

### AC-7: Add Skill via Work Experience (Option 3)
- **Given** the user is on the Add Skill page and chooses Work Experience
- **When** the user selects the checkbox, then clicks "Add"
- **Then** the system displays "Added Successfully" label

### AC-8: Add Skill via Training Course (Option 4)
- **Given** the user is on the Add Skill page and chooses Training Course
- **When** the user selects the checkbox, then clicks "Add"
- **Then** the system displays "Added Successfully" label

### AC-9: Add Skill via Project (Option 5)
- **Given** the user is on the Add Skill page and chooses Project
- **When** the user selects the checkbox, then clicks "Add"
- **Then** the system displays "Added Successfully" label

### AC-10: Add New Entry via Add Academics (Option 6)
- **Given** the user has no existing education entry
- **When** the user clicks "Add Academics", fills the education form, saves, selects the new entry checkbox, and clicks "Add"
- **Then** the system displays "Added Successfully" label

### AC-11: Add New Entry via Add Project (Option 7)
- **Given** the user has no existing project entry
- **When** the user clicks "Add Project", fills the form, saves, selects the new entry checkbox, and clicks "Add"
- **Then** the system displays "Added Successfully" label

### AC-12: Add New Entry via Add Internship (Option 8)
- **Given** the user has no existing internship entry
- **When** the user clicks "Add Internship", fills the form, saves, selects the new entry checkbox, and clicks "Add"
- **Then** the system displays "Added Successfully" label

### AC-13: Add New Entry via Add Certification (Option 9)
- **Given** the user has no existing certification entry
- **When** the user clicks "Add Certification", fills the form, saves, selects the new entry checkbox, and clicks "Add"
- **Then** the system displays "Added Successfully" label

### AC-14: Add New Entry via Add Work Experience (Option 10)
- **Given** the user has no existing work experience entry
- **When** the user clicks "Add Work Experience", fills the form, saves, selects the new entry checkbox, and clicks "Add"
- **Then** the system displays "Added Successfully" label

### AC-15: Update & Apply Eligibility
- **Given** a skill has been successfully added via any ONE of the 10 options
- **When** the user clicks "Update & Apply"
- **Then** the eligibility is updated and the user returns to the Role page with "Apply" enabled

### AC-16: Apply for Role
- **Given** the user has met eligibility requirements
- **When** the user clicks "Apply" on the Role page
- **Then** the Upload Resume page/modal is displayed

### AC-17: Upload Resume and Complete Application
- **Given** the user is on the Upload Resume page
- **When** the user uploads a resume file and clicks "Apply"
- **Then** the system displays a green "Applied Successfully" label

### AC-18: Close and Verify
- **Given** the application was submitted successfully
- **When** the user clicks "Close"
- **Then** the modal closes and the role appears under "Applied Roles"

---

## 10. Out of Scope

The following items are explicitly **not covered** in this PRD:

- **Resume Builder flow** — Covered in a separate PRD (`PRD-Student-Resume-Builder.md`)
- **Profile creation / Student onboarding** — Assumed as a precondition
- **Role creation by employer/admin** — Admin-side functionality
- **Application review / Employer-side actions** — Post-application employer workflow
- **Assessment / Interview scheduling** — Covered under separate modules
- **Offer management** — Covered under "Offer Received" module
- **Events module** — Separate feature
- **"Complete Now" button flow** — May relate to profile completion, not role application
- **"My Resume" button flow** — Covered in Resume Builder PRD
- **Applied Roles listing page** — View-only page, not part of the application submission flow
- **Multiple role applications in a single session** — Only single role application flow is documented
- **Mobile / responsive behavior** — Desktop browser flow only
- **Payment or subscription gates** — Not applicable for student role application
- **Detailed field-by-field specifications for Additional Skill Input pages** — Each "Add" page (Education, Project, Internship, Certification, Work Experience) follows the same patterns documented in `PRD-Student-Resume-Builder.md`

---

## 11. Automation Readiness Notes

### 11.1 Test Data Requirements
- **Email:** Read from Excel column `Student-Email-ID`
- **Password:** Read from Excel column `Student-PassWord`
- **Role Name:** Read from Excel column `Role-Name`
- **Skill Category:** Read from Excel column `Skill-Category` (values: Academics, Internship, Work Experience, Training Course, Project)
- **Skill Sub-Selection (Academics):** Read from Excel column `Skill-Academics` (values: 10th, 12th, Both)
- **Resume File Path:** Read from Excel column `Resume-File-Path` or use a static test file

### 11.2 Key Assertions for Automation
- **"Added Successfully" label** — Must be asserted after clicking "Add" on the Add Skill page
  - Locator strategy: Look for text content "Added Successfully" within the visible page/modal
  - Wait for the label to appear (may require a short wait for server response)
- **"Applied Successfully" green label** — Must be asserted after clicking "Apply" on the Upload Resume page
  - Locator strategy: Look for text content "Applied Successfully" with green color styling
  - Verify both text content and visual styling (green color)

### 11.3 UI Component Patterns
- **Side Menu:** Persistent left navigation with clickable menu items. Each item navigates to a different page.
- **Search Bar:** Standard text input on the Roles page. Accepts keyboard input and triggers search on type or submit.
- **"Check Eligibility" Button:** Appears on individual role cards. Navigates to the eligibility evaluation page.
- **"+" (Add Skill) Icon:** Icon button within the Skills section. Opens the Add Skill modal/page.
- **Skill Category List:** Expandable/collapsible sections (Academics, Internship, Work Experience, Training Course, Project). On click, each expands to reveal checkboxes.
- **Academics Checkboxes:** Two checkboxes labeled "10th" and "12th" within the Academics category.
- **Single Checkboxes:** One checkbox each for Internship, Work Experience, Training Course, and Project categories.
- **Additional Skill Input Links:** Clickable options (Add Academics, Add Project, Add Internship, Add Certification, Add Work Experience) that open dedicated Ant Design form pages.
- **Ant Design Form Fields:** Dropdown selects (searchable), text inputs, date pickers — consistent across all "Add" pages.
- **File Upload:** Standard file input or drag-and-drop zone. Triggers OS file picker dialog.
  - For Playwright: Use `page.setInputFiles()` or `fileChooser` API to handle file upload
- **Confirmation Labels:** Text elements that appear after successful actions. May be toast notifications, inline labels, or banner messages.

### 11.4 Wait Strategies
- After login: Wait for URL to contain `/dashboard` (timeout: 15 seconds)
- After clicking side menu items: Wait for page content to load (use `networkidle` or element-based waits)
- After role search: Wait for search results to appear (debounce time may apply)
- After clicking a skill category: Wait for checkboxes to appear within the expanded section
- After clicking "Add" on Add Skill: Wait for "Added Successfully" label to be visible
- After clicking any "Add [Type]" link: Wait for the form page to load fully
- After saving a new entry: Wait for redirect back to Add Skill page
- After clicking "Apply" on Upload Resume: Wait for "Applied Successfully" green label to be visible
- After file upload: Wait for upload progress to complete before clicking "Apply"

### 11.5 Page Object Model (POM) Mapping
- **LoginPage** — `pages/loginpage.ts` (existing)
- **DashboardPage** — `pages/dashboardpage.ts` (side menu navigation, action buttons)
- **RolePage** — `pages/rolepage.ts` (search bar, Check Eligibility, Apply button)
- **EligibilityPage** — `pages/eligibilitypage.ts` (Skills section, eligibility criteria)
- **AddSkillPage** — `pages/addskillpage.ts` (skill categories, checkboxes, Add/Update & Apply buttons, additional input links)
- **EducationPage** — `pages/educationpage.ts` (Add Academics — 10th/12th fields)
- **ProjectPage** — `pages/projectpage.ts` (Add Project form)
- **InternshipPage** — `pages/internshippage.ts` (Add Internship form)
- **CertificationPage** — `pages/certificationpage.ts` (Add Certification form)
- **WorkExperiencePage** — `pages/workexperiencepage.ts` (Add Work Experience form)
- **UploadResumePage** — `pages/uploadresumepage.ts` (file upload, Apply, Close buttons)

### 11.6 Test Execution
- **Framework:** Playwright with TypeScript
- **Test File:** `tests/role-application-test.spec.ts`
- **Data Source:** Excel file with student credentials, role name, skill category, and resume file path
- **Run Command:** `npx playwright test tests/role-application-test.spec.ts --headed`

### 11.7 Critical Verification Points
- ✅ Login redirects to Dashboard successfully
- ✅ Side menu displays all 7 options + 2 action buttons
- ✅ "Roles" navigation works from side menu
- ✅ Role search returns expected results
- ✅ "Check Eligibility" opens eligibility page with Skills section
- ✅ Skill categories display with correct checkbox counts (Academics: 2, others: 1 each)
- ✅ Single category skill selection works (any of the 5)
- ✅ Multi-category skill selection works (2+ categories at once)
- ✅ Additional Skill Input options open correct form pages
- ✅ New entries created via "Add" pages appear in category selection
- ✅ **"Added Successfully" label is displayed and verified**
- ✅ "Update & Apply" updates eligibility and returns to Role page
- ✅ "Apply" button opens Upload Resume page
- ✅ Resume file uploads successfully
- ✅ **"Applied Successfully" green label is displayed and verified**
- ✅ "Close" button closes the modal and returns to Roles/Applied Roles page
- ✅ Applied role is visible under "Applied Roles" in side menu

---

## Appendix: Flow Diagram (Text)

```
Login Page
  │
  ├─ Enter Email
  ├─ Enter Password
  ├─ Click Agree Checkbox
  └─ Click Login
       │
       ▼
Dashboard (Home Page)
  │
  ├─ Side Menu: Dashboard | Roles | Applied Roles | Assessment | Interview/Drive | Offer Received | Events
  ├─ Buttons: Complete Now | My Resume
  └─ Click "Roles"
       │
       ▼
Role Page
  │
  ├─ Search Bar → Enter Role Name → Search
  └─ Click "Check Eligibility"
       │
       ▼
Check Eligibility Page
  │
  └─ Click "Skills" Section
       │
       ▼
Skills Page (Mandatory Skills)
  │
  ├─ Mandatory Skills Displayed
  └─ Click "+" (Add Skill)
       │
       ▼
Add Skill Page (choose ANY ONE of 10 options)
  │
  ├─ SKILL CATEGORY SELECTION (pick ONE — existing entries):
  │   ├─ 1. Academics → ☐ 10th  ☐ 12th
  │   ├─ 2. Internship → ☐ (1 checkbox)
  │   ├─ 3. Work Experience → ☐ (1 checkbox)
  │   ├─ 4. Training Course → ☐ (1 checkbox)
  │   └─ 5. Project → ☐ (1 checkbox)
  │
  ├─ ADDITIONAL SKILL INPUT (pick ONE — create new entry):
  │   ├─ 6. Add Academics → Education Page (10th/12th, Ant Design fields)
  │   ├─ 7. Add Project → Project Page (Ant Design fields)
  │   ├─ 8. Add Internship → Internship Page (Ant Design fields)
  │   ├─ 9. Add Certification → Certification Page (Ant Design fields)
  │   └─ 10. Add Work Experience → Work Experience Page (Ant Design fields + checkbox)
  │
  ├─ Click "Add" → ✅ "Added Successfully" Label
  └─ Click "Update & Apply"
       │
       ▼
Role Page (Post Eligibility)
  │
  └─ Click "Apply"
       │
       ▼
Upload Resume Page
  │
  ├─ Click "Upload Resume" → Select File
  ├─ Click "Apply" → ✅ "Applied Successfully" (Green Label)
  └─ Click "Close"
       │
       ▼
✅ Application Complete
```

---

*End of PRD — Role Application Flow v2*

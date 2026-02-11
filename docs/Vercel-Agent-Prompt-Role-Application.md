# 🤖 Vercel Browser Agent Prompt - Role Application Flow

**URL:** https://auth.uat.pluginlive.com/

## Master Prompt

```
Browser automation agent for Role Application Flow in PluginLive Student Portal.
Task: Login → Search role → Check eligibility → Add skill (pick ONE of 10 options) → Upload resume → Complete application.
Add Skill page has 10 options — select EXACTLY ONE based on test data.
```

---

## 1. Login

```
1. Navigate to https://auth.uat.pluginlive.com/
2. Enter email: {{STUDENT_EMAIL}}, password: {{STUDENT_PASSWORD}}
3. Click "Agree" checkbox → Click Login
4. Wait for Dashboard (URL contains "/dashboard", side menu with 7 options visible)

DATA: STUDENT_EMAIL="test@example.com", STUDENT_PASSWORD="TestPass123"
```

## 2. Navigate to Roles

```
1. Click "Roles" from side menu
2. Wait for Roles page (search bar visible at top)
```

## 3. Search Role & Check Eligibility

```
1. Type "{{ROLE_NAME}}" in search bar → Wait for results
2. Click "Check Eligibility" on matching role card
3. Wait for Eligibility page (Skills, Education sections visible)

DATA: ROLE_NAME="Software Developer"
```

## 4. Open Add Skill Page

```
1. Click "Skills" section → Wait for Skills page
2. Click "+" (Add Skill) icon
3. Verify 10 options visible:
   TOP (Skill Categories): 1-Academics(2 checkboxes), 2-Internship, 3-Work Exp, 4-Training, 5-Project
   BOTTOM (Add New): 6-Add Academics, 7-Add Project, 8-Add Internship, 9-Add Certification, 10-Add Work Exp
```

---

## 5. Add Skill via Category (Options 1-5)

```
PRECONDITION: Add Skill page open. Student has existing record for selected category.

1. Click category: {{SKILL_OPTION}}
   - Option 1: "Academics" → 2 checkboxes (10th, 12th) → Select {{SKILL_ACADEMICS}}
   - Option 2: "Internship" → 1 checkbox
   - Option 3: "Work Experience" → 1 checkbox
   - Option 4: "Training Course" → 1 checkbox
   - Option 5: "Project" → 1 checkbox
2. Wait for section expand → Select checkbox(es)
3. Click "Add" → Verify "Added Successfully" label
4. Click "Update & Apply" → Wait for redirect to Role page

DATA: SKILL_ACADEMICS="10th" (for Option 1 only)
```

---

## 6. Add New Entry (Options 6-10)

```
PRECONDITION: Add Skill page open. Student has NO existing record for selected option.

1. Click option from Additional Skill Input section: {{ADD_OPTION}}
2. Wait for form page to open → Fill fields (all Ant Design dropdowns/textfields):

   Option 6 (Add Academics): Board, Year, Percentage (for 10th/12th)
   Option 7 (Add Project): Title, Company, Start/End Date, Skills
   Option 8 (Add Internship): Role, Company, Function, Industry, Start/End Date, Skills
   Option 9 (Add Certification): Institute, Course, Start/End Date, Skills
   Option 10 (Add Work Exp): Role, Company, Function, Industry, Start/End Date, Job Title, Skills + Checkbox

3. Click Save → Wait for confirmation → Verify returned to Add Skill page
4. Find corresponding category → Verify new entry visible → Select checkbox
5. Click "Add" → Verify "Added Successfully" label
6. Click "Update & Apply" → Wait for redirect to Role page

SAMPLE DATA (Option 10):
WORK_ROLE="Software Developer", WORK_COMPANY="Infosys", WORK_FUNCTION="Engineering",
WORK_INDUSTRY="IT Services", WORK_START="Jan 2024", WORK_END="Jun 2024",
WORK_JOB_TITLE="Junior Developer", WORK_SKILLS="JavaScript"
```

---

## 7. Apply & Upload Resume

```
1. Verify back on Role page → Click "Apply" button
2. Wait for Upload Resume modal → Click "Upload Resume"
3. Select file: {{RESUME_FILE_PATH}} (PDF/DOC/DOCX)
4. Wait for upload complete → Click "Apply"
5. **VERIFY "Applied Successfully" GREEN label** (critical assertion)
6. Click "Close" → Verify returned to Roles/Applied Roles page

DATA: RESUME_FILE_PATH="C:/test-data/resume.pdf"
```

---

## 8. E2E Flow — Category Path (Option 3)

```
PRECONDITION: Student has existing Work Experience record.

1. Login → Roles → Search "{{ROLE_NAME}}" → Check Eligibility
2. Skills → "+" → Click "Work Experience" (Option 3) → Select checkbox
3. "Add" → Verify "Added Successfully" → "Update & Apply"
4. "Apply" → Upload {{RESUME_FILE_PATH}} → "Apply" → Verify GREEN "Applied Successfully" → Close

DATA: STUDENT_EMAIL="test@example.com", STUDENT_PASSWORD="TestPass123",
ROLE_NAME="Software Developer", RESUME_FILE_PATH="C:/test-data/resume.pdf"
```

## 9. E2E Flow — Add New Entry Path (Option 10)

```
PRECONDITION: Student has NO Work Experience record.

1. Login → Roles → Search "{{ROLE_NAME}}" → Check Eligibility
2. Skills → "+" → Click "Add Work Experience" (Option 10)
3. Fill: Role, Company, Function, Industry, Dates, Job Title, Skills + Checkbox → Save
4. Verify returned → Select new entry checkbox → "Add" → Verify "Added Successfully" → "Update & Apply"
5. "Apply" → Upload resume → "Apply" → Verify GREEN "Applied Successfully" → Close

DATA: WORK_ROLE="Software Developer", WORK_COMPANY="Infosys", WORK_FUNCTION="Engineering",
WORK_INDUSTRY="IT Services", WORK_START="Jan 2024", WORK_END="Jun 2024",
WORK_JOB_TITLE="Junior Developer", WORK_SKILLS="JavaScript", RESUME_FILE_PATH="C:/test-data/resume.pdf"
```

---

## UI Components & Decision Table

**Ant Design Interactions:** All dropdowns searchable (Click → Type → Select). Month-Year Picker (Year → Month). Multi-select (Type → Select → Click outside).

**Skill Option Map:**
- **Options 1-5** (Existing Records): Section 5 → Academics(2 checkboxes), Internship, Work Exp, Training, Project
- **Options 6-10** (Add New): Section 6 → Add Academics, Add Project, Add Internship, Add Certification, Add Work Exp

---

## Agent Notes

1. **Single Choice:** Pick EXACTLY ONE of 10 options on Add Skill page
2. **Critical Assertions:** "Added Successfully" and GREEN "Applied Successfully" labels — never skip
3. **Wait Strategy:** Elements visible/interactive before click. Network idle after saves. Expansion animations complete.
4. **Error Recovery:** Retry 3x with 5s wait. Screenshot on failure.
5. **Options 6-10 Flow:** Form save → Return to Add Skill → Select new entry checkbox → Click "Add" (save alone ≠ complete)

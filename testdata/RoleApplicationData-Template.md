# Role Application Test Data Template

## Excel Sheet Name: `RoleApplicationData`

### Required Columns for Role Application Flow

| Column Name | Description | Sample Value | Used In |
|-------------|-------------|--------------|---------|
| **Student-Email-ID** | Student login email | test@example.com | Login |
| **Student-PassWord** | Student login password | TestPass123 | Login |
| **Role-Name** | Role to search and apply for | Software Developer | Search & Apply |
| **Resume-File-Path** | Path to resume file (PDF/DOC/DOCX) | C:/test-data/resume.pdf | Upload Resume |
| **Skill-Category** | Which skill category to use (1-5) | 3 (Work Experience) | Skill Selection |
| **Skill-Academics** | For Option 1: 10th, 12th, or Both | 10th | Academics Category |
| **Work-Role** | For Option 10: Work role | Software Developer | Add Work Experience |
| **Work-Company** | For Option 10: Company name | Infosys | Add Work Experience |
| **Work-Function** | For Option 10: Function | Engineering | Add Work Experience |
| **Work-Industry** | For Option 10: Industry | IT Services | Add Work Experience |
| **Work-Start** | For Option 10: Start date | Jan 2024 | Add Work Experience |
| **Work-End** | For Option 10: End date | Jun 2024 | Add Work Experience |
| **Work-Job-Title** | For Option 10: Job title | Junior Developer | Add Work Experience |
| **Work-Skills** | For Option 10: Skills | JavaScript | Add Work Experience |
| **Project-Title** | For Option 7: Project title | E-Commerce Website | Add Project |
| **Project-Company** | For Option 7: Company | Self | Add Project |
| **Project-Start** | For Option 7: Start date | Jan 2024 | Add Project |
| **Project-End** | For Option 7: End date | Mar 2024 | Add Project |
| **Project-Skills** | For Option 7: Skills | JavaScript | Add Project |
| **Intern-Role** | For Option 8: Internship role | Software Developer | Add Internship |
| **Intern-Company** | For Option 8: Company | TCS | Add Internship |
| **Intern-Function** | For Option 8: Function | Engineering | Add Internship |
| **Intern-Industry** | For Option 8: Industry | IT Services | Add Internship |
| **Intern-Start** | For Option 8: Start date | Jun 2023 | Add Internship |
| **Intern-End** | For Option 8: End date | Aug 2023 | Add Internship |
| **Intern-Skills** | For Option 8: Skills | JavaScript | Add Internship |

## Sample Test Data Rows

### Row 1: E2E via Existing Work Experience (Option 3)
```
Student-Email-ID: test@example.com
Student-PassWord: TestPass123
Role-Name: Software Developer
Resume-File-Path: C:/test-data/resume.pdf
Skill-Category: 3
```

### Row 2: E2E via Add New Work Experience (Option 10)
```
Student-Email-ID: test2@example.com
Student-PassWord: TestPass123
Role-Name: Software Developer
Resume-File-Path: C:/test-data/resume.pdf
Skill-Category: 10
Work-Role: Software Developer
Work-Company: Infosys
Work-Function: Engineering
Work-Industry: IT Services
Work-Start: Jan 2024
Work-End: Jun 2024
Work-Job-Title: Junior Developer
Work-Skills: JavaScript
```

### Row 3: Academics - 10th Only (Option 1)
```
Student-Email-ID: test3@example.com
Student-PassWord: TestPass123
Role-Name: Software Developer
Resume-File-Path: C:/test-data/resume.pdf
Skill-Category: 1
Skill-Academics: 10th
```

## Notes

1. **Skill-Category Values:**
   - 1 = Academics (requires Skill-Academics: 10th/12th/Both)
   - 2 = Internship
   - 3 = Work Experience
   - 4 = Training Course
   - 5 = Project
   - 6 = Add Academics
   - 7 = Add Project
   - 8 = Add Internship
   - 9 = Add Certification
   - 10 = Add Work Experience

2. **Date Format:** "MMM YYYY" (e.g., "Jan 2024", "Jun 2023")

3. **File Path:** Use absolute paths for resume files

4. **Prerequisites:**
   - For Options 1-5: Student must have existing records in their profile
   - For Options 6-10: Student should NOT have existing records (or test will create new ones)

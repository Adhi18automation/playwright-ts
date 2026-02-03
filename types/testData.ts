export interface LoginData {
  STUDENTMAIL: string;
  PASSWORD: string;
}

export interface AddressData {
  COUNTRY: string;
  STATE: string;
  CITY: string;
  POSTALCODE: number;
}

export interface MarksData {
  MARKS: string;
  QUALIFICATION: string;
  STATE_DIPLOMA?: string;
  CITY_DIPLOMA?: string;
  COLLEGE_DIPLOMA?: string;
  YEAR_DIPLOMA?: number;
  MARKS_TYPE: string;
  MARKS_DIPLOMA?: string;
  CGPA_OUT_OF?: string;
  DEGREE?: string;
  DEPARTMENT?: string;
  BOARD_12TH?: string;
  YEAR_12TH?: number;
  MARKS_12TH?: string;
}

export interface InternshipData {
  ROLE: string;
  COMPANY: string;
  FUNCTION: string;
  INDUSTRY: string;
  START_DATE: string;
  END_DATE: string;
  SKILLS: string;
}

export interface WorkExperienceData {
  ROLE: string;
  TITLE: string;
  COMPANY: string;
  FUNCTION: string;
  INDUSTRY: string;
  SKILLS: string;
  START_DATE: string;
  END_DATE: string;
  EMPLOYMENT_TYPE: string;
}

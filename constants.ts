import { ResumeData } from './types';

export const SECTION_PLACEHOLDERS: { [key: string]: string } = {
  'PROFESSIONAL SUMMARY': '<p>[Add your professional summary here]</p>',
  'CORE SKILLS': '<ul><li>Skill 1</li><li>Skill 2</li><li>Skill 3</li></ul>',
  'EXPERIENCE': '<p><strong>Job Title | Company Name | Start Date - End Date</strong></p><ul><li>Achievement or responsibility</li><li>Achievement or responsibility</li></ul>',
  'EDUCATION': '<p>Degree in [Field of Study]</p><p>University Name | Graduation Year</p>',
  'PROJECTS': '<p><strong>Project Name | Link to project</strong></p><ul><li>Description of the project and your role.</li></ul>',
  'CERTIFICATIONS': '<p>Certification Name | Issuing Body | Year</p>',
  'LANGUAGES': '<ul><li>Language (Proficiency)</li></ul>',
  'VOLUNTEERING': '<p><strong>Organization | Role | Start Date - End Date</strong></p><ul><li>Key responsibilities and achievements.</li></ul>',
  'PUBLICATIONS': '<p>Title of Publication | Where it was published | Year</p>',
  'PROFESSIONAL AFFILIATIONS': '<p>Name of Affiliation | Role</p>',
  'INTERESTS': '<ul><li>Interest 1</li><li>Interest 2</li></ul>',
  'AWARDS & HONORS': '<p>Award/Honor Name | Issuing Organization | Year</p>',
  'REFERENCES': '<p>Available upon request.</p>',
  'CUSTOM SECTION': '<p>[Add your custom content here]</p>'
};

export const DEFAULT_RESUME_DATA: ResumeData = {
  name: 'YOUR NAME',
  title: 'Your Title/Position',
  contact: {
    email: 'Your Email',
    phone: 'Your Phone',
    linkedin: 'Your LinkedIn',
  },
  sections: [
    { id: 'summary', title: 'PROFESSIONAL SUMMARY', content: SECTION_PLACEHOLDERS['PROFESSIONAL SUMMARY'] },
    { id: 'skills', title: 'CORE SKILLS', content: SECTION_PLACEHOLDERS['CORE SKILLS'] },
    { id: 'experience', title: 'EXPERIENCE', content: SECTION_PLACEHOLDERS['EXPERIENCE'] },
    { id: 'education', title: 'EDUCATION', content: SECTION_PLACEHOLDERS['EDUCATION'] },
  ],
};

export const ALL_SECTIONS = [
  'Heading', 'Professional Summary', 'Core Skills', 'Experience', 'Education', 'Projects', 'Certifications', 'Languages', 'Volunteering', 'Publications', 'Professional Affiliations', 'Interests', 'Awards & Honors', 'References', 'Custom Section'
];
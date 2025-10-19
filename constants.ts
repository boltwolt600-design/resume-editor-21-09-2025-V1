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

export const PROFESSIONAL_CLASSIC_TEMPLATE = {
  data: {
    name: 'YOUR NAME',
    title: 'WEB & GRAPHIC DESIGNER',
    contact: {
      email: 'harryjohnson@gmail.com',
      phone: '+055 1242 132 551',
      linkedin: 'linkedin@harryjohnson',
      website: 'www.yourwebsite.com',
      address: 'City Name, Country, CA 90802',
      facebook: 'facebook@harryjohnson',
      twitter: 'twitter@harryjohnson',
    },
    sections: [
      {
        id: 'profile',
        title: 'PROFILE',
        content: `<p>[A brief, compelling summary of your professional background, skills, and career goals. Tailor this to the job you are applying for.]</p>`,
      },
      {
        id: 'contact',
        title: 'CONTACT',
        content: `
          <p>+055 1242 132 551</p>
          <p>harryjohnson@gmail.com</p>
          <p>www.yourwebsite.com</p>
          <p>City Name, Country, CA 90802</p>
        `,
      },
      {
        id: 'education',
        title: 'EDUCATION',
        content: `
          <h4>MASTER OF SCIENCE</h4>
          <p>University Name Here - London</p>
          <p>2005 - 2007</p>
          <br/>
          <h4>BACHELOR OF SCIENCE</h4>
          <p>University Name Here - London</p>
          <p>2002 - 2005</p>
        `,
      },
      {
        id: 'skills',
        title: 'SKILLS',
        content: `
          <p>Photoshop</p>
          <p>Wordpress</p>
          <p>InDesign</p>
          <p>Illustrator</p>
          <p>PowerPoint</p>
          <p>Illustrator</p>
        `,
      },
      {
        id: 'experience',
        title: 'EXPERIENCE',
        content: `
          <p>April 2017 - Present</p>
          <h4>SENIOR MARKETING SPECIALIST</h4>
          <p><strong>Smart Pixel Studio - New York</strong></p>
          <p>Lorem ipsum dolor sit amet, magna consectetuer adipiscing elit, sed diamnibih euismod the tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim venia, nostrud exerci tation ullamcorperduis dolore te.</p>
          <ul>
            <li>Lorem ipsum dolor sit amet, nostrud exerci tation ullamcorper duis dolore te.</li>
            <li>The wisi enim ad minim venia, nostrud tation ullamcorperduis dolore</li>
          </ul>
          <br/>
          <p>January 2015 - April 2017</p>
          <h4>GRAPHIC & WEB DESIGNER</h4>
          <p><strong>Web Tech Technology Ltd - Lonson</strong></p>
          <p>Lorem ipsum dolor sit amet, magna consectetuer adipiscing elit, sed diamnibih euismod the tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim venia, nostrud exerci tation ullamcorperduis dolore te.</p>
          <ul>
            <li>Lorem ipsum dolor sit amet, nostrud exerci tation ullamcorper duis dolore te.</li>
            <li>The wisi enim ad minim venia, nostrud tation ullamcorperduis dolore</li>
          </ul>
        `,
      },
      {
        id: 'socials',
        title: 'SOCIALS',
        content: `
          <p>Facebook: @harryjohnson</p>
          <p>Twitter: @harryjohnson</p>
          <p>LinkedIn: @harryjohnson</p>
        `
      }
    ],
  },
  formatting: {
    accentColor: '#333333',
    textAlign: 'left',
    lineSpacing: 1.5,
    sideMargins: 25,
    fontStyle: 'Lato',
    fontSize: 10,
  }
} as const;


export const EXECUTIVE_CLASSIC_TEMPLATE = {
  data: {
    name: 'DENISE ROBERTSON',
    title: 'Professional Job Title',
    contact: {
      address: 'City, Country',
      phone: '0123 000 0000',
      email: 'name.surname@email.com'
    },
    sections: [
      {
        id: 'profile',
        title: 'PROFESSIONAL PROFILE',
        content: `<p>Write a brief, engaging text about yourself. Provide information about your educational background, work experience, skills and key achievements relevant to the role you are applying for. Describe your most impressive achievement and quantify it.</p>`
      },
      {
        id: 'experience',
        title: 'WORK EXPERIENCE',
        content: `
          <div class="job-entry">
            <div class="job-header"><p><strong>JOB TITLE</strong></p><p><em>mm/yyyy – mm/yyyy</em></p></div>
            <p><strong>Company Name (City, Country)</strong></p>
            <ul>
              <li>Use bullet point lists to describe your main responsibilities and achievements. Start every bullet point with an action verb, such as ‘improved’, ‘coordinated’ and ‘implemented’, especially if you are describing your previous accomplishments.</li>
              <li>Be consistent with the tense you are using. The recommendation is to describe your current role in present continuous tense and previous roles in past simple tense.</li>
            </ul>
          </div>
          <div class="job-entry">
            <div class="job-header"><p><strong>JOB TITLE</strong></p><p><em>mm/yyyy – mm/yyyy</em></p></div>
            <p><strong>Company Name (City, Country)</strong></p>
            <ul>
              <li>Tailor your descriptions to the role you are applying for by reorganizing the bullet point list. The easiest way to do it is to put the most relevant tasks closer to the top of your description.</li>
            </ul>
          </div>
        `
      },
      {
        id: 'education',
        title: 'EDUCATION',
        content: `
          <div class="job-entry">
            <div class="job-header"><p><strong>Master’s Degree in Major</strong></p><p><em>mm/yyyy – mm/yyyy</em></p></div>
            <p>Name of the institution or university, City, Country</p>
          </div>
          <div class="job-entry">
            <div class="job-header"><p><strong>Bachelor’s Degree in Major</strong></p><p><em>mm/yyyy – mm/yyyy</em></p></div>
            <p>Name of the institution or university, City, Country</p>
          </div>
        `
      },
      {
        id: 'skills',
        title: 'SKILLS',
        content: `
          <p><strong>Languages:</strong> language (proficiency), language (proficiency), language (proficiency)</p>
          <p><strong>Technical skills:</strong> MS Office (proficiency), software (proficiency), software (proficiency)</p>
          <p><strong>Other skills:</strong> list a few job-relevant skills and competencies (e.g. project management, graphic design, data analysis)</p>
        `
      }
    ],
  },
  formatting: {
    accentColor: '#333333',
    textAlign: 'left',
    lineSpacing: 1.4,
    sideMargins: 25,
    fontStyle: 'Garamond',
    fontSize: 11,
  }
} as const;

export const CREATIVE_MODERN_TEMPLATE = {
  data: {
    name: 'YOUR NAME',
    title: 'GRAPHIC DESIGNER',
    photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=2080&auto=format&fit=crop',
    contact: {},
    sections: [
      {
        id: 'contact',
        title: 'CONTACT',
        content: `
          <p>Number</p>
          <p>Email</p>
          <p>Website</p>
        `
      },
      {
        id: 'education',
        title: 'EDUCATION',
        content: `
          <p><strong>2018</strong> University name</p>
          <p>Major in vision and Visual Communication</p>
          <br/>
          <p><strong>2012</strong> University name</p>
          <p>Major in vision and Visual Communication</p>
        `
      },
      {
        id: 'expertise',
        title: 'EXPERTISE',
        content: `
          <div class="expertise-grid">
            <div class="expertise-item">Graphic<br/>Designer</div>
            <div class="expertise-item">Motion<br/>Graphic</div>
          </div>
        `
      },
      {
        id: 'profile',
        title: 'PROFILE',
        content: `<p>Graphic designer with a modern-fluent mastery of design, committed to achieving exceptional visual communication solutions.</p>`
      },
      {
        id: 'experience',
        title: 'EXPERIENCES',
        content: `
          <p><strong>2022</strong> Workplace name</p>
          <p>Senior Graphic Designer</p>
          <p>Led branding projects, ensuring consistency and with brooding closely with cross-functional teams.</p>
          <br/>
          <p><strong>2020</strong> Workplace name</p>
          <p>Graphic Designer</p>
          <p>Managed a diverse dress of print of digital projects, from concept of completion.</p>
        `
      }
    ]
  },
  formatting: {
    accentColor: '#1a2e2a',
    textAlign: 'left',
    lineSpacing: 1.5,
    sideMargins: 20,
    fontStyle: 'Montserrat',
    fontSize: 10,
  }
} as const;

export const CREATIVE_PHOTO_TEMPLATE = {
  data: {
    name: 'RICHARD SAUNDERSON',
    title: 'Creative Director',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
    contact: {
      address: '123 Street, City, State 45678',
      phone: '+0(00) 123 45678',
      email: 'Your.info@example.com'
    },
    sections: [
      {
        id: 'experience',
        title: 'JOB EXPERIENCE',
        content: `
          <h4>ENTER JOB POSITION | 2014 - 2016</h4>
          <p>Company Name | New York City</p>
          <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>
          <br/>
          <h4>ENTER JOB POSITION | 2014 - 2016</h4>
          <p>Company Name | New York City</p>
          <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>
        `
      },
      {
        id: 'skills',
        title: 'SKILLS',
        content: `
          <div class="skill-grid">
            <p>WORDPRESS</p><div class="skill-bar-wrapper"><div class="skill-bar" style="width: 80%"></div></div>
            <p>ILLUSTRATOR</p><div class="skill-bar-wrapper"><div class="skill-bar" style="width: 90%"></div></div>
            <p>HTML, CSS</p><div class="skill-bar-wrapper"><div class="skill-bar" style="width: 95%"></div></div>
            <p>INDESIGN</p><div class="skill-bar-wrapper"><div class="skill-bar" style="width: 75%"></div></div>
            <p>PHOTOSHOP</p><div class="skill-bar-wrapper"><div class="skill-bar" style="width: 85%"></div></div>
            <p>MS WORD</p><div class="skill-bar-wrapper"><div class="skill-bar" style="width: 70%"></div></div>
          </div>
        `
      },
      {
        id: 'contact_footer',
        title: '',
        content: '<p>www.yourweb.com</p>'
      },
      {
        id: 'quote',
        title: '',
        content: `<p>"Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat."</p>`
      },
      {
        id: 'education_right',
        title: 'EDUCATION',
        content: `
          <p><strong>2008 - 2012</strong></p>
          <p>ENTER YOUR DEGREE</p>
          <p>University Name / Address Here</p>
          <br/>
          <p><strong>2008 - 2012</strong></p>
          <p>ENTER YOUR DEGREE</p>
          <p>University Name / Address Here</p>
        `
      }
    ]
  },
  formatting: {
    accentColor: '#3d85c6',
    textAlign: 'left',
    lineSpacing: 1.6,
    sideMargins: 20,
    fontStyle: 'Roboto',
    fontSize: 10,
  }
} as const;

export const PROFESSIONAL_PHOTO_TEMPLATE = {
  data: {
    name: 'HENRY MADISON',
    title: 'GRAPHIC DESIGNER',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop',
    contact: {
      email: 'info@yourmail.com',
      phone: '+0000 1234 5678',
      address: 'New York City - 000',
    },
    sections: [
      {
        id: 'socials',
        title: '',
        content: '<p>in | tw | f</p>'
      },
      {
        id: 'contact',
        title: 'CONTACT',
        content: `<p>EMAIL:<br/>info@yourmail.com</p><p>PHONE:<br/>+0000 1234 5678</p><p>ADDRESS:<br/>New York City - 000</p>`
      },
      {
        id: 'interests',
        title: 'INTERESTS',
        content: '<p>Icons here</p>'
      },
      {
        id: 'profile',
        title: 'PROFILE',
        content: '<p>Highly skilled and imaginative Graphic Designer with a passion for translating ideas into captivating visual narratives. Proficient in leveraging design principles and cutting-edge software.</p>'
      },
      {
        id: 'education',
        title: 'EDUCATION',
        content: `
          <p><strong>ASIAN UNIVERSITY</strong><br/>2000 - 2005<br/>BACHELORS OF SCIENCE</p>
          <p><em>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</em></p>
        `
      },
      {
        id: 'experience',
        title: 'EXPERIENCE',
        content: `
          <p><strong>SENIOR DESIGNER</strong><br/>2000 - 2005<br/>Company Name</p>
          <p><em>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</em></p>
        `
      },
      {
        id: 'skills',
        title: 'SKILLS',
        content: `
        <div class="skill-grid-photo">
          <div><span>Ai</span><p>ILLUSTRATOR</p></div>
          <div><span>Ps</span><p>PHOTOSHOP</p></div>
          <div><span>Id</span><p>INDESIGN</p></div>
          <div><span>Ae</span><p>AFTER EFFECTS</p></div>
        </div>
        `
      }
    ]
  },
  formatting: {
    accentColor: '#0b5394',
    textAlign: 'left',
    lineSpacing: 1.5,
    sideMargins: 20,
    fontStyle: 'Open Sans',
    fontSize: 10,
  }
} as const;
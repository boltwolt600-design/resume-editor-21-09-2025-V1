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

export const MANJARI_SINGH_TEMPLATE = {
  data: {
    name: 'MANJARI SINGH',
    title: '',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',
    contact: {
      email: 'manjarisofficial@gmail.com',
      phone: '+91 9766777121',
      instagram: '@wideeyed_pocketsized',
    },
    sections: [
      { id: 'header_left', title: 'GRAPHIC DESIGNER PHOTOGRAPHER ARTIST', content: '' },
      { id: 'academics', title: 'ACADEMICS', content: '<p><strong>Symbiosis Institute of Design</strong><br/>B.des in Fashion Design 2016-20</p>' },
      { id: 'interests', title: 'INTERESTS', content: '<p>BOOKS | MOVIES | GAMING | PLANTS | MUSIC | SKETCHING & DRAWING | COOKING</p>' },
      { id: 'summary', title: '', content: '<p>Hello! My name is Manjari. I am a freelancer & visual storyteller based in Pune, India. With an experience of 5+ years in <strong>photography</strong>, I also have a 4+ years of industry experience in <strong>graphic design, photo/video editing</strong> and <strong>visual design.</strong><br/>I am also an <strong>illustration</strong> artist. I have a meticulous perspective with keen eye for visual aesthetics.</p>' },
      { id: 'experience', title: 'WORK EXPERIENCE', content: `
        <div class="timeline-entry"><div class="timeline-year">2019</div><div><strong>KA-SHA</strong> (Fashion Intern)</div></div>
        <div class="timeline-entry"><div class="timeline-year">2020</div><div><strong>The Blonde Salad</strong> - Italy (Intern)</div></div>
        <div class="timeline-entry"><div class="timeline-year">2021</div><div><strong>India Lost & Found</strong> (Illustrator mentor)<br/><strong>Inti & Chandra</strong> - London (Branding)</div></div>
        <div class="timeline-entry"><div class="timeline-year">2022</div><div><strong>Freckl Studio</strong> - Melbourne (Rebranding)</div></div>
        <div class="timeline-entry"><div class="timeline-year">2023</div><div><strong>Wallets & Wines</strong> (Sr. Graphic Designer)<br/><strong>L'Officiel Ukraine</strong> (Video Editor)<br/><strong>Olga Tanui</strong> - USA (Video Editor)<br/><strong>Four Points by Sheraton</strong> (Photographer)</div></div>
      ` },
      { id: 'extras', title: 'EXTRAS', content: '<ul><li>Photographer for Forever 21, Westside, Splash, Turf Club, etc.</li><li>Featured photographer in magazine - Art Hole (UK), DOCU (Germany), The Curator Mag</li><li>Featured Designer in Pune Fashion Week</li><li>Backstage work for Lakme Fashion week, Blender\'s Pride, NH7 Weekender.</li></ul>' },
      { id: 'software', title: '', content: '<div class="software-grid"><div>Ps</div><div>Pr</div><div>Lr</div><div>Ai</div></div>' }
    ]
  },
  formatting: {
    accentColor: '#000000',
    textAlign: 'left',
    lineSpacing: 1.5,
    sideMargins: 15,
    fontStyle: 'Helvetica',
    fontSize: 10,
  }
} as const;

export const OLIVIA_LINGTON_TEMPLATE = {
  data: {
    name: 'Olivia lington',
    title: 'graphic designer',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
    contact: {
      address: 'Anywhere',
      phone: '123-456-7890',
      email: 'yourname@gmail.com',
    },
    sections: [
      { id: 'summary', title: "I'm create", content: '<p>visual concepts, using computer software or by hand, to communicate ideas that inspire, inform, and captivate consumers.</p>' },
      { id: 'education', title: 'EDUCATION', content: '<p><strong>Art and Design</strong><br/>University of the Arts London<br/>20XX - 20XX</p>' },
      { id: 'skills', title: 'SKILLS', content: '<p>Communication<br/>Typography<br/>Interactive Media<br/>Delivering Presentations</p>' },
      { id: 'software', title: 'SOFTWARE SKILLS', content: '<p>Adobe Creative Suite<br/>Figma<br/>Databases<br/>MS Office</p>' },
      { id: 'experience', title: 'EXPERIENCE', content: '<p><strong>Graphic Designer</strong><br/>Company name<br/>20XX</p>' },
      { id: 'certificate', title: 'CERTIFICATE', content: '<p><strong>Certified Graphics</strong><br/>Design Specialization<br/>20XX</p>' },
      { id: 'contacts_footer', title: 'CONTACTS', content: '<p>Anywhere<br/>123-456-7890<br/>yourname@gmail.com</p>' },
      { id: 'thank_you', title: '', content: 'Thank you.'}
    ]
  },
  formatting: {
    accentColor: '#D9534F',
    textAlign: 'left',
    lineSpacing: 1.6,
    sideMargins: 25,
    fontStyle: 'Times New Roman',
    fontSize: 11,
  }
} as const;

export const ALEX_BRAHAR_TEMPLATE = {
  data: {
    name: 'ALEX BRAHAR',
    title: 'UI DESIGNER',
    photo: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=1776&auto=format&fit=crop',
    contact: {
      address: 'Your Street Address Here',
      phone: '000-000-0000',
      email: 'urname@email.com',
      website: 'www.websitename.com',
    },
    sections: [
      { id: 'summary', title: '', content: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>' },
      { id: 'education', title: 'Education', content: '<h4>ENTER YOUR MAJOR</h4><p>Name Of Your University Here<br/>2005-2009</p><br/><h4>ENTER YOUR MAJOR</h4><p>Name Of Your University Here<br/>2009-2011</p>' },
      { id: 'hobbies', title: 'Hobbies', content: '<p>Travel - Music - Writing - Chess</p>' },
      { id: 'experience', title: 'Experience', content: '<h4>Enter Job Position Here</h4><p><em>Company Name / Location</em></p><p>Lorem ipsum dolor sit amet, this is a the淳a consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et.</p><br/><p><strong>2015 - 2017</strong></p><h4>Enter Job Position Here</h4><p><em>Company Name / Location</em></p><p>Lorem ipsum dolor sit amet, this is a the淳a consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et.</p>' },
      { id: 'expertise', title: 'Expertise', content: '<p>Circle icons here</p>' },
    ]
  },
  formatting: {
    accentColor: '#FFC107',
    textAlign: 'left',
    lineSpacing: 1.5,
    sideMargins: 20,
    fontStyle: 'Lato',
    fontSize: 10,
  }
} as const;

export const DIYA_PATEL_TEMPLATE = {
  data: {
    name: 'DIYA PATEL',
    title: 'COMMUNICATION DESIGN STUDENT',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop',
    contact: {
      phone: '+91 9712224131',
      email: 'pateldiya5804@gmail.com',
      behance: 'diyapatel38',
      address: 'Ahmedabad',
    },
    sections: [
      { id: 'summary', title: '', content: '<p>Hi, I\'m Diya Patel, a 3rd-year Communication Design student with a passion for branding, filmmaking, photography, and layout design. I love exploring new creative avenues, including AI and packaging design. Fun, open-minded, and always eager to learn from others, I thrive in collaborative environments that spark fresh ideas and innovation.</p>' },
      { id: 'education', title: 'EDUCATION', content: '<p><strong>INSTITUTE OF DESIGN, NIRMA UNIVERSITY</strong><br/>Bachelor in Design | 2022 - 2026</p><p><strong>NEW TULIP INTERNATIONAL SCHOOL</strong><br/>Higher Secondary | 2020 - 2022</p><p><strong>UDGAM SCHOOL FOR CHILDREN</strong><br/>Secondary | 2013 - 2020</p>' },
      { id: 'experience', title: 'EXPERIENCE', content: '<p><strong>REDO FEST, IDNU</strong><br/>Senior Marketing head | 2025</p><p><strong>REDO FEST, IDNU</strong><br/>Junior Exhibition head | 2024</p><p><strong>CRAFT INDIA COLLABORATIVE</strong><br/>Graphic Intern | May-July 2024</p><p><strong>ABASANA ADVERTISING</strong><br/>Graphic Intern | May-June 2023</p>' },
      { id: 'software', title: 'SOFTWARE', content: '<div class="software-grid-dark"><div>Ps</div><div>Ai</div><div>Id</div><div>Lr</div><div>Pr</div></div>' },
      { id: 'skills', title: 'SKILLS', content: '<div class="pill-grid"><span class="skill-pill">Branding</span><span class="skill-pill">Layouting</span><span class="skill-pill">Photography</span><span class="skill-pill">Videography</span><span class="skill-pill">Prototyping and Wireframing</span><span class="skill-pill">Design Thinking</span><span class="skill-pill">Leadership</span><span class="skill-pill">Team Work</span><span class="skill-pill">Multitasking</span><span class="skill-pill">Collaborative</span><span class="skill-pill">Research</span></div>' },
      { id: 'interests', title: 'INTERESTS', content: '<div class="pill-grid"><span class="skill-pill">Packaging Design</span><span class="skill-pill">Editing</span><span class="skill-pill">UI Design</span><span class="skill-pill">Filming</span><span class="skill-pill">Volunteering</span></div>' },
      { id: 'languages', title: 'LANGUAGES', content: '<p>GUJARATI<br/>HINDI<br/>ENGLISH</p>' },
    ]
  },
  formatting: {
    accentColor: '#333333',
    textAlign: 'left',
    lineSpacing: 1.6,
    sideMargins: 25,
    fontStyle: 'Montserrat',
    fontSize: 10,
  }
} as const;

export const CLAUDIA_ALVES_TEMPLATE = {
  data: {
    name: 'CLAUDIA ALVES',
    title: '',
    photo: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2dcb?q=80&w=1887&auto=format&fit=crop',
    contact: {},
    sections: [
      { id: 'summary', title: '', content: '<p>Lulusan baru jurusan Komunikasi dengan keterampilan menyusun pesan efektif, analisis audiens, dan pengalaman dalam media sosial serta produksi konten.</p>' },
      { id: 'education', title: 'Pendidikan', content: '<p><strong>2017 - 2021</strong><br/><strong>SMK</strong><br/>Liceria</p><p>Jurusan Ilmu Pengetahuan Sosial</p><ul><li>Juara 1 lomba cerdas cermat</li><li>Juara 1 lomba desain</li></ul><p><strong>2021 - 2023</strong><br/><strong>Universitas</strong><br/>Fauget</p><p>Jurusan Komunikasi</p><ul><li>Ketua organisasi mahasiswa</li></ul>' },
      { id: 'experience', title: 'Pengalaman', content: '<div class="experience-grid-3col"><p><strong>2017 - 2018<br/>Magang Kuliah</strong><br/>Mengelola platform media sosial perusahaan dan memastikan pesan yang konsisten dan relevan.</p><p><strong>2019 - 2020<br/>Volunteer</strong><br/>Membangun dan memelihara hubungan dengan media, mitra, dan pemangku kepentingan lainnya.</p><p><strong>2021 - 2022<br/>Asisten Dosen</strong><br/>Menyediakan dukungan komunikasi untuk acara-acara perusahaan dan aktivitas promosi.</p></div>' },
      { id: 'certificates', title: 'Sertifikat', content: '<div class="certificate-grid"><p><strong>Bahasa Mandarin (500 Poin)</strong><br/>Valid 2018 - 2022<br/>Oleh Lembaga Bahasa Liceria</p><p><strong>Komunikasi (500 Poin)</strong><br/>Valid 2018 - 2022<br/>Oleh Lembaga Khusus Liceria</p><p><strong>Bahasa Inggris (520 Poin)</strong><br/>Valid 2019 - 2023<br/>Oleh Lembaga Bahasa Liceria</p><p><strong>Marketing (500 Poin)</strong><br/>Valid 2019 - 2023<br/>Oleh Lembaga Khusus Liceria</p></div>' },
      { id: 'notes', title: 'Notes:', content: '<p>Lulusan Baru Jurusan Komunikasi</p>' },
      { id: 'contact_box', title: 'Kontak:', content: '<p><strong>Sosmed :</strong> @reallygreatsite<br/><strong>Alamat :</strong> 123 Anywhere St., Any City, ST 12345<br/><strong>Email :</strong> hello@reallygreatsite.com<br/><strong>Telepon :</strong> +123-456-7890</p>' }
    ]
  },
  formatting: {
    accentColor: '#673AB7',
    textAlign: 'left',
    lineSpacing: 1.5,
    sideMargins: 25,
    fontStyle: 'Helvetica',
    fontSize: 11,
  }
} as const;

export const BECKY_LU_TEMPLATE = {
  data: {
    name: 'BECKY LU',
    title: 'Design Specialist',
    photo: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=1887&auto=format&fit=crop',
    contact: {
      address: '123 North Lake, MN',
      phone: '123-456-7890',
      email: 'mail@example.com',
      website: 'ww.example.com',
    },
    sections: [
      { id: 'summary', title: '', content: '<p>Talented and ambitious Design Specialist with six years of experience working closely with local and international clients across various industries. Proficient in multiple design language, Becky brings forth interesting design solutions to new landscapes.</p>' },
      { id: 'skills', title: 'Skills', content: '<ul><li>Problem solving skills</li><li>Communication skills</li><li>3D design tools</li><li>Teamwork skills</li><li>Storytelling skills</li><li>Web design skills</li></ul>' },
      { id: 'education', title: 'Education', content: '<p><strong>West University</strong><br/>BA in Graphic Design<br/>2013- 2016</p>' },
      { id: 'experience', title: 'Experience', content: '<h4>Design Specialist</h4><p>Design Way 2019 - present</p><ul><li>Offer guidance and advice for creative team on best practices to the production of print and digital graphic designs.</li><li>Introduce new ways to optimize designs to best suit the changing market environment.</li><li>Provide constructive criticism and relevant feedback for creative and design team to continue to produce quality work in an efficient manner.</li></ul><h4>Social Media Assistant</h4><p>Art Creations 2017 - 2018</p><ul><li>Create design concepts and provide additional support to senior members of the design team.</li><li>Work directly with the marketing team in developing an effective and appealing social media marketing plan.</li><li>Responsible for visualizing and producing designs for social media posts.</li></ul>' },
      { id: 'references', title: 'REFERENCES', content: '<div class="references-grid"><p><strong>Dianna Grey</strong><br/>Sn. Designer, Art Creations<br/>Phone 123-456-7890<br/>Email mail@example.com</p><p><strong>Cindy Xi</strong><br/>Creative Director, Design Way<br/>Phone 123-456-7890<br/>Email mail@example.com</p></div>' },
    ]
  },
  formatting: {
    accentColor: '#FFD700',
    textAlign: 'left',
    lineSpacing: 1.6,
    sideMargins: 25,
    fontStyle: 'Verdana',
    fontSize: 10,
  }
} as const;

export const EXECUTIVE_PROFESSIONAL_TEMPLATE = {
  data: {
    name: 'LAURA SMITH',
    title: 'EXECUTIVE ASSISTANT',
    contact: {
      phone: '+888 123 156 789',
      email: 'l.smith@email.com',
      address: 'London, UK',
      website: 'www.yourweb.com',
    },
    sections: [
      { id: 'contact', title: 'CONTACT', content: '<p>+888 123 156 789</p><p>l.smith@email.com</p><p>London, UK</p><p>www.yourweb.com</p>' },
      { id: 'skills', title: 'SKILLS', content: '<p>Social Media Marketing</p><p>Project Management</p><p>Content Development</p><p>Google Analytics</p><p>Copywriting</p><p>Data Analytic</p><p>Problem Solving</p>' },
      { id: 'education', title: 'EDUCATION', content: '<h4>DEGREE/BACHELOR</h4><p>University of Oxford</p><p>2010 - 2014</p><br/><h4>DEGREE/BACHELOR</h4><p>University of Oxford</p><p>2010 - 2012</p>' },
      { id: 'profile', title: 'PROFILE', content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>' },
      { id: 'experience', title: 'EXPERIENCE', content: '<h4>JOB TITLE</h4><p><strong>Company / Location / 2018 - Present</strong></p><p>Amet mattis vulputate enim nulla aliquet porttitor. Amet tellus cras adipiscing enim eu turpis egestas pretium. Sem viverra aliquet eget sit amet tellus cras adipiscing. Vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum.</p><ul><li>Mattis pellentesque id nibh tortor. Sit amet nulla facilisi morbi tempus iaculis urna id.</li><li>Volutpat consequat mauris nunc congue.</li><li>Eu feugiat pretium nibh ipsum consequat.</li></ul><br/><h4>JOB TITLE</h4><p><strong>Company / Location / 2015 - 2017</strong></p><p>Amet mattis vulputate enim nulla aliquet porttitor. Amet tellus cras adipiscing enim eu turpis egestas pretium. Sem viverra aliquet eget sit amet tellus cras adipiscing. Vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum.</p><ul><li>Mattis pellentesque id nibh tortor. Sit amet nulla facilisi morbi tempus iaculis urna id.</li><li>Volutpat consequat mauris nunc congue.</li><li>Eu feugiat pretium nibh ipsum consequat.</li></ul>' },
    ]
  },
  formatting: {
    accentColor: '#EAE7E2',
    textAlign: 'left',
    lineSpacing: 1.5,
    sideMargins: 25,
    fontStyle: 'Helvetica',
    fontSize: 10,
  }
} as const;

export const MODERN_PHOTO_TEMPLATE = {
  data: {
    name: 'HANNAH MORALES',
    title: 'SOCIAL MEDIA MANAGER',
    photo: 'https://images.unsplash.com/photo-1521146764736-56c929d59c83?q=80&w=1887&auto=format&fit=crop',
    contact: {
      phone: '123-456-7890',
      email: 'hello@reallygreatsite.com',
      social: '@reallygreatsite',
      address: 'Any City',
    },
    sections: [
      { id: 'summary', title: '', content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>' },
      { id: 'education', title: 'EDUCATION', content: '<h4>BACHELOR OF SCIENCE IN MARKETING</h4><p><strong>Warner & Spencer University | 2018-2021</strong></p><p>Managed complex projects from start to finish. Translated requirements into polished, high-level designs</p><p>Marketing and social media marketing, advertising and public Relations</p>' },
      { id: 'experience', title: 'EXPERIENCE', content: '<h4>COPYWRITER</h4><p><strong>Warner & Spencer | 2025-2026</strong></p><p>Boosted our monthly output by 80% by creating daily articles, story ideas, and social media posts.</p><p>Improved the team\'s copy by 10% by identifying gaps in existing online content and collaborating with editors during research.</p><br/><h4>SENIOR COPYWRITER</h4><p><strong>Warner & Spencer | 2025-2026</strong></p><p>Boosted our monthly output by 80% by creating daily articles, story ideas, and social media posts.</p>' },
      { id: 'skills', title: 'SKILLS', content: '<div class="pill-grid"><span class="skill-pill">Content Planning</span><span class="skill-pill">Research</span><span class="skill-pill">Graphic Design</span><span class="skill-pill">Writing</span><span class="skill-pill">SEO</span><span class="skill-pill">Marketing Strategy</span><span class="skill-pill">Market Research</span><span class="skill-pill">Brand strategy</span><span class="skill-pill">Trend Analysis</span><span class="skill-pill">Multitasking</span><span class="skill-pill">Budget management</span><span class="skill-pill">Reporting</span></div>' },
      { id: 'awards', title: 'AWARDS', content: '<h4>LEADERSHIP AWARD</h4><p><strong>Fauget 2025</strong></p><p>Recognition for exemplary leadership and consistent quality output</p>' },
      { id: 'reference', title: 'REFERENCE', content: '<h4>CAHAYA DEWI</h4><p><strong>Warner & Spencer</strong><br/>Phone: 123-456-7890<br/>Email: hello@reallygreatsite.com</p>' },
    ]
  },
  formatting: {
    accentColor: '#333333',
    textAlign: 'left',
    lineSpacing: 1.5,
    sideMargins: 25,
    fontStyle: 'Montserrat',
    fontSize: 10,
  }
} as const;

export const CHRONOLOGICAL_CLEAN_TEMPLATE = {
  data: {
    name: "Andy Bernard",
    title: 'REGIONAL DIRECTOR',
    contact: {
      email: 'abernard@dundermifflin.com',
      phone: '555-555-1234',
      address: 'Scranton, PA',
    },
    sections: [
      { id: 'summary', title: "Hello, I'm", content: "<p>Don't bother with a resume objective. Your objective is obvious—to get hired and paid. Instead, use this space to summarize your story. Who are you? What are your superpowers and how do you use them to solve problems the employer may have? Be honest, authentic, and human.</p>" },
      { id: 'experience', title: 'Experience', content: '<div class="timeline-entry-vertical"><div class="timeline-year-vertical">2021 – CURRENT</div><div><h4>REGIONAL DIRECTOR</h4><p><strong>Dunder Mifflin in Scranton, PA</strong></p><ul><li>Fusce at magna id lectus dignissim dictum id nec augue. Donec fermentum imperdiet metus et volutpat. Proin convallis id risus viverra fermentum.</li></ul></div></div><div class="timeline-entry-vertical"><div class="timeline-year-vertical">2019 – 2021</div><div><h4>SALES ASSOCIATE</h4><p><strong>Dunder Mifflin in Scranton, PA</strong></p><ul><li>Aenean vitae arcu ac magna lacinia accumsan. Nullam vel tortor egestas, aliquam mauris in, ullamcorper lectus.</li></ul></div></div>' },
      { id: 'education', title: 'EDUCATION', content: '<div class="boxed-section"><p>2014 - 2017</p><p><strong>B.A. in Business Administration</strong></p><p>Cornell University</p><br/><p>2012 - 2014</p><p><strong>A.A. in History</strong></p><p>Cornell University</p></div>' },
      { id: 'skills', title: 'SKILLS', content: '<div class="boxed-section"><ul><li>Team Coaching & Leadership</li><li>Revenue Generation & Growth</li><li>Empathetic Listener</li></ul></div>' },
      { id: 'certifications', title: 'CERTIFICATIONS', content: '<div class="boxed-section"><p><strong>Certification Name Here</strong></p><p>Company or Institution Name</p></div>' },
      { id: 'languages', title: 'LANGUAGES', content: '<div class="boxed-section"><div class="language-dots"><p>English</p><div><span></span><span></span><span></span><span></span><span></span></div></div><div class="language-dots"><p>Spanish</p><div><span></span><span></span><span></span><span class="empty"></span><span class="empty"></span></div></div></div>' },
    ]
  },
  formatting: {
    accentColor: '#333333',
    textAlign: 'left',
    lineSpacing: 1.5,
    sideMargins: 25,
    fontStyle: 'Helvetica',
    fontSize: 11,
  }
} as const;

export const CREATIVE_ORGANIC_TEMPLATE = {
  data: {
    name: 'Shu Huan',
    title: '',
    photo: 'https://images.unsplash.com/photo-1520423465839-2c7102e5c840?q=80&w=1887&auto=format&fit=crop',
    contact: {
      email: 'shuhuan23@gmail.com',
      phone: '+60198968080',
      address: 'Petaling Jaya, Selangor',
      linkedin: 'in/Shu Huan Loh'
    },
    sections: [
      { id: 'summary', title: 'Hello, I am', content: "<p>I'm a recent graduate with a Bachelor's (Honours) in Design in Creative Media, specializing in Graphic Design.</p><p>I'm passionate about merchandise design and branding, and I enjoy solving problems with creative solutions. Eager to learn and grow, I thrive in every step of the design process, from brainstorming fresh ideas to delivering impactful and engaging designs.</p>" },
      { id: 'contact', title: 'Contact', content: '<p>shuhuan23@gmail.com</p><p>+60198968080</p><p>Petaling Jaya, Selangor</p><p>in/Shu Huan Loh</p>' },
      { id: 'education', title: 'Education', content: "<p><strong>Taylor's University, Malaysia | 2021 - 2024</strong><br/>Bachelor of Design (Honours) in Creative Media, Graphic Design Specialisation</p><p><strong>Nanyang Academy of Fine Arts, Singapore | 2019 - 2020</strong><br/>Diploma in Graphic Communication</p>" },
      { id: 'softwares', title: 'Softwares', content: '<div class="skill-bar-grid"><p>Ai illustrator</p><div class="skill-bar-wrapper"><div class="skill-bar" style="width: 90%; background-color: #3A8D8C;"></div></div><p>Ps photoshop</p><div class="skill-bar-wrapper"><div class="skill-bar" style="width: 85%; background-color: #3A8D8C;"></div></div><p>Id indesign</p><div class="skill-bar-wrapper"><div class="skill-bar" style="width: 70%; background-color: #3A8D8C;"></div></div><p>Pr premiere pro</p><div class="skill-bar-wrapper"><div class="skill-bar" style="width: 75%; background-color: #3A8D8C;"></div></div><p>Ae after effect</p><div class="skill-bar-wrapper"><div class="skill-bar" style="width: 60%; background-color: #3A8D8C;"></div></div><p>Xd adobe xd</p><div class="skill-bar-wrapper"><div class="skill-bar" style="width: 80%; background-color: #3A8D8C;"></div></div></div>' },
      { id: 'languages', title: 'Languages', content: '<div class="pill-grid"><span class="skill-pill-outline">Mandarin - Native</span><span class="skill-pill-outline">English - IELTS Band 8.0</span><span class="skill-pill-outline">Malay - Basic</span></div>' },
      { id: 'core_skills', title: 'Core Skills', content: '<ul><li>Packaging & Merchandise Design</li><li>Campaign Design</li><li>Brand Identity Design</li><li>Publishing Design</li><li>Social Media Design</li></ul>' },
      { id: 'soft_skills', title: 'Soft Skills', content: '<ul><li>Responsible</li><li>Well Organized</li><li>Teamwork</li><li>Time Management</li><li>Creative</li><li>Initiative and autonomy</li></ul>' },
    ]
  },
  formatting: {
    accentColor: '#3A8D8C',
    textAlign: 'left',
    lineSpacing: 1.6,
    sideMargins: 25,
    fontStyle: 'Montserrat',
    fontSize: 10,
  }
} as const;


export const TECH_SIDEBAR_TEMPLATE = {
  data: {
    name: 'JAMES MARTINE',
    title: 'GRAPHIC & WEB DESIGNER',
    photo: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=1887&auto=format&fit=crop',
    contact: {
      phone: '909 555 0102',
      email: 'yourname@email.com',
      website: 'www.yourwebsite.com',
      address: '123, Your Street, New York, NYC',
      behance: 'behance.net/username',
      facebook: 'facebook.com/username',
    },
    sections: [
      { id: 'about_me', title: 'ABOUT ME', content: '<p>My Name is Richard Anderson lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation.</p>' },
      { id: 'contact_sidebar', title: 'CONTACT', content: '<p>909 555 0102<br/>yourname@email.com<br/>www.yourwebsite.com<br/>123, Your Street, New York, NYC</p>' },
      { id: 'follow_me', title: 'FOLLOW ME', content: '<p>Behance: behance.net/username<br/>Facebook: facebook.com/username</p>' },
      { id: 'references_sidebar', title: 'REFERENCES', content: '<p><strong>PAUL ANDERSON</strong><br/>Web Designer, Design LTD<br/>Phone: 123-456-7890<br/>Email: info@email.com</p><br/><p><strong>WINSTON CHOW</strong><br/>Director, Design Store LTD<br/>Phone: 123-456-7890<br/>Email: winston@email.com</p>' },
      { id: 'interests_sidebar', title: 'INTERESTS', content: '<div class="interest-grid"><p>GAMING</p><p>TRAVELLING</p><p>PHOTOGRAPHY</p><p>SPORTS</p><p>MUSIC</p><p>ART</p></div>'},
      { id: 'education', title: 'EDUCATION', content: '<h4>UNIVERSITY OF STANFORD</h4><p>2003-2005</p><br/><h4>UNIVERSITY OF STANFORD</h4><p>2002-2003</p>'},
      { id: 'experience', title: 'EXPERIENCE', content: '<p><strong>Lorem, Ipsum LTD</strong><br/>2005 - 2007</p><br/><p><strong>Smart Pixel Studio</strong><br/>2002 - 2004</p><br/><p><strong>Tech Technology</strong><br/>2001 - 2002</p>'},
      { id: 'skills', title: 'SKILLS', content: '<div class="skill-bar-grid-alt"><p>Photoshop</p><div class="skill-bar-wrapper"><div class="skill-bar" style="width: 90%; background-color: #34495e;"></div></div><p>Illustrator</p><div class="skill-bar-wrapper"><div class="skill-bar" style="width: 80%; background-color: #34495e;"></div></div><p>HTML / CSS</p><div class="skill-bar-wrapper"><div class="skill-bar" style="width: 95%; background-color: #34495e;"></div></div><p>MS Word</p><div class="skill-bar-wrapper"><div class="skill-bar" style="width: 70%; background-color: #34495e;"></div></div><p>InDesign</p><div class="skill-bar-wrapper"><div class="skill-bar" style="width: 85%; background-color: #34495e;"></div></div><p>Wordpress</p><div class="skill-bar-wrapper"><div class="skill-bar" style="width: 75%; background-color: #34495e;"></div></div></div>'},
    ]
  },
  formatting: {
    accentColor: '#2c3e50',
    textAlign: 'left',
    lineSpacing: 1.5,
    sideMargins: 25,
    fontStyle: 'Lato',
    fontSize: 10,
  }
} as const;

export const SAGE_TIMELINE_TEMPLATE = {
  data: {
    name: 'Maria Souza',
    title: 'Project Manager',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1887&auto=format&fit=crop',
    contact: {
      address: 'Your city, Country',
      phone: '+62 123 456 7890',
      email: 'youremail@email.com',
      website: 'www.yourdomain.com',
    },
    sections: [
      { id: 'summary', title: '', content: '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim.</p>' },
      { id: 'contact_block', title: 'Contact', content: '<p>Your city, Country<br/>+62 123 456 7890<br/>youremail@email.com<br/>www.yourdomain.com</p>' },
      { id: 'education', title: 'Education', content: '<div class="timeline-entry-vertical-alt"><p><strong>Your degree/major</strong></p><p>University name</p><p>2014 - 2018</p></div><div class="timeline-entry-vertical-alt"><p><strong>Your degree/major</strong></p><p>University name</p><p>2014 - 2018</p></div>' },
      { id: 'experience', title: 'Experience', content: '<div class="timeline-entry-vertical-alt"><p><strong>Your job title</strong></p><p>Company name - City</p><p>2014 - 2018</p><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy.</p></div><div class="timeline-entry-vertical-alt"><p><strong>Your job title</strong></p><p>Company name - City</p><p>2014 - 2018</p><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy.</p></div>' },
      { id: 'skills', title: 'Skills', content: '<p>Adobe Illustrator<br/>Adobe Photoshop<br/>Adobe Xd<br/>Microsoft office</p>' },
      { id: 'social', title: 'Social', content: '<p>Instagram: /your-username<br/>LinkedIn: /your-username</p>' },
    ]
  },
  formatting: {
    accentColor: '#698474',
    textAlign: 'left',
    lineSpacing: 1.7,
    sideMargins: 25,
    fontStyle: 'Lora',
    fontSize: 11,
  }
} as const;

export const MINIMALIST_SPLIT_TEMPLATE = {
  data: {
    name: 'MALIN FRANSISKA',
    title: 'POSITION TITLE HERE',
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1887&auto=format&fit=crop',
    contact: {
      address: '555 Street, City/Town',
      phone: '+00 99 88 456 789',
      email: 'your.name@email.com',
      website: 'www.websitename.com',
    },
    sections: [
      { id: 'summary', title: '', content: '<p>Lorem ipsum dolordummy text one evers since printer ipsum ley type and scrambled it to specimen book typesetting industry. Lorem standard Dolor Ipsum. Lorem Ipsum asmel galley type and scrambled it to specimen. ipsu galley type and scrambled</p>' },
      { id: 'experience', title: 'WORK EXPERIENCE', content: '<h4>Enter Your Job Title</h4><p><em>Company name | Location | 2020 - Current</em></p><ul><li>Dummy text is evers since the when unknown printer ipsu ipsutet.</li><li>Esetting lorem when ane lorem standard ipsu ipsu.</li></ul><br/><h4>Enter Your Job Title</h4><p><em>Company name | Location | 2017 - 2019</em></p><ul><li>Dummy text is evers since the when unknown printer ipsu ipsutet.</li><li>Esetting lorem when ane lorem standard ipsu ipsu.</li></ul>' },
      { id: 'references_main', title: 'REFERENCES', content: '<p><strong>Joshua Hutcherson</strong><br/>Position at Company<br/>Phone: +87 215 459 785<br/>Email: infoname@mail.com</p><br/><p><strong>Thomas Madisons</strong><br/>Position at Company<br/>Phone: +87 215 459 785<br/>Email: infoname@mail.com</p>' },
      { id: 'contact_right', title: 'CONTACT', content: '<p>555 Street, City/Town<br/>+00 99 88 456 789<br/>your.name@email.com<br/>www.websitename.com</p>' },
      { id: 'education_right', title: 'EDUCATION', content: '<p><strong>Ba (Hons) Graphics</strong><br/>University / Location<br/>2006 - 2010</p><br/><p><strong>Ma Graphics</strong><br/>Institute / Location<br/>2005 - 2006</p>' },
      { id: 'expertise_right', title: 'EXPERTISE', content: '<p>Resource management<br/>Public Relation<br/>Team Leadership<br/>Social Media Marketing<br/>Content Marketing</p>' },
    ]
  },
  formatting: {
    accentColor: '#333333',
    textAlign: 'left',
    lineSpacing: 1.5,
    sideMargins: 25,
    fontStyle: 'Raleway',
    fontSize: 10,
  }
} as const;

export const MODERN_MINIMALIST_TEMPLATE = {
  data: {
    name: 'Sanat Rath',
    title: 'Interaction Designer',
    photo: '',
    contact: {
      email: 'sanatrath.com',
      website: 'sanatrath.com',
      phone: '404.860.0606',
    },
    sections: [
      { id: 'experience', title: 'Work Experience', content: `<h4>Google / Interaction Designer</h4><p>MAY 2014 - PRESENT, NEW YORK CITY</p><p>Currently, I lead a team to maintain the internal style guide & implement new design patterns in Docs, Sheets & Slides on web & mobile. I create javascript prototypes for research studies, oversee production specs & facilitate design reviews with stakeholders across all the 3 apps.</p><br/><h4>Georgia Tech / Designer</h4><p>AUG 2012 - MAY 2014, ATLANTA</p><p>I designed, developed & launched 2 websites for Africa Atlanta 2014 & Westside Communities Alliance with 5k+ daily unique visitors. I created all marketing materials for Ivan Allen college of Liberal Arts.</p>` },
      { id: 'education', title: 'Education', content: `<h4>Georgia Tech / MS HCI</h4><p>AUG 2012 - MAY 2014, ATLANTA</p><p>Initiated & contributed to several experimental projects involving web, ubiquity, tangible interaction, natural user interfaces, mobile augmented reality & ubiquitous computing.</p><br/><h4>IIT Roorkee / B.Arch</h4><p>AUG 2007 - MAY 2012, ROORKEE</p><p>Created design proposal for Museum of Modern Art, Odisha as a hybrid of art, interaction design & architecture in Bhubaneswar, India.</p>` },
      { id: 'skills', title: 'Skills', content: `<p><strong>Design:</strong> Illustration & UI graphics • Strategy & vision presentations • User flows • Concept sketches • Wireframes & mock ups with Sketch & Illustrator • Motion design with Principle & After Effects • Production redlines • Style guides & pattern library</p><p><strong>Prototyping:</strong> Rapid prototyping using Keynote & Invision • Interactive flow with HTML/ CSS/ JS • Frameworks (Polymer, Backbone, Socket, Angular) & APIs</p>` },
    ]
  },
  formatting: {
    accentColor: '#2a6496',
    textAlign: 'left',
    lineSpacing: 1.6,
    sideMargins: 30,
    fontStyle: 'Helvetica Neue',
    fontSize: 11,
  }
} as const;

export const SOFTWARE_ENGINEER_PRO_TEMPLATE = {
  data: {
    name: 'ALEXANDER WILLIAM SMITH',
    title: 'SOFTWARE ENGINEER',
    photo: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop',
    contact: {
      phone: '+1 555 4 56 7890',
      email: 'alexander-smith@mail.com',
      website: 'www.alexander-website.com',
      address: '23 St, Tec City Los Angeles, CA',
    },
    sections: [
      { id: 'summary', title: 'SUMMARY', content: '<p>Dynamic Software Engineer with over 5 years of experience specializing in backend architecture and development. Adept at designing, building, and integrating new innovative solutions to increase efficiency and scalability. Successfully led projects resulting in a 40% increase in performance metrics. Proficient in agile methodologies and ready to bring technical acumen to a progressive team.</p>' },
      { id: 'experience', title: 'WORK EXPERIENCE', content: `<h4>LEAD SOFTWARE ENGINEER</h4><p><strong>Digital Innovations Inc | June 2021 - Present</strong></p><ul><li>Orchestrated a diverse team of 10 engineers effectively in developing innovative and scalable software solutions, significantly improving project delivery by 35%.</li><li>Adapted legacy code to modern development and design concepts, greatly enhancing system interoperability, functionality, and overall performance.</li></ul><br/><h4>SOFTWARE ENGINEER</h4><p><strong>CloudTech Solutions | July 2018 - May 2021</strong></p><ul><li>Developed 8 cloud-based applications, improving main system reliability by 30%.</li><li>Actively participated in the entire software development lifecycle, from initial concept to final deployment and maintenance, efficiently delivering the final product.</li></ul>` },
      { id: 'projects', title: 'PROJECTS', content: '<p><strong>E-commerce Platform:</strong> A scalable solution for online retail. [link]</p><p><strong>Health Tracking App:</strong> Complex app for monitoring daily health metrics [link]</p>' },
      { id: 'education_right', title: 'EDUCATION', content: '<p><strong>Master of Science in Software Engineering</strong><br/>Stanford University<br/>Sep 2016 - Jun 2018</p>' },
      { id: 'skills_right', title: 'SKILLS', content: '<p><strong>Technical</strong><br/>System Architecture<br/>Java & Python<br/>RESTful APIs</p><br/><p><strong>Professional</strong><br/>Effective Communication<br/>Strategic Planning<br/>Decision Making</p>' },
      { id: 'languages_right', title: 'LANGUAGES', content: '<p>English: Fluent<br/>Spanish: Intermediate</p>' },
    ]
  },
  formatting: {
    accentColor: '#333333',
    textAlign: 'left',
    lineSpacing: 1.5,
    sideMargins: 25,
    fontStyle: 'Calibri',
    fontSize: 11,
  }
} as const;

export const PASTEL_PANELS_TEMPLATE = {
  data: {
    name: 'Listia Prastiwie',
    title: 'Graphic Design',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1887&auto=format&fit=crop',
    contact: {
      social: '@your_usernamehere',
    },
    sections: [
      { id: 'summary', title: '', content: '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim.</p>' },
      { id: 'contact', title: 'CONTACT', content: '<p>Your Address Here blok 5-12,<br/>L.A., California.</p><p>+23-3422-4553-21</p><p>youremail@here.com</p>' },
      { id: 'education', title: 'EDUCATION', content: '<p><strong>Visual Design, 2016</strong><br/>Name of University<br/>Your address here. LA, California</p><br/><p><strong>Visual Design, 2017</strong><br/>Name of University<br/>Your address here. LA, California</p>' },
      { id: 'skills', title: 'PERSONAL SKILL', content: '<div class="skill-dots-grid"><p>Illustrator</p><div><span></span><span></span><span></span><span></span><span class="empty"></span></div><p>Photoshop</p><div><span></span><span></span><span></span><span class="empty"></span><span class="empty"></span></div><p>Figma</p><div><span></span><span></span><span></span><span></span><span></span></div></div>' },
      { id: 'experience', title: 'EXPERIENCE', content: '<p><strong>Graphic Designer, 2018</strong><br/>Monday Studio, LA, California.<br/>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</p><br/><p><strong>Art Assistant, 2019</strong><br/>Tuesday Studio, LA, California.<br/>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</p>' },
      { id: 'awards', title: 'AWARDS', content: '<p><strong>Best Design Thinking</strong><br/>Winning Design Graphic Urban Theme, LA</p><p><strong>Best Concept</strong><br/>Local Award Mountain Beach Theme, TEXAS</p>' },
    ]
  },
  formatting: {
    accentColor: '#b19cd9',
    textAlign: 'left',
    lineSpacing: 1.6,
    sideMargins: 25,
    fontStyle: 'Poppins',
    fontSize: 10,
  }
} as const;
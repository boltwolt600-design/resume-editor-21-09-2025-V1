import React from 'react';

/**
 * Modern Professional Resume Template
 * Two-column layout with accent color sidebar
 * All text elements are editable via contenteditable attribute
 */

interface ModernProfessionalTemplateProps {
  accentColor?: string;
}

export const ModernProfessionalTemplate: React.FC<ModernProfessionalTemplateProps> = ({
  accentColor = '#2c5f7c'
}) => {
  return (
    <div className="w-full max-w-[210mm] min-h-[297mm] bg-white mx-auto shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="flex h-full">
        {/* LEFT COLUMN - Sidebar with accent color */}
        <div className="w-[35%] text-white p-8" style={{ backgroundColor: accentColor }}>

          {/* EDITABLE: Profile Photo */}
          <div className="mb-6 flex justify-center">
            <div className="w-32 h-32 rounded-full bg-white/20 border-4 border-white overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-xs text-center p-2" contentEditable suppressContentEditableWarning>
                [Add Photo Here]
              </div>
            </div>
          </div>

          {/* EDITABLE: Contact Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 pb-2 border-b-2 border-white/30">CONTACT</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold mb-1">Phone</p>
                <p contentEditable suppressContentEditableWarning>(555) 123-4567</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Email</p>
                <p contentEditable suppressContentEditableWarning>your.email@example.com</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Location</p>
                <p contentEditable suppressContentEditableWarning>City, State, Country</p>
              </div>
              <div>
                <p className="font-semibold mb-1">LinkedIn</p>
                <p contentEditable suppressContentEditableWarning>linkedin.com/in/yourprofile</p>
              </div>
            </div>
          </div>

          {/* EDITABLE: Skills Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 pb-2 border-b-2 border-white/30">SKILLS</h3>
            <div className="space-y-4 text-sm">
              {/* Skill 1 */}
              <div>
                <p className="font-semibold mb-2" contentEditable suppressContentEditableWarning>Project Management</p>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
              {/* Skill 2 */}
              <div>
                <p className="font-semibold mb-2" contentEditable suppressContentEditableWarning>Communication</p>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              {/* Skill 3 */}
              <div>
                <p className="font-semibold mb-2" contentEditable suppressContentEditableWarning>Data Analysis</p>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              {/* Skill 4 */}
              <div>
                <p className="font-semibold mb-2" contentEditable suppressContentEditableWarning>Leadership</p>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* EDITABLE: Languages Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 pb-2 border-b-2 border-white/30">LANGUAGES</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span contentEditable suppressContentEditableWarning>English</span>
                <span>Native</span>
              </div>
              <div className="flex justify-between">
                <span contentEditable suppressContentEditableWarning>Spanish</span>
                <span>Fluent</span>
              </div>
              <div className="flex justify-between">
                <span contentEditable suppressContentEditableWarning>French</span>
                <span>Intermediate</span>
              </div>
            </div>
          </div>

          {/* EDITABLE: Certifications Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 pb-2 border-b-2 border-white/30">CERTIFICATIONS</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold" contentEditable suppressContentEditableWarning>Certification Name</p>
                <p className="text-white/80 text-xs" contentEditable suppressContentEditableWarning>Issuing Organization | Year</p>
              </div>
              <div>
                <p className="font-semibold" contentEditable suppressContentEditableWarning>Certification Name</p>
                <p className="text-white/80 text-xs" contentEditable suppressContentEditableWarning>Issuing Organization | Year</p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - Main content */}
        <div className="w-[65%] p-8 text-gray-800">

          {/* EDITABLE: Name and Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2" style={{ color: accentColor }} contentEditable suppressContentEditableWarning>
              JOHN DOE
            </h1>
            <h2 className="text-xl text-gray-600" contentEditable suppressContentEditableWarning>
              Software Engineer
            </h2>
          </div>

          {/* EDITABLE: Professional Summary */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-3 pb-2 uppercase" style={{ borderBottom: `2px solid ${accentColor}` }}>
              Professional Summary
            </h3>
            <p className="text-sm leading-relaxed text-gray-700" contentEditable suppressContentEditableWarning>
              Results-driven professional with 5+ years of experience in software development and project management.
              Proven track record of delivering high-quality solutions that drive business growth and improve operational efficiency.
              Skilled in leading cross-functional teams and implementing innovative strategies to achieve organizational goals.
            </p>
          </div>

          {/* EDITABLE: Experience Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 pb-2 uppercase" style={{ borderBottom: `2px solid ${accentColor}` }}>
              Experience
            </h3>

            {/* Job Entry 1 */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-base font-bold" contentEditable suppressContentEditableWarning>
                  Senior Software Engineer
                </h4>
                <span className="text-sm text-gray-600" contentEditable suppressContentEditableWarning>
                  Jan 2021 - Present
                </span>
              </div>
              <p className="text-sm font-semibold mb-2" style={{ color: accentColor }} contentEditable suppressContentEditableWarning>
                Tech Company Inc. | San Francisco, CA
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li contentEditable suppressContentEditableWarning>
                  Led development of cloud-based solutions serving 100,000+ users, improving system performance by 40%
                </li>
                <li contentEditable suppressContentEditableWarning>
                  Mentored team of 5 junior developers, implementing best practices and code review processes
                </li>
                <li contentEditable suppressContentEditableWarning>
                  Collaborated with product managers to design and implement new features based on user feedback
                </li>
              </ul>
            </div>

            {/* Job Entry 2 */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-base font-bold" contentEditable suppressContentEditableWarning>
                  Software Engineer
                </h4>
                <span className="text-sm text-gray-600" contentEditable suppressContentEditableWarning>
                  Jun 2018 - Dec 2020
                </span>
              </div>
              <p className="text-sm font-semibold mb-2" style={{ color: accentColor }} contentEditable suppressContentEditableWarning>
                Startup Solutions LLC | New York, NY
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li contentEditable suppressContentEditableWarning>
                  Developed and maintained web applications using React, Node.js, and MongoDB
                </li>
                <li contentEditable suppressContentEditableWarning>
                  Reduced page load times by 60% through optimization and caching strategies
                </li>
                <li contentEditable suppressContentEditableWarning>
                  Participated in agile development processes including sprint planning and retrospectives
                </li>
              </ul>
            </div>
          </div>

          {/* EDITABLE: Education Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 pb-2 uppercase" style={{ borderBottom: `2px solid ${accentColor}` }}>
              Education
            </h3>

            {/* Education Entry 1 */}
            <div className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-base font-bold" contentEditable suppressContentEditableWarning>
                  Bachelor of Science in Computer Science
                </h4>
                <span className="text-sm text-gray-600" contentEditable suppressContentEditableWarning>
                  2014 - 2018
                </span>
              </div>
              <p className="text-sm" style={{ color: accentColor }} contentEditable suppressContentEditableWarning>
                University Name | City, State
              </p>
              <p className="text-sm text-gray-700 mt-1" contentEditable suppressContentEditableWarning>
                GPA: 3.8/4.0 | Dean's List | Relevant Coursework: Data Structures, Algorithms, Database Systems
              </p>
            </div>
          </div>

          {/* EDITABLE: Projects Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 pb-2 uppercase" style={{ borderBottom: `2px solid ${accentColor}` }}>
              Projects
            </h3>

            {/* Project Entry 1 */}
            <div className="mb-4">
              <h4 className="text-base font-bold mb-1" contentEditable suppressContentEditableWarning>
                E-Commerce Platform
              </h4>
              <p className="text-sm text-gray-700" contentEditable suppressContentEditableWarning>
                Built a full-stack e-commerce application with React, Express, and PostgreSQL.
                Implemented secure payment processing, user authentication, and real-time inventory management.
              </p>
            </div>

            {/* Project Entry 2 */}
            <div>
              <h4 className="text-base font-bold mb-1" contentEditable suppressContentEditableWarning>
                Task Management App
              </h4>
              <p className="text-sm text-gray-700" contentEditable suppressContentEditableWarning>
                Created a collaborative task management tool with drag-and-drop functionality,
                real-time updates using WebSockets, and integration with third-party calendar APIs.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ModernProfessionalTemplate;

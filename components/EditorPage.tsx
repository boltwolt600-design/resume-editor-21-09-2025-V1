import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ResumeData, SidebarTab, ResumeSection, Aisuggestions } from '../types';
import { DEFAULT_RESUME_DATA, ALL_SECTIONS, SECTION_PLACEHOLDERS } from '../constants';
import * as Icons from './icons';
import { getAtsSuggestions, enhanceText, getGapJustification } from '../services/geminiService';

const templates = [
  { name: 'Professional Classic', color: 'bg-blue-500' },
  { name: 'Tech Modern', color: 'bg-indigo-500' },
  { name: 'Professional Photo', color: 'bg-sky-500' },
  { name: 'Executive Classic', color: 'bg-slate-500' },
  { name: 'Creative Modern', color: 'bg-rose-500' },
  { name: 'Creative Photo', color: 'bg-purple-500' },
];

const accentColors = ['#000000', '#4A90E2', '#50E3C2', '#F5A623', '#D0021B', '#9013FE'];


// Sub-components defined outside the main component to prevent re-creation on re-renders
const Sidebar: React.FC<{
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  aiSuggestions: Aisuggestions;
  handleAiAction: (action: 'ats' | 'enhance' | 'gap') => void;
  isAiLoading: boolean;
}> = ({ activeTab, setActiveTab, resumeData, setResumeData, aiSuggestions, handleAiAction, isAiLoading }) => {
  const tabs: SidebarTab[] = ['Design', 'Formatting', 'Sections', 'AI Copilot'];
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addSection = (sectionTitle: string) => {
    if (!resumeData.sections.find(s => s.title.toLowerCase() === sectionTitle.toLowerCase())) {
        const upperCaseTitle = sectionTitle.toUpperCase();
        const newSection: ResumeSection = {
            id: sectionTitle.toLowerCase().replace(/\s+/g, '-'),
            title: upperCaseTitle,
            content: SECTION_PLACEHOLDERS[upperCaseTitle] || `[Add your ${sectionTitle.toLowerCase()} here]`
        };
        setResumeData(prev => ({...prev, sections: [...prev.sections, newSection]}));
    }
  };

  const removeSection = (sectionId: string) => {
    setResumeData(prev => ({...prev, sections: prev.sections.filter(s => s.id !== sectionId)}));
  };

  const duplicateSection = (sectionId: string) => {
    const sectionToDuplicate = resumeData.sections.find(s => s.id === sectionId);
    if (!sectionToDuplicate) return;

    const newSection: ResumeSection = {
        ...sectionToDuplicate,
        id: `${sectionToDuplicate.id}-${Date.now()}`,
        title: `${sectionToDuplicate.title} (Copy)`
    };

    const originalIndex = resumeData.sections.findIndex(s => s.id === sectionId);
    const newSections = [...resumeData.sections];
    newSections.splice(originalIndex + 1, 0, newSection);

    setResumeData(prev => ({ ...prev, sections: newSections }));
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === dropIndex) {
          setDraggedIndex(null);
          return;
      }

      const newSections = [...resumeData.sections];
      const [draggedItem] = newSections.splice(draggedIndex, 1);
      newSections.splice(dropIndex, 0, draggedItem);
      
      setResumeData(prev => ({...prev, sections: newSections}));
      setDraggedIndex(null);
  };

  const handleDragEnd = () => {
      setDraggedIndex(null);
  };


  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="flex border-b border-slate-200">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-2 text-sm font-semibold transition-colors ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'Design' && (
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Templates</h3>
            <div className="grid grid-cols-2 gap-4">
              {templates.map(template => (
                <div key={template.name} className="cursor-pointer group">
                  <div className={`aspect-[3/4] ${template.color} rounded-md flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity`}></div>
                  <p className="text-sm text-center mt-2 text-slate-700">{template.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'Formatting' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Text & Paragraph</h3>
              <div className="flex items-center space-x-2 p-1 bg-slate-100 rounded-md">
                  <button className="p-2 rounded hover:bg-slate-200"><Icons.BoldIcon className="w-5 h-5"/></button>
                  <button className="p-2 rounded hover:bg-slate-200"><Icons.ItalicIcon className="w-5 h-5"/></button>
                  <button className="p-2 rounded hover:bg-slate-200"><Icons.UnderlineIcon className="w-5 h-5"/></button>
                  <div className="w-px h-6 bg-slate-300"></div>
                  <button className="p-2 rounded hover:bg-slate-200"><Icons.AlignLeftIcon className="w-5 h-5"/></button>
                  <button className="p-2 rounded hover:bg-slate-200"><Icons.AlignCenterIcon className="w-5 h-5"/></button>
                  <button className="p-2 rounded hover:bg-slate-200"><Icons.AlignRightIcon className="w-5 h-5"/></button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Accent Colors</h3>
              <div className="flex space-x-2">
                {accentColors.map(color => <button key={color} className="w-6 h-6 rounded-full border border-slate-300" style={{ backgroundColor: color }}></button>)}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Line Spacing</h3>
              <input type="range" min="1" max="2" step="0.1" defaultValue="1.4" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Font Formatting</h3>
              <select className="w-full p-2 border border-slate-300 rounded-md text-sm">
                <option>Inter</option>
                <option>Roboto</option>
                <option>Lato</option>
              </select>
              <input type="range" min="10" max="16" step="0.5" defaultValue="11" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-4" />
            </div>
          </div>
        )}
        {activeTab === 'Sections' && (
            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Resume Sections</h3>
                    <div className="space-y-2">
                        {resumeData.sections.map((section, index) => (
                            <div 
                                key={section.id}
                                draggable="true"
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, index)}
                                onDragEnd={handleDragEnd}
                                className={`flex items-center justify-between bg-slate-100 p-2 rounded-md cursor-move transition-opacity ${draggedIndex === index ? 'opacity-50' : 'opacity-100'}`}
                            >
                                <span className="text-sm font-medium text-slate-700">{section.title}</span>
                                <div className="flex items-center space-x-1">
                                    <button onClick={() => duplicateSection(section.id)} className="p-1 text-slate-400 hover:text-blue-500" title="Duplicate section">
                                        <Icons.CopyIcon className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => removeSection(section.id)} className="p-1 text-slate-400 hover:text-red-500" title="Remove section">
                                        <Icons.Trash2Icon className="w-4 h-4"/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                 <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Add Section</h3>
                    <div className="space-y-2">
                        {ALL_SECTIONS.filter(title => !resumeData.sections.some(s => s.title.toLowerCase() === title.toLowerCase())).map(title => (
                           <div key={title} className="flex items-center justify-between bg-white p-2 rounded-md border border-slate-200">
                               <span className="text-sm text-slate-600">{title}</span>
                               <button onClick={() => addSection(title)} className="p-1 text-slate-400 hover:text-blue-500"><Icons.PlusIcon className="w-4 h-4"/></button>
                           </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
         {activeTab === 'AI Copilot' && (
          <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">ATS Score: {aiSuggestions.atsScore}%</h3>
                <div className="text-sm p-3 bg-blue-50 rounded-md border border-blue-200 text-blue-800">
                    {isAiLoading && aiSuggestions.suggestions === '' && <p>Analyzing...</p>}
                    <p className="whitespace-pre-wrap">{aiSuggestions.suggestions || 'AI suggestions will appear here based on your resume content.'}</p>
                </div>
              </div>
              <button onClick={() => handleAiAction('ats')} disabled={isAiLoading} className="w-full text-left p-3 bg-slate-100 rounded-md hover:bg-slate-200 disabled:opacity-50">
                  <h4 className="font-semibold text-slate-800">ATS Optimization</h4>
                  <p className="text-sm text-slate-500">Improve your score against tracking systems.</p>
              </button>
              <button onClick={() => handleAiAction('enhance')} disabled={isAiLoading} className="w-full text-left p-3 bg-slate-100 rounded-md hover:bg-slate-200 disabled:opacity-50">
                  <h4 className="font-semibold text-slate-800">Enhance Selected Text</h4>
                  <p className="text-sm text-slate-500">Rewrite text for more impact. Select text to enable.</p>
              </button>
              <button onClick={() => handleAiAction('gap')} disabled={isAiLoading} className="w-full text-left p-3 bg-slate-100 rounded-md hover:bg-slate-200 disabled:opacity-50">
                  <h4 className="font-semibold text-slate-800">Gap Justification</h4>
                  <p className="text-sm text-slate-500">Get help explaining career gaps.</p>
              </button>
              {aiSuggestions.enhancedText && <div className="text-sm p-3 bg-green-50 rounded-md border border-green-200 text-green-800"><strong>Suggestion:</strong> {aiSuggestions.enhancedText}</div>}
              {aiSuggestions.gapJustification && <div className="text-sm p-3 bg-purple-50 rounded-md border border-purple-200 text-purple-800 whitespace-pre-wrap"><strong>Gap Suggestions:</strong>{'\n'}{aiSuggestions.gapJustification}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

const ResumePreview: React.FC<{
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}> = ({ resumeData, setResumeData }) => {

    const handleContentChange = (
        field: keyof ResumeData | `contact.${keyof ResumeData['contact']}` | `section.${string}`,
        value: string
    ) => {
        setResumeData(prev => {
            if (field.startsWith('section.')) {
                const sectionId = field.split('.')[1];
                return {
                    ...prev,
                    sections: prev.sections.map(s => s.id === sectionId ? {...s, content: value} : s)
                };
            }
            if (field.startsWith('contact.')) {
                const contactField = field.split('.')[1] as keyof ResumeData['contact'];
                return {
                    ...prev,
                    contact: {...prev.contact, [contactField]: value}
                };
            }
            return {...prev, [field as keyof ResumeData]: value};
        });
    };

    const EditableField: React.FC<{
      fieldKey: keyof ResumeData | `contact.${keyof ResumeData['contact']}` | `section.${string}`;
      value: string;
      className?: string;
      isTextArea?: boolean;
    }> = ({ fieldKey, value, className, isTextArea = false }) => (
        <div
            contentEditable
            suppressContentEditableWarning
            onBlur={e => handleContentChange(fieldKey, e.currentTarget.innerText)}
            className={`outline-none focus:bg-blue-50 focus:shadow-inner p-1 rounded-sm ${className}`}
            style={{ whiteSpace: isTextArea ? 'pre-wrap' : 'normal' }}
            dangerouslySetInnerHTML={{ __html: value }}
        />
    );


    return (
        <div className="flex-1 p-10 bg-slate-100 overflow-y-auto">
            <div id="resume-paper" className="w-[8.5in] h-[11in] bg-white shadow-lg mx-auto p-12 text-[11pt] font-[Inter,sans-serif] text-slate-800">
                <div className="text-center border-b pb-4 border-slate-300">
                    <EditableField fieldKey="name" value={resumeData.name} className="text-3xl font-bold uppercase tracking-wider" />
                    <EditableField fieldKey="title" value={resumeData.title} className="text-md mt-1" />
                    <div className="flex justify-center items-center space-x-2 text-sm mt-2 text-slate-600">
                         <EditableField fieldKey="contact.email" value={resumeData.contact.email} />
                         <span>|</span>
                         <EditableField fieldKey="contact.phone" value={resumeData.contact.phone} />
                         <span>|</span>
                         <EditableField fieldKey="contact.linkedin" value={resumeData.contact.linkedin} />
                    </div>
                </div>
                <div className="mt-6 space-y-5">
                    {resumeData.sections.map(section => (
                        <div key={section.id}>
                            <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-slate-700 pb-1 mb-2">{section.title}</h2>
                            <EditableField fieldKey={`section.${section.id}`} value={section.content} isTextArea={true} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Main EditorPage Component
const EditorPage: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('Design');
  const [resumeData, setResumeData] = useState<ResumeData>(DEFAULT_RESUME_DATA);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Aisuggestions>({
      atsScore: 0,
      suggestions: '',
      enhancedText: '',
      gapJustification: ''
  });

  const handleAiAction = async (action: 'ats' | 'enhance' | 'gap') => {
      setIsAiLoading(true);
      setAiSuggestions(prev => ({...prev, enhancedText: '', gapJustification: ''}));

      try {
          if (action === 'ats') {
              setAiSuggestions(prev => ({...prev, suggestions: ''}));
              const result = await getAtsSuggestions(resumeData);
              setAiSuggestions(prev => ({...prev, atsScore: result.score, suggestions: result.suggestions}));
          } else if (action === 'enhance') {
              const selection = window.getSelection()?.toString().trim();
              if (selection) {
                  const result = await enhanceText(selection);
                  setAiSuggestions(prev => ({...prev, enhancedText: result}));
              } else {
                  alert("Please select some text in the resume to enhance.");
              }
          } else if (action === 'gap') {
              const result = await getGapJustification();
              setAiSuggestions(prev => ({...prev, gapJustification: result}));
          }
      } catch (error) {
          console.error(`AI action failed: ${action}`, error);
          alert(`An error occurred. Please check the console.`);
      } finally {
          setIsAiLoading(false);
      }
  };


  return (
    <div className="flex h-screen w-screen font-sans bg-slate-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        resumeData={resumeData} 
        setResumeData={setResumeData}
        aiSuggestions={aiSuggestions}
        handleAiAction={handleAiAction}
        isAiLoading={isAiLoading}
      />
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between p-3 bg-white border-b border-slate-200">
          <div>
            <span className="font-semibold text-slate-700">New Resume</span>
            <span className="ml-4 text-sm bg-blue-100 text-blue-700 font-medium px-2 py-1 rounded-md">ATS: {aiSuggestions.atsScore}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={onBackToHome} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">Home</button>
            <button className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">Undo</button>
            <button className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors">Save</button>
            <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">Export</button>
          </div>
        </header>
        <ResumePreview resumeData={resumeData} setResumeData={setResumeData} />
      </div>
    </div>
  );
};

export default EditorPage;
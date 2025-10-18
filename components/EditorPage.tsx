
import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
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

const accentColors = ['#4285F4', '#EA4335', '#34A853', '#FBBC05', '#8B5CF6', '#718096', '#000000', '#FFFFFF'];

// Custom hook for managing state history
const useHistory = <T,>(initialState: T) => {
    const [history, setHistory] = useState<T[]>([initialState]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const setState = useCallback((action: T | ((prevState: T) => T)) => {
        const newState = action instanceof Function ? action(history[currentIndex]) : action;

        if (JSON.stringify(newState) === JSON.stringify(history[currentIndex])) {
            return; // No change, don't add to history
        }

        const newHistory = history.slice(0, currentIndex + 1);
        newHistory.push(newState);

        setHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);
    }, [history, currentIndex]);

    const undo = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    }, [currentIndex]);

    const canUndo = currentIndex > 0;

    return {
        state: history[currentIndex],
        setState,
        undo,
        canUndo,
    };
};

interface FormattingOptions {
    accentColor: string;
    textAlign: 'left' | 'center' | 'right';
    lineSpacing: number;
    sideMargins: number;
    fontStyle: string;
    fontSize: number;
}


// Sub-components defined outside the main component to prevent re-creation on re-renders
const Sidebar: React.FC<{
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  resumeData: ResumeData;
  setResumeData: (action: ResumeData | ((prevState: ResumeData) => ResumeData)) => void;
  aiSuggestions: Aisuggestions;
  handleAiAction: (action: 'ats' | 'enhance' | 'gap') => void;
  isAiLoading: boolean;
  formatting: FormattingOptions;
  onFormattingChange: (key: keyof FormattingOptions, value: any) => void;
  onApplyFormat: (command: string) => void;
}> = ({ activeTab, setActiveTab, resumeData, setResumeData, aiSuggestions, handleAiAction, isAiLoading, formatting, onFormattingChange, onApplyFormat }) => {
  const tabs: SidebarTab[] = ['Design', 'Formatting', 'Sections', 'AI Copilot'];
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addSection = (sectionTitle: string) => {
    if (!resumeData.sections.find(s => s.title.toLowerCase() === sectionTitle.toLowerCase())) {
        const upperCaseTitle = sectionTitle.toUpperCase();
        const newSection: ResumeSection = {
            id: sectionTitle.toLowerCase().replace(/\s+/g, '-'),
            title: upperCaseTitle,
            content: SECTION_PLACEHOLDERS[upperCaseTitle] || `<p>[Add your ${sectionTitle.toLowerCase()} here]</p>`
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
    <div className="w-96 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="grid grid-cols-2 border-b border-slate-200">
        <button onClick={() => setActiveTab('Design')} className={`py-3 px-2 text-sm font-semibold transition-colors ${activeTab === 'Design' ? 'text-blue-600 bg-slate-50' : 'text-slate-500 hover:bg-slate-100'}`}>Design</button>
        <button onClick={() => setActiveTab('Formatting')} className={`py-3 px-2 text-sm font-semibold transition-colors ${activeTab === 'Formatting' ? 'text-blue-600 bg-slate-50' : 'text-slate-500 hover:bg-slate-100'}`}>Formatting</button>
        <button onClick={() => setActiveTab('Sections')} className={`py-3 px-2 text-sm font-semibold transition-colors ${activeTab === 'Sections' ? 'text-blue-600 bg-slate-50' : 'text-slate-500 hover:bg-slate-100'}`}>Sections</button>
        <button onClick={() => setActiveTab('AI Copilot')} className={`py-3 px-2 text-sm font-semibold transition-colors ${activeTab === 'AI Copilot' ? 'text-blue-600 bg-slate-50' : 'text-slate-500 hover:bg-slate-100'}`}>AI Copilot</button>
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
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Text & Paragraph</h3>
              <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-lg justify-around">
                  <button onClick={() => onApplyFormat('bold')} className="p-2 rounded-md hover:bg-slate-200 text-slate-600"><Icons.BoldIcon className="w-5 h-5"/></button>
                  <button onClick={() => onApplyFormat('italic')} className="p-2 rounded-md hover:bg-slate-200 text-slate-600"><Icons.ItalicIcon className="w-5 h-5"/></button>
                  <button onClick={() => onApplyFormat('underline')} className="p-2 rounded-md hover:bg-slate-200 text-slate-600"><Icons.UnderlineIcon className="w-5 h-5"/></button>
                  <div className="w-px h-6 bg-slate-300"></div>
                  <button onClick={() => onApplyFormat('insertUnorderedList')} className="p-2 rounded-md hover:bg-slate-200 text-slate-600"><Icons.ListIcon className="w-5 h-5"/></button>
                  <button onClick={() => onApplyFormat('insertOrderedList')} className="p-2 rounded-md hover:bg-slate-200 text-slate-600"><Icons.ListOrderedIcon className="w-5 h-5"/></button>
                  <div className="w-px h-6 bg-slate-300"></div>
                  <button onClick={() => onApplyFormat('outdent')} className="p-2 rounded-md hover:bg-slate-200 text-slate-600"><Icons.OutdentIcon className="w-5 h-5"/></button>
                  <button onClick={() => onApplyFormat('indent')} className="p-2 rounded-md hover:bg-slate-200 text-slate-600"><Icons.IndentIcon className="w-5 h-5"/></button>
              </div>
            </div>
             <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Accent Colors</h3>
                <div className="flex flex-wrap gap-3">
                    {accentColors.map(color => (
                        <button key={color} onClick={() => onFormattingChange('accentColor', color)} className={`w-7 h-7 rounded-full transition-transform transform hover:scale-110 ${formatting.accentColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''} ${color === '#FFFFFF' ? 'border border-slate-300' : ''}`} style={{ backgroundColor: color }}></button>
                    ))}
                </div>
            </div>
            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-800">Alignment & Layout</h3>
                <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Text Alignment</label>
                    <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        {(['left', 'center', 'right'] as const).map(align => (
                            <button key={align} onClick={() => onApplyFormat(`justify${align.charAt(0).toUpperCase() + align.slice(1)}`)} className={`flex-1 p-2 rounded-md transition-colors text-slate-600 hover:bg-slate-200`}>
                                {align === 'left' && <Icons.AlignLeftIcon className="w-5 h-5 mx-auto"/>}
                                {align === 'center' && <Icons.AlignCenterIcon className="w-5 h-5 mx-auto"/>}
                                {align === 'right' && <Icons.AlignRightIcon className="w-5 h-5 mx-auto"/>}
                            </button>
                        ))}
                    </div>
                </div>
                 <div>
                    <label htmlFor="line-spacing" className="text-sm font-medium text-slate-700 mb-2 block">Line Spacing: {formatting.lineSpacing}</label>
                    <input id="line-spacing" type="range" min="1" max="2" step="0.1" value={formatting.lineSpacing} onChange={e => onFormattingChange('lineSpacing', parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                </div>
                 <div>
                    <label htmlFor="side-margins" className="text-sm font-medium text-slate-700 mb-2 block">Side Margins</label>
                    <div className="flex items-center space-x-3">
                        <input id="side-margins" type="range" min="10" max="30" step="1" value={formatting.sideMargins} onChange={e => onFormattingChange('sideMargins', parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                        <div className="p-2 border border-slate-300 rounded-md text-sm w-20 text-center bg-white">{formatting.sideMargins}mm</div>
                    </div>
                </div>
            </div>
             <div className="space-y-5">
                <h3 className="text-lg font-semibold text-slate-800">Font Formatting</h3>
                 <div>
                    <label htmlFor="font-style" className="text-sm font-medium text-slate-700 mb-2 block">Font Style</label>
                    <select id="font-style" value={formatting.fontStyle} onChange={e => onFormattingChange('fontStyle', e.target.value)} className="w-full p-2 border border-slate-300 rounded-md text-sm bg-white text-slate-900">
                        <option>Inter</option>
                        <option>Roboto</option>
                        <option>Lato</option>
                        <option>Merriweather</option>
                        <option>Source Sans Pro</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="font-size" className="text-sm font-medium text-slate-700 mb-2 block">Font Size: {formatting.fontSize}pt</label>
                    <input id="font-size" type="range" min="9" max="14" step="0.5" value={formatting.fontSize} onChange={e => onFormattingChange('fontSize', parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                </div>
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
                        {ALL_SECTIONS.filter(title => !resumeData.sections.some(s => s.title.toUpperCase() === title.toUpperCase() || s.title.startsWith(title.toUpperCase() + ' (COPY'))).map(title => (
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
  onContentChange: (
    field: keyof ResumeData | `contact.${keyof ResumeData['contact']}` | `section.${string}`,
    value: string
  ) => void;
  formatting: FormattingOptions;
}> = ({ resumeData, onContentChange, formatting }) => {
    const [paginatedSections, setPaginatedSections] = useState<ResumeSection[][]>([resumeData.sections]);

    useEffect(() => {
        const measurementContainer = document.createElement('div');
        measurementContainer.style.position = 'absolute';
        measurementContainer.style.left = '-9999px';
        measurementContainer.style.top = '-9999px';
        measurementContainer.style.width = '8.5in';
        document.body.appendChild(measurementContainer);

        const MeasurementContent: React.FC<{ data: ResumeData, format: FormattingOptions }> = ({ data, format }) => (
            <div style={{
                padding: `3rem ${format.sideMargins}mm`,
                fontSize: `${format.fontSize}pt`,
                fontFamily: `'${format.fontStyle}', sans-serif`,
                lineHeight: format.lineSpacing,
                textAlign: format.textAlign
            }} className="text-slate-800">
                <div className="text-center border-b pb-4 border-slate-300 resume-header-measure">
                    <div className="text-3xl font-bold uppercase tracking-wider" dangerouslySetInnerHTML={{ __html: data.name }} />
                    <div className="text-md mt-1" dangerouslySetInnerHTML={{ __html: data.title }} />
                    <div className="flex justify-center items-center space-x-2 text-sm mt-2 text-slate-600">
                        <span dangerouslySetInnerHTML={{ __html: data.contact.email }} />|
                        <span dangerouslySetInnerHTML={{ __html: data.contact.phone }} />|
                        <span dangerouslySetInnerHTML={{ __html: data.contact.linkedin }} />
                    </div>
                </div>
                <div className="mt-6 space-y-5">
                    {data.sections.map(section => (
                        <div key={section.id} data-section-id={section.id} className="resume-section-measure">
                            <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mb-2" style={{ borderColor: format.accentColor }}>{section.title}</h2>
                            <div dangerouslySetInnerHTML={{ __html: section.content || ' ' }} />
                        </div>
                    ))}
                </div>
            </div>
        );

        const root = ReactDOM.createRoot(measurementContainer);
        root.render(<MeasurementContent data={resumeData} format={formatting} />);

        const timeoutId = setTimeout(() => {
            const headerEl = measurementContainer.querySelector('.resume-header-measure') as HTMLElement;
            const sectionEls = Array.from(measurementContainer.querySelectorAll('.resume-section-measure')) as HTMLElement[];
            
            const maxContentHeight = (11 * 96) - (2 * 3 * 16); // 11in page height @ 96dpi minus 3rem padding top/bottom

            if (!headerEl || sectionEls.length < resumeData.sections.length) {
                 root.unmount();
                 document.body.removeChild(measurementContainer);
                 return;
            }

            const newPages: ResumeSection[][] = [];
            let currentPage: ResumeSection[] = [];
            let currentPageHeight = headerEl.offsetHeight + 24; // Page 1 starts with header height + mt-6 (24px).
            const spaceBetweenSections = 20; // from space-y-5 which is 1.25rem

            resumeData.sections.forEach(section => {
                const sectionEl = sectionEls.find(el => el.dataset.sectionId === section.id);
                if (!sectionEl) return;
                
                const sectionHeight = sectionEl.offsetHeight;
                const heightWithMargin = sectionHeight + (currentPage.length > 0 ? spaceBetweenSections : 0);

                if (currentPageHeight + heightWithMargin > maxContentHeight && currentPage.length > 0) {
                    newPages.push(currentPage);
                    currentPage = [section];
                    currentPageHeight = sectionHeight; // New page starts with just the section height.
                } else {
                    currentPage.push(section);
                    currentPageHeight += heightWithMargin;
                }
            });

            if (currentPage.length > 0) {
                newPages.push(currentPage);
            }
            
            if (JSON.stringify(newPages) !== JSON.stringify(paginatedSections)) {
                 setPaginatedSections(newPages);
            }

            root.unmount();
            document.body.removeChild(measurementContainer);

        }, 100);

        return () => {
            clearTimeout(timeoutId);
            if (document.body.contains(measurementContainer)) {
                root.unmount();
                document.body.removeChild(measurementContainer);
            }
        };

    }, [resumeData, formatting]);

    const EditableField: React.FC<{
      // FIX: The type for fieldKey was too broad ('string'), causing a type error. 
      // It's now correctly typed to match the specific keys expected by onContentChange.
      fieldKey: keyof ResumeData | `contact.${keyof ResumeData['contact']}` | `section.${string}`;
      value: string;
      className?: string;
    }> = ({ fieldKey, value, className }) => (
        <div
            contentEditable
            suppressContentEditableWarning
            data-field-key={fieldKey}
            onInput={e => onContentChange(fieldKey, e.currentTarget.innerHTML)}
            className={`outline-none focus:bg-blue-50 focus:shadow-inner p-1 rounded-sm ${className}`}
            dangerouslySetInnerHTML={{ __html: value }}
        />
    );


    return (
        <div className="flex-1 p-10 bg-slate-100 overflow-y-auto">
             <style>{`
                @import url('https://fonts.googleapis.com/css2?family=${formatting.fontStyle.replace(/ /g, '+')}:wght@400;700&display=swap');
             `}</style>
            {paginatedSections.map((pageSections, pageIndex) => (
                <div 
                    key={pageIndex} 
                    id={`resume-page-${pageIndex}`} 
                    className="w-[8.5in] h-[11in] bg-white shadow-lg mx-auto text-slate-800 mb-8 overflow-hidden"
                    style={{
                        padding: `3rem ${formatting.sideMargins}mm`,
                        fontSize: `${formatting.fontSize}pt`,
                        fontFamily: `'${formatting.fontStyle}', sans-serif`,
                        lineHeight: formatting.lineSpacing,
                        textAlign: formatting.textAlign,
                    }}
                >
                    {pageIndex === 0 && (
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
                    )}
                    <div className={`space-y-5 ${pageIndex === 0 ? 'mt-6' : ''}`}>
                        {pageSections.map(section => (
                            <div key={section.id}>
                                <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mb-2" style={{ borderColor: formatting.accentColor }}>{section.title}</h2>
                                <EditableField fieldKey={`section.${section.id}`} value={section.content} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

// Main EditorPage Component
const EditorPage: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('Formatting');
  const { 
      state: resumeData, 
      setState: setResumeData, 
      undo, 
      canUndo 
  } = useHistory<ResumeData>(DEFAULT_RESUME_DATA);
  
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Aisuggestions>({
      atsScore: 0,
      suggestions: '',
      enhancedText: '',
      gapJustification: ''
  });

  const [formatting, setFormatting] = useState<FormattingOptions>({
    accentColor: '#000000',
    textAlign: 'left',
    lineSpacing: 1.4,
    sideMargins: 20,
    fontStyle: 'Inter',
    fontSize: 11,
  });

  const handleFormattingChange = (key: keyof FormattingOptions, value: any) => {
    setFormatting(prev => ({ ...prev, [key]: value }));
  };
  
  const handleContentChange = useCallback((
    field: string,
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
          if (field === 'name' || field === 'title') {
             return {...prev, [field as keyof ResumeData]: value};
          }
          return prev;
      });
  }, [setResumeData]);

  const handleApplyFormat = (command: string) => {
      document.execCommand(command, false, undefined);
      
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && activeElement.isContentEditable) {
          const fieldKey = activeElement.dataset.fieldKey;
          const newHtml = activeElement.innerHTML;
          if (fieldKey) {
            handleContentChange(fieldKey, newHtml);
          }
      }
  };


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
        formatting={formatting}
        onFormattingChange={handleFormattingChange}
        onApplyFormat={handleApplyFormat}
      />
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between p-3 bg-white border-b border-slate-200">
          <div>
            <span className="font-semibold text-slate-700">New Resume</span>
            <span className="ml-4 text-sm bg-blue-100 text-blue-700 font-medium px-2 py-1 rounded-md">ATS: {aiSuggestions.atsScore}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={onBackToHome} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">Home</button>
            <button 
              onClick={undo} 
              disabled={!canUndo} 
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Undo
            </button>
            <button className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors">Save</button>
            <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">Export</button>
          </div>
        </header>
        <ResumePreview resumeData={resumeData} onContentChange={handleContentChange} formatting={formatting} />
      </div>
    </div>
  );
};

export default EditorPage;

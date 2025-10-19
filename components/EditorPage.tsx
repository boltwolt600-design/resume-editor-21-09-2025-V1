
import React, { useState, useCallback, useEffect, useRef, useLayoutEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import { ResumeData, SidebarTab, ResumeSection, Aisuggestions, TemplateName } from '../types';
import { DEFAULT_RESUME_DATA, ALL_SECTIONS, SECTION_PLACEHOLDERS, PROFESSIONAL_CLASSIC_TEMPLATE, EXECUTIVE_CLASSIC_TEMPLATE, CREATIVE_MODERN_TEMPLATE, CREATIVE_PHOTO_TEMPLATE, PROFESSIONAL_PHOTO_TEMPLATE } from '../constants';
import * as Icons from './icons';
import { getAtsSuggestions, enhanceText, getGapJustification } from '../services/geminiService';

const SimpleClassicPreview = () => (
    <div className="aspect-[3/4] bg-white rounded-md flex flex-col p-2 border border-slate-300">
        <div className="text-center">
            <div className="h-1.5 w-1/2 bg-slate-800 mx-auto rounded-sm"></div>
            <div className="h-1 w-1/3 bg-slate-600 mx-auto mt-1 rounded-sm"></div>
        </div>
        <div className="h-px bg-slate-300 my-2"></div>
        <div className="flex-1 space-y-2">
            <div className="h-1 w-1/4 bg-slate-800 rounded-sm"></div>
            <div className="h-0.5 w-full bg-slate-400 rounded-sm"></div>
            <div className="h-0.5 w-3/4 bg-slate-400 rounded-sm"></div>
             <div className="h-1 w-1/4 bg-slate-800 rounded-sm mt-2"></div>
            <div className="h-0.5 w-full bg-slate-400 rounded-sm"></div>
            <div className="h-0.5 w-full bg-slate-400 rounded-sm"></div>
        </div>
    </div>
);

const ProfessionalClassicPreview = () => (
    <div className="aspect-[3/4] bg-white rounded-md flex flex-col p-2 border border-slate-300">
        <div className="text-center">
            <div className="h-1.5 w-1/2 bg-slate-800 mx-auto rounded-sm"></div>
            <div className="h-1 w-1/3 bg-slate-600 mx-auto mt-1 rounded-sm"></div>
        </div>
        <div className="h-px bg-slate-300 my-2"></div>
        <div className="flex-1 flex gap-2">
            <div className="w-1/3 space-y-2">
                <div className="h-1 w-full bg-slate-800 rounded-sm"></div>
                <div className="h-0.5 w-3/4 bg-slate-400 rounded-sm"></div>
                <div className="h-0.5 w-full bg-slate-400 rounded-sm"></div>
                 <div className="h-1 w-full bg-slate-800 rounded-sm mt-2"></div>
                <div className="h-0.5 w-3/4 bg-slate-400 rounded-sm"></div>
            </div>
            <div className="w-px bg-slate-300"></div>
            <div className="w-2/3 space-y-2">
                 <div className="h-1 w-full bg-slate-800 rounded-sm"></div>
                <div className="h-0.5 w-3/4 bg-slate-400 rounded-sm"></div>
                <div className="h-0.5 w-full bg-slate-400 rounded-sm"></div>
                <div className="h-0.5 w-1/2 bg-slate-400 rounded-sm"></div>
            </div>
        </div>
    </div>
);

const ExecutiveClassicPreview = () => (
    <div className="aspect-[3/4] bg-white rounded-md flex flex-col p-2 border border-slate-300">
        <div className="h-1.5 w-1/2 bg-slate-800 rounded-sm"></div>
        <div className="h-1 w-1/3 bg-slate-600 mt-1 rounded-sm"></div>
        <div className="h-0.5 w-full bg-slate-400 mt-1 rounded-sm"></div>
        <div className="h-px bg-slate-300 my-2"></div>
        <div className="flex-1 space-y-2">
            <div className="h-1 w-1/3 bg-slate-800 rounded-sm"></div>
            <div className="h-0.5 w-full bg-slate-400 rounded-sm"></div>
            <div className="h-0.5 w-3/4 bg-slate-400 rounded-sm"></div>
             <div className="h-1 w-1/3 bg-slate-800 rounded-sm mt-2"></div>
            <div className="h-0.5 w-full bg-slate-400 rounded-sm"></div>
            <div className="h-0.5 w-full bg-slate-400 rounded-sm"></div>
        </div>
    </div>
);

const CreativeModernPreview = () => (
    <div className="aspect-[3/4] bg-white rounded-md flex flex-col p-0 border border-slate-300 overflow-hidden">
        <div className="w-full h-1/4 bg-[#1a2e2a] p-1 flex justify-end">
            <div className="w-1/2 h-full bg-[#e9e3d9] rounded-sm"></div>
        </div>
        <div className="w-full h-1/3 bg-[#d45d3e] p-1 flex">
            <div className="w-1/2 h-full bg-[#f3f0ec] rounded-sm"></div>
        </div>
        <div className="w-full flex-1 bg-[#1a2e2a] p-1 flex justify-end">
            <div className="w-1/2 h-full bg-[#f3f0ec] rounded-sm"></div>
        </div>
    </div>
);

const CreativePhotoPreview = () => (
    <div className="aspect-[3/4] bg-white rounded-md flex p-2 border border-slate-300 gap-2">
        <div className="w-2/3 space-y-2">
            <div className="h-2 w-1/2 bg-[#3d85c6] rounded-sm"></div>
            <div className="h-1.5 w-2/3 bg-slate-800 mt-1 rounded-sm"></div>
            <div className="h-px bg-slate-300 my-2"></div>
            <div className="h-1 w-1/3 bg-slate-800 rounded-sm"></div>
            <div className="h-0.5 w-full bg-slate-400 rounded-sm"></div>
            <div className="h-0.5 w-3/4 bg-slate-400 rounded-sm"></div>
        </div>
        <div className="w-1/3 space-y-2">
            <div className="w-full aspect-square bg-slate-300 rounded-md"></div>
            <div className="bg-slate-100 p-1 rounded-sm space-y-1">
                <div className="h-0.5 w-full bg-slate-400 rounded-sm"></div>
                <div className="h-0.5 w-3/4 bg-slate-400 rounded-sm"></div>
            </div>
        </div>
    </div>
);

const ProfessionalPhotoPreview = () => (
    <div className="aspect-[3/4] bg-white rounded-md flex p-0 border border-slate-300">
        <div className="w-1/3 bg-slate-800 p-1 space-y-2">
            <div className="w-full aspect-square bg-slate-200"></div>
            <div className="h-1.5 w-3/4 bg-white rounded-sm"></div>
            <div className="h-1 w-1/2 bg-white rounded-sm"></div>
        </div>
        <div className="w-2/3 p-1 space-y-2">
            <div className="h-1 w-1/2 bg-slate-800 rounded-sm"></div>
            <div className="h-0.5 w-full bg-slate-400 rounded-sm"></div>
            <div className="h-0.5 w-3/4 bg-slate-400 rounded-sm"></div>
        </div>
    </div>
);


// FIX: Changed JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
const templates: { id: TemplateName; name: string; component: React.ReactElement; }[] = [
  { id: 'default', name: 'Simple Classic', component: <SimpleClassicPreview /> },
  { id: 'Professional Classic', name: 'Professional Classic', component: <ProfessionalClassicPreview /> },
  { id: 'Executive Classic', name: 'Executive Classic', component: <ExecutiveClassicPreview /> },
  { id: 'Creative Modern', name: 'Creative Modern', component: <CreativeModernPreview /> },
  { id: 'Creative Photo', name: 'Creative Photo', component: <CreativePhotoPreview /> },
  { id: 'Professional Photo', name: 'Professional Photo', component: <ProfessionalPhotoPreview /> },
];


const colorPalette = {
    grayscale: ['#000000', '#434343', '#666666', '#999999', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff'],
    vibrant: ['#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#9900ff', '#ff00ff'],
    light: ['#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#cfe2f3', '#d9d2e9', '#ead1dc',
            '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#9fc5e8', '#b4a7d6', '#d5a6bd'],
    medium: ['#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6fa8dc', '#8e7cc3', '#c27ba0',
             '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3d85c6', '#674ea7', '#a64d79'],
    dark: ['#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#0b5394', '#351c75', '#741b47',
           '#660000', '#783f04', '#7f6000', '#274e13', '#0c343d', '#073763', '#20124d', '#4c1130']
};


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
    
    const replaceState = useCallback((newState: T) => {
         const newHistory = history.slice(0, currentIndex + 1);
        newHistory[currentIndex] = newState;
        setHistory(newHistory);
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
        replaceState,
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
  onFontPropertyChange: (property: 'fontStyle' | 'fontSize', value: string | number) => void;
  onApplyFormat: (command: string, value?: string) => void;
  onFontDropdownMouseDown: (e: React.MouseEvent) => void;
  onTemplateSelect: (templateId: TemplateName) => void;
}> = ({ 
    activeTab, setActiveTab, resumeData, setResumeData, aiSuggestions, handleAiAction, 
    isAiLoading, formatting, onFormattingChange, onFontPropertyChange, onApplyFormat,
    onFontDropdownMouseDown, onTemplateSelect
}) => {
  const tabs: SidebarTab[] = ['Design', 'Formatting', 'Sections', 'AI Copilot'];
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showUnorderedListOptions, setShowUnorderedListOptions] = useState(false);
  const [showOrderedListOptions, setShowOrderedListOptions] = useState(false);
  const [showFontStyleOptions, setShowFontStyleOptions] = useState(false);
  const [showFontSizeOptions, setShowFontSizeOptions] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const listOptionsRef = useRef<HTMLDivElement>(null);
  const fontOptionsRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const iconPickerRef = useRef<HTMLDivElement>(null);
  
  const fontStyles = ["Arial", "Calibri", "Cambria", "Garamond", "Georgia", "Helvetica", "Inter", "Lato", "Merriweather", "Montserrat", "Open Sans", "Roboto", "Source Sans Pro", "Times New Roman", "Trebuchet MS", "Verdana"];
  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 48, 72];

  // FIX: Moved svgMap and related constants out of the handler to fix scope issue.
  const iconStyle = `style="display: inline-block; width: 1em; height: 1em; vertical-align: -0.125em; margin-right: 0.25em;"`;
  const svgMap: { [key: string]: string } = {
      'phone': ReactDOMServer.renderToString(<Icons.PhoneIcon />),
      'mail': ReactDOMServer.renderToString(<Icons.MailIcon />),
      'map-pin': ReactDOMServer.renderToString(<Icons.MapPinIcon />),
      'globe': ReactDOMServer.renderToString(<Icons.GlobeIcon />),
      'linkedin': ReactDOMServer.renderToString(<Icons.LinkedinIcon />),
      'github': ReactDOMServer.renderToString(<Icons.GithubIcon />),
      'at-sign': ReactDOMServer.renderToString(<Icons.AtSignIcon />),
      'award': ReactDOMServer.renderToString(<Icons.AwardIcon />),
      'book-open': ReactDOMServer.renderToString(<Icons.BookOpenIcon />),
      'briefcase': ReactDOMServer.renderToString(<Icons.BriefcaseIcon />),
      'camera': ReactDOMServer.renderToString(<Icons.CameraIcon />),
      'certificate': ReactDOMServer.renderToString(<Icons.CertificateIcon />),
      'clipboard-check': ReactDOMServer.renderToString(<Icons.ClipboardCheckIcon />),
      'clock': ReactDOMServer.renderToString(<Icons.ClockIcon />),
      'cloud': ReactDOMServer.renderToString(<Icons.CloudIcon />),
      'code': ReactDOMServer.renderToString(<Icons.CodeIcon />),
      'coffee': ReactDOMServer.renderToString(<Icons.CoffeeIcon />),
      'compass': ReactDOMServer.renderToString(<Icons.CompassIcon />),
      'database': ReactDOMServer.renderToString(<Icons.DatabaseIcon />),
      'edit-2': ReactDOMServer.renderToString(<Icons.Edit2Icon />),
      'external-link': ReactDOMServer.renderToString(<Icons.ExternalLinkIcon />),
      'feather': ReactDOMServer.renderToString(<Icons.FeatherIcon />),
      'flag': ReactDOMServer.renderToString(<Icons.FlagIcon />),
      'folder': ReactDOMServer.renderToString(<Icons.FolderIcon />),
      'gift': ReactDOMServer.renderToString(<Icons.GiftIcon />),
      'git-branch': ReactDOMServer.renderToString(<Icons.GitBranchIcon />),
      'hard-drive': ReactDOMServer.renderToString(<Icons.HardDriveIcon />),
      'hash': ReactDOMServer.renderToString(<Icons.HashIcon />),
      'headphones': ReactDOMServer.renderToString(<Icons.HeadphonesIcon />),
      'heart': ReactDOMServer.renderToString(<Icons.HeartIcon />),
      'help-circle': ReactDOMServer.renderToString(<Icons.HelpCircleIcon />),
      'home': ReactDOMServer.renderToString(<Icons.HomeIcon />),
      'image': ReactDOMServer.renderToString(<Icons.ImageIcon />),
      'inbox': ReactDOMServer.renderToString(<Icons.InboxIcon />),
      'info': ReactDOMServer.renderToString(<Icons.InfoIcon />),
      'key': ReactDOMServer.renderToString(<Icons.KeyIcon />),
      'languages': ReactDOMServer.renderToString(<Icons.LanguagesIcon />),
      'layers': ReactDOMServer.renderToString(<Icons.LayersIcon />),
      'layout': ReactDOMServer.renderToString(<Icons.LayoutIcon />),
      'lightbulb': ReactDOMServer.renderToString(<Icons.LightbulbIcon />),
      'message-square': ReactDOMServer.renderToString(<Icons.MessageSquareIcon />),
      'mic': ReactDOMServer.renderToString(<Icons.MicIcon />),
      'monitor': ReactDOMServer.renderToString(<Icons.MonitorIcon />),
      'music': ReactDOMServer.renderToString(<Icons.MusicIcon />),
      'package': ReactDOMServer.renderToString(<Icons.PackageIcon />),
      'paperclip': ReactDOMServer.renderToString(<Icons.PaperclipIcon />),
      'pen-tool': ReactDOMServer.renderToString(<Icons.PenToolIcon />),
      'pie-chart': ReactDOMServer.renderToString(<Icons.PieChartIcon />),
      'printer': ReactDOMServer.renderToString(<Icons.PrinterIcon />),
      'puzzle': ReactDOMServer.renderToString(<Icons.PuzzleIcon />),
      'save': ReactDOMServer.renderToString(<Icons.SaveIcon />),
      'search': ReactDOMServer.renderToString(<Icons.SearchIcon />),
      'send': ReactDOMServer.renderToString(<Icons.SendIcon />),
      'server': ReactDOMServer.renderToString(<Icons.ServerIcon />),
      'settings': ReactDOMServer.renderToString(<Icons.SettingsIcon />),
      'star': ReactDOMServer.renderToString(<Icons.StarIcon />),
      'thumbs-up': ReactDOMServer.renderToString(<Icons.ThumbsUpIcon />),
      'tool': ReactDOMServer.renderToString(<Icons.ToolIcon />),
      'trophy': ReactDOMServer.renderToString(<Icons.TrophyIcon />),
      'twitter': ReactDOMServer.renderToString(<Icons.TwitterIcon />),
      'user': ReactDOMServer.renderToString(<Icons.UserIcon />),
      'users': ReactDOMServer.renderToString(<Icons.UsersIcon />),
      'video': ReactDOMServer.renderToString(<Icons.VideoIcon />),
      'volume-2': ReactDOMServer.renderToString(<Icons.Volume2Icon />),
      'wifi': ReactDOMServer.renderToString(<Icons.WifiIcon />),
      'zap': ReactDOMServer.renderToString(<Icons.ZapIcon />),
      'youtube': ReactDOMServer.renderToString(<Icons.YoutubeIcon />),
      'dribbble': ReactDOMServer.renderToString(<Icons.DribbbleIcon />),
      'smile': ReactDOMServer.renderToString(<Icons.SmileIcon />),
  };
  const iconList = Object.keys(svgMap);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (listOptionsRef.current && !listOptionsRef.current.contains(event.target as Node)) {
            setShowUnorderedListOptions(false);
            setShowOrderedListOptions(false);
        }
        if (fontOptionsRef.current && !fontOptionsRef.current.contains(event.target as Node)) {
            setShowFontStyleOptions(false);
            setShowFontSizeOptions(false);
        }
        if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
            setShowColorPicker(false);
        }
        if (iconPickerRef.current && !iconPickerRef.current.contains(event.target as Node)) {
            setShowIconPicker(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUnorderedListClick = () => {
      setShowOrderedListOptions(false);
      setShowUnorderedListOptions(prev => !prev);
  }

  const handleOrderedListClick = () => {
      setShowUnorderedListOptions(false);
      setShowOrderedListOptions(prev => !prev);
  }

  const handleUnorderedListFormat = (style: string) => {
      onApplyFormat('insertUnorderedList', style);
      setShowUnorderedListOptions(false);
  };

  const handleOrderedListFormat = (style: string) => {
      onApplyFormat('insertOrderedList', style);
      setShowOrderedListOptions(false);
  };
  
  const handleColorApply = (command: 'foreColor' | 'backColor', color: string) => {
      onApplyFormat(command, color);
      setShowColorPicker(false);
  };

  const handleIconInsert = (iconName: string) => {
    const svgString = svgMap[iconName];
    if (svgString) {
        onApplyFormat('insertHTML', svgString.replace(/class="[^"]*"/g, `class="w-4 h-4 inline-block align-baseline mr-1"` ) + '&nbsp;');
    }
    setShowIconPicker(false);
  };

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
                <div key={template.id} onClick={() => onTemplateSelect(template.id)} className="cursor-pointer group">
                  {template.component}
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
              <div className="relative flex items-center space-x-1 p-1 bg-slate-100 rounded-lg" ref={listOptionsRef}>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => onApplyFormat('bold')} className="p-2 rounded-md hover:bg-slate-200 text-slate-600"><Icons.BoldIcon className="w-5 h-5"/></button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => onApplyFormat('italic')} className="p-2 rounded-md hover:bg-slate-200 text-slate-600"><Icons.ItalicIcon className="w-5 h-5"/></button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => onApplyFormat('underline')} className="p-2 rounded-md hover:bg-slate-200 text-slate-600"><Icons.UnderlineIcon className="w-5 h-5"/></button>
                  
                  <div ref={colorPickerRef}>
                      <button 
                        onMouseDown={(e) => e.preventDefault()} 
                        onClick={() => setShowColorPicker(prev => !prev)} 
                        className="p-2 rounded-md hover:bg-slate-200 text-slate-600"
                        title="Text Color"
                      >
                          <Icons.TextColorIcon className="w-5 h-5"/>
                      </button>
                      {showColorPicker && (
                          <div className="absolute z-20 top-full mt-2 left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-md shadow-lg p-3 w-[310px]">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <h4 className="text-xs font-semibold text-slate-600 mb-2 text-center">Background color</h4>
                                    <div className="space-y-1">
                                        <div className="grid grid-cols-9 gap-px">
                                          {colorPalette.grayscale.map(c => <button key={c} onMouseDown={(e) => e.preventDefault()} onClick={() => handleColorApply('backColor', c)} className="w-6 h-6 rounded-sm" style={{backgroundColor: c, border: c==='#ffffff' ? '1px solid #ddd' : 'none'}}></button>)}
                                        </div>
                                        <div className="grid grid-cols-8 gap-px">
                                          {colorPalette.vibrant.map(c => <button key={c} onMouseDown={(e) => e.preventDefault()} onClick={() => handleColorApply('backColor', c)} className="w-6 h-6 rounded-sm" style={{backgroundColor: c}}></button>)}
                                        </div>
                                        <div className="grid grid-cols-8 gap-px">
                                          {colorPalette.light.map(c => <button key={c} onMouseDown={(e) => e.preventDefault()} onClick={() => handleColorApply('backColor', c)} className="w-6 h-6 rounded-sm" style={{backgroundColor: c}}></button>)}
                                        </div>
                                        <div className="grid grid-cols-8 gap-px">
                                          {colorPalette.medium.map(c => <button key={c} onMouseDown={(e) => e.preventDefault()} onClick={() => handleColorApply('backColor', c)} className="w-6 h-6 rounded-sm" style={{backgroundColor: c}}></button>)}
                                        </div>
                                        <div className="grid grid-cols-8 gap-px">
                                          {colorPalette.dark.map(c => <button key={c} onMouseDown={(e) => e.preventDefault()} onClick={() => handleColorApply('backColor', c)} className="w-6 h-6 rounded-sm" style={{backgroundColor: c}}></button>)}
                                        </div>
                                    </div>
                                </div>
                                 <div className="flex-1">
                                    <h4 className="text-xs font-semibold text-slate-600 mb-2 text-center">Text color</h4>
                                     <div className="space-y-1">
                                        <div className="grid grid-cols-9 gap-px">
                                          {colorPalette.grayscale.map(c => <button key={c} onMouseDown={(e) => e.preventDefault()} onClick={() => handleColorApply('foreColor', c)} className="w-6 h-6 rounded-sm" style={{backgroundColor: c, border: c==='#ffffff' ? '1px solid #ddd' : 'none'}}></button>)}
                                        </div>
                                        <div className="grid grid-cols-8 gap-px">
                                          {colorPalette.vibrant.map(c => <button key={c} onMouseDown={(e) => e.preventDefault()} onClick={() => handleColorApply('foreColor', c)} className="w-6 h-6 rounded-sm" style={{backgroundColor: c}}></button>)}
                                        </div>
                                        <div className="grid grid-cols-8 gap-px">
                                          {colorPalette.light.map(c => <button key={c} onMouseDown={(e) => e.preventDefault()} onClick={() => handleColorApply('foreColor', c)} className="w-6 h-6 rounded-sm" style={{backgroundColor: c}}></button>)}
                                        </div>
                                        <div className="grid grid-cols-8 gap-px">
                                          {colorPalette.medium.map(c => <button key={c} onMouseDown={(e) => e.preventDefault()} onClick={() => handleColorApply('foreColor', c)} className="w-6 h-6 rounded-sm" style={{backgroundColor: c}}></button>)}
                                        </div>
                                        <div className="grid grid-cols-8 gap-px">
                                          {colorPalette.dark.map(c => <button key={c} onMouseDown={(e) => e.preventDefault()} onClick={() => handleColorApply('foreColor', c)} className="w-6 h-6 rounded-sm" style={{backgroundColor: c}}></button>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                          </div>
                      )}
                  </div>
                  
                  <div className="w-px h-6 bg-slate-300"></div>
                  
                  <div className="relative">
                        <button 
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={handleUnorderedListClick}
                            className="p-2 rounded-md hover:bg-slate-200 text-slate-600"
                            title="Bulleted List"
                        >
                            <Icons.ListIcon className="w-5 h-5"/>
                        </button>
                        {showUnorderedListOptions && (
                            <div className="absolute z-10 top-full mt-1 left-0 w-36 bg-white border border-slate-200 rounded-md shadow-lg py-1">
                                <button onClick={() => handleUnorderedListFormat('disc')} className="flex items-center w-full px-3 py-1 text-sm text-left text-slate-700 hover:bg-slate-100">
                                    <span className="mr-3 text-lg">&bull;</span> Disc
                                </button>
                                <button onClick={() => handleUnorderedListFormat('circle')} className="flex items-center w-full px-3 py-1 text-sm text-left text-slate-700 hover:bg-slate-100">
                                    <span className="mr-3 text-lg">&#9702;</span> Circle
                                </button>
                                <button onClick={() => handleUnorderedListFormat('square')} className="flex items-center w-full px-3 py-1 text-sm text-left text-slate-700 hover:bg-slate-100">
                                    <span className="mr-3 text-lg">&#9642;</span> Square
                                </button>
                                <div className="h-px bg-slate-200 my-1"></div>
                                <button onClick={() => handleUnorderedListFormat('"→"')} className="flex items-center w-full px-3 py-1 text-sm text-left text-slate-700 hover:bg-slate-100">
                                    <span className="mr-3 text-md">→</span> Arrow
                                </button>
                                <button onClick={() => handleUnorderedListFormat('"–"')} className="flex items-center w-full px-3 py-1 text-sm text-left text-slate-700 hover:bg-slate-100">
                                    <span className="mr-3 text-md">–</span> Dash
                                </button>
                                <button onClick={() => handleUnorderedListFormat('"✓"')} className="flex items-center w-full px-3 py-1 text-sm text-left text-slate-700 hover:bg-slate-100">
                                    <span className="mr-3 text-md">✓</span> Checkmark
                                </button>
                                <div className="h-px bg-slate-200 my-1"></div>
                                <button onClick={() => handleUnorderedListFormat('none')} className="flex items-center w-full px-3 py-1 text-sm text-left text-slate-700 hover:bg-slate-100">
                                    <span className="mr-3 text-md">&nbsp;</span> None
                                </button>
                            </div>
                        )}
                    </div>

                  <div className="relative">
                      <button 
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={handleOrderedListClick}
                          className="p-2 rounded-md hover:bg-slate-200 text-slate-600"
                          title="Numbered List"
                      >
                          <Icons.ListOrderedIcon className="w-5 h-5"/>
                      </button>
                      {showOrderedListOptions && (
                          <div className="absolute z-10 top-full mt-1 left-0 w-48 bg-white border border-slate-200 rounded-md shadow-lg py-1">
                              <button onClick={() => handleOrderedListFormat('decimal')} className="flex items-center w-full px-3 py-1 text-sm text-left text-slate-700 hover:bg-slate-100">
                                  <span className="mr-3">1.</span> Decimal
                              </button>
                              <button onClick={() => handleOrderedListFormat('decimal-leading-zero')} className="flex items-center w-full px-3 py-1 text-sm text-left text-slate-700 hover:bg-slate-100">
                                  <span className="mr-3">01.</span> Decimal w/ Zero
                              </button>
                              <button onClick={() => handleOrderedListFormat('lower-alpha')} className="flex items-center w-full px-3 py-1 text-sm text-left text-slate-700 hover:bg-slate-100">
                                  <span className="mr-3">a.</span> Lower Alpha
                              </button>
                              <button onClick={() => handleOrderedListFormat('upper-alpha')} className="flex items-center w-full px-3 py-1 text-sm text-left text-slate-700 hover:bg-slate-100">
                                  <span className="mr-3">A.</span> Upper Alpha
                              </button>
                              <button onClick={() => handleOrderedListFormat('lower-roman')} className="flex items-center w-full px-3 py-1 text-sm text-left text-slate-700 hover:bg-slate-100">
                                  <span className="mr-3">i.</span> Lower Roman
                              </button>
                              <button onClick={() => handleOrderedListFormat('upper-roman')} className="flex items-center w-full px-3 py-1 text-sm text-left text-slate-700 hover:bg-slate-100">
                                  <span className="mr-3">I.</span> Upper Roman
                              </button>
                               <button onClick={() => handleOrderedListFormat('lower-greek')} className="flex items-center w-full px-3 py-1 text-sm text-left text-slate-700 hover:bg-slate-100">
                                  <span className="mr-3">α.</span> Lower Greek
                              </button>
                               <button onClick={() => handleOrderedListFormat('upper-greek')} className="flex items-center w-full px-3 py-1 text-sm text-left text-slate-700 hover:bg-slate-100">
                                  <span className="mr-3">Α.</span> Upper Greek
                              </button>
                              <div className="h-px bg-slate-200 my-1"></div>
                              <button onClick={() => handleOrderedListFormat('none')} className="flex items-center w-full px-3 py-1 text-sm text-left text-slate-700 hover:bg-slate-100">
                                  <span className="mr-3">&nbsp;</span> None
                              </button>
                          </div>
                      )}
                  </div>

                  <div className="w-px h-6 bg-slate-300"></div>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => onApplyFormat('outdent')} className="p-2 rounded-md hover:bg-slate-200 text-slate-600"><Icons.OutdentIcon className="w-5 h-5"/></button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => onApplyFormat('indent')} className="p-2 rounded-md hover:bg-slate-200 text-slate-600"><Icons.IndentIcon className="w-5 h-5"/></button>
              </div>
            </div>
            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-800">Alignment & Layout</h3>
                <div onMouseDown={(e) => e.preventDefault()}>
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
                        <div className="p-2 border border-slate-300 rounded-md text-sm w-20 text-center bg-white text-slate-900">{formatting.sideMargins}mm</div>
                    </div>
                </div>
            </div>
             <div className="space-y-5">
                <h3 className="text-lg font-semibold text-slate-800">Font Formatting</h3>
                 <div className="flex space-x-2" ref={fontOptionsRef}>
                    {/* Font Style Dropdown */}
                    <div className="w-2/3 relative">
                         <label htmlFor="font-style-button" className="sr-only">Font Style</label>
                         <button
                            id="font-style-button"
                            onMouseDown={onFontDropdownMouseDown}
                            onClick={() => {
                                setShowFontSizeOptions(false);
                                setShowFontStyleOptions(prev => !prev);
                            }}
                            className="w-full p-2 border border-slate-300 rounded-md text-sm bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none flex justify-between items-center text-left"
                         >
                            <span style={{fontFamily: formatting.fontStyle}}>{formatting.fontStyle}</span>
                            <Icons.ChevronDownIcon className="w-4 h-4 text-slate-500" />
                         </button>
                         {showFontStyleOptions && (
                            <div className="absolute z-10 top-full mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {fontStyles.map(font => (
                                    <button
                                        key={font}
                                        onMouseDown={onFontDropdownMouseDown}
                                        onClick={() => {
                                            onFontPropertyChange('fontStyle', font);
                                            setShowFontStyleOptions(false);
                                        }}
                                        className="w-full text-left px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                                        style={{fontFamily: font}}
                                    >
                                        {font}
                                    </button>
                                ))}
                            </div>
                         )}
                    </div>
                    {/* Font Size Dropdown */}
                    <div className="w-1/3 relative">
                         <label htmlFor="font-size-button" className="sr-only">Font Size</label>
                         <button
                            id="font-size-button"
                            onMouseDown={onFontDropdownMouseDown}
                            onClick={() => {
                                setShowFontStyleOptions(false);
                                setShowFontSizeOptions(prev => !prev);
                            }}
                            className="w-full p-2 border border-slate-300 rounded-md text-sm bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none flex justify-between items-center text-left"
                        >
                            <span>{formatting.fontSize}</span>
                            <Icons.ChevronDownIcon className="w-4 h-4 text-slate-500" />
                        </button>
                         {showFontSizeOptions && (
                            <div className="absolute z-10 top-full mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {fontSizes.map(size => (
                                    <button
                                        key={size}
                                        onMouseDown={onFontDropdownMouseDown}
                                        onClick={() => {
                                            onFontPropertyChange('fontSize', size);
                                            setShowFontSizeOptions(false);
                                        }}
                                        className="w-full text-left px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                         )}
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">Extra CV Tools</h3>
                <div className="relative flex items-center justify-around p-1 bg-slate-100 rounded-lg" ref={iconPickerRef}>
                    <button onClick={() => onApplyFormat('createLink')} className="flex flex-col items-center p-2 rounded-md hover:bg-slate-200 text-slate-600 space-y-1 w-1/4">
                        <Icons.LinkIcon className="w-6 h-6"/>
                        <span className="text-xs font-medium">Link</span>
                    </button>
                    <div className="w-1/4">
                        <button onClick={() => setShowIconPicker(p => !p)} className="flex flex-col items-center p-2 rounded-md hover:bg-slate-200 text-slate-600 space-y-1 w-full">
                            <Icons.SmileIcon className="w-6 h-6"/>
                            <span className="text-xs font-medium">Icons</span>
                        </button>
                    </div>
                    <button onClick={() => onApplyFormat('insertHorizontalRule')} className="flex flex-col items-center p-2 rounded-md hover:bg-slate-200 text-slate-600 space-y-1 w-1/4">
                        <Icons.MinusIcon className="w-6 h-6"/>
                        <span className="text-xs font-medium">Divider</span>
                    </button>
                    <button onClick={() => onApplyFormat('removeFormat')} className="flex flex-col items-center p-2 rounded-md hover:bg-slate-200 text-slate-600 space-y-1 w-1/4" title="Clear Formatting">
                        <Icons.EraserIcon className="w-6 h-6"/>
                        <span className="text-xs font-medium">Clear</span>
                    </button>
                    {showIconPicker && (
                         <div className="absolute z-10 top-full mt-2 left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-md shadow-lg p-3 w-[280px]">
                            <h4 className="text-xs font-semibold text-slate-500 mb-2 px-1 col-span-full">Select an Icon</h4>
                            <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                                {iconList.map(iconName => {
                                    // FIX: Corrected key mapping for icons
                                    const iconKey = Object.keys(Icons).find(key => key.toLowerCase().replace('icon', '') === iconName.replace(/-/g, '')) as keyof typeof Icons;
                                    const IconComponent = Icons[iconKey];
                                    return (
                                    <button 
                                        key={iconName}
                                        onClick={() => handleIconInsert(iconName)} 
                                        className="p-2 rounded hover:bg-slate-100 text-slate-600"
                                        title={iconName.replace('-', ' ')}
                                    >
                                        {IconComponent && <IconComponent className="w-5 h-5"/>}
                                    </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}
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
                                <span className="text-sm font-medium text-slate-700" dangerouslySetInnerHTML={{__html: section.title}}></span>
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

const EditableField: React.FC<{
  fieldKey: keyof ResumeData | `contact.${keyof ResumeData['contact']}` | `section.${string}` | `section.title.${string}`;
  value: string;
  onContentChange: (fieldKey: string, value: string) => void;
  className?: string;
  style?: React.CSSProperties;
  tag?: React.ElementType;
}> = ({ fieldKey, value, onContentChange, className, style, tag: Tag = 'div' }) => {
    const elementRef = useRef<HTMLElement>(null!);

    useLayoutEffect(() => {
        if (elementRef.current && elementRef.current.innerHTML !== value) {
            elementRef.current.innerHTML = value;
        }
    }, [value]);

    return (
        <Tag
            ref={elementRef}
            contentEditable
            suppressContentEditableWarning={true}
            data-field-key={fieldKey}
            onInput={e => onContentChange(fieldKey, (e.currentTarget as HTMLElement).innerHTML)}
            className={`outline-none focus:bg-blue-50 focus:shadow-inner p-1 rounded-sm ${className || ''}`}
            style={style}
        />
    );
};


const ResumePreview: React.FC<{
  templateId: TemplateName;
  resumeData: ResumeData;
  onContentChange: (
    field: keyof ResumeData | `contact.${keyof ResumeData['contact']}` | `section.${string}` | `section.title.${string}`,
    value: string
  ) => void;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formatting: FormattingOptions;
}> = ({ templateId, resumeData, onContentChange, onPhotoUpload, formatting }) => {
    const photoInputRef = useRef<HTMLInputElement>(null);

    const getSection = useCallback((title: string) => resumeData.sections.find(s => s.title.toUpperCase() === title.toUpperCase()), [resumeData.sections]);

    const renderDefaultTemplate = () => (
        <div 
          id={`resume-page-0`} 
          className="w-[8.5in] h-[11in] bg-white shadow-lg mx-auto text-slate-800 mb-8 overflow-hidden"
          style={{
              padding: `3rem ${formatting.sideMargins}mm`,
              fontSize: `${formatting.fontSize}pt`,
              fontFamily: `'${formatting.fontStyle}', sans-serif`,
              lineHeight: formatting.lineSpacing,
              textAlign: formatting.textAlign,
          }}
        >
            <div className="text-center border-b pb-4 border-slate-300">
                <EditableField onContentChange={onContentChange} fieldKey="name" value={resumeData.name} className="text-3xl font-bold uppercase tracking-wider" />
                <EditableField onContentChange={onContentChange} fieldKey="title" value={resumeData.title} className="text-md mt-1" />
                <div className="flex justify-center items-center space-x-2 text-sm mt-2 text-slate-600">
                    <EditableField onContentChange={onContentChange} tag="span" fieldKey="contact.email" value={resumeData.contact.email} />
                    <span>|</span>
                    <EditableField onContentChange={onContentChange} tag="span" fieldKey="contact.phone" value={resumeData.contact.phone} />
                    <span>|</span>
                    <EditableField onContentChange={onContentChange} tag="span" fieldKey="contact.linkedin" value={resumeData.contact.linkedin} />
                </div>
            </div>
          <div className={`space-y-5 mt-6`}>
              {resumeData.sections.map(section => (
                  <div key={section.id}>
                      <EditableField 
                          onContentChange={onContentChange}
                          tag="h2" 
                          fieldKey={`section.title.${section.id}`} 
                          value={section.title} 
                          className="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mb-2" 
                          style={{ borderColor: formatting.accentColor }} 
                      />
                      <EditableField onContentChange={onContentChange} fieldKey={`section.${section.id}`} value={section.content} />
                  </div>
              ))}
          </div>
        </div>
    );

    const renderExecutiveClassicTemplate = () => (
      <div 
        id="resume-page-0"
        className="w-[8.5in] h-[11in] bg-white shadow-lg mx-auto text-slate-800 mb-8 overflow-hidden"
        style={{
            padding: `2rem ${formatting.sideMargins}mm`,
            fontSize: `${formatting.fontSize}pt`,
            fontFamily: `'${formatting.fontStyle}', sans-serif`,
            lineHeight: formatting.lineSpacing,
        }}
      >
        <header className="mb-6">
          <EditableField onContentChange={onContentChange} fieldKey="name" value={resumeData.name} className="text-4xl font-bold" />
          <EditableField onContentChange={onContentChange} fieldKey="title" value={resumeData.title} className="text-lg text-slate-600" />
          <div className="flex space-x-4 text-sm mt-2 text-slate-500">
            <EditableField tag="span" onContentChange={onContentChange} fieldKey="contact.address" value={resumeData.contact.address || ''} />
            <EditableField tag="span" onContentChange={onContentChange} fieldKey="contact.phone" value={resumeData.contact.phone || ''} />
            <EditableField tag="span" onContentChange={onContentChange} fieldKey="contact.email" value={resumeData.contact.email || ''} />
          </div>
        </header>
        <div className="h-px bg-slate-300 w-full mb-6"></div>
         <main className="space-y-6">
            {resumeData.sections.map(section => (
              <div key={section.id}>
                <EditableField onContentChange={onContentChange} tag="h2" fieldKey={`section.title.${section.id}`} value={section.title} className="text-sm font-bold uppercase tracking-widest text-slate-600 border-b-2 border-slate-300 pb-1 mb-3" />
                <EditableField onContentChange={onContentChange} fieldKey={`section.${section.id}`} value={section.content} />
              </div>
            ))}
        </main>
      </div>
    );

    const renderProfessionalClassicTemplate = () => {
      const leftSections = ['PROFILE', 'CONTACT', 'EDUCATION', 'SKILLS'];
      const rightSections = ['EXPERIENCE'];
      const footerSection = 'SOCIALS';

      return (
          <div
              id="resume-page-0"
              className="w-[8.5in] h-[11in] bg-white shadow-lg mx-auto text-slate-800 mb-8 flex flex-col"
              style={{
                  padding: `${formatting.sideMargins}mm`,
                  fontSize: `${formatting.fontSize}pt`,
                  fontFamily: `'${formatting.fontStyle}', sans-serif`,
                  lineHeight: formatting.lineSpacing,
              }}
          >
              <header className="text-center border-b-2 border-slate-300 pb-4 mb-4">
                  <EditableField onContentChange={onContentChange} fieldKey="name" value={resumeData.name} className="text-4xl font-bold uppercase tracking-widest" />
                  <EditableField onContentChange={onContentChange} fieldKey="title" value={resumeData.title} className="text-lg mt-1 tracking-widest" />
              </header>

              <main className="flex-1 flex gap-8">
                  <div className="w-1/3 pr-8 space-y-6">
                      {leftSections.map(title => {
                          const section = getSection(title);
                          if (!section) return null;
                          return (
                              <div key={section.id}>
                                  <EditableField onContentChange={onContentChange} tag="h3" fieldKey={`section.title.${section.id}`} value={section.title} className="text-md font-bold uppercase tracking-widest border-b-2 border-slate-800 pb-1 mb-2" />
                                  <EditableField onContentChange={onContentChange} fieldKey={`section.${section.id}`} value={section.content} />
                              </div>
                          );
                      })}
                  </div>
                  <div className="w-px bg-slate-300 h-full"></div>
                  <div className="w-2/3 pl-8 space-y-6">
                      {rightSections.map(title => {
                          const section = getSection(title);
                          if (!section) return null;
                          return (
                              <div key={section.id}>
                                  <EditableField onContentChange={onContentChange} tag="h3" fieldKey={`section.title.${section.id}`} value={section.title} className="text-md font-bold uppercase tracking-widest border-b-2 border-slate-800 pb-1 mb-2" />
                                  <EditableField onContentChange={onContentChange} fieldKey={`section.${section.id}`} value={section.content} />
                              </div>
                          );
                      })}
                  </div>
              </main>

              <footer className="pt-4 border-t-2 border-slate-300 mt-auto">
                  <EditableField onContentChange={onContentChange} fieldKey={`section.${footerSection.toLowerCase()}`} value={getSection(footerSection)?.content || ''} />
              </footer>
          </div>
      );
    };

    const renderCreativeModernTemplate = () => (
      <div 
        id="resume-page-0"
        className="w-[8.5in] h-[11in] bg-[#f3f0ec] shadow-lg mx-auto text-slate-800 mb-8 overflow-hidden flex"
        style={{
            fontSize: `${formatting.fontSize}pt`,
            fontFamily: `'${formatting.fontStyle}', sans-serif`,
            lineHeight: formatting.lineSpacing,
        }}
      >
        <div className="w-[45%] bg-[#1a2e2a] text-white p-12 flex flex-col justify-between">
          <div>
            <EditableField onContentChange={onContentChange} fieldKey="name" value={resumeData.name} className="text-5xl font-bold" />
            <EditableField onContentChange={onContentChange} fieldKey="title" value={resumeData.title} className="text-lg mt-2" />
          </div>
          <div>
            <EditableField tag="h3" onContentChange={onContentChange} fieldKey={`section.title.contact`} value={getSection('CONTACT')?.title || ''} className="text-2xl font-bold mb-4" />
            <EditableField onContentChange={onContentChange} fieldKey={`section.contact`} value={getSection('CONTACT')?.content || ''} />
          </div>
          <div>
            <EditableField tag="h3" onContentChange={onContentChange} fieldKey={`section.title.education`} value={getSection('EDUCATION')?.title || ''} className="text-2xl font-bold mb-4" />
            <EditableField onContentChange={onContentChange} fieldKey={`section.education`} value={getSection('EDUCATION')?.content || ''} />
          </div>
          <div>
            <EditableField tag="h3" onContentChange={onContentChange} fieldKey={`section.title.expertise`} value={getSection('EXPERTISE')?.title || ''} className="text-2xl font-bold mb-4" />
            <EditableField onContentChange={onContentChange} fieldKey={`section.expertise`} value={getSection('EXPERTISE')?.content || ''} />
          </div>
          <div></div>
        </div>
        <div className="w-[55%] bg-[#d45d3e] p-1">
          <div className="bg-[#e9e3d9] h-full p-12 space-y-8">
            <div>
              <EditableField tag="h3" onContentChange={onContentChange} fieldKey={`section.title.profile`} value={getSection('PROFILE')?.title || ''} className="text-2xl font-bold mb-4" />
              <EditableField onContentChange={onContentChange} fieldKey={`section.profile`} value={getSection('PROFILE')?.content || ''} />
            </div>
            <div>
              <EditableField tag="h3" onContentChange={onContentChange} fieldKey={`section.title.experience`} value={getSection('EXPERIENCES')?.title || ''} className="text-2xl font-bold mb-4" />
              <EditableField onContentChange={onContentChange} fieldKey={`section.experience`} value={getSection('EXPERIENCES')?.content || ''} />
            </div>
          </div>
        </div>
      </div>
    );
    
    const renderCreativePhotoTemplate = () => (
      <div
        id="resume-page-0"
        className="w-[8.5in] h-[11in] bg-white shadow-lg mx-auto text-slate-800 mb-8 flex"
        style={{
            fontSize: `${formatting.fontSize}pt`,
            fontFamily: `'${formatting.fontStyle}', sans-serif`,
            lineHeight: formatting.lineSpacing,
        }}
      >
        <div className="w-[65%] p-10 flex flex-col">
            <header className="mb-8">
                <div className="w-16 h-2 mb-4" style={{ backgroundColor: formatting.accentColor }}></div>
                <EditableField onContentChange={onContentChange} fieldKey="name" value={resumeData.name} className="text-4xl font-bold" />
                <EditableField onContentChange={onContentChange} fieldKey="title" value={resumeData.title} className="text-lg" />
            </header>
            <main className="flex-1 space-y-6">
                <EditableField tag="h3" onContentChange={onContentChange} fieldKey={`section.title.experience`} value={getSection('JOB EXPERIENCE')?.title || ''} className="text-xl font-bold" />
                <EditableField onContentChange={onContentChange} fieldKey={`section.experience`} value={getSection('JOB EXPERIENCE')?.content || ''} />
                <EditableField tag="h3" onContentChange={onContentChange} fieldKey={`section.title.skills`} value={getSection('SKILLS')?.title || ''} className="text-xl font-bold" />
                <EditableField onContentChange={onContentChange} fieldKey={`section.skills`} value={getSection('SKILLS')?.content || ''} />
            </main>
            <footer className="mt-auto pt-4 border-t border-slate-200">
                <EditableField onContentChange={onContentChange} fieldKey={`section.contact_footer`} value={getSection('CONTACT_FOOTER')?.content || ''} />
            </footer>
        </div>
        <div className="w-[35%] bg-slate-100 p-10 flex flex-col items-center">
            <input type="file" ref={photoInputRef} onChange={onPhotoUpload} className="hidden" accept="image/*" />
            <img src={resumeData.photo} onClick={() => photoInputRef.current?.click()} alt="Profile" className="w-48 h-48 object-cover rounded-full mb-8 cursor-pointer" />
            <div className="text-center italic text-slate-600 mb-8 relative">
                <span className="absolute -left-6 -top-2 text-5xl text-slate-300 font-serif">“</span>
                <EditableField onContentChange={onContentChange} fieldKey={`section.quote`} value={getSection('QUOTE')?.content || ''} />
                <span className="absolute -right-6 -bottom-2 text-5xl text-slate-300 font-serif">”</span>
            </div>
            <div className="w-full">
                <EditableField tag="h3" onContentChange={onContentChange} fieldKey={`section.title.education_right`} value={getSection('EDUCATION_RIGHT')?.title || ''} className="text-xl font-bold mb-4" />
                <EditableField onContentChange={onContentChange} fieldKey={`section.education_right`} value={getSection('EDUCATION_RIGHT')?.content || ''} />
            </div>
        </div>
      </div>
    );
    
    const renderProfessionalPhotoTemplate = () => (
      <div 
        id="resume-page-0"
        className="w-[8.5in] h-[11in] bg-white shadow-lg mx-auto text-slate-800 mb-8 flex"
        style={{
            fontSize: `${formatting.fontSize}pt`,
            fontFamily: `'${formatting.fontStyle}', sans-serif`,
            lineHeight: formatting.lineSpacing,
        }}
      >
        <div className="w-[35%] bg-[#222] text-white p-8 flex flex-col">
            <header className="flex-grow-0">
                <input type="file" ref={photoInputRef} onChange={onPhotoUpload} className="hidden" accept="image/*" />
                <img src={resumeData.photo} onClick={() => photoInputRef.current?.click()} alt="Profile" className="w-full mb-4 cursor-pointer" />
                <EditableField onContentChange={onContentChange} fieldKey="name" value={resumeData.name} className="text-3xl font-bold" />
                <EditableField onContentChange={onContentChange} fieldKey="title" value={resumeData.title} className="text-md" />
                <div className="mt-2 text-sm space-x-2 text-blue-400">
                    <EditableField onContentChange={onContentChange} fieldKey={`section.socials`} value={getSection('SOCIALS')?.content || ''} />
                </div>
            </header>
            <main className="flex-1 flex flex-col justify-around mt-8">
                <div>
                  <EditableField tag="h3" onContentChange={onContentChange} fieldKey={`section.title.contact`} value={getSection('CONTACT')?.title || ''} className="text-lg font-bold border-b border-blue-400 pb-1 mb-3" />
                  <EditableField onContentChange={onContentChange} fieldKey={`section.contact`} value={getSection('CONTACT')?.content || ''} />
                </div>
                 <div>
                  <EditableField tag="h3" onContentChange={onContentChange} fieldKey={`section.title.interests`} value={getSection('INTERESTS')?.title || ''} className="text-lg font-bold border-b border-blue-400 pb-1 mb-3" />
                  <EditableField onContentChange={onContentChange} fieldKey={`section.interests`} value={getSection('INTERESTS')?.content || ''} />
                </div>
            </main>
        </div>
        <div className="w-[65%] p-10 space-y-6">
            <EditableField tag="h3" onContentChange={onContentChange} fieldKey={`section.title.profile`} value={getSection('PROFILE')?.title || ''} className="text-xl font-bold border-b-2 border-slate-400 pb-1" />
            <EditableField onContentChange={onContentChange} fieldKey={`section.profile`} value={getSection('PROFILE')?.content || ''} />
            
            <EditableField tag="h3" onContentChange={onContentChange} fieldKey={`section.title.education`} value={getSection('EDUCATION')?.title || ''} className="text-xl font-bold border-b-2 border-slate-400 pb-1" />
            <EditableField onContentChange={onContentChange} fieldKey={`section.education`} value={getSection('EDUCATION')?.content || ''} />

            <EditableField tag="h3" onContentChange={onContentChange} fieldKey={`section.title.experience`} value={getSection('EXPERIENCE')?.title || ''} className="text-xl font-bold border-b-2 border-slate-400 pb-1" />
            <EditableField onContentChange={onContentChange} fieldKey={`section.experience`} value={getSection('EXPERIENCE')?.content || ''} />
            
            <EditableField tag="h3" onContentChange={onContentChange} fieldKey={`section.title.skills`} value={getSection('SKILLS')?.title || ''} className="text-xl font-bold border-b-2 border-slate-400 pb-1" />
            <EditableField onContentChange={onContentChange} fieldKey={`section.skills`} value={getSection('SKILLS')?.content || ''} />
        </div>
      </div>
    );

    const renderTemplate = () => {
        switch (templateId) {
            case 'Professional Classic': return renderProfessionalClassicTemplate();
            case 'Executive Classic': return renderExecutiveClassicTemplate();
            case 'Creative Modern': return renderCreativeModernTemplate();
            case 'Creative Photo': return renderCreativePhotoTemplate();
            case 'Professional Photo': return renderProfessionalPhotoTemplate();
            case 'default':
            default: return renderDefaultTemplate();
        }
    }

    return (
        <div className="flex-1 p-10 bg-slate-100 overflow-y-auto">
             <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Garamond:wght@400;700&family=Lato:wght@400;700&family=Arial:wght@400;700&family=Calibri:wght@400;700&family=Cambria:wght@400;700&family=Georgia:wght@400;700&family=Helvetica:wght@400;700&family=Inter:wght@400;700&family=Merriweather:wght@400;700&family=Montserrat:wght@400;700&family=Open+Sans:wght@400;700&family=Roboto:wght@400;700&family=Source+Sans+Pro:wght@400;700&family=Times+New+Roman:wght@400;700&family=Trebuchet+MS:wght@400;700&family=Verdana:wght@400;700&display=swap');
                
                .job-header { display: flex; justify-content: space-between; }
                .job-entry { margin-bottom: 1rem; }
                .expertise-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; text-align: center;}
                .expertise-item { border-radius: 9999px; border: 2px solid white; padding: 1rem; }
                .skill-grid { display: grid; grid-template-columns: 100px 1fr; gap: 0.5rem 1rem; align-items: center; }
                .skill-bar-wrapper { width: 100%; background-color: #e0e0e0; border-radius: 9999px; height: 8px; }
                .skill-bar { height: 100%; background-color: #3d85c6; border-radius: 9999px; }
                .skill-grid-photo { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .skill-grid-photo > div { display: flex; align-items: center; gap: 0.5rem; }
                .skill-grid-photo > div > span { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; border: 2px solid #0b5394; color: #0b5394; font-weight: bold; }
             `}</style>
            {renderTemplate()}
        </div>
    );
};

// Main EditorPage Component
const EditorPage: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('Design');
  const [templateId, setTemplateId] = useState<TemplateName>('default');
  const { 
      state: resumeData, 
      setState: setResumeData, 
      undo, 
      canUndo,
      replaceState,
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

  const handleTemplateSelect = (id: TemplateName) => {
      setTemplateId(id);
      let templateData;
      switch (id) {
          case 'Professional Classic': templateData = PROFESSIONAL_CLASSIC_TEMPLATE; break;
          case 'Executive Classic': templateData = EXECUTIVE_CLASSIC_TEMPLATE; break;
          case 'Creative Modern': templateData = CREATIVE_MODERN_TEMPLATE; break;
          case 'Creative Photo': templateData = CREATIVE_PHOTO_TEMPLATE; break;
          case 'Professional Photo': templateData = PROFESSIONAL_PHOTO_TEMPLATE; break;
          default: templateData = { data: DEFAULT_RESUME_DATA, formatting: { accentColor: '#000000', textAlign: 'left', lineSpacing: 1.4, sideMargins: 20, fontStyle: 'Inter', fontSize: 11 } };
      }
      setResumeData(JSON.parse(JSON.stringify(templateData.data)));
      setFormatting(JSON.parse(JSON.stringify(templateData.formatting)));
  };

  const handleFormattingChange = (key: keyof FormattingOptions, value: any) => {
    setFormatting(prev => ({ ...prev, [key]: value }));
  };

  const handleFontDropdownMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleFontPropertyChange = (property: 'fontStyle' | 'fontSize', value: string | number) => {
    const selection = window.getSelection();

    if (selection && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        let editableElement = range.commonAncestorContainer;
         if (editableElement.nodeType !== Node.ELEMENT_NODE) {
            editableElement = editableElement.parentElement!;
        }
        while (editableElement && !(editableElement as HTMLElement).isContentEditable) {
            editableElement = editableElement.parentElement!;
        }

        if (!editableElement) return;
        const fieldKey = (editableElement as HTMLElement).dataset.fieldKey;

        const tempDiv = document.createElement("div");
        tempDiv.appendChild(range.cloneContents());
        const selectedHTML = tempDiv.innerHTML;
        
        if (!selectedHTML) return;
        
        let styleAttribute = '';
        if (property === 'fontStyle') {
            styleAttribute = `font-family: '${value}'`;
        } else if (property === 'fontSize') {
            styleAttribute = `font-size: ${value}pt`;
        }

        const newHtml = `<span style="${styleAttribute}">${selectedHTML}</span>`;
        document.execCommand('insertHTML', false, newHtml);
        
        if (fieldKey) {
            handleContentChange(fieldKey, (editableElement as HTMLElement).innerHTML);
        }

    } else {
        setFormatting(prev => ({ ...prev, [property]: value }));
    }
  };
  
  const handleContentChange = useCallback((
    field: string,
    value: string
  ) => {
      const action = (prev: ResumeData) => {
          const newResumeData = JSON.parse(JSON.stringify(prev));
          if (field.startsWith('section.title.')) {
              const sectionId = field.split('.')[2];
              const section = newResumeData.sections.find((s: ResumeSection) => s.id === sectionId);
              if (section) section.title = value;
          }
          else if (field.startsWith('section.')) {
              const sectionId = field.split('.')[1];
              const section = newResumeData.sections.find((s: ResumeSection) => s.id === sectionId);
              if (section) section.content = value;
          }
          else if (field.startsWith('contact.')) {
              const contactField = field.split('.')[1] as keyof ResumeData['contact'];
              newResumeData.contact[contactField] = value;
          }
          else if (field === 'name' || field === 'title') {
             newResumeData[field as 'name' | 'title'] = value;
          }
          return newResumeData;
      };
      replaceState(action(resumeData));
  }, [resumeData, replaceState]);

  const handleApplyFormat = (command: string, value?: string) => {
    if (command === 'createLink') {
        const url = prompt('Enter the URL for the selected text:');
        if (url) {
            document.execCommand('createLink', false, url);
        }
    } else if (command === 'insertDate') {
        const date = new Date().toLocaleDateString();
        document.execCommand('insertText', false, date);
    } else if (command.startsWith('justify')) {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
        const range = selection.getRangeAt(0);
        const contentEditable = range.commonAncestorContainer.parentElement?.closest<HTMLElement>('[contenteditable="true"]');
        if (!contentEditable) return;
        const alignValue = command.replace('justify', '').toLowerCase();
        const getContainingBlock = (node: Node | null, root: HTMLElement): HTMLElement | null => {
            while (node && node !== root) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const el = node as HTMLElement;
                    const tagName = el.tagName.toLowerCase();
                    if (['p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'].includes(tagName)) {
                        if (el === root) return null;
                        return el;
                    }
                }
                node = node.parentNode;
            }
            return null;
        };
        const startBlock = getContainingBlock(range.startContainer, contentEditable);
        const endBlock = getContainingBlock(range.endContainer, contentEditable);
        if (!startBlock || !endBlock) return;
        const allBlocksInEditor = Array.from(contentEditable.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, div'));
        const startIndex = allBlocksInEditor.indexOf(startBlock);
        const endIndex = allBlocksInEditor.indexOf(endBlock);
        if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
            const blocksToStyle = allBlocksInEditor.slice(startIndex, endIndex + 1);
            blocksToStyle.forEach(block => {
                if (!['ul', 'ol'].includes(block.tagName.toLowerCase())) {
                    (block as HTMLElement).style.textAlign = alignValue;
                }
            });
            const fieldKey = contentEditable.dataset.fieldKey;
            if (fieldKey) {
                handleContentChange(fieldKey, contentEditable.innerHTML);
            }
        }
        return;
    }

    if ((command === 'insertUnorderedList' || command === 'insertOrderedList') && value) {
        const listType = command === 'insertUnorderedList' ? 'UL' : 'OL';
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        let range = selection.getRangeAt(0);
        let container = range.commonAncestorContainer;
        if (container.nodeType !== Node.ELEMENT_NODE) {
            container = container.parentNode!;
        }
        let listElement = container as HTMLElement;
        while (listElement && !['UL', 'OL'].includes(listElement.tagName) && listElement.contentEditable !== 'true') {
            listElement = listElement.parentElement!;
        }
        if (listElement && listElement.tagName === listType) {
            listElement.style.listStyleType = value;
        } else {
            document.execCommand(command, false, undefined);
            const newSelection = window.getSelection()!;
            range = newSelection.getRangeAt(0);
            container = range.commonAncestorContainer;
            if (container.nodeType !== Node.ELEMENT_NODE) {
                container = container.parentNode!;
            }
            let newListElement = container as HTMLElement;
            while (newListElement && newListElement.tagName !== listType && newListElement.contentEditable !== 'true') {
                newListElement = newListElement.parentElement!;
            }
            if (newListElement && newListElement.tagName === listType) {
                newListElement.style.listStyleType = value;
            }
        }
    } else {
        document.execCommand(command, false, value);
    }
      
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement.isContentEditable) {
        const fieldKey = activeElement.dataset.fieldKey;
        if (fieldKey) {
            handleContentChange(fieldKey, activeElement.innerHTML);
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
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeData(prev => ({ ...prev, photo: event.target?.result as string }));
      };
      reader.readAsDataURL(e.target.files[0]);
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
        onFontPropertyChange={handleFontPropertyChange}
        onApplyFormat={handleApplyFormat}
        onFontDropdownMouseDown={handleFontDropdownMouseDown}
        onTemplateSelect={handleTemplateSelect}
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
        <ResumePreview 
          templateId={templateId} 
          resumeData={resumeData} 
          onContentChange={handleContentChange} 
          onPhotoUpload={handlePhotoUpload}
          formatting={formatting} 
        />
      </div>
    </div>
  );
};

export default EditorPage;
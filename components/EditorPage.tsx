import React, { useState, useCallback, useEffect, useRef, useLayoutEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import { ResumeData, SidebarTab, ResumeSection, Aisuggestions, TemplateName } from '../types';
import { DEFAULT_RESUME_DATA, ALL_SECTIONS, SECTION_PLACEHOLDERS, PROFESSIONAL_CLASSIC_TEMPLATE, EXECUTIVE_CLASSIC_TEMPLATE, CREATIVE_MODERN_TEMPLATE, CREATIVE_PHOTO_TEMPLATE, PROFESSIONAL_PHOTO_TEMPLATE, MANJARI_SINGH_TEMPLATE, OLIVIA_LINGTON_TEMPLATE, ALEX_BRAHAR_TEMPLATE, DIYA_PATEL_TEMPLATE, CLAUDIA_ALVES_TEMPLATE, BECKY_LU_TEMPLATE, EXECUTIVE_PROFESSIONAL_TEMPLATE, MODERN_PHOTO_TEMPLATE, CHRONOLOGICAL_CLEAN_TEMPLATE, CREATIVE_ORGANIC_TEMPLATE } from '../constants';
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

const ManjariSinghPreview = () => (
    <div className="aspect-[3/4] bg-white rounded-md flex flex-col p-2 border border-slate-300 gap-1">
        <div className="flex justify-between items-start">
            <div className="w-1/3 h-2 bg-slate-800 rounded-sm"></div>
            <div className="w-1/3 h-2 bg-slate-800 rounded-sm text-right"></div>
        </div>
        <div className="h-px bg-slate-300 my-1"></div>
        <div className="flex gap-2 flex-1">
            <div className="w-1/3">
                <div className="w-full aspect-square bg-slate-300 rounded-full"></div>
            </div>
            <div className="w-2/3 space-y-1">
                <div className="h-2 w-2/3 bg-slate-800 rounded-sm"></div>
                <div className="h-1 w-full bg-slate-400 rounded-sm"></div>
                <div className="h-1 w-3/4 bg-slate-400 rounded-sm"></div>
                <div className="h-1.5 w-1/2 bg-slate-800 rounded-sm mt-2"></div>
                <div className="h-1 w-full bg-slate-400 rounded-sm"></div>
            </div>
        </div>
    </div>
);

const OliviaLingtonPreview = () => (
    <div className="aspect-[3/4] bg-[#FDFBF7] rounded-md flex flex-col p-2 border border-slate-300 relative overflow-hidden">
        <div className="w-1/3 h-1 bg-slate-800 rounded-sm"></div>
        <div className="w-1/2 h-2.5 bg-[#D9534F] rounded-sm mt-1"></div>
        <div className="w-1/3 h-2.5 bg-[#D9534F] rounded-sm mt-0.5"></div>
        <div className="absolute top-4 right-2 w-1/2 aspect-square bg-slate-300 rounded-full"></div>
        <div className="absolute bottom-[-20px] left-[-20px] w-1/2 aspect-square bg-[#D9534F] rounded-full"></div>
        <div className="mt-auto w-1/4 h-1 bg-slate-800 rounded-sm self-end"></div>
    </div>
);

const AlexBraharPreview = () => (
    <div className="aspect-[3/4] bg-white rounded-md flex border border-slate-300 overflow-hidden">
        <div className="w-1/3 bg-[#FFC107] p-1 space-y-2">
            <div className="w-full h-4 bg-slate-800"></div>
            <div className="h-1.5 w-full bg-slate-800 rounded-sm"></div>
            <div className="h-1 w-3/4 bg-slate-400 rounded-sm"></div>
        </div>
        <div className="w-2/3 p-1 space-y-2">
            <div className="h-1 w-1/2 bg-slate-800 rounded-sm"></div>
            <div className="h-0.5 w-full bg-slate-400 rounded-sm"></div>
            <div className="h-0.5 w-3/4 bg-slate-400 rounded-sm"></div>
        </div>
    </div>
);

const DiyaPatelPreview = () => (
    <div className="aspect-[3/4] bg-white rounded-md flex border border-slate-300 p-2 gap-2">
        <div className="w-2/3 space-y-2">
            <div className="h-2 w-1/2 bg-slate-800 rounded-sm"></div>
            <div className="h-1 w-1/3 bg-slate-600 rounded-sm"></div>
            <div className="h-px bg-slate-300 my-1"></div>
            <div className="h-1 w-1/4 bg-slate-800 rounded-sm"></div>
            <div className="h-0.5 w-full bg-slate-400 rounded-sm"></div>
        </div>
        <div className="w-1/3 space-y-2">
            <div className="w-full aspect-square bg-slate-300"></div>
            <div className="h-1 w-full bg-slate-800 rounded-sm"></div>
            <div className="flex flex-wrap gap-0.5">
                <div className="w-1/3 h-0.5 bg-slate-400 rounded-full"></div>
                <div className="w-1/2 h-0.5 bg-slate-400 rounded-full"></div>
            </div>
        </div>
    </div>
);

const ClaudiaAlvesPreview = () => (
    <div className="aspect-[3/4] bg-white rounded-md flex flex-col p-2 border border-slate-300 relative overflow-hidden">
        <div className="w-2/3 h-2.5 bg-slate-800 rounded-sm"></div>
        <div className="w-1/2 h-1 bg-slate-600 rounded-sm mt-1"></div>
        <div className="absolute top-1 right-1 w-1/3 aspect-square bg-slate-300"></div>
        <div className="absolute top-10 right-8 w-1/3 aspect-square bg-yellow-300 rotate-12"></div>
        <div className="absolute top-0 right-8 w-2 h-1/4 bg-purple-400"></div>
    </div>
);

const BeckyLuPreview = () => (
    <div className="aspect-[3/4] bg-white rounded-md flex flex-col p-2 border border-slate-300 relative overflow-hidden">
        <div className="absolute top-0 right-[-30%] w-2/3 h-1/2 bg-yellow-300 rounded-bl-full"></div>
        <div className="relative z-10">
            <div className="w-1/3 h-1.5 bg-slate-800 rounded-sm"></div>
            <div className="w-1/2 h-2.5 bg-slate-800 rounded-sm mt-1"></div>
        </div>
        <div className="relative z-10 w-1/3 aspect-square bg-slate-300 rounded-full mt-2 self-end mr-4"></div>
    </div>
);

const ExecutiveProfessionalPreview = () => (
    <div className="aspect-[3/4] bg-white rounded-md flex p-2 border border-slate-300 gap-2">
        <div className="w-1/3 space-y-2">
            <div className="h-1 w-full bg-slate-800 rounded-sm"></div>
            <div className="h-0.5 w-full bg-slate-400 rounded-sm"></div>
            <div className="h-1 w-full bg-slate-800 rounded-sm mt-2"></div>
            <div className="h-0.5 w-full bg-slate-400 rounded-sm"></div>
        </div>
        <div className="w-2/3 space-y-2">
            <div className="h-1.5 w-2/3 bg-slate-800 rounded-sm"></div>
            <div className="h-1 w-1/3 bg-slate-600 rounded-sm mt-1"></div>
            <div className="h-px bg-slate-300 my-1"></div>
            <div className="h-1 w-1/4 bg-slate-800 rounded-sm"></div>
            <div className="h-0.5 w-full bg-slate-400 rounded-sm"></div>
        </div>
    </div>
);

const ModernPhotoPreview = () => (
    <div className="aspect-[3/4] bg-white rounded-md flex p-2 border border-slate-300 gap-2">
        <div className="w-2/3 space-y-2">
            <div className="h-2 w-2/3 bg-slate-800 rounded-sm"></div>
            <div className="h-1 w-1/3 bg-slate-600 rounded-sm mt-1"></div>
            <div className="h-1 w-1/4 bg-slate-800 rounded-sm mt-2"></div>
            <div className="h-0.5 w-full bg-slate-400 rounded-sm"></div>
        </div>
        <div className="w-1/3 space-y-2">
            <div className="w-full h-1/3 bg-slate-300"></div>
            <div className="h-1 w-full bg-slate-800 rounded-sm"></div>
            <div className="flex flex-wrap gap-0.5">
                <div className="w-1/2 h-0.5 bg-slate-400 rounded-full"></div>
                <div className="w-1/3 h-0.5 bg-slate-400 rounded-full"></div>
            </div>
        </div>
    </div>
);

const ChronologicalCleanPreview = () => (
    <div className="aspect-[3/4] bg-white rounded-md flex p-2 border border-slate-300 relative">
        <div className="w-px h-full bg-slate-300 absolute left-1/2 top-0"></div>
        <div className="w-1/2 pr-2 space-y-2">
            <div className="h-2 w-2/3 bg-slate-800 rounded-sm"></div>
            <div className="h-0.5 w-full bg-slate-400 rounded-sm"></div>
            <div className="h-1 w-1/4 bg-slate-800 rounded-sm mt-2"></div>
        </div>
        <div className="w-1/2 pl-2 space-y-2">
            <div className="w-full h-4 border border-slate-300 rounded-sm p-0.5 space-y-1">
                <div className="h-0.5 w-1/2 bg-slate-400 rounded-sm"></div>
            </div>
             <div className="w-full h-4 border border-slate-300 rounded-sm p-0.5 space-y-1">
                <div className="h-0.5 w-1/2 bg-slate-400 rounded-sm"></div>
            </div>
        </div>
    </div>
);

const CreativeOrganicPreview = () => (
    <div className="aspect-[3/4] bg-white rounded-md flex p-2 border border-slate-300 relative overflow-hidden">
        <div className="absolute top-0 right-[-25%] w-2/3 h-2/3 bg-[#3A8D8C] rounded-bl-full"></div>
        <div className="w-2/3 space-y-2 z-10">
            <div className="h-2 w-2/3 bg-slate-800 rounded-sm"></div>
            <div className="h-0.5 w-full bg-slate-400 rounded-sm"></div>
        </div>
        <div className="w-1/3 z-10">
             <div className="w-full aspect-square bg-slate-300 rounded-full mt-8"></div>
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
  { id: 'Manjari Singh', name: 'Manjari Singh', component: <ManjariSinghPreview /> },
  { id: 'Olivia Lington', name: 'Olivia Lington', component: <OliviaLingtonPreview /> },
  { id: 'Alex Brahar', name: 'Alex Brahar', component: <AlexBraharPreview /> },
  { id: 'Diya Patel', name: 'Diya Patel', component: <DiyaPatelPreview /> },
  { id: 'Claudia Alves', name: 'Claudia Alves', component: <ClaudiaAlvesPreview /> },
  { id: 'Becky Lu', name: 'Becky Lu', component: <BeckyLuPreview /> },
  { id: 'Executive Professional', name: 'Executive Pro', component: <ExecutiveProfessionalPreview /> },
  { id: 'Modern Photo', name: 'Modern Photo', component: <ModernPhotoPreview /> },
  { id: 'Chronological Clean', name: 'Chronological', component: <ChronologicalCleanPreview /> },
  { id: 'Creative Organic', name: 'Creative Organic', component: <CreativeOrganicPreview /> },
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
        {active
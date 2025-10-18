import React, { useState, useCallback, useEffect, useRef, useLayoutEffect } from 'react';
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
  onFontPropertyChange: (property: 'fontStyle' | 'fontSize', value: string | number) => void;
  onApplyFormat: (command: string, value?: string) => void;
  onFontDropdownMouseDown: (e: React.MouseEvent) => void;
}> = ({ 
    activeTab, setActiveTab, resumeData, setResumeData, aiSuggestions, handleAiAction, 
    isAiLoading, formatting, onFormattingChange, onFontPropertyChange, onApplyFormat,
    onFontDropdownMouseDown
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
      'phone': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81 .7A2 2 0 0 1 22 16.92z" /></svg>`,
      'mail': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>`,
      'map-pin': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>`,
      'globe': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>`,
      'linkedin': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>`,
      'github': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>`,
      'at-sign': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/></svg>`,
      'award': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 17 17 23 15.79 13.88"/></svg>`,
      'book-open': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
      'briefcase': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
      'camera': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
      'certificate': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M12 21v-2"/><path d="M12 3v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M21 12h-2"/><path d="M5 12H3"/><path d="m19.07 4.93-1.41 1.41"/><path d="m6.34 17.66-1.41 1.41"/><path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"/><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></svg>`,
      'clipboard-check': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>`,
      'clock': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
      'cloud': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
      'code': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
      'coffee': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>`,
      'compass': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
      'database': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
      'edit-2': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>`,
      'external-link': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
      'feather': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>`,
      'flag': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`,
      'folder': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
      'gift': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`,
      'git-branch': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>`,
      'hard-drive': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/></svg>`,
      'hash': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>`,
      'headphones': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>`,
      'heart': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
      'help-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      'home': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
      'image': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
      'inbox': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`,
      'info': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
      'key': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>`,
      'languages': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>`,
      'layers': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
      'layout': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`,
      'lightbulb': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-5.66 11.64 2.5 2.5 0 0 1-.34 3.36h12a2.5 2.5 0 0 1-.34-3.36A7 7 0 0 0 12 2z"/></svg>`,
      'message-square': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
      'mic': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
      'monitor': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
      'music': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
      'package': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
      'paperclip': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`,
      'pen-tool': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18z"/><path d="m2 2 7.586 7.586"/><path d="m11 11 1 1"/></svg>`,
      'pie-chart': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>`,
      'printer': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`,
      'puzzle': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M20.42 20.42c.86-.86.86-2.24 0-3.1-1.33-1.33-3.1-1.33-4.42 0-1.03 1.03-1.03 2.69 0 3.72s2.7 1.03 3.72 0l-1.88-1.88a.001.001 0 0 1 0-.002z"/><path d="M12.55 5.92c.86-.86.86-2.24 0-3.1C11.22 1.49 9.44 1.49 8.12 2.8c-1.03 1.03-1.03 2.69 0 3.72 1.04 1.03 2.7 1.03 3.72 0l-1.88-1.88a.001.001 0 0 1 0-.002z"/><path d="M3.58 14.75c-.86.86-.86 2.24 0 3.1 1.33 1.33 3.1 1.33 4.42 0 1.03-1.03 1.03-2.69 0-3.72s-2.7-1.03-3.72 0l1.88 1.88a.001.001 0 0 1 0 .002z"/><path d="M11.45 20.42c-.86.86-.86 2.24 0 3.1 1.33 1.33 3.1 1.33 4.42 0 1.03-1.03 1.03-2.69 0-3.72s-2.7-1.03-3.72 0l1.88 1.88a.001.001 0 0 0 0 .002z"/><path d="M14.75 3.58c.86-.86.86-2.24 0-3.1-1.33-1.33-3.1-1.33-4.42 0-1.03 1.03-1.03 2.69 0 3.72s2.7 1.03 3.72 0l-1.88-1.88a.001.001 0 0 0 0-.002z"/><path d="M5.92 12.55c-.86.86-.86 2.24 0 3.1 1.33 1.33 3.1 1.33 4.42 0 1.03-1.03 1.03-2.69 0-3.72s-2.7-1.03-3.72 0l1.88 1.88a.001.001 0 0 0 0 .002z"/></svg>`,
      'save': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
      'search': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
      'send': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
      'server': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`,
      'settings': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
      'star': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
      'thumbs-up': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88z"/></svg>`,
      'tool': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
      'trophy': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21-.19.08-.44.15-.93.22-.5.07-1.07.14-1.78.21C4.4 18.86 2 19.86 2 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21.19.08.44.15.93.22.5.07 1.07.14 1.78.21C19.6 18.86 22 19.86 22 22"/><path d="M12 2C8.69 2 6 4.69 6 8a6 6 0 0 0 6 6 6 6 0 0 0 6-6c0-3.31-2.69-6-6-6z"/></svg>`,
      'twitter': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>`,
      'user': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
      'users': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      'video': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
      'volume-2': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`,
      'wifi': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`,
      'zap': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
      'youtube': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>`,
      'dribbble': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>`,
      'smile': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${iconStyle}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
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
        onApplyFormat('insertHTML', svgString + '&nbsp;');
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
        // This effect syncs the DOM with the `value` prop.
        // It's crucial for features like "Undo" where the state changes
        // externally. It compares the current DOM content with the new
        // prop value to avoid unnecessary DOM manipulation, which would
        // cause the selection to be lost.
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
            // By removing dangerouslySetInnerHTML, we are telling React that we will manage the content
            // of this element imperatively. The initial content will be set by the useLayoutEffect on mount.
        />
    );
};


const ResumePreview: React.FC<{
  resumeData: ResumeData;
  onContentChange: (
    field: keyof ResumeData | `contact.${keyof ResumeData['contact']}` | `section.${string}` | `section.title.${string}`,
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
                            <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mb-2" style={{ borderColor: format.accentColor }} dangerouslySetInnerHTML={{ __html: section.title }} />
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

    return (
        <div className="flex-1 p-10 bg-slate-100 overflow-y-auto">
             <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Arial:wght@400;700&family=Calibri:wght@400;700&family=Cambria:wght@400;700&family=Garamond:wght@400;700&family=Georgia:wght@400;700&family=Helvetica:wght@400;700&family=Inter:wght@400;700&family=Lato:wght@400;700&family=Merriweather:wght@400;700&family=Montserrat:wght@400;700&family=Open+Sans:wght@400;700&family=Roboto:wght@400;700&family=Source+Sans+Pro:wght@400;700&family=Times+New+Roman:wght@400;700&family=Trebuchet+MS:wght@400;700&family=Verdana:wght@400;700&display=swap');
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
                    )}
                    <div className={`space-y-5 ${pageIndex === 0 ? 'mt-6' : ''}`}>
                        {pageSections.map(section => (
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

  const handleFontDropdownMouseDown = (e: React.MouseEvent) => {
    // This is the core fix. By preventing the default mousedown action,
    // we stop the contentEditable field from losing focus (blurring),
    // which preserves the user's text selection.
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

        // Use a robust method to apply styles via a <span> tag.
        // This avoids deprecated <font> tags and issues with surroundContents.
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
        
        // After modifying the DOM, read the new innerHTML and update the state.
        if (fieldKey) {
            handleContentChange(fieldKey, (editableElement as HTMLElement).innerHTML);
        }

    } else {
        // If there's no selection, update the global formatting state.
        setFormatting(prev => ({ ...prev, [property]: value }));
    }
  };
  
  const handleContentChange = useCallback((
    field: string,
    value: string
  ) => {
      setResumeData(prev => {
          if (field.startsWith('section.title.')) {
              const sectionId = field.split('.')[2];
              return {
                  ...prev,
                  sections: prev.sections.map(s => s.id === sectionId ? {...s, title: value} : s)
              };
          }
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
                    // FIX: Cast block to HTMLElement to access the style property.
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
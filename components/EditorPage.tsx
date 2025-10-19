import React, { useState, useCallback, useEffect, useRef, useLayoutEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import { ResumeData, SidebarTab, ResumeSection, Aisuggestions, TemplateName } from '../types';
import { DEFAULT_RESUME_DATA, ALL_SECTIONS, SECTION_PLACEHOLDERS, PROFESSIONAL_CLASSIC_TEMPLATE, EXECUTIVE_CLASSIC_TEMPLATE, CREATIVE_MODERN_TEMPLATE, CREATIVE_PHOTO_TEMPLATE, PROFESSIONAL_PHOTO_TEMPLATE, MANJARI_SINGH_TEMPLATE, OLIVIA_LINGTON_TEMPLATE, ALEX_BRAHAR_TEMPLATE, DIYA_PATEL_TEMPLATE, CLAUDIA_ALVES_TEMPLATE, BECKY_LU_TEMPLATE, EXECUTIVE_PROFESSIONAL_TEMPLATE, MODERN_PHOTO_TEMPLATE, CHRONOLOGICAL_CLEAN_TEMPLATE, CREATIVE_ORGANIC_TEMPLATE, TECH_SIDEBAR_TEMPLATE, SAGE_TIMELINE_TEMPLATE, MINIMALIST_SPLIT_TEMPLATE, MODERN_MINIMALIST_TEMPLATE, SOFTWARE_ENGINEER_PRO_TEMPLATE, PASTEL_PANELS_TEMPLATE } from '../constants';
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

const TechSidebarPreview = () => (
    <div className="aspect-[3/4] bg-white rounded-md flex p-0 border border-slate-300">
        <div className="w-1/3 bg-[#2c3e50] p-1 space-y-2">
            <div className="h-1 w-full bg-white rounded-sm"></div>
            <div className="h-0.5 w-3/4 bg-slate-300 rounded-sm"></div>
            <div className="h-1 w-full bg-white rounded-sm mt-2"></div>
            <div className="h-0.5 w-3/4 bg-slate-300 rounded-sm"></div>
        </div>
        <div className="w-2/3 p-2 space-y-2">
            <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-slate-300"></div>
                 <div>
                    <div className="h-1.5 w-20 bg-slate-800 rounded-sm"></div>
                    <div className="h-1 w-16 bg-slate-600 rounded-sm mt-1"></div>
                 </div>
            </div>
            <div className="h-1 w-1/4 bg-slate-800 rounded-sm mt-2"></div>
            <div className="h-0.5 w-full bg-slate-400 rounded-sm"></div>
        </div>
    </div>
);

const SageTimelinePreview = () => (
    <div className="aspect-[3/4] bg-white rounded-md flex flex-col p-2 border border-slate-300 relative overflow-hidden">
        <div className="h-1.5 w-1/2 bg-slate-800 rounded-sm"></div>
        <div className="h-0.5 w-full bg-slate-400 rounded-sm mt-2"></div>
        <div className="w-full h-4 bg-[#698474] rounded-sm my-2"></div>
        <div className="flex-1 flex gap-2">
            <div className="w-1/2 relative space-y-2">
                <div className="absolute left-0 top-0 h-full w-px bg-slate-400"></div>
                <div className="h-1 w-1/2 bg-slate-800 rounded-sm"></div>
                <div className="h-0.5 w-3/4 bg-slate-400 rounded-sm ml-2"></div>
            </div>
             <div className="w-1/2 relative space-y-2">
                <div className="absolute left-0 top-0 h-full w-px bg-slate-400"></div>
                 <div className="h-1 w-1/2 bg-slate-800 rounded-sm"></div>
                <div className="h-0.5 w-3/4 bg-slate-400 rounded-sm ml-2"></div>
            </div>
        </div>
        <div className="absolute right-2 top-2 w-1/3 h-1/4 bg-slate-300 rounded-md"></div>
    </div>
);

const MinimalistSplitPreview = () => (
    <div className="aspect-[3/4] bg-white rounded-md flex p-2 border border-slate-300 gap-2">
        <div className="w-2/3 space-y-2">
            <div className="h-1.5 w-2/3 bg-slate-800 rounded-sm"></div>
            <div className="h-1 w-1/3 bg-slate-600 rounded-sm mt-1"></div>
            <div className="h-px bg-slate-300 my-1"></div>
            <div className="h-1 w-1/4 bg-slate-800 rounded-sm"></div>
            <div className="h-0.5 w-full bg-slate-400 rounded-sm"></div>
        </div>
        <div className="w-1/3 space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-300 self-end ml-auto"></div>
            <div className="h-1 w-full bg-slate-800 rounded-sm mt-2"></div>
            <div className="h-0.5 w-3/4 bg-slate-400 rounded-sm"></div>
        </div>
    </div>
);

const ModernMinimalistPreview = () => (
    <div className="aspect-[3/4] bg-white rounded-md flex flex-col p-2 border border-slate-300">
        <div className="flex justify-between">
            <div>
                <div className="h-1.5 w-20 bg-slate-800 rounded-sm"></div>
                <div className="h-1 w-16 bg-blue-500 rounded-sm mt-1"></div>
            </div>
            <div className="text-right">
                <div className="h-0.5 w-12 bg-slate-400 rounded-sm ml-auto"></div>
                <div className="h-0.5 w-16 bg-slate-400 rounded-sm mt-1 ml-auto"></div>
            </div>
        </div>
        <div className="h-px bg-slate-300 my-2"></div>
        <div className="flex-1 flex gap-2">
            <div className="w-1/2 space-y-2">
                 <div className="h-1 w-1/2 bg-slate-800 rounded-sm"></div>
                 <div className="h-0.5 w-full bg-slate-400 rounded-sm"></div>
            </div>
            <div className="w-1/2 space-y-2">
                 <div className="h-1 w-1/2 bg-slate-800 rounded-sm"></div>
                 <div className="h-0.5 w-full bg-slate-400 rounded-sm"></div>
            </div>
        </div>
    </div>
);

const SoftwareEngineerProPreview = () => (
    <div className="aspect-[3/4] bg-white rounded-md flex p-2 border border-slate-300 gap-2">
        <div className="w-2/3 space-y-2">
            <div className="h-2 w-3/4 bg-slate-800 rounded-sm"></div>
            <div className="h-1 w-1/2 bg-slate-600 rounded-sm mt-1"></div>
            <div className="h-px bg-slate-300 my-1"></div>
            <div className="h-1 w-1/4 bg-slate-800 rounded-sm"></div>
            <div className="h-0.5 w-full bg-slate-400 rounded-sm"></div>
        </div>
        <div className="w-1/3 space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-300 ml-auto"></div>
            <div className="h-1 w-full bg-slate-800 rounded-sm mt-2"></div>
            <div className="h-0.5 w-3/4 bg-slate-400 rounded-sm"></div>
        </div>
    </div>
);

const PastelPanelsPreview = () => (
    <div className="aspect-[3/4] bg-white rounded-md flex flex-col p-2 border border-slate-300 gap-2">
        <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-md bg-slate-300"></div>
            <div className="h-1.5 w-1/3 bg-slate-800 rounded-sm mt-1"></div>
            <div className="h-1 w-1/4 bg-slate-600 rounded-sm mt-1"></div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-2 mt-2">
            <div className="flex gap-1">
                <div className="w-1 h-full bg-[#C8A2C8] rounded-sm"></div>
                <div className="flex-1 space-y-1">
                    <div className="h-0.5 w-full bg-slate-400 rounded-sm"></div>
                </div>
            </div>
             <div className="flex gap-1">
                <div className="w-1 h-full bg-[#D8BFD8] rounded-sm"></div>
                <div className="flex-1 space-y-1">
                    <div className="h-0.5 w-full bg-slate-400 rounded-sm"></div>
                </div>
            </div>
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
  { id: 'Tech Sidebar', name: 'Tech Sidebar', component: <TechSidebarPreview /> },
  { id: 'Sage Timeline', name: 'Sage Timeline', component: <SageTimelinePreview /> },
  { id: 'Minimalist Split', name: 'Minimalist Split', component: <MinimalistSplitPreview /> },
  { id: 'Modern Minimalist', name: 'Modern Minimalist', component: <ModernMinimalistPreview /> },
  { id: 'Software Engineer Pro', name: 'Software Engineer Pro', component: <SoftwareEngineerProPreview /> },
  { id: 'Pastel Panels', name: 'Pastel Panels', component: <PastelPanelsPreview /> },
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
                <h3 className="font-semibold text-slate-800">Templates</h3>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    {templates.map(template => (
                        <div key={template.id} className="cursor-pointer group" onClick={() => onTemplateSelect(template.id)}>
                            <div className="transition-transform group-hover:scale-105">
                                {template.component}
                            </div>
                            <p className="text-xs text-center mt-2 text-slate-600 group-hover:text-blue-600">{template.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
        {activeTab === 'Formatting' && (
            <div className="space-y-6">
                <div>
                    <h3 className="font-semibold text-slate-800 mb-3">Text Formatting</h3>
                    <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-md">
                         <button onClick={() => onApplyFormat('bold')} className="p-2 rounded hover:bg-slate-200" title="Bold"><Icons.BoldIcon className="w-4 h-4" /></button>
                        <button onClick={() => onApplyFormat('italic')} className="p-2 rounded hover:bg-slate-200" title="Italic"><Icons.ItalicIcon className="w-4 h-4" /></button>
                        <button onClick={() => onApplyFormat('underline')} className="p-2 rounded hover:bg-slate-200" title="Underline"><Icons.UnderlineIcon className="w-4 h-4" /></button>
                        <div className="w-px bg-slate-300 mx-1"></div>
                        <button onClick={() => onApplyFormat('justifyLeft')} className="p-2 rounded hover:bg-slate-200" title="Align Left"><Icons.AlignLeftIcon className="w-4 h-4" /></button>
                        <button onClick={() => onApplyFormat('justifyCenter')} className="p-2 rounded hover:bg-slate-200" title="Align Center"><Icons.AlignCenterIcon className="w-4 h-4" /></button>
                        <button onClick={() => onApplyFormat('justifyRight')} className="p-2 rounded hover:bg-slate-200" title="Align Right"><Icons.AlignRightIcon className="w-4 h-4" /></button>
                         <div className="w-px bg-slate-300 mx-1"></div>
                        <div ref={listOptionsRef} className="relative">
                            <button onClick={handleUnorderedListClick} className="p-2 rounded hover:bg-slate-200" title="Bulleted List"><Icons.ListIcon className="w-4 h-4" /></button>
                            {showUnorderedListOptions && (
                                <div className="absolute z-10 bg-white shadow-lg rounded-md p-1 mt-1 left-0">
                                    <button onClick={() => handleUnorderedListFormat('disc')} className="block w-full text-left px-2 py-1 hover:bg-slate-100">●</button>
                                    <button onClick={() => handleUnorderedListFormat('circle')} className="block w-full text-left px-2 py-1 hover:bg-slate-100">○</button>
                                    <button onClick={() => handleUnorderedListFormat('square')} className="block w-full text-left px-2 py-1 hover:bg-slate-100">■</button>
                                </div>
                            )}
                        </div>
                        <div ref={listOptionsRef} className="relative">
                           <button onClick={handleOrderedListClick} className="p-2 rounded hover:bg-slate-200" title="Numbered List"><Icons.ListOrderedIcon className="w-4 h-4" /></button>
                            {showOrderedListOptions && (
                                <div className="absolute z-10 bg-white shadow-lg rounded-md p-1 mt-1 left-0">
                                    <button onClick={() => handleOrderedListFormat('decimal')} className="block w-full text-left px-2 py-1 hover:bg-slate-100">1, 2, 3</button>
                                    <button onClick={() => handleOrderedListFormat('lower-alpha')} className="block w-full text-left px-2 py-1 hover:bg-slate-100">a, b, c</button>
                                    <button onClick={() => handleOrderedListFormat('lower-roman')} className="block w-full text-left px-2 py-1 hover:bg-slate-100">i, ii, iii</button>
                                </div>
                            )}
                        </div>
                        <button onClick={() => onApplyFormat('outdent')} className="p-2 rounded hover:bg-slate-200" title="Outdent"><Icons.OutdentIcon className="w-4 h-4" /></button>
                        <button onClick={() => onApplyFormat('indent')} className="p-2 rounded hover:bg-slate-200" title="Indent"><Icons.IndentIcon className="w-4 h-4" /></button>
                        <div className="w-px bg-slate-300 mx-1"></div>
                        <div ref={colorPickerRef} className="relative">
                            <button onClick={() => setShowColorPicker(prev => !prev)} className="p-2 rounded hover:bg-slate-200" title="Text Color">
                                <Icons.TextColorIcon className="w-4 h-4" />
                            </button>
                            {showColorPicker && (
                                <div className="absolute z-20 bg-white shadow-lg rounded-md p-2 mt-1 -left-20" onMouseDown={e => e.stopPropagation()}>
                                    <div className="font-semibold text-xs mb-1">Text Color</div>
                                    <div className="grid grid-cols-9 gap-1 mb-2">
                                        {Object.values(colorPalette).flat().map(color => (
                                            <button key={color} onClick={() => handleColorApply('foreColor', color)} style={{ backgroundColor: color }} className="w-5 h-5 rounded-sm border border-slate-200"></button>
                                        ))}
                                    </div>
                                     <div className="font-semibold text-xs mb-1">Highlight Color</div>
                                    <div className="grid grid-cols-9 gap-1">
                                        {Object.values(colorPalette).flat().map(color => (
                                            <button key={color} onClick={() => handleColorApply('backColor', color)} style={{ backgroundColor: color }} className="w-5 h-5 rounded-sm border border-slate-200"></button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <button onClick={() => onApplyFormat('removeFormat')} className="p-2 rounded hover:bg-slate-200" title="Clear Formatting"><Icons.EraserIcon className="w-4 h-4" /></button>
                        <button onClick={() => onApplyFormat('createLink', window.prompt("Enter URL:"))} className="p-2 rounded hover:bg-slate-200" title="Insert Link"><Icons.LinkIcon className="w-4 h-4" /></button>
                        <div ref={iconPickerRef} className="relative">
                            <button onClick={() => setShowIconPicker(prev => !prev)} className="p-2 rounded hover:bg-slate-200" title="Insert Icon"><Icons.SmileIcon className="w-4 h-4" /></button>
                             {showIconPicker && (
                                <div className="absolute z-20 bg-white shadow-lg rounded-md p-2 mt-1 -left-32 w-64 h-64 overflow-y-auto" onMouseDown={e => e.stopPropagation()}>
                                    <div className="grid grid-cols-6 gap-1">
                                        {iconList.map(iconName => {
                                            const IconComponent = Icons[Object.keys(Icons).find(key => key.toLowerCase().startsWith(iconName.replace(/-/g, ''))) as keyof typeof Icons];
                                            return IconComponent ? (
                                                <button key={iconName} onClick={() => handleIconInsert(iconName)} className="p-2 rounded hover:bg-slate-200 flex justify-center items-center" title={iconName}>
                                                    <IconComponent className="w-5 h-5" />
                                                </button>
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold text-slate-800 mb-3">Font Style</h3>
                    <div ref={fontOptionsRef} className="flex gap-2">
                        <div className="relative w-2/3">
                            <button onMouseDown={onFontDropdownMouseDown} onClick={() => setShowFontStyleOptions(p => !p)} className="w-full bg-slate-100 p-2 rounded-md text-left flex justify-between items-center">
                                <span className="truncate">{formatting.fontStyle}</span>
                                <Icons.ChevronDownIcon className="w-4 h-4" />
                            </button>
                            {showFontStyleOptions && (
                                <div className="absolute z-10 bg-white shadow-lg rounded-md p-1 mt-1 w-full max-h-60 overflow-y-auto">
                                    {fontStyles.map(font => (
                                        <button key={font} onMouseDown={onFontDropdownMouseDown} onClick={() => { onFontPropertyChange('fontStyle', font); setShowFontStyleOptions(false); }} className="block w-full text-left px-2 py-1 hover:bg-slate-100" style={{fontFamily: font}}>{font}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="relative w-1/3">
                            <button onMouseDown={onFontDropdownMouseDown} onClick={() => setShowFontSizeOptions(p => !p)} className="w-full bg-slate-100 p-2 rounded-md text-left flex justify-between items-center">
                                <span className="truncate">{formatting.fontSize}</span>
                                <Icons.ChevronDownIcon className="w-4 h-4" />
                            </button>
                             {showFontSizeOptions && (
                                <div className="absolute z-10 bg-white shadow-lg rounded-md p-1 mt-1 w-full max-h-60 overflow-y-auto">
                                    {fontSizes.map(size => (
                                        <button key={size} onMouseDown={onFontDropdownMouseDown} onClick={() => { onFontPropertyChange('fontSize', size); setShowFontSizeOptions(false); }} className="block w-full text-left px-2 py-1 hover:bg-slate-100">{size}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="accent-color" className="font-semibold text-slate-800">Accent Color</label>
                    <input id="accent-color" type="color" value={formatting.accentColor} onChange={e => onFormattingChange('accentColor', e.target.value)} className="w-full h-10 mt-2 p-1 border border-slate-300 rounded-md" />
                </div>
                 <div>
                    <label htmlFor="line-spacing" className="font-semibold text-slate-800">Line Spacing: {formatting.lineSpacing}</label>
                    <input id="line-spacing" type="range" min="1" max="2" step="0.1" value={formatting.lineSpacing} onChange={e => onFormattingChange('lineSpacing', parseFloat(e.target.value))} className="w-full mt-2" />
                </div>
                 <div>
                    <label htmlFor="side-margins" className="font-semibold text-slate-800">Side Margins (mm): {formatting.sideMargins}</label>
                    <input id="side-margins" type="range" min="10" max="40" step="1" value={formatting.sideMargins} onChange={e => onFormattingChange('sideMargins', parseInt(e.target.value, 10))} className="w-full mt-2" />
                </div>
            </div>
        )}
        {activeTab === 'Sections' && (
            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Manage Sections</h3>
                    <div className="space-y-2">
                        {resumeData.sections.map((section, index) => (
                           <div 
                                key={section.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, index)}
                                onDragEnd={handleDragEnd}
                                className={`p-3 bg-slate-50 border border-slate-200 rounded-md flex justify-between items-center cursor-move ${draggedIndex === index ? 'opacity-50' : ''}`}
                           >
                                <span className="font-medium text-slate-700">{section.title}</span>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => duplicateSection(section.id)} className="p-1 text-slate-400 hover:text-blue-600" title="Duplicate"><Icons.CopyIcon className="w-4 h-4" /></button>
                                    <button onClick={() => removeSection(section.id)} className="p-1 text-slate-400 hover:text-red-600" title="Remove"><Icons.Trash2Icon className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Add Section</h3>
                     <div className="flex flex-wrap gap-2">
                        {ALL_SECTIONS.filter(title => !resumeData.sections.some(s => s.title.toLowerCase() === title.toLowerCase() && title !== 'Custom Section')).map(title => (
                            <button key={title} onClick={() => addSection(title)} className="bg-slate-100 text-slate-700 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-slate-200 flex items-center gap-1">
                                <Icons.PlusIcon className="w-4 h-4" /> {title}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}
        {activeTab === 'AI Copilot' && (
           <div>
                <h3 className="font-semibold text-slate-800 mb-4">AI Copilot</h3>
                <div className="space-y-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-slate-700">ATS Score & Suggestions</h4>
                            <button onClick={() => handleAiAction('ats')} disabled={isAiLoading} className="bg-blue-600 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                                {isAiLoading && aiSuggestions.atsScore === -1 ? 'Analyzing...' : 'Analyze'}
                            </button>
                        </div>
                        {aiSuggestions.atsScore > 0 && (
                            <div className="mt-4">
                                <div className="text-center">
                                    <div className="inline-block relative">
                                        <span className="text-3xl font-bold text-blue-600">{aiSuggestions.atsScore}</span>
                                        <span className="text-slate-500">/100</span>
                                    </div>
                                </div>
                                <div className="text-sm text-slate-600 mt-2 space-y-1" dangerouslySetInnerHTML={{ __html: aiSuggestions.suggestions.replace(/\n/g, '<br/>') }} />
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-slate-700">Enhance Bullet Point</h4>
                             <button onClick={() => handleAiAction('enhance')} disabled={isAiLoading} className="bg-green-600 text-white px-3 py-1 text-sm rounded-md hover:bg-green-700 disabled:bg-green-300">
                                {isAiLoading && aiSuggestions.enhancedText === '...' ? 'Enhancing...' : 'Enhance'}
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Select a line in your resume and click enhance.</p>
                        {aiSuggestions.enhancedText && aiSuggestions.enhancedText !== '...' && (
                           <p className="text-sm text-slate-800 mt-2 p-2 bg-green-100 rounded-md">{aiSuggestions.enhancedText}</p>
                        )}
                    </div>
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-slate-700">Justify Employment Gaps</h4>
                             <button onClick={() => handleAiAction('gap')} disabled={isAiLoading} className="bg-purple-600 text-white px-3 py-1 text-sm rounded-md hover:bg-purple-700 disabled:bg-purple-300">
                                {isAiLoading && aiSuggestions.gapJustification === '...' ? 'Generating...' : 'Generate'}
                            </button>
                        </div>
                         {aiSuggestions.gapJustification && aiSuggestions.gapJustification !== '...' && (
                            <div className="text-sm text-slate-600 mt-2 space-y-1" dangerouslySetInnerHTML={{ __html: aiSuggestions.gapJustification.replace(/\n/g, '<br/>') }} />
                        )}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};


const ResumePreview: React.FC<{
  resumeData: ResumeData;
  formatting: FormattingOptions;
  activeSectionId: string | null;
  onSectionClick: (sectionId: string) => void;
  onContentChange: (sectionId: string, content: string) => void;
  onNameChange: (name: string) => void;
  onTitleChange: (title: string) => void;
  onContactChange: (field: string, value: string) => void;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editorRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
}> = ({ 
    resumeData, formatting, activeSectionId, onSectionClick, onContentChange, onNameChange, onTitleChange, onContactChange, onPhotoChange, editorRefs
}) => {
    const { accentColor, textAlign, lineSpacing, sideMargins, fontStyle, fontSize } = formatting;

    const dynamicStyles = `
        #resume-paper {
            text-align: ${textAlign};
            line-height: ${lineSpacing};
            font-family: "${fontStyle}", sans-serif;
            font-size: ${fontSize}pt;
        }
        #resume-paper h1, #resume-paper h2, #resume-paper h3, #resume-paper h4 {
            color: ${accentColor};
        }
        .job-entry { margin-bottom: 1em; }
        .job-header { display: flex; justify-content: space-between; margin-bottom: 0.25em; }
        .expertise-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .expertise-item { border: 2px solid ${accentColor}; color: ${accentColor}; text-align: center; padding: 20px; border-radius: 50%; aspect-ratio: 1 / 1; display: flex; align-items: center; justify-content: center; }
        .skill-grid { display: grid; grid-template-columns: 100px 1fr; gap: 5px 10px; align-items: center;}
        .skill-bar-wrapper { background-color: #e0e0e0; border-radius: 5px; height: 8px; }
        .skill-bar { background-color: ${accentColor}; height: 100%; border-radius: 5px; }
        .skill-grid-photo { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: center;}
        .skill-grid-photo > div > span { font-size: 2em; font-weight: bold; color: ${accentColor}; }
        .timeline-entry { display: flex; gap: 15px; align-items: baseline; margin-bottom: 5px; }
        .timeline-year { font-weight: bold; color: ${accentColor}; }
        .software-grid > div, .software-grid-dark > div { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
        .software-grid { display: flex; gap: 10px; }
        .software-grid > div { background-color: #f0f0f0; color: #333; }
        .software-grid-dark { display: flex; gap: 10px; }
        .software-grid-dark > div { background-color: #333; color: white; }
        .pill-grid { display: flex; flex-wrap: wrap; gap: 5px; }
        .skill-pill { background-color: #e0e0e0; color: #333; padding: 2px 8px; border-radius: 10px; font-size: 0.9em; }
        .skill-pill-outline { border: 1px solid ${accentColor}; color: ${accentColor}; padding: 2px 8px; border-radius: 10px; font-size: 0.9em; }
        .experience-grid-3col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; }
        .certificate-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .references-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .timeline-entry-vertical { display: flex; gap: 20px; margin-bottom: 1em; }
        .timeline-year-vertical { flex-shrink: 0; width: 100px; color: ${accentColor}; font-weight: bold; }
        .boxed-section { border: 1px solid #ccc; padding: 10px; margin-bottom: 1em; }
        .language-dots { display: flex; justify-content: space-between; align-items: center; }
        .language-dots > div { display: flex; gap: 4px; }
        .language-dots > div > span { display: block; width: 12px; height: 12px; background-color: ${accentColor}; border-radius: 50%; }
        .language-dots > div > span.empty { background-color: #e0e0e0; }
        .interest-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; text-align: center; }
        .skill-bar-grid-alt { display: grid; grid-template-columns: 100px 1fr; gap: 5px 10px; align-items: center; }
        .sage-timeline-wrapper { border-left: 2px solid ${accentColor}; padding-left: 15px; }
        .timeline-entry-vertical-alt { position: relative; margin-bottom: 15px; }
        .timeline-entry-vertical-alt::before { content: ''; position: absolute; left: -22.5px; top: 5px; width: 10px; height: 10px; background-color: ${accentColor}; border-radius: 50%; border: 1px solid white; }
        .skill-dots-grid { display: grid; grid-template-columns: 100px 1fr; gap: 5px 10px; align-items: center; }
        .skill-dots-grid > div { display: flex; gap: 3px; }
        .skill-dots-grid > div > span { display: block; width: 10px; height: 10px; background-color: #333; border-radius: 50%; }
        .skill-dots-grid > div > span.empty { background-color: #ccc; }
    `;

    return (
        <div className="p-8 bg-slate-200 flex-1 overflow-y-auto">
            <style>{dynamicStyles}</style>
            <div id="resume-paper" className="w-[210mm] min-h-[297mm] bg-white shadow-lg mx-auto" style={{ padding: `${sideMargins}mm` }}>
                 {/* Default Template & simple structures */}
                {['YOUR NAME', 'DENISE ROBERTSON', 'Sanat Rath'].includes(resumeData.name) && (
                     <>
                        <div className="text-center" style={{ textAlign: resumeData.name === 'Sanat Rath' ? 'left' : 'center'}}>
                             {resumeData.name === 'Sanat Rath' && (
                                <div style={{ float: 'right', textAlign: 'right', fontSize: '0.9em' }}>
                                    <EditableDiv value={resumeData.contact.website} onChange={v => onContactChange('website', v)} tag="p" editorRefs={editorRefs} sectionId="contact-website" onClick={onSectionClick} activeSectionId={activeSectionId} />
                                    <EditableDiv value={resumeData.contact.email} onChange={v => onContactChange('email', v)} tag="p" editorRefs={editorRefs} sectionId="contact-email" onClick={onSectionClick} activeSectionId={activeSectionId} />
                                    <EditableDiv value={resumeData.contact.phone} onChange={v => onContactChange('phone', v)} tag="p" editorRefs={editorRefs} sectionId="contact-phone" onClick={onSectionClick} activeSectionId={activeSectionId} />
                                </div>
                             )}
                            <EditableDiv value={resumeData.name} onChange={onNameChange} tag="h1" editorRefs={editorRefs} sectionId="name" onClick={onSectionClick} activeSectionId={activeSectionId} style={{ fontWeight: 'bold', fontSize: '2.5em', color: resumeData.name === 'Sanat Rath' ? accentColor : 'inherit' }} />
                            <EditableDiv value={resumeData.title} onChange={onTitleChange} tag="p" editorRefs={editorRefs} sectionId="title" onClick={onSectionClick} activeSectionId={activeSectionId} style={{ fontSize: '1.2em', letterSpacing: '0.1em' }}/>
                            {resumeData.name !== 'Sanat Rath' && <div style={{height: '1px', backgroundColor: '#ccc', margin: '1em 0'}} />}
                        </div>
                        {resumeData.name === 'Sanat Rath' ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2em', marginTop: '2em' }}>
                                <div>
                                    {resumeData.sections.filter(s => ['experience'].includes(s.id)).map(section => (
                                        <div key={section.id} className="mb-4">
                                            <h2 style={{fontWeight: 'bold', borderBottom: '2px solid #ccc', paddingBottom: '0.25em', marginBottom: '0.5em'}}>{section.title}</h2>
                                            <EditableDiv value={section.content} onChange={c => onContentChange(section.id, c)} editorRefs={editorRefs} sectionId={section.id} onClick={onSectionClick} activeSectionId={activeSectionId} />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                     {resumeData.sections.filter(s => ['education', 'skills'].includes(s.id)).map(section => (
                                        <div key={section.id} className="mb-4">
                                            <h2 style={{fontWeight: 'bold', borderBottom: '2px solid #ccc', paddingBottom: '0.25em', marginBottom: '0.5em'}}>{section.title}</h2>
                                            <EditableDiv value={section.content} onChange={c => onContentChange(section.id, c)} editorRefs={editorRefs} sectionId={section.id} onClick={onSectionClick} activeSectionId={activeSectionId} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                             resumeData.sections.map(section => (
                                <div key={section.id} className="mb-4">
                                    <h2 style={{fontWeight: 'bold'}}>{section.title}</h2>
                                    <EditableDiv value={section.content} onChange={c => onContentChange(section.id, c)} editorRefs={editorRefs} sectionId={section.id} onClick={onSectionClick} activeSectionId={activeSectionId} />
                                </div>
                            ))
                        )}
                    </>
                )}

                 {/* Other templates */}
                 {resumeData.name === 'JAMES MARTINE' && (
                    <div className="flex gap-6">
                        <div style={{ width: '35%', backgroundColor: accentColor, color: 'white', padding: '20px', margin: '-25mm 0 -25mm -25mm' }}>
                            {resumeData.sections.filter(s => s.id.endsWith('_sidebar') || s.id === 'about_me').map(section => (
                                <div key={section.id} className="mb-4">
                                    <h2 style={{ color: 'white' }}>{section.title}</h2>
                                    <EditableDiv value={section.content} onChange={c => onContentChange(section.id, c)} editorRefs={editorRefs} sectionId={section.id} onClick={onSectionClick} activeSectionId={activeSectionId} />
                                </div>
                            ))}
                        </div>
                        <div style={{ width: '65%' }}>
                            <div className="flex items-center gap-4 mb-4">
                                {resumeData.photo && <img src={resumeData.photo} alt="profile" className="w-24 h-24 rounded-full object-cover" />}
                                <div>
                                    <EditableDiv value={resumeData.name} onChange={onNameChange} tag="h1" editorRefs={editorRefs} sectionId="name" onClick={onSectionClick} activeSectionId={activeSectionId} style={{ fontWeight: 'bold', fontSize: '2.5em' }} />
                                    <EditableDiv value={resumeData.title} onChange={onTitleChange} tag="p" editorRefs={editorRefs} sectionId="title" onClick={onSectionClick} activeSectionId={activeSectionId} style={{ fontSize: '1.2em', letterSpacing: '0.1em' }}/>
                                </div>
                            </div>
                            {resumeData.sections.filter(s => !s.id.endsWith('_sidebar') && s.id !== 'about_me').map(section => (
                                <div key={section.id} className="mb-4">
                                    <h2>{section.title}</h2>
                                    <EditableDiv value={section.content} onChange={c => onContentChange(section.id, c)} editorRefs={editorRefs} sectionId={section.id} onClick={onSectionClick} activeSectionId={activeSectionId} />
                                </div>
                            ))}
                        </div>
                    </div>
                 )}

                 {resumeData.name === 'Maria Souza' && (
                    <div className="relative">
                        <div className="grid grid-cols-3 gap-8">
                            <div className="col-span-2">
                                <EditableDiv value={resumeData.name} onChange={onNameChange} tag="h1" editorRefs={editorRefs} sectionId="name" onClick={onSectionClick} activeSectionId={activeSectionId} style={{ fontWeight: 'bold', fontSize: '2.5em', color: accentColor }} />
                                <EditableDiv value={resumeData.title} onChange={onTitleChange} tag="p" editorRefs={editorRefs} sectionId="title" onClick={onSectionClick} activeSectionId={activeSectionId} style={{ fontSize: '1.5em' }}/>
                                {resumeData.sections.filter(s => s.id === 'summary').map(s => <EditableDiv key={s.id} value={s.content} onChange={c => onContentChange(s.id, c)} editorRefs={editorRefs} sectionId={s.id} onClick={onSectionClick} activeSectionId={activeSectionId} />)}
                            </div>
                            <div className="relative">
                                {resumeData.photo && <img src={resumeData.photo} alt="profile" className="w-full object-cover" style={{height: '200px'}} />}
                            </div>
                        </div>
                        <div style={{ backgroundColor: accentColor, color: 'white', padding: '20px', marginTop: '-50px', position: 'relative', zIndex: 10 }}>
                             {resumeData.sections.filter(s => s.id === 'contact_block').map(s => <EditableDiv key={s.id} value={s.content} onChange={c => onContentChange(s.id, c)} editorRefs={editorRefs} sectionId={s.id} onClick={onSectionClick} activeSectionId={activeSectionId} />)}
                        </div>
                        <div className="grid grid-cols-2 gap-8 mt-8">
                            <div>
                                {resumeData.sections.filter(s => s.id === 'education').map(s => <div key={s.id}><h2 className="mb-2">{s.title}</h2><div className="sage-timeline-wrapper"><EditableDiv value={s.content} onChange={c => onContentChange(s.id, c)} editorRefs={editorRefs} sectionId={s.id} onClick={onSectionClick} activeSectionId={activeSectionId} /></div></div>)}
                                {resumeData.sections.filter(s => s.id === 'skills').map(s => <div key={s.id} className="mt-4"><h2 className="mb-2">{s.title}</h2><EditableDiv value={s.content} onChange={c => onContentChange(s.id, c)} editorRefs={editorRefs} sectionId={s.id} onClick={onSectionClick} activeSectionId={activeSectionId} /></div>)}
                            </div>
                             <div>
                                {resumeData.sections.filter(s => s.id === 'experience').map(s => <div key={s.id}><h2 className="mb-2">{s.title}</h2><div className="sage-timeline-wrapper"><EditableDiv value={s.content} onChange={c => onContentChange(s.id, c)} editorRefs={editorRefs} sectionId={s.id} onClick={onSectionClick} activeSectionId={activeSectionId} /></div></div>)}
                                {resumeData.sections.filter(s => s.id === 'social').map(s => <div key={s.id} className="mt-4"><h2 className="mb-2">{s.title}</h2><EditableDiv value={s.content} onChange={c => onContentChange(s.id, c)} editorRefs={editorRefs} sectionId={s.id} onClick={onSectionClick} activeSectionId={activeSectionId} /></div>)}
                            </div>
                        </div>
                    </div>
                 )}

                {resumeData.name === 'MALIN FRANSISKA' && (
                    <div className="flex gap-8">
                        <div style={{ width: '65%' }}>
                             <EditableDiv value={resumeData.name} onChange={onNameChange} tag="h1" editorRefs={editorRefs} sectionId="name" onClick={onSectionClick} activeSectionId={activeSectionId} style={{ fontWeight: 'bold', fontSize: '2.5em' }} />
                             <EditableDiv value={resumeData.title} onChange={onTitleChange} tag="p" editorRefs={editorRefs} sectionId="title" onClick={onSectionClick} activeSectionId={activeSectionId} style={{ fontSize: '1.2em' }}/>
                             <div className="my-4">{resumeData.sections.filter(s => s.id === 'summary').map(s => <EditableDiv key={s.id} value={s.content} onChange={c => onContentChange(s.id, c)} editorRefs={editorRefs} sectionId={s.id} onClick={onSectionClick} activeSectionId={activeSectionId} />)}</div>
                             {resumeData.sections.filter(s => ['experience', 'references_main'].includes(s.id)).map(s => <div key={s.id} className="mb-4"><h2 className="mb-2">{s.title}</h2><EditableDiv value={s.content} onChange={c => onContentChange(s.id, c)} editorRefs={editorRefs} sectionId={s.id} onClick={onSectionClick} activeSectionId={activeSectionId} /></div>)}
                        </div>
                        <div style={{ width: '35%', borderLeft: '1px solid #ccc', paddingLeft: '2rem' }}>
                            {resumeData.photo && <img src={resumeData.photo} alt="profile" className="w-24 h-24 rounded-full object-cover mb-4" />}
                            {resumeData.sections.filter(s => s.id.endsWith('_right')).map(s => <div key={s.id} className="mb-4"><h2 className="mb-2">{s.title}</h2><EditableDiv value={s.content} onChange={c => onContentChange(s.id, c)} editorRefs={editorRefs} sectionId={s.id} onClick={onSectionClick} activeSectionId={activeSectionId} /></div>)}
                        </div>
                    </div>
                )}
                 
                {resumeData.name === 'ALEXANDER WILLIAM SMITH' && (
                     <div className="flex gap-8">
                        <div style={{ width: '65%' }}>
                            <EditableDiv value={resumeData.name} onChange={onNameChange} tag="h1" editorRefs={editorRefs} sectionId="name" onClick={onSectionClick} activeSectionId={activeSectionId} style={{ fontWeight: 'bold', fontSize: '2.5em' }} />
                            <EditableDiv value={resumeData.title} onChange={onTitleChange} tag="p" editorRefs={editorRefs} sectionId="title" onClick={onSectionClick} activeSectionId={activeSectionId} style={{ fontSize: '1.2em', borderBottom: '2px solid black', paddingBottom: '0.5rem', marginBottom: '1rem' }}/>
                            {resumeData.sections.filter(s => ['summary', 'experience', 'projects'].includes(s.id)).map(s => <div key={s.id} className="mb-4"><h2 className="mb-2">{s.title}</h2><EditableDiv value={s.content} onChange={c => onContentChange(s.id, c)} editorRefs={editorRefs} sectionId={s.id} onClick={onSectionClick} activeSectionId={activeSectionId} /></div>)}
                        </div>
                        <div style={{ width: '35%', paddingTop: '1rem' }}>
                            <div className="flex justify-end mb-4">{resumeData.photo && <img src={resumeData.photo} alt="profile" className="w-24 h-24 rounded-full object-cover" />}</div>
                            <div style={{ textAlign: 'right' }}>
                                <EditableDiv value={resumeData.contact.phone} onChange={v => onContactChange('phone', v)} tag="p" editorRefs={editorRefs} sectionId="contact-phone" onClick={onSectionClick} activeSectionId={activeSectionId} />
                                <EditableDiv value={resumeData.contact.email} onChange={v => onContactChange('email', v)} tag="p" editorRefs={editorRefs} sectionId="contact-email" onClick={onSectionClick} activeSectionId={activeSectionId} />
                                <EditableDiv value={resumeData.contact.website} onChange={v => onContactChange('website', v)} tag="p" editorRefs={editorRefs} sectionId="contact-website" onClick={onSectionClick} activeSectionId={activeSectionId} />
                                <EditableDiv value={resumeData.contact.address} onChange={v => onContactChange('address', v)} tag="p" editorRefs={editorRefs} sectionId="contact-address" onClick={onSectionClick} activeSectionId={activeSectionId} />
                            </div>
                            <div style={{height: '1px', backgroundColor: '#ccc', margin: '1em 0'}} />
                            {resumeData.sections.filter(s => s.id.endsWith('_right')).map(s => <div key={s.id} className="mb-4"><h2 className="mb-2">{s.title}</h2><EditableDiv value={s.content} onChange={c => onContentChange(s.id, c)} editorRefs={editorRefs} sectionId={s.id} onClick={onSectionClick} activeSectionId={activeSectionId} /></div>)}
                        </div>
                    </div>
                )}

                {resumeData.name === 'Listia Prastiwie' && (
                    <div className="text-center">
                        {resumeData.photo && <img src={resumeData.photo} alt="profile" className="w-32 h-32 object-cover mb-4 mx-auto border-4 border-black p-1" />}
                        <EditableDiv value={resumeData.name} onChange={onNameChange} tag="h1" editorRefs={editorRefs} sectionId="name" onClick={onSectionClick} activeSectionId={activeSectionId} style={{ fontWeight: 'bold', fontSize: '2.5em' }} />
                        <EditableDiv value={resumeData.title} onChange={onTitleChange} tag="p" editorRefs={editorRefs} sectionId="title" onClick={onSectionClick} activeSectionId={activeSectionId} style={{ fontSize: '1.2em' }}/>
                        {resumeData.sections.filter(s => s.id === 'summary').map(s => <EditableDiv key={s.id} value={s.content} onChange={c => onContentChange(s.id, c)} editorRefs={editorRefs} sectionId={s.id} onClick={onSectionClick} activeSectionId={activeSectionId} />)}
                        
                        <div className="grid grid-cols-2 gap-4 mt-8">
                             {['contact', 'education', 'skills', 'experience', 'awards'].map(id => {
                                const section = resumeData.sections.find(s => s.id === id);
                                const otherSection = resumeData.sections.find(s => s.id === (id === 'contact' ? 'experience' : 'awards'));
                                if (!section) return null;
                                return (
                                    <div key={id} className="flex border border-slate-300">
                                        <h2 className="[writing-mode:vertical-rl] text-white p-2 text-center" style={{backgroundColor: id.length % 2 === 0 ? accentColor : '#e1add3'}}>{section.title}</h2>
                                        <div className="p-2 text-left flex-1"><EditableDiv value={section.content} onChange={c => onContentChange(section.id, c)} editorRefs={editorRefs} sectionId={section.id} onClick={onSectionClick} activeSectionId={activeSectionId} /></div>
                                    </div>
                                )
                             })}
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};

interface EditableDivProps {
    value: string;
    onChange: (value: string) => void;
    tag?: 'h1' | 'h2' | 'p' | 'div';
    editorRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
    sectionId: string;
    onClick: (sectionId: string) => void;
    activeSectionId: string | null;
    className?: string;
    style?: React.CSSProperties;
}

const EditableDiv: React.FC<EditableDivProps> = ({ value, onChange, tag = 'div', editorRefs, sectionId, onClick, activeSectionId, className, style }) => {
    const Tag = tag;

    const onInput = (e: React.FormEvent<HTMLDivElement>) => {
        onChange(e.currentTarget.innerHTML);
    };

    return (
        <Tag
            ref={el => (editorRefs.current[sectionId] = el)}
            contentEditable
            suppressContentEditableWarning
            onInput={onInput}
            onClick={() => onClick(sectionId)}
            dangerouslySetInnerHTML={{ __html: value }}
            className={`${className || ''} outline-none focus:outline-blue-300 focus:outline-2 rounded-sm p-1 -m-1`}
            style={style}
        />
    );
};


const initialFormattingOptions: FormattingOptions = {
    accentColor: '#0b5394',
    textAlign: 'left',
    lineSpacing: 1.5,
    sideMargins: 25,
    fontStyle: 'Helvetica',
    fontSize: 11,
};

const EditorPage: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
    const { state: resume, setState: setResume, undo, canUndo, replaceState } = useHistory<ResumeData>(DEFAULT_RESUME_DATA);
    const [activeTab, setActiveTab] = useState<SidebarTab>('Design');
    const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
    const editorRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const [formatting, setFormatting] = useState<FormattingOptions>(initialFormattingOptions);
     const [aiSuggestions, setAiSuggestions] = useState<Aisuggestions>({
        atsScore: 0,
        suggestions: '',
        enhancedText: '',
        gapJustification: ''
    });
    const [isAiLoading, setIsAiLoading] = useState(false);
    const selectionRef = useRef<Range | null>(null);

    useLayoutEffect(() => {
        if (selectionRef.current) {
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(selectionRef.current);
            selectionRef.current = null;
        }
    });

    const handleContentChange = (sectionId: string, content: string) => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            selectionRef.current = selection.getRangeAt(0).cloneRange();
        }
        replaceState({
            ...resume,
            sections: resume.sections.map(s => s.id === sectionId ? { ...s, content } : s)
        });
    };
    
    const handleSetContent = (sectionId: string, content: string) => {
         setResume(prev => ({
            ...prev,
            sections: prev.sections.map(s => s.id === sectionId ? { ...s, content } : s)
        }));
    };

    const handleNameChange = (name: string) => setResume(prev => ({ ...prev, name }));
    const handleTitleChange = (title: string) => setResume(prev => ({ ...prev, title }));
    const handleContactChange = (field: string, value: string) => {
        setResume(prev => ({
            ...prev,
            contact: { ...prev.contact, [field]: value }
        }));
    };
     const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setResume(prev => ({...prev, photo: event.target?.result as string}));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };


    const handleAiAction = async (action: 'ats' | 'enhance' | 'gap') => {
        setIsAiLoading(true);
        if (action === 'ats') {
            setAiSuggestions(prev => ({ ...prev, atsScore: -1 }));
            const result = await getAtsSuggestions(resume);
            setAiSuggestions(prev => ({ ...prev, atsScore: result.score, suggestions: result.suggestions }));
        } else if (action === 'enhance') {
            const selection = window.getSelection();
            if (selection && selection.toString().trim()) {
                setAiSuggestions(prev => ({ ...prev, enhancedText: '...' }));
                const enhanced = await enhanceText(selection.toString());
                setAiSuggestions(prev => ({ ...prev, enhancedText: enhanced }));
            } else {
                alert('Please select some text to enhance.');
            }
        } else if (action === 'gap') {
             setAiSuggestions(prev => ({ ...prev, gapJustification: '...' }));
            const justification = await getGapJustification();
            setAiSuggestions(prev => ({ ...prev, gapJustification: justification }));
        }
        setIsAiLoading(false);
    };

     const handleFormattingChange = (key: keyof FormattingOptions, value: any) => {
        setFormatting(prev => ({ ...prev, [key]: value }));
    };

    const handleFontPropertyChange = (property: 'fontStyle' | 'fontSize', value: string | number) => {
        handleFormattingChange(property, value);
    };
    
    const handleApplyFormat = (command: string, value?: string) => {
        if (!activeSectionId) return;

        const editor = editorRefs.current[activeSectionId];
        if (editor) {
            editor.focus();
            
            if (command === 'insertUnorderedList' || command === 'insertOrderedList') {
                document.execCommand('styleWithCSS', false, 'true');
                document.execCommand(command, false, undefined);
                const listElements = editor.querySelectorAll(command === 'insertUnorderedList' ? 'ul' : 'ol');
                listElements.forEach(list => {
                    list.style.listStyleType = value || (command === 'insertUnorderedList' ? 'disc' : 'decimal');
                });
                document.execCommand('styleWithCSS', false, 'false');
            } else if (command === 'createLink') {
                if (value) document.execCommand(command, false, value);
            }
            else {
                 document.execCommand(command, false, value);
            }

            handleContentChange(activeSectionId, editor.innerHTML);
        }
    };

    const onFontDropdownMouseDown = (e: React.MouseEvent) => {
        e.preventDefault(); 
        const editor = editorRefs.current[activeSectionId || ''];
        editor?.focus();
    };

    const handleTemplateSelect = (templateId: TemplateName) => {
        let template;
        switch (templateId) {
            case 'Professional Classic': template = PROFESSIONAL_CLASSIC_TEMPLATE; break;
            case 'Executive Classic': template = EXECUTIVE_CLASSIC_TEMPLATE; break;
            case 'Creative Modern': template = CREATIVE_MODERN_TEMPLATE; break;
            case 'Creative Photo': template = CREATIVE_PHOTO_TEMPLATE; break;
            case 'Professional Photo': template = PROFESSIONAL_PHOTO_TEMPLATE; break;
            case 'Manjari Singh': template = MANJARI_SINGH_TEMPLATE; break;
            case 'Olivia Lington': template = OLIVIA_LINGTON_TEMPLATE; break;
            case 'Alex Brahar': template = ALEX_BRAHAR_TEMPLATE; break;
            case 'Diya Patel': template = DIYA_PATEL_TEMPLATE; break;
            case 'Claudia Alves': template = CLAUDIA_ALVES_TEMPLATE; break;
            case 'Becky Lu': template = BECKY_LU_TEMPLATE; break;
            case 'Executive Professional': template = EXECUTIVE_PROFESSIONAL_TEMPLATE; break;
            case 'Modern Photo': template = MODERN_PHOTO_TEMPLATE; break;
            case 'Chronological Clean': template = CHRONOLOGICAL_CLEAN_TEMPLATE; break;
            case 'Creative Organic': template = CREATIVE_ORGANIC_TEMPLATE; break;
            case 'Tech Sidebar': template = TECH_SIDEBAR_TEMPLATE; break;
            case 'Sage Timeline': template = SAGE_TIMELINE_TEMPLATE; break;
            case 'Minimalist Split': template = MINIMALIST_SPLIT_TEMPLATE; break;
            case 'Modern Minimalist': template = MODERN_MINIMALIST_TEMPLATE; break;
            case 'Software Engineer Pro': template = SOFTWARE_ENGINEER_PRO_TEMPLATE; break;
            case 'Pastel Panels': template = PASTEL_PANELS_TEMPLATE; break;
            default:
                setResume(DEFAULT_RESUME_DATA);
                setFormatting({ ...initialFormattingOptions });
                return;
        }

        // Deep copy to avoid mutation issues
        const newResumeData = JSON.parse(JSON.stringify(template.data));
        const newFormatting = JSON.parse(JSON.stringify(template.formatting));
        
        setResume(newResumeData as ResumeData);
        setFormatting(newFormatting as FormattingOptions);
    };


    return (
        <div className="flex h-screen font-sans">
            <Sidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab}
                resumeData={resume}
                setResumeData={setResume}
                aiSuggestions={aiSuggestions}
                handleAiAction={handleAiAction}
                isAiLoading={isAiLoading}
                formatting={formatting}
                onFormattingChange={handleFormattingChange}
                onFontPropertyChange={handleFontPropertyChange}
                onApplyFormat={handleApplyFormat}
                onFontDropdownMouseDown={onFontDropdownMouseDown}
                onTemplateSelect={handleTemplateSelect}
            />
            <ResumePreview 
                resumeData={resume}
                formatting={formatting}
                activeSectionId={activeSectionId}
                onSectionClick={setActiveSectionId}
                onContentChange={handleSetContent}
                onNameChange={handleNameChange}
                onTitleChange={handleTitleChange}
                onContactChange={handleContactChange}
                onPhotoChange={handlePhotoChange}
                editorRefs={editorRefs}
            />
             <div className="w-20 bg-slate-100 border-l border-slate-200 flex flex-col items-center p-2 gap-2">
                 <button onClick={onBackToHome} className="w-full aspect-square flex flex-col items-center justify-center text-slate-600 hover:bg-slate-200 rounded-md" title="Home">
                    <Icons.HomeIcon className="w-6 h-6" />
                    <span className="text-xs">Home</span>
                 </button>
                 <button onClick={undo} disabled={!canUndo} className="w-full aspect-square flex flex-col items-center justify-center text-slate-600 hover:bg-slate-200 rounded-md disabled:opacity-50" title="Undo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M3 13a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l-3 2.7"/></svg>
                    <span className="text-xs">Undo</span>
                </button>
                 <button className="w-full aspect-square flex flex-col items-center justify-center text-slate-600 hover:bg-slate-200 rounded-md" title="Print">
                    <Icons.PrinterIcon className="w-6 h-6" />
                    <span className="text-xs">Print</span>
                </button>
            </div>
        </div>
    );
};

export default EditorPage;
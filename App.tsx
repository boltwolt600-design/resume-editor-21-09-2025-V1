
import React, { useState } from 'react';
import { UploadIcon, PlusCircleIcon, ShieldCheckIcon, TrendingUpIcon, TargetIcon, BrainCircuitIcon, CheckIcon, ArrowRightIcon } from './components/icons';
import EditorPage from './components/EditorPage';

type View = 'landing' | 'editor';

const LandingPage = ({ onStartCreating }: { onStartCreating: () => void }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      // Here you would process the file. For now, we'll just move to the editor.
      console.log('File selected:', event.target.files[0].name);
      onStartCreating();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 font-sans">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-slate-800">Smart Resume Studio</h1>
        <p className="text-xl text-slate-600 mt-4">Create professional resumes with AI-powered optimization</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Import Card */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200 flex flex-col items-center text-center">
          <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
            <UploadIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 mt-6">Import Existing Resume</h2>
          <p className="text-slate-500 mt-2 mb-6">Load your existing resume and enhance it with professional templates</p>
          <ul className="space-y-3 text-left text-slate-600 mb-8">
            <li className="flex items-center"><CheckIcon className="w-4 h-4 text-green-500 mr-2" /> Upload PDF, DOCX, DOC, or TXT</li>
            <li className="flex items-center"><CheckIcon className="w-4 h-4 text-green-500 mr-2" /> AI content extraction and formatting</li>
            <li className="flex items-center"><CheckIcon className="w-4 h-4 text-green-500 mr-2" /> Professional template application</li>
          </ul>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.docx,.doc,.txt" />
          <button onClick={handleImportClick} className="w-full mt-auto bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            Select Files <ArrowRightIcon />
          </button>
        </div>

        {/* Start from Scratch Card */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200 flex flex-col items-center text-center">
          <div className="bg-green-100 text-green-600 p-4 rounded-full">
            <PlusCircleIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 mt-6">Start from Scratch</h2>
          <p className="text-slate-500 mt-2 mb-6">Create a new resume from scratch with AI guidance and professional templates</p>
          <ul className="space-y-3 text-left text-slate-600 mb-8">
            <li className="flex items-center"><CheckIcon className="w-4 h-4 text-green-500 mr-2" /> AI-powered content suggestions</li>
            <li className="flex items-center"><CheckIcon className="w-4 h-4 text-green-500 mr-2" /> Step-by-step guidance</li>
            <li className="flex items-center"><CheckIcon className="w-4 h-4 text-green-500 mr-2" /> Professional formatting</li>
          </ul>
          <button onClick={onStartCreating} className="w-full mt-auto bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
            Create New Resume <ArrowRightIcon />
          </button>
        </div>
      </div>

      <div className="mt-20 text-center max-w-4xl w-full">
        <h3 className="text-3xl font-bold text-slate-800">What You'll Get with Smart Resume Studio</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          <FeatureCard icon={<ShieldCheckIcon className="w-7 h-7 text-blue-600"/>} title="ATS Optimization" description="Beat applicant tracking systems with AI-powered formatting" />
          <FeatureCard icon={<TrendingUpIcon className="w-7 h-7 text-green-600"/>} title="Impact Enhancement" description="Transform job duties into quantifiable achievements" />
          <FeatureCard icon={<TargetIcon className="w-7 h-7 text-orange-600"/>} title="Job Targeting" description="Create tailored resumes for specific opportunities" />
          <FeatureCard icon={<BrainCircuitIcon className="w-7 h-7 text-purple-600"/>} title="AI Copilot" description="Get intelligent suggestions and gap justification" />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 text-center">
    <div className="flex justify-center mb-4">{icon}</div>
    <h4 className="font-semibold text-slate-800">{title}</h4>
    <p className="text-sm text-slate-500 mt-1">{description}</p>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');

  const handleStartCreating = () => {
    setView('editor');
  };

  const handleBackToHome = () => {
    setView('landing');
  }

  return (
    <div>
      {view === 'landing' ? (
        <LandingPage onStartCreating={handleStartCreating} />
      ) : (
        <EditorPage onBackToHome={handleBackToHome} />
      )}
    </div>
  );
};

export default App;

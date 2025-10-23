import React, { useState, useCallback } from 'react';
import { Automation } from './types';
import { parseAutomationRequest } from './services/geminiService';
import AutomationInput from './components/AutomationInput';
import AutomationCanvas from './components/AutomationCanvas';

const App: React.FC = () => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateAutomation = useCallback(async (prompt: string) => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const newAutomation = await parseAutomationRequest(prompt);
      if (newAutomation) {
        setAutomations(prev => [...prev, newAutomation]);
      } else {
        setError("The AI could not understand the request. Please try phrasing it differently, for example: 'When a new email arrives from news@example.com, send a slack message to #general'.");
      }
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDeleteAutomation = (indexToDelete: number) => {
    setAutomations(prev => prev.filter((_, index) => index !== indexToDelete));
  };

  const handleUpdateAutomation = (indexToUpdate: number, updatedAutomation: Automation) => {
    setAutomations(prev => prev.map((auto, index) => (index === indexToUpdate ? updatedAutomation : auto)));
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
           <div className="flex justify-center items-center gap-4 mb-2">
             <img src="https://picsum.photos/50/50?grayscale" alt="logo" className="w-12 h-12 rounded-full" />
             <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">
                Workflow Automator
             </h1>
           </div>
           <p className="text-gray-400 text-lg max-w-2xl mx-auto">
             Describe a task in plain English, and watch AI build the automation for you.
           </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:pr-4">
             <AutomationInput onSubmit={handleCreateAutomation} isLoading={isLoading} />
          </div>
          <div className="lg:pl-4">
             <AutomationCanvas 
                automations={automations} 
                onDelete={handleDeleteAutomation}
                onUpdate={handleUpdateAutomation}
              />
          </div>
        </div>

        {error && (
            <div className="mt-8 p-4 bg-red-900/50 text-red-300 border border-red-700 rounded-lg max-w-3xl mx-auto text-center">
                <p><strong>Error:</strong> {error}</p>
            </div>
        )}

      </main>
      <footer className="text-center mt-16 text-gray-500">
        <p>Powered by Appstra</p>
      </footer>
    </div>
  );
};

export default App;
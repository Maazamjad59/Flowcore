
import React, { useState } from 'react';

interface AutomationInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const AutomationInput: React.FC<AutomationInputProps> = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState<string>('');

  const examples = [
    "When a new email is received from 'billing@company.com' with 'invoice' in the subject, save the attachment to Google Drive.",
    "If a new pull request is opened in the 'frontend' repo, send a notification to the '#dev-alerts' Slack channel.",
    "When a calendar event named 'Team Standup' is about to start, create a task in Todoist called 'Prepare for Standup'."
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prompt);
    setPrompt('');
  };
  
  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
      <h2 className="text-2xl font-semibold mb-4 text-gray-200">1. Describe Your Automation</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., When a new email arrives..."
          className="w-full h-40 p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-300 resize-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            'Create Automation'
          )}
        </button>
      </form>
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-400 mb-2">Or try an example:</h3>
        <div className="flex flex-col gap-2">
          {examples.map((ex, i) => (
             <button key={i} onClick={() => handleExampleClick(ex)} className="text-left text-sm text-indigo-400 hover:text-indigo-300 p-2 bg-gray-900/50 rounded-md hover:bg-gray-700/50 transition-colors disabled:opacity-50" disabled={isLoading}>
               {ex}
             </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutomationInput;

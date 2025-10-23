import React from 'react';
import { Automation } from '../types';
import AutomationCard from './AutomationCard';

interface AutomationCanvasProps {
  automations: Automation[];
  onDelete: (index: number) => void;
  onUpdate: (index: number, automation: Automation) => void;
}

const AutomationCanvas: React.FC<AutomationCanvasProps> = ({ automations, onDelete, onUpdate }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 min-h-[300px] flex flex-col">
      <h2 className="text-2xl font-semibold mb-4 text-gray-200">2. Visualize Your Workflow</h2>
      <div className="flex-grow">
        {automations.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 text-center">Your generated automations will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {automations.map((auto, index) => (
              <AutomationCard 
                key={index} 
                automation={auto} 
                index={index}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AutomationCanvas;
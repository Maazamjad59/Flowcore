import React, { useState, useEffect } from 'react';
import { Automation, Condition } from '../types';
import { MailIcon } from './icons/MailIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { GithubIcon } from './icons/GithubIcon';
import { SlackIcon } from './icons/SlackIcon';
import { TodoistIcon } from './icons/TodoistIcon';
import { DriveIcon } from './icons/DriveIcon';
import { UnknownIcon } from './icons/UnknownIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PencilIcon } from './icons/PencilIcon';

interface AutomationCardProps {
  automation: Automation;
  index: number;
  onDelete: (index: number) => void;
  onUpdate: (index: number, automation: Automation) => void;
}

const serviceIcons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    'email': MailIcon,
    'google drive': DriveIcon,
    'slack': SlackIcon,
    'github': GithubIcon,
    'calendar': CalendarIcon,
    'todoist': TodoistIcon,
    'default': UnknownIcon,
};

const getIcon = (service: string) => {
    const IconComponent = serviceIcons[service.toLowerCase()] || serviceIcons.default;
    return <IconComponent className="w-8 h-8" />;
};

const formatText = (text: string) => {
    if(!text) return '';
    return text.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const ConditionChip: React.FC<{ condition: Condition }> = ({ condition }) => (
    <div className="bg-gray-600/50 text-gray-300 text-xs px-2 py-1 rounded-full flex items-center gap-1">
        <span className="font-semibold">{formatText(condition.field)}</span>
        <span className="text-gray-400">{condition.operator}</span>
        <span className="font-semibold text-indigo-300">"{condition.value}"</span>
    </div>
);

const EditInput: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string; }> = (props) => (
    <input {...props} className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
);

const AutomationCard: React.FC<AutomationCardProps> = ({ automation, index, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAutomation, setEditedAutomation] = useState(automation);

  useEffect(() => {
    setEditedAutomation(automation);
  }, [automation]);

  const handleFieldChange = (part: 'trigger' | 'action', field: string, value: string) => {
    setEditedAutomation(prev => ({
      ...prev,
      [part]: {
        ...prev[part],
        [field]: value
      }
    }));
  };

  const handleJsonChange = (part: 'trigger' | 'action', field: 'conditions' | 'details', value: string) => {
     try {
        const parsed = value.trim() ? JSON.parse(value) : (field === 'conditions' ? [] : {});
        setEditedAutomation(prev => ({ ...prev, [part]: { ...prev[part], [field]: parsed }}));
     } catch (error) {
        console.warn("Invalid JSON:", error);
     }
  };


  const handleSave = () => {
    onUpdate(index, editedAutomation);
    setIsEditing(false);
   };

  const handleCancel = () => {
    setEditedAutomation(automation);
    setIsEditing(false);
  };

  const { trigger, action } = isEditing ? editedAutomation : automation;

  return (
    <div className="bg-gray-900/70 p-4 rounded-lg border border-gray-700/50 animate-fade-in relative group">
       <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Trigger */}
        <div className="flex-1 flex flex-col items-center text-center p-3 bg-gray-800 rounded-lg w-full space-y-2">
            <div className="flex items-center gap-3">
              {getIcon(trigger.service)}
              <div>
                <p className="text-xs text-indigo-400 uppercase tracking-wider">Trigger</p>
                {isEditing ? (
                  <EditInput value={trigger.service} onChange={(e) => handleFieldChange('trigger', 'service', e.target.value)} placeholder="Service"/>
                ) : (
                  <h3 className="font-bold text-gray-200">{formatText(trigger.service)}</h3>
                )}
              </div>
            </div>
             {isEditing ? (
                  <EditInput value={trigger.event} onChange={(e) => handleFieldChange('trigger', 'event', e.target.value)} placeholder="Event"/>
             ) : (
                <p className="text-sm text-gray-400">{formatText(trigger.event)}</p>
             )}
            {isEditing ? (
                <textarea 
                    defaultValue={JSON.stringify(trigger.conditions || [], null, 2)} 
                    onChange={(e) => handleJsonChange('trigger', 'conditions', e.target.value)}
                    className="w-full h-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    placeholder='[{"field": "subject", "operator": "contains", "value": "invoice"}]'
                />
            ) : (
                trigger.conditions && trigger.conditions.length > 0 && (
                    <div className="pt-1 flex flex-wrap gap-2 justify-center">
                        {trigger.conditions.map((cond, i) => <ConditionChip key={i} condition={cond} />)}
                    </div>
                )
            )}
        </div>

        {/* Arrow */}
        <div className="text-indigo-500 transform sm:rotate-0 rotate-90">
            <ArrowRightIcon className="w-8 h-8" />
        </div>

        {/* Action */}
        <div className="flex-1 flex flex-col items-center text-center p-3 bg-gray-800 rounded-lg w-full space-y-2">
            <div className="flex items-center gap-3">
              {getIcon(action.service)}
              <div>
                <p className="text-xs text-purple-400 uppercase tracking-wider">Action</p>
                {isEditing ? (
                    <EditInput value={action.service} onChange={(e) => handleFieldChange('action', 'service', e.target.value)} placeholder="Service"/>
                ) : (
                    <h3 className="font-bold text-gray-200">{formatText(action.service)}</h3>
                )}
              </div>
            </div>
            {isEditing ? (
                <EditInput value={action.operation} onChange={(e) => handleFieldChange('action', 'operation', e.target.value)} placeholder="Operation"/>
            ) : (
                <p className="text-sm text-gray-400 mt-2">{formatText(action.operation)}</p>
            )}
            
            {isEditing ? (
                 <textarea 
                    defaultValue={JSON.stringify(action.details || {}, null, 2)} 
                    onChange={(e) => handleJsonChange('action', 'details', e.target.value)}
                    className="w-full h-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    placeholder='{"channel": "#dev", "message": "PR opened"}'
                 />
            ): (
                 action.details && Object.keys(action.details).length > 0 && (
                    <div className="pt-1 flex flex-wrap gap-2 justify-center">
                        {Object.entries(action.details).map(([key, value]) => (
                            <div key={key} className="bg-gray-600/50 text-gray-300 text-xs px-2 py-1 rounded-full">
                               <span className="font-semibold">{formatText(key)}:</span> <span className="text-purple-300">"{value}"</span>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
      </div>
      
       <div className="absolute top-2 right-2 flex items-center gap-2">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="p-1.5 bg-green-500/80 hover:bg-green-500 rounded-full text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button onClick={handleCancel} className="p-1.5 bg-gray-600/80 hover:bg-gray-500 rounded-full text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </>
        ) : (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <button onClick={() => setIsEditing(true)} className="p-1.5 bg-gray-700/80 hover:bg-indigo-600 rounded-full text-gray-300 hover:text-white transition-all" title="Edit">
              <PencilIcon className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(index)} className="p-1.5 bg-gray-700/80 hover:bg-red-600 rounded-full text-gray-300 hover:text-white transition-all" title="Delete">
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutomationCard;
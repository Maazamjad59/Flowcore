
export interface Condition {
  field: string;
  operator: 'contains' | 'equals' | 'starts_with' | 'ends_with';
  value: string;
}

export interface Trigger {
  service: string;
  event: string;
  conditions?: Condition[];
}

export interface Action {
  service: string;
  operation: string;
  details?: Record<string, string>;
}

export interface Automation {
  trigger: Trigger;
  action: Action;
}

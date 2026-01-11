
export type ViewType = 'dashboard' | 'resources' | 'compliance' | 'vault' | 'findings' | 'visualizer' | 'reports' | 'settings';

export enum Severity {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export enum CloudProvider {
  AWS = 'AWS',
  AZURE = 'Azure',
  GCP = 'GCP'
}

export interface Finding {
  id: string;
  title: string;
  resource: string;
  provider: CloudProvider;
  severity: Severity;
  status: 'Open' | 'Fixed' | 'Muted';
  framework: string[];
  impact: string;
  fix: string;
  timestamp: string;
}

export interface ActivityEvent {
  id: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'alert' | 'success';
}

export interface ConnectionStatus {
  provider: CloudProvider;
  status: 'connected' | 'error' | 'disconnected';
  lastChecked?: string;
}

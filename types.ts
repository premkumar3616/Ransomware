
export interface SystemLog {
  timestamp: string;
  message: string;
  type: 'info' | 'error' | 'warning' | 'critical';
}

export enum AppState {
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKED'
}

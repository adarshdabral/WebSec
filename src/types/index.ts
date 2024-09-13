export interface ScanResult {
    found: boolean;
    description: string;
  }
  
  export interface ScanResults {
    [vulnerability: string]: ScanResult;
  }
/**
 * Diagram configuration options
 */

export interface DiagramOptions {
  width?: number;
  height?: number;
  padding?: number;
  strokeWidth?: number;
  fontSize?: number;
  fontFamily?: string;
  cornerRadius?: number;
  minRailWidth?: number;
  outputFormat?: 'html' | 'svg' | 'png';
  theme?: 'default' | 'dark' | 'light';
  debug?: boolean; // Enable debug visualization (bounding boxes and baselines)
  terminalStyle?: {
    fill?: string;
    stroke?: string;
    fontWeight?: string;
  };
  nonterminalStyle?: {
    fill?: string;
    stroke?: string;
    fontWeight?: string;
  };
}

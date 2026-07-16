// Configuration for the CLI

export interface CLIConfig {
  defaultNetwork: 'preview' | 'preprod' | 'mainnet';
  contractAddress?: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export const DEFAULT_CONFIG: CLIConfig = {
  defaultNetwork: 'preview',
  logLevel: 'info'
};

export function loadConfig(): CLIConfig {
  // In a real implementation, this would load from a config file
  return DEFAULT_CONFIG;
}

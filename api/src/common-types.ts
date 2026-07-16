// Common types shared across the DApp

export interface NetworkConfig {
  name: 'preview' | 'preprod' | 'mainnet';
  rpcUrl: string;
  explorerUrl: string;
}

export const NETWORKS: Record<string, NetworkConfig> = {
  preview: {
    name: 'preview',
    rpcUrl: 'https://preview-rpc.midnight.network',
    explorerUrl: 'https://preview-explorer.midnight.network'
  },
  preprod: {
    name: 'preprod',
    rpcUrl: 'https://preprod-rpc.midnight.network',
    explorerUrl: 'https://preprod-explorer.midnight.network'
  },
  mainnet: {
    name: 'mainnet',
    rpcUrl: 'https://rpc.midnight.network',
    explorerUrl: 'https://explorer.midnight.network'
  }
};

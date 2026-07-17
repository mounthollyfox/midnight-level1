declare global {
  interface Window {
    cardano?: {
      lace?: {
        isEnabled: () => Promise<boolean>
        enable: () => Promise<string[]>
        getUsedAddresses: () => Promise<string[]>
      }
    }
  }
}

export {}

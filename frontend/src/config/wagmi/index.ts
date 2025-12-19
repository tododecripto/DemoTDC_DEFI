import { connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { createConfig, http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'

const { wallets } = getDefaultWallets()

export const connectors = connectorsForWallets(wallets, {
  appName: 'DemoTDC_DEX',
  projectId: 'YOUR_PROJECT_ID', 
})

export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    // Usamos el RPC oficial de Base Sepolia directamente
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
  connectors,
  ssr: true,
})

import { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useBalance } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { withLayout } from '../layout'

// DIRECCIONES IMPERIALES (DTDC)
const TOKEN_ADDRESS = '0xD4560365c676C32Ef6D6A7c3F756CA8651bd95E6'
const FAUCET_ADDRESS = '0xCD8a5512B561D749838EFc25f8Ec5E4191D1a312'
const VENDOR_ADDRESS = '0xd6B3AaeEaF0f7bEEf953C6811A78baFD7df0C5F9'
const STAKING_ADDRESS = '0x8e1940047D0dede120c25Dd352845034c4197D8e'
const DEX_ADDRESS = '0x2387b22E1A6b576126ee941bb12e3f4F0Cad0900'

// ABIs
const FAUCET_ABI = [{ "inputs": [], "name": "requestTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }] as const
const VENDOR_ABI = [{ "inputs": [], "name": "buyTokens", "outputs": [], "stateMutability": "payable", "type": "function" }] as const
const TOKEN_ABI = [
  { "inputs": [{ "name": "spender", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }
] as const
const STAKING_ABI = [
  { "inputs": [{ "name": "amount", "type": "uint256" }], "name": "stake", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "name": "account", "type": "address" }], "name": "stakes", "outputs": [{ "name": "amount", "type": "uint256" }, { "name": "startTime", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "name": "account", "type": "address" }], "name": "calculateReward", "outputs": [{ "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
] as const
const DEX_ABI = [
  { "inputs": [], "name": "ethToToken", "outputs": [{ "name": "", "type": "uint256" }], "stateMutability": "payable", "type": "function" }
] as const

function Page() {
  const { isConnected, address } = useAccount()
  const [view, setView] = useState<'swap' | 'ecosystem'>('swap')
  
  const [swapAmount, setSwapAmount] = useState('0.001')
  const [buyAmount, setBuyAmount] = useState('0.001')
  const [stakeAmount, setStakeAmount] = useState('100')

  const { writeContract: writeImperial } = useWriteContract()

  const tokenBalance = useBalance({
    address,
    token: TOKEN_ADDRESS as `0x${string}`,
    query: { enabled: !!address, refetchInterval: 3000 }
  })

  const { data: stakeData, refetch: refetchStake } = useReadContract({ address: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'stakes', args: address ? [address] : undefined, query: { enabled: !!address } })
  const { data: rewardData, refetch: refetchReward } = useReadContract({ address: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'calculateReward', args: address ? [address] : undefined, query: { enabled: !!address } })

  useEffect(() => {
    const interval = setInterval(() => {
      if (isConnected) {
        refetchReward()
        refetchStake()
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [isConnected])

  const balanceFormatted = tokenBalance.data ? Number(tokenBalance.data.formatted).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0'
  const stakedAmount = stakeData ? formatEther((stakeData as any)[0]) : '0'
  const currentReward = rewardData ? formatEther(rewardData as bigint) : '0'

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col items-center">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gray-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-50 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03]" 
             style={{backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
      </div>

      <nav className="w-full max-w-6xl flex justify-between items-center p-6 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-8">
          <span className="text-xl font-extrabold tracking-tighter">DEMO.TDC</span>
          <div className="hidden md:flex gap-6">
            <button onClick={() => setView('swap')} className={`text-sm font-semibold transition-colors ${view === 'swap' ? 'text-black underline underline-offset-8' : 'text-gray-400 hover:text-black'}`}>TDC DEX</button>
            <button onClick={() => setView('ecosystem')} className={`text-sm font-semibold transition-colors ${view === 'ecosystem' ? 'text-black underline underline-offset-8' : 'text-gray-400 hover:text-black'}`}>TDC DEFI</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isConnected && (
            <div className="hidden sm:flex flex-col items-end px-4 border-r border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Balance</span>
              <span className="text-sm font-black text-black">{balanceFormatted} DTDC</span>
            </div>
          )}
          <ConnectButton chainStatus="none" showBalance={false} />
        </div>
      </nav>

      <main className="w-full max-w-lg mt-12 p-4 z-10">
        {!isConnected ? (
          <div className="text-center space-y-6 py-20">
            <h1 className="text-4xl font-extrabold tracking-tight italic">SISTEMA_OFFLINE</h1>
            <p className="text-gray-500">Conecta tu wallet para sincronizar con la red DTDC.</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Legend de Bienvenida con Wallet */}
            <div className="text-center space-y-1 animate-in fade-in duration-700">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Acceso Autorizado</p>
              <h3 className="text-sm font-medium text-black">Bienvenido, <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-[11px]">{address}</span></h3>
            </div>

            {/* VISTA SWAP (DEX) */}
            {view === 'swap' && (
              <div className="minimal-card space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-end">
                  <h2 className="text-2xl font-bold">DEX Swap</h2>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Algorithmic Trading</span>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Pagas</label>
                    <div className="flex justify-between items-center">
                      <input type="number" value={swapAmount} onChange={(e) => setSwapAmount(e.target.value)} className="bg-transparent text-2xl font-bold w-full outline-none" />
                      <span className="font-extrabold text-gray-400">ETH</span>
                    </div>
                  </div>
                  <div className="flex justify-center -my-6 relative z-10">
                    <div className="bg-white border border-gray-100 p-2 rounded-full shadow-sm text-gray-300 font-bold">↓</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Recibes (est.)</label>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-300 italic">Cotización...</span>
                      <span className="font-extrabold text-gray-400">DTDC</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => writeImperial({ address: DEX_ADDRESS, abi: DEX_ABI, functionName: 'ethToToken', value: parseEther(swapAmount) })}
                  className="pill-button w-full text-lg py-4 shadow-xl shadow-black/5"
                >
                  EJECUTAR TRANSACCION
                </button>
              </div>
            )}

            {/* VISTA ECOSISTEMA (TDC DEFI) */}
            {view === 'ecosystem' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                
                {/* 1. FAUCET */}
                <div className="minimal-card bg-black text-white flex justify-between items-center p-6 shadow-2xl shadow-green-500/10 border-green-500/20">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Faucet</p>
                    <p className="text-xl font-bold text-green-400">Recibe 10 DTDC</p>
                  </div>
                  <button 
                    onClick={() => writeImperial({ address: FAUCET_ADDRESS, abi: FAUCET_ABI, functionName: 'requestTokens' })}
                    className="text-[10px] font-bold border border-green-900 text-green-500 rounded-full px-4 py-2 hover:bg-green-950 transition-all shrink-0"
                  >
                    + RECLAMAR
                  </button>
                </div>

                {/* 2. VENDOR */}
                <div className="minimal-card space-y-6">
                  <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400">Tienda (Precio Fijo)</h3>
                  <div className="space-y-4">
                    <div className="relative w-full">
                      <input 
                        type="number" 
                        value={buyAmount} 
                        onChange={(e) => setBuyAmount(e.target.value)} 
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold pl-12 focus:border-black transition-colors outline-none text-xl" 
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-black uppercase">ETH</span>
                    </div>
                    
                    <button 
                      onClick={() => writeImperial({ address: VENDOR_ADDRESS, abi: VENDOR_ABI, functionName: 'buyTokens', value: parseEther(buyAmount) })} 
                      className="pill-button w-full py-4 text-sm"
                    >
                      COMPRAR {(Number(buyAmount) * 100000).toLocaleString()} DTDC
                    </button>
                  </div>
                </div>

                {/* 3. STAKING */}
                <div className="minimal-card space-y-6 border-t-4 border-t-black">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400">Banco de Staking</h3>
                    <span className="text-[10px] bg-black text-white font-bold px-3 py-1 rounded-full">20% APY</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Inversión</p>
                      <p className="text-2xl font-black">{Number(stakedAmount).toLocaleString()} DTDC</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Intereses</p>
                      <p className="text-2xl font-black text-green-600">+{Number(currentReward).toFixed(6)}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <input type="number" value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 font-bold text-sm focus:border-black transition-colors outline-none" />
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => writeImperial({ address: TOKEN_ADDRESS, abi: TOKEN_ABI, functionName: 'approve', args: [STAKING_ADDRESS, parseEther(stakeAmount)] })} className="text-[10px] font-bold border-2 border-gray-100 rounded-xl py-3 hover:bg-gray-50 transition-all">1. AUTORIZAR</button>
                      <button onClick={() => writeImperial({ address: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'stake', args: [parseEther(stakeAmount)] })} className="pill-button text-[10px]">2. INVERTIR</button>
                    </div>
                    <button onClick={() => writeImperial({ address: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'withdraw' })} className="w-full text-[10px] font-extrabold text-red-500 hover:text-red-700 mt-2 uppercase tracking-tighter transition-colors">Liquidación Total (Capital + Intereses)</button>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}
      </main>

      <footer className="w-full max-w-6xl p-10 mt-auto text-center border-t border-gray-50">
        <p className="text-[10px] font-bold text-gray-300 tracking-[0.2em] uppercase">DAPP DEMO.TDC</p>
      </footer>
    </div>
  )
}

export default withLayout(Page)
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
const TOKEN_ABI = [{ "inputs": [{ "name": "spender", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }] as const
const STAKING_ABI = [
  { "inputs": [{ "name": "amount", "type": "uint256" }], "name": "stake", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "name": "account", "type": "address" }], "name": "stakes", "outputs": [{ "name": "amount", "type": "uint256" }, { "name": "startTime", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "name": "account", "type": "address" }], "name": "calculateReward", "outputs": [{ "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
] as const
const DEX_ABI = [{ "inputs": [], "name": "ethToToken", "outputs": [{ "name": "", "type": "uint256" }], "stateMutability": "payable", "type": "function" }] as const

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
    <div className="min-h-screen bg-[#ffffff] flex flex-col items-center font-sans selection:bg-black selection:text-white pb-32">
      {/* Background Sutil */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full" 
             style={{backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '30px 40px'}}></div>
      </div>

      {/* Nav Bar */}
      <nav className="w-full max-w-6xl flex justify-between items-center p-8 z-10 border-b border-gray-50 sticky top-0 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center gap-12">
          <span className="text-lg font-black tracking-tighter">DEMO.TDC</span>
          <div className="flex gap-8">
            <button onClick={() => setView('swap')} className={`text-xs font-bold tracking-widest transition-colors ${view === 'swap' ? 'text-black underline underline-offset-8' : 'text-gray-300 hover:text-black'}`}>TDC DEX</button>
            <button onClick={() => setView('ecosystem')} className={`text-sm font-bold tracking-widest transition-colors ${view === 'ecosystem' ? 'text-black underline underline-offset-8' : 'text-gray-300 hover:text-black'}`}>TDC DEFI</button>
          </div>
        </div>
        <div className="flex items-center gap-6">
          {isConnected && (
            <div className="text-right">
              <p className="text-[9px] font-bold text-gray-300 uppercase">Balance</p>
              <p className="text-xs font-black">{balanceFormatted} DTDC</p>
            </div>
          )}
          <ConnectButton chainStatus="none" showBalance={false} />
        </div>
      </nav>

      <main className="w-full max-w-lg mt-16 p-4 z-10 space-y-10">
        {!isConnected ? (
          <div className="text-center py-32">
            <h1 className="text-3xl font-light text-gray-300 tracking-tight">Conecta tu wallet para empezar.</h1>
          </div>
        ) : (
          <>
            <div className="px-2">
              <p className="text-xs text-gray-400 font-medium">Bienvenido, <span className="text-black font-mono">{address}</span></p>
            </div>

            <div className="space-y-16">
              {view === 'swap' && (
                <div className="minimal-card space-y-8 shadow-sm">
                  <h2 className="text-xl font-black">Intercambio</h2>
                  <div className="space-y-2">
                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex justify-between items-center">
                      <input type="number" value={swapAmount} onChange={(e) => setSwapAmount(e.target.value)} className="bg-transparent text-2xl font-bold outline-none w-full" />
                      <span className="text-sm font-black text-gray-300">ETH</span>
                    </div>
                    <div className="flex justify-center -my-4 relative z-10">
                      <div className="bg-white border border-gray-100 p-2 rounded-full shadow-sm text-gray-300">↓</div>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex justify-between items-center opacity-60">
                      <span className="text-2xl font-bold">Cotización...</span>
                      <span className="text-sm font-black text-gray-300">DTDC</span>
                    </div>
                  </div>
                  <button onClick={() => writeImperial({ address: DEX_ADDRESS, abi: DEX_ABI, functionName: 'ethToToken', value: parseEther(swapAmount) })} className="pill-button w-full py-5 text-sm uppercase tracking-widest">Ejecutar Swap</button>
                </div>
              )}

              {view === 'ecosystem' && (
                <div className="space-y-16">
                  
                  {/* 1. FAUCET */}
                  <div className="minimal-card bg-black text-white flex justify-between items-center p-8">
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Faucet Diaria</p>
                      <p className="text-3xl font-black text-green-400">10 DTDC</p>
                      <p className="text-[9px] text-gray-600 mt-1">Tu saldo actual: {balanceFormatted}</p>
                    </div>
                    <button 
                      onClick={() => writeImperial({ address: FAUCET_ADDRESS, abi: FAUCET_ABI, functionName: 'requestTokens' })}
                      className="text-[10px] font-bold border border-green-900 text-green-500 rounded-full px-6 py-3 hover:bg-green-950 transition-all uppercase tracking-widest"
                    >
                      Solicitar
                    </button>
                  </div>

                  {/* 2. VENDOR - INPUT IGUAL AL BOTON */}
                  <div className="minimal-card space-y-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-300">Tienda (Precio Fijo)</h3>
                    <div className="flex flex-col items-center space-y-4 w-full">
                      <div className="relative w-full">
                        <input 
                          type="number" 
                          value={buyAmount} 
                          onChange={(e) => setBuyAmount(e.target.value)} 
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold outline-none focus:border-black transition-colors text-center text-xl" 
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300 uppercase">ETH</span>
                      </div>
                      
                      <button 
                        onClick={() => writeImperial({ address: VENDOR_ADDRESS, abi: VENDOR_ABI, functionName: 'buyTokens', value: parseEther(buyAmount) })} 
                        className="pill-button w-full py-4 text-xs uppercase tracking-widest"
                      >
                        Comprar {(Number(buyAmount) * 100000).toLocaleString()} DTDC
                      </button>
                    </div>
                  </div>

                  {/* 3. STAKING - LIMPIEZA DE FONDO mt-24 */}
                  <div className="minimal-card space-y-8 mt-24 border-t-4 border-t-black !bg-white">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-300">Staking (20% APY)</h3>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-[10px] font-bold text-gray-300 uppercase mb-1">Inversión</p>
                        <p className="text-xl font-black">{Number(stakedAmount).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-300 uppercase mb-1">Ganancias</p>
                        <p className="text-xl font-black text-green-500">+{Number(currentReward).toFixed(6)}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <input type="number" value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 font-bold outline-none focus:border-black transition-colors text-center" />
                      <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => writeImperial({ address: TOKEN_ADDRESS, abi: TOKEN_ABI, functionName: 'approve', args: [STAKING_ADDRESS, parseEther(stakeAmount)] })} className="text-[10px] font-bold border border-gray-100 rounded-xl py-4 hover:bg-gray-50 uppercase tracking-widest">1. Autorizar</button>
                        <button onClick={() => writeImperial({ address: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'stake', args: [parseEther(stakeAmount)] })} className="pill-button text-[10px] uppercase tracking-widest">2. Invertir</button>
                      </div>
                      <button onClick={() => writeImperial({ address: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'withdraw' })} className="w-full text-[10px] font-bold text-gray-300 hover:text-red-500 transition-colors uppercase tracking-widest pt-2">Retirar todo</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="w-full max-w-6xl p-16 mt-auto text-center border-t border-gray-50">
        <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">
          DAPP DEMO.TDC | ELABORADO POR EL PROFESOR CRIPTO DE TODODECRIPTO.COM
        </p>
      </footer>
    </div>
  )
}

export default withLayout(Page)
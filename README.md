# 🏦 Ecosistema DeFi DemoTDC (DEX + Yield Farming)

Bienvenido a **DemoTDC**, una suite financiera descentralizada completa desplegada en la red **Base Sepolia**. Este proyecto demuestra la arquitectura de un protocolo DeFi institucional con una interfaz minimalista de alta gama.

![DeFi Dashboard](https://media.giphy.com/media/QxZRBqV0RSef8euVFP/giphy.gif)

## 🚀 Módulos del Imperio

Este ecosistema está compuesto por 5 contratos inteligentes interconectados:

### 1. 🪙 Token DemoTDC (`DTDC`)
El activo nativo del ecosistema.
*   **Suministro:** 1,000,000,000 (1 Billón).
*   **Estándar:** ERC-20 OpenZeppelin.

### 2. 🦄 TDC DEX (Intercambio Descentralizado)
Un mercado automatizado (AMM) que permite el intercambio instantáneo entre ETH y DTDC.
*   **Modelo:** Constant Product Market Maker (`x * y = k`).
*   **Comisión:** 0.3% (Simulado).
*   **Liquidez:** Inicializada con 10,000 DTDC + 0.01 ETH.

### 3. 🏦 Banco de Staking (Yield Farming)
Protocolo de inversión pasiva.
*   **APY:** 20% Anual (Calculado por segundo).
*   **Mecánica:** Deposita DTDC -> Gana DTDC en tiempo real -> Retira capital + intereses.

### 4. 🏪 Tienda (Vendor)
Módulo de venta directa a precio fijo.
*   **Tasa:** 1 ETH = 100,000 DTDC.
*   **Uso:** Adquisición rápida de tokens sin deslizamiento (slippage).

### 5. 💧 Faucet
Distribución gratuita para onboarding.
*   **Regalo:** 10 DTDC cada 24 horas por billetera.

---

## 💻 Interfaz de Usuario (dApp)

La interfaz ha sido diseñada siguiendo principios de **Minimalismo Institucional**:
*   **Diseño:** Limpio, tipografía Helvética/Inter, alto contraste (Blanco/Negro).
*   **Navegación:** Sistema dual **TDC DEX** (Swap) y **TDC DEFI** (Herramientas).
*   **Tecnología:** React + Vite + Wagmi v2 + RainbowKit + UnoCSS.

## 📦 Instalación Local

Si deseas clonar y ejecutar este protocolo en tu máquina:

### 1. Clonar Repositorio
```bash
git clone https://github.com/tododecripto/DemoTDC_DEFI.git
cd DemoTDC_DEFI
```

### 2. Configurar Backend (Smart Contracts)
```bash
npm install
# Crea un archivo .env con tu PRIVATE_KEY y BASE_SEPOLIA_RPC_URL
```

### 3. Configurar Frontend (Web)
```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173` en tu navegador y conecta tu MetaMask a **Base Sepolia**.

---

## 📜 Direcciones de Contratos (Base Sepolia)

| Contrato | Dirección |
| :--- | :--- |
| **Token (DTDC)** | `0xD4560365c676C32Ef6D6A7c3F756CA8651bd95E6` |
| **DEX** | `0x2387b22E1A6b576126ee941bb12e3f4F0Cad0900` |
| **Staking** | `0x8e1940047D0dede120c25Dd352845034c4197D8e` |
| **Vendor** | `0xd6B3AaeEaF0f7bEEf953C6811A78baFD7df0C5F9` |
| **Faucet** | `0xCD8a5512B561D749838EFc25f8Ec5E4191D1a312` |

---

Desarrollado con 💻 y ☕ por **El Profesor Cripto** de **TodoDeCripto.com**.

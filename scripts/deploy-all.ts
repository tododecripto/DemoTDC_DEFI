import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Iniciando despliegue IMPERIAL con cuenta:", deployer.address);

  // 1. Desplegar Token
  console.log("\n🪙 Desplegando Token DTDC...");
  const Token = await ethers.getContractFactory("DemoTDC");
  const token = await Token.deploy();
  await token.waitForDeployment();
  console.log("✅ Token DTDC desplegado en:", token.target);

  // 2. Desplegar Faucet
  console.log("\n💧 Desplegando Faucet...");
  const Faucet = await ethers.getContractFactory("Faucet");
  const faucet = await Faucet.deploy(token.target);
  await faucet.waitForDeployment();
  console.log("✅ Faucet desplegada en:", faucet.target);

  // 3. Desplegar Vendor
  console.log("\n🏪 Desplegando Vendor...");
  const Vendor = await ethers.getContractFactory("Vendor");
  const vendor = await Vendor.deploy(token.target);
  await vendor.waitForDeployment();
  console.log("✅ Vendor desplegado en:", vendor.target);

  // 4. Desplegar Staking
  console.log("\n🏦 Desplegando Staking...");
  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(token.target);
  await staking.waitForDeployment();
  console.log("✅ Staking desplegado en:", staking.target);

  // 5. Desplegar DEX
  console.log("\n🦄 Desplegando DEX...");
  const DEX = await ethers.getContractFactory("DEX");
  const dex = await DEX.deploy(token.target);
  await dex.waitForDeployment();
  console.log("✅ DEX desplegado en:", dex.target);

  // 6. FINANCIAMIENTO Y LIQUIDEZ
  console.log("\n💸 Financiando y proveyendo liquidez...");
  
  // Faucet: 10,000 tokens
  await token.transfer(faucet.target, ethers.parseEther("10000"));
  console.log("- Faucet financiada: 10,000 DTDC");

  // Vendor: 100,000 tokens
  await token.transfer(vendor.target, ethers.parseEther("100000"));
  console.log("- Vendor financiado: 100,000 DTDC");

  // Staking: 50,000 tokens
  await token.transfer(staking.target, ethers.parseEther("50000"));
  console.log("- Staking financiado: 50,000 DTDC");

  // DEX Liquidez: 10,000 DTDC + 0.01 ETH
  const dexTokenAmount = ethers.parseEther("10000");
  const dexEthAmount = ethers.parseEther("0.01");

  // Aprobar al DEX para que tome los tokens
  await token.approve(dex.target, dexTokenAmount);
  // Añadir liquidez
  await dex.addLiquidity(dexTokenAmount, { value: dexEthAmount });
  console.log("- DEX Liquidez añadida: 10,000 DTDC + 0.01 ETH");

  console.log("\n✨ ¡IMPERIO DESPLEGADO! ✨");
  console.log("Guarda estas direcciones para tu Frontend:");
  console.log({
    TOKEN: token.target,
    FAUCET: faucet.target,
    VENDOR: vendor.target,
    STAKING: staking.target,
    DEX: dex.target
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
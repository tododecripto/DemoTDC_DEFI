import { ethers } from "hardhat";

async function main() {
  const myTokenAddress = "0xD4560365c676C32Ef6D6A7c3F756CA8651bd95E6"; 

  console.log("🏦 Desplegando el NUEVO Banco de Staking (20% APY)...");

  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(myTokenAddress);
  await staking.waitForDeployment();

  console.log("✅ Nuevo Banco desplegado en:", staking.target);
  console.log("⚠️  IMPORTANTE: Recuerda enviarle tokens a este nuevo contrato para pagar intereses.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

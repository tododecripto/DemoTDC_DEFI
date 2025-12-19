import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  // DIRECCIONES IMPERIALES (DTDC)
  const TOKEN_ADDRESS = '0xD4560365c676C32Ef6D6A7c3F756CA8651bd95E6';
  const FAUCET_ADDRESS = '0xCD8a5512B561D749838EFc25f8Ec5E4191D1a312';
  const VENDOR_ADDRESS = '0xd6B3AaeEaF0f7bEEf953C6811A78baFD7df0C5F9';
  const STAKING_ADDRESS = '0x8e1940047D0dede120c25Dd352845034c4197D8e'; // El nuevo staking
  const DEX_ADDRESS = '0x2387b22E1A6b576126ee941bb12e3f4F0Cad0900';

  console.log("📊 AUDITORIA IMPERIAL DE SALDOS (DTDC)");
  console.log("------------------------------------------------");

  const token = await ethers.getContractAt("DemoTDC", TOKEN_ADDRESS);

  const checkBalance = async (name: string, address: string) => {
    const bal = await token.balanceOf(address);
    console.log(`${name.padEnd(15)}: ${ethers.formatEther(bal)} DTDC`);
  };

  await checkBalance("👑 TU (Deployer)", deployer.address);
  await checkBalance("💧 Faucet", FAUCET_ADDRESS);
  await checkBalance("🏪 Vendor", VENDOR_ADDRESS);
  await checkBalance("🏦 Staking", STAKING_ADDRESS);
  await checkBalance("🦄 DEX Pool", DEX_ADDRESS);

  console.log("------------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

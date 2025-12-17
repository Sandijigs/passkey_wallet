const { generateWallet } = require('@stacks/wallet-sdk');

const mnemonic = "twice kind fence tip hidden tilt action fragile skin nothing glory cousin green tomorrow spring wrist shed math olympic multiply hip blue scout claw";

async function test() {
  try {
    console.log("Testing wallet generation...");
    const wallet = await generateWallet({
      secretKey: mnemonic,
      password: ''
    });

    console.log("Wallet:", JSON.stringify(wallet, null, 2));
    console.log("\nAccounts:", wallet.accounts);
    if (wallet.accounts && wallet.accounts[0]) {
      console.log("\nFirst account:");
      console.log("  Address:", wallet.accounts[0].address);
      console.log("  Private Key:", wallet.accounts[0].stxPrivateKey);
    }
  } catch (error) {
    console.error("Error:", error.message);
    console.error(error.stack);
  }
}

test();

import { useState } from "react";
import { ethers, Eip1193Provider } from "ethers";
import USD0Abi from "./USD0.json";

// Environment variables
const USD0_ADDRESS = import.meta.env.VITE_USD0_ADDRESS!;
const RELAYER_URL = import.meta.env.VITE_RELAYER_URL!;

// Constants
const EIP712_DOMAIN_VERSION = "1";
const SIGNATURE_VALIDITY_PERIOD_SECONDS = 3600; // 1 hour
const USD0_DECIMALS = 6;

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

export default function App() {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("1");

  async function sendGasless() {
    if (!window.ethereum) {
      alert("Please install MetaMask or a compatible Ethereum wallet.");
      return;
    }

    // 1) Provider & Signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();

    // 2) EIP-712 Domain Data (Fetched in parallel)
    const tokenContract = new ethers.Contract(USD0_ADDRESS, USD0Abi, provider);
    const [signerAddress, network, tokenName] = await Promise.all([
      signer.getAddress(),
      provider.getNetwork(),
      tokenContract.name() as Promise<string>, // Explicitly type if ABI isn't fully typed
    ]);

    const domain = {
      name: tokenName,
      version: EIP712_DOMAIN_VERSION,
      chainId: network.chainId,
      verifyingContract: USD0_ADDRESS,
    };

    const types = {
      TransferWithAuthorization: [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "validAfter", type: "uint256" },
        { name: "validBefore", type: "uint256" },
        { name: "nonce", type: "bytes32" },
      ],
    };

    // 3) Build the payload message
    const nowSeconds = Math.floor(Date.now() / 1000);
    const message = {
      from: signerAddress,
      to,
      value: ethers.parseUnits(amount, USD0_DECIMALS).toString(),
      validAfter: nowSeconds,
      validBefore: nowSeconds + SIGNATURE_VALIDITY_PERIOD_SECONDS,
      nonce: ethers.hexlify(ethers.randomBytes(32)),
    };

    // 4) Sign Typed Data
    const signature = await signer.signTypedData(domain, types, message);
    const { v, r, s } = ethers.Signature.from(signature);

    // 5) POST to Relayer
    const response = await fetch(`${RELAYER_URL}/relay-transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload: message, v, r, s }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: "Relayer request failed with status: " + response.status,
      }));
      throw new Error(errorData.error || "Relayer request failed.");
    }
    const { txHash } = await response.json();
    alert("✅ Sent! On-chain tx hash:\n" + txHash);
  }

  return (
    <div style={{ padding: 20, maxWidth: 400 }}>
      <h1>Gasless USD₮0 Demo</h1>
      <input
        placeholder="Recipient address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        placeholder="Amount (e.g. 0.5)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: "100%", marginBottom: 12 }}
      />
      <button onClick={sendGasless}>Send Gasless</button>
    </div>
  );
}

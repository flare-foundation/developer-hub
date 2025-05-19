import { useState } from "react";
import { ethers } from "ethers";
import USD0Abi from "./USD0.json";

const USD0_ADDRESS = import.meta.env.VITE_USD0_ADDRESS!;
const RELAYER_URL  = import.meta.env.VITE_RELAYER_URL!;

export default function App() {
  const [to,     setTo]     = useState("");
  const [amount, setAmount] = useState("1");

  async function sendGasless() {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    //  1) Provider & signer —
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const from   = await signer.getAddress();

    //  2) Domain & types for EIP-712 —
    const chainId  = (await provider.getNetwork()).chainId;
    const contract = new ethers.Contract(USD0_ADDRESS, USD0Abi, signer);
    const domain   = {
      name:    await contract.name(),
      version: "1",
      chainId,
      verifyingContract: USD0_ADDRESS
    };
    const types = {
      TransferWithAuthorization: [
        { name: "from",        type: "address" },
        { name: "to",          type: "address" },
        { name: "value",       type: "uint256" },
        { name: "validAfter",  type: "uint256" },
        { name: "validBefore", type: "uint256" },
        { name: "nonce",       type: "bytes32" }
      ]
    };

    //  3) Build the payload message —
    const now         = Math.floor(Date.now() / 1000);
    const validAfter  = now;
    const validBefore = now + 3600;                   
    const nonce       = ethers.hexlify(ethers.randomBytes(32));
    const message = {
      from,
      to,
      value: ethers.parseUnits(amount, 6).toString(),
      validAfter,
      validBefore,
      nonce
    };

    
    // 4) Sign 
    const rawSig = await signer.signTypedData(domain, types, message);
    const { v, r, s } = ethers.Signature.from(rawSig);



    //  5) POST to your relayer —
    const resp = await fetch(`${RELAYER_URL}/relay-transfer`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ payload: message, v, r, s })
    });
    if (!resp.ok) {
      const err = await resp.json();
      console.error("Relayer error", err);
      alert("Relayer failed: " + err.error);
      return;
    }

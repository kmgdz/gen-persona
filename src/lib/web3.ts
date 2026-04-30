export const GENLAYER_TESTNET_CHAIN_ID = '0x107D'; // 4221
// For reference, arbitrary ID since exact isn't specified, but we'll try to add it.
export const GENLAYER_NETWORK_PARAMS = {
  chainId: '0x107D', // 4221
  chainName: 'GenLayer Testnet',
  nativeCurrency: {
    name: 'GEN',
    symbol: 'GEN',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.testnet-chain.genlayer.com'], // Using GenLayer Chain RPC
  blockExplorerUrls: ['https://explorer.testnet-chain.genlayer.com/'],
};

export async function connectWallet(): Promise<string> {
  if (!window.ethereum) {
    throw new Error("No crypto wallet found. Please install MetaMask or another EVM wallet.");
  }

  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  
  if (!accounts || accounts.length === 0) {
    throw new Error("No accounts found.");
  }

  return accounts[0];
}

export async function switchToGenLayer() {
  if (!window.ethereum) return;

  try {
    // Try switching to the network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: GENLAYER_NETWORK_PARAMS.chainId }],
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [GENLAYER_NETWORK_PARAMS],
        });
      } catch (addError) {
        throw new Error("Failed to add GenLayer Testnet to wallet.");
      }
    } else {
      console.warn("Failed to switch network. Assuming test mode.");
    }
  }
}

export async function createInscription(account: string, persona: any) {
  if (!window.ethereum) {
     // If no window.ethereum, mock delay for simulation
     await new Promise(r => setTimeout(r, 2000));
     return "mock_tx_hash_" + Date.now();
  }

  // Create an authentic SVG representation of the persona
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" style="background:#050505;font-family:'Courier New',monospace;color:#fff;">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ec3e9b;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#7e22ce;stop-opacity:0.6" />
        <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" style="stop-color:#ec3e9b;stop-opacity:0.25" />
        <stop offset="100%" style="stop-color:#ec3e9b;stop-opacity:0" />
      </radialGradient>
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
        <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.1 0" />
        <feComposite operator="in" in2="SourceGraphic" result="monoNoise"/>
        <feBlend mode="screen" in="monoNoise" in2="SourceGraphic" />
      </filter>
    </defs>
    <rect width="600" height="800" fill="#050505"/>
    <rect width="600" height="800" filter="url(#noise)" opacity="0.5"/>
    
    <!-- Background Design Elements -->
    <path d="M 0 0 L 600 800 M 600 0 L 0 800" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    <circle cx="300" cy="400" r="280" fill="url(#glow)"/>
    <circle cx="300" cy="400" r="280" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1" stroke-dasharray="10 10"/>
    
    <!-- Main Frame -->
    <rect x="24" y="24" width="552" height="752" rx="36" fill="none" stroke="url(#grad1)" stroke-width="2"/>
    <rect x="36" y="36" width="528" height="728" rx="24" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    
    <!-- Header -->
    <text x="300" y="100" font-size="16" fill="#888" font-weight="bold" text-anchor="middle" letter-spacing="10">GENLAYER NETWORK</text>
    <line x1="200" y1="120" x2="400" y2="120" stroke="url(#grad1)" stroke-width="2"/>
    <text x="300" y="140" font-size="12" fill="#555" text-anchor="middle" letter-spacing="2">ON-CHAIN IDENTITY MATRIX</text>

    <!-- Visual Avatar Placeholder -->
    <text x="300" y="380" font-size="180" text-anchor="middle" filter="drop-shadow(0 0 30px rgba(236,62,155,0.5))">${persona.emoji}</text>
    
    <!-- Persona Details -->
    <text x="300" y="520" font-size="44" text-anchor="middle" fill="#fff" font-family="sans-serif" font-weight="900" style="text-shadow: 0 0 20px rgba(236,62,155,0.6);">${persona.title.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>
    
    <rect x="80" y="560" width="440" height="1" fill="rgba(255,255,255,0.1)"/>
    
    <!-- Traits -->
    <text x="80" y="600" font-size="14" fill="#ec3e9b" font-weight="bold" letter-spacing="4">VERIFIED TRAITS //</text>
    ${persona.traits.map((t: string, i: number) => `
      <rect x="80" y="${620 + i*30}" width="6" height="6" fill="#ec3e9b" />
      <text x="100" y="${627 + i*30}" font-size="18" fill="#ddd" font-family="sans-serif" font-weight="600" letter-spacing="2">${t.replace(/&/g, '&amp;').replace(/</g, '&lt;').toUpperCase()}</text>
    `).join('')}
    
    <!-- Footer -->
    <rect x="80" y="720" width="440" height="1" fill="rgba(255,255,255,0.1)"/>
    <text x="80" y="745" font-size="12" fill="#666" letter-spacing="2">IDENTITY_CHECKSUM:</text>
    <text x="520" y="745" font-size="12" fill="#ec3e9b" text-anchor="end" letter-spacing="1">${account.substring(0,12)}...${account.substring(account.length-8)}</text>
  </svg>`;

  const metadata = {
    name: "GenPersona: " + persona.title,
    description: persona.description,
    image: "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg))),
    attributes: persona.traits.map((t: string) => ({ trait_type: "Trait", value: t })),
    protocol: "GenLayer Inscription AI Certificate"
  };

  // Convert JSON metadata to hex string for the data payload
  const jsonString = JSON.stringify(metadata);
  const encoder = new TextEncoder();
  const bytes = encoder.encode(jsonString);
  let hexData = '0x';
  for (const byte of bytes) {
    hexData += byte.toString(16).padStart(2, '0');
  }

  // Send transaction with the metadata payload as a real fully on-chain "inscription"
  const txHash = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [{
      from: account,
      to: account, // send to self as proof of ownership
      value: '0x0',
      data: hexData,
    }],
  });

  return txHash;
}

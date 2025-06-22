'use client';
import { PasskeyKit, PasskeyServer } from 'passkey-kit';

// Default values for Soroban testnet
const DEFAULT_RPC_URL = 'https://testnet.sorobanrpc.com';
const DEFAULT_NETWORK_PASSPHRASE =
  'Public Global Stellar Network ; September 2015';
const DEFAULT_WALLET_WASM_HASH =
  'ecd990f0b45ca6817149b6175f79b32efb442f35731985a084131e8265c4cd90';

export const account = new PasskeyKit({
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || DEFAULT_RPC_URL,
  networkPassphrase:
    process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || DEFAULT_NETWORK_PASSPHRASE,
  walletWasmHash:
    process.env.NEXT_PUBLIC_WALLET_WASM_HASH || DEFAULT_WALLET_WASM_HASH,
  timeoutInSeconds: 30,
});

export const server = new PasskeyServer({
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || DEFAULT_RPC_URL,
  launchtubeUrl: process.env.NEXT_PUBLIC_LAUNCHTUBE_URL || '',
  launchtubeJwt: process.env.NEXT_PUBLIC_LAUNCHTUBE_JWT || '',
});

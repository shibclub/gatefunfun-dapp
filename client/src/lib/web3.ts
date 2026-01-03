import { BrowserProvider, Contract, formatEther, parseEther } from 'ethers';

// 扩展 Window 类型以支持 ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Gate Layer 网络配置
export const GATE_LAYER_CHAIN_ID = 10088;
export const GATE_LAYER_RPC = 'https://gatelayer-mainnet.gatenode.cc';
export const GATE_LAYER_BLOCK_EXPLORER = 'https://www.gatescan.org/gatelayer/';

// 合约地址
export const TOKEN_REGISTRY_ADDRESS = '0x7e021071526F6B30703C330BFe6fFf948d2D8c61';
export const CLAIM_CONTRACT_ADDRESS = '0xaF5de12700f7fdE6e5Bc74833C95d2db9d4B30d5';

// 代币注册合约 ABI（关键方法）
export const TOKEN_REGISTRY_ABI = [
  {
    inputs: [
      { internalType: 'string', name: 'symbol', type: 'string' },
      { internalType: 'string', name: 'fullName', type: 'string' },
      { internalType: 'string', name: 'telegram', type: 'string' },
    ],
    name: 'createToken',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
    payable: true,
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'getTokenInfo',
    outputs: [
      { internalType: 'string', name: 'symbol', type: 'string' },
      { internalType: 'string', name: 'fullName', type: 'string' },
      { internalType: 'string', name: 'telegram', type: 'string' },
      { internalType: 'address', name: 'creator', type: 'address' },
      { internalType: 'uint256', name: 'balance', type: 'uint256' },
      { internalType: 'uint8', name: 'status', type: 'uint8' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getCreatorTokens',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'address', name: 'user', type: 'address' },
    ],
    name: 'getUserDeposit',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTokenCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

// 领取合约 ABI（关键方法）
export const CLAIM_CONTRACT_ABI = [
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'claimTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'getClaimableTokens',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenContracts',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
];

// 连接钱包
export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error('Please install MetaMask');
  }

  const provider = new BrowserProvider(window.ethereum);
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });

  await switchToGateLayer();
  return { provider, account: accounts[0] };
}

// 切换到 Gate Layer 网络
export async function switchToGateLayer() {
  if (!window.ethereum) {
    throw new Error('Please install MetaMask');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${GATE_LAYER_CHAIN_ID.toString(16)}` }],
    });
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      // 网络不存在，添加网络
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${GATE_LAYER_CHAIN_ID.toString(16)}`,
            chainName: 'Gate Layer',
            rpcUrls: [GATE_LAYER_RPC],
            nativeCurrency: {
              name: 'GT',
              symbol: 'GT',
              decimals: 18,
            },
            blockExplorerUrls: ['https://explorer.gatelayer.io'],
          },
        ],
      });
    } else {
      throw switchError;
    }
  }
}

// 获取用户余额
export async function getBalance(provider: BrowserProvider, account: string) {
  const balance = await provider.getBalance(account);
  return formatEther(balance);
}

// 创建代币
export async function createToken(
  provider: BrowserProvider,
  account: string,
  symbol: string,
  fullName: string,
  telegram: string
) {
  const signer = await provider.getSigner();
  const contract = new Contract(TOKEN_REGISTRY_ADDRESS, TOKEN_REGISTRY_ABI, signer);

  const tx = await contract.createToken(symbol, fullName, telegram);
  const receipt = await tx.wait();
  return receipt;
}

// 认购代币
export async function depositToken(
  provider: BrowserProvider,
  account: string,
  tokenId: number,
  amount: string
) {
  const signer = await provider.getSigner();
  const contract = new Contract(TOKEN_REGISTRY_ADDRESS, TOKEN_REGISTRY_ABI, signer);

  const amountWei = parseEther(amount);
  const tx = await contract.deposit(tokenId, { value: amountWei, from: account });
  const receipt = await tx.wait();
  return receipt;
}

// 退款
export async function withdrawToken(
  provider: BrowserProvider,
  account: string,
  tokenId: number
) {
  const signer = await provider.getSigner();
  const contract = new Contract(TOKEN_REGISTRY_ADDRESS, TOKEN_REGISTRY_ABI, signer);

  const tx = await contract.withdraw(tokenId);
  const receipt = await tx.wait();
  return receipt;
}

// 获取代币信息
export async function getTokenInfo(provider: BrowserProvider, tokenId: number) {
  const contract = new Contract(TOKEN_REGISTRY_ADDRESS, TOKEN_REGISTRY_ABI, provider);
  const info = await contract.getTokenInfo(tokenId);
  return {
    symbol: info[0],
    fullName: info[1],
    telegram: info[2],
    creator: info[3],
    balance: formatEther(info[4]),
    status: info[5],
  };
}

// 获取用户创建的代币列表
export async function getCreatorTokens(provider: BrowserProvider, account: string) {
  const contract = new Contract(TOKEN_REGISTRY_ADDRESS, TOKEN_REGISTRY_ABI, provider);
  const tokenIds = await contract.getCreatorTokens(account);
  return tokenIds.map((id: any) => id.toString());
}

// 获取用户的认购金额
export async function getUserDeposit(
  provider: BrowserProvider,
  tokenId: number,
  account: string
) {
  const contract = new Contract(TOKEN_REGISTRY_ADDRESS, TOKEN_REGISTRY_ABI, provider);
  const deposit = await contract.getUserDeposit(tokenId, account);
  return formatEther(deposit);
}

// 获取可领取的代币数量
export async function getClaimableTokens(
  provider: BrowserProvider,
  account: string,
  tokenId: number
) {
  const contract = new Contract(CLAIM_CONTRACT_ADDRESS, CLAIM_CONTRACT_ABI, provider);
  const claimable = await contract.getClaimableTokens(account, tokenId);
  return formatEther(claimable);
}

// 领取代币
export async function claimTokens(
  provider: BrowserProvider,
  account: string,
  tokenId: number
) {
  const signer = await provider.getSigner();
  const contract = new Contract(CLAIM_CONTRACT_ADDRESS, CLAIM_CONTRACT_ABI, signer);

  const tx = await contract.claimTokens(tokenId);
  const receipt = await tx.wait();
  return receipt;
}

// 获取代币总数
export async function getTokenCount(provider: BrowserProvider) {
  const contract = new Contract(TOKEN_REGISTRY_ADDRESS, TOKEN_REGISTRY_ABI, provider);
  const count = await contract.getTokenCount();
  return count.toString();
}

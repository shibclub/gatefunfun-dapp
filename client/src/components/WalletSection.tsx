import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '@/contexts/Web3Context';
import { getBalance, TOKEN_REGISTRY_ADDRESS } from '@/lib/web3';
import { toast } from 'sonner';

/**
 * WalletSection 组件 - 钱包连接和余额显示
 * 设计特点：
 * - 玻璃态卡片设计
 * - 实时余额更新
 * - 合约地址复制功能
 */
export default function WalletSection() {
  const { t } = useTranslation();
  const { provider, account, isConnected, connect, isConnecting, error } = useWeb3();
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected && provider && account) {
      fetchBalance();
      const interval = setInterval(fetchBalance, 10000);
      return () => clearInterval(interval);
    }
  }, [isConnected, provider, account]);

  const fetchBalance = async () => {
    if (!provider || !account) return;
    try {
      setLoading(true);
      const bal = await getBalance(provider, account);
      setBalance(parseFloat(bal).toFixed(4));
    } catch (err) {
      console.error('Failed to fetch balance:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(TOKEN_REGISTRY_ADDRESS);
      toast.success(t('common.copied'));
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="glass-card p-8 max-w-3xl mx-auto">
      <div className="space-y-6">
        {/* 连接钱包按钮 */}
        {!isConnected ? (
          <div className="text-center">
            <button
              onClick={connect}
              disabled={isConnecting}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary via-blue-500 to-secondary text-white font-bold text-lg hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? `${t('common.loading')}...` : t('wallet.connect')}
            </button>
          </div>
        ) : (
          <>
            {/* 网络状态 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl p-4 border border-green-500/20">
                <p className="text-gray-400 text-sm mb-2 font-medium">{t('wallet.networkStatus')}</p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-green-400 font-bold">Gate Layer (10088)</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl p-4 border border-blue-500/20">
                <p className="text-gray-400 text-sm mb-2 font-medium">{t('wallet.balance')}</p>
                <p className="text-2xl font-bold text-primary">{balance} GT</p>
              </div>
            </div>

            {/* 账户信息 */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-gray-400 text-sm mb-3 font-medium">Account Address</p>
              <div className="flex items-center justify-between bg-black/20 rounded-lg p-3">
                <p className="text-white font-mono text-sm break-all flex-1">{account}</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(account!);
                    toast.success('Account copied!');
                  }}
                  className="ml-2 text-secondary hover:text-secondary/80 transition-colors text-xl"
                  title="Copy address"
                >
                  📋
                </button>
              </div>
            </div>
          </>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <p className="text-red-400 text-sm font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* 合约地址 */}
        <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-4 border border-accent/20">
          <p className="text-gray-400 text-sm mb-3 font-medium">{t('common.contractAddress')}</p>
          <div className="flex items-center justify-between bg-black/20 rounded-lg p-3">
            <p className="text-white font-mono text-sm break-all flex-1">{TOKEN_REGISTRY_ADDRESS}</p>
            <button
              onClick={copyAddress}
              className="ml-2 text-accent hover:text-accent/80 transition-colors text-xl"
              title="Copy contract address"
            >
              📋
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Token Registry Contract</p>
        </div>
      </div>
    </div>
  );
}

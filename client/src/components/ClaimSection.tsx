import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '@/contexts/Web3Context';
import { claimTokens, getClaimableTokens } from '@/lib/web3';
import { toast } from 'sonner';

/**
 * ClaimSection 组件 - 领取代币
 * 设计特点：
 * - 可领取数量实时显示
 * - 清晰的成功/失败反馈
 * - 高端玻璃态设计
 */
export default function ClaimSection() {
  const { t } = useTranslation();
  const { provider, account } = useWeb3();
  const [tokenId, setTokenId] = useState('');
  const [claimable, setClaimable] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const [querying, setQuerying] = useState(false);

  const handleQueryToken = async () => {
    if (!provider || !account || !tokenId) return;

    try {
      setQuerying(true);
      const amount = await getClaimableTokens(provider, account, parseInt(tokenId));
      setClaimable(amount);
    } catch (err: any) {
      toast.error('Failed to query claimable tokens');
      setClaimable('0');
    } finally {
      setQuerying(false);
    }
  };

  const handleClaim = async () => {
    if (!provider || !account || !tokenId) return;

    try {
      setLoading(true);
      await claimTokens(provider, account, parseInt(tokenId));
      toast.success(t('claim.success'));
      setTokenId('');
      setClaimable('0');
    } catch (err: any) {
      toast.error(err.message || t('claim.error'));
      console.error('Claim error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 hover:shadow-lg hover:shadow-secondary/20 transition-all duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-emerald-600 flex items-center justify-center">
          <span className="text-white text-xl font-bold">🎁</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-secondary">{t('claim.title')}</h3>
          <p className="text-xs text-gray-400">Claim your token rewards</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Token ID Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">{t('claim.tokenId')}</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="Enter token ID"
              className="glass-input flex-1"
              disabled={loading || querying}
            />
            <button
              onClick={handleQueryToken}
              disabled={!tokenId || querying || loading}
              className="glass-button-secondary px-6 disabled:opacity-50"
            >
              {querying ? '⚙️' : '🔍'}
            </button>
          </div>
        </div>

        {/* Claimable Amount Display */}
        <div className="bg-gradient-to-br from-secondary/20 to-emerald-500/10 rounded-xl p-6 border border-secondary/30">
          <p className="text-gray-400 text-sm mb-3 font-medium">{t('claim.info')}</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-secondary">{claimable}</span>
            <span className="text-xl text-gray-400">Tokens</span>
          </div>
        </div>

        {/* Status Messages */}
        {parseFloat(claimable) > 0 && (
          <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/30 rounded-xl p-4">
            <p className="text-green-400 text-sm font-semibold">
              ✅ You have <span className="text-lg font-bold">{claimable}</span> tokens ready to claim!
            </p>
          </div>
        )}

        {parseFloat(claimable) === 0 && tokenId && (
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/30 rounded-xl p-4">
            <p className="text-yellow-400 text-sm font-semibold">
              ℹ️ {t('claim.noTokens')}
            </p>
          </div>
        )}

        {!tokenId && (
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30 rounded-xl p-4">
            <p className="text-blue-400 text-sm font-semibold">
              💡 Enter a token ID and click Query to check claimable tokens
            </p>
          </div>
        )}

        {/* Claim Button */}
        <button
          onClick={handleClaim}
          disabled={!tokenId || parseFloat(claimable) === 0 || loading}
          className="w-full glass-button mt-6 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-bold py-4"
        >
          {loading ? (
            <span className="flex items-center justify-center space-x-2">
              <span className="spinner">⚙️</span>
              <span>{t('claim.claiming')}</span>
            </span>
          ) : (
            `${t('claim.button')} ${claimable > '0' ? `(${claimable})` : ''}`
          )}
        </button>
      </div>
    </div>
  );
}

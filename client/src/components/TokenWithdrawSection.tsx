import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '@/contexts/Web3Context';
import { withdrawToken, getTokenInfo, getUserDeposit } from '@/lib/web3';
import { toast } from 'sonner';

interface TokenWithdrawSectionProps {
  onSuccess?: () => void;
}

export default function TokenWithdrawSection({ onSuccess }: TokenWithdrawSectionProps) {
  const { t } = useTranslation();
  const { provider, account } = useWeb3();
  const [tokenId, setTokenId] = useState('');
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [userDeposit, setUserDeposit] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const [querying, setQuerying] = useState(false);

  const handleQueryToken = async () => {
    if (!provider || !account || !tokenId) return;

    try {
      setQuerying(true);
      const info = await getTokenInfo(provider, parseInt(tokenId));
      const deposit = await getUserDeposit(provider, parseInt(tokenId), account);
      setTokenInfo(info);
      setUserDeposit(deposit);
    } catch (err: any) {
      toast.error('Failed to query token');
      setTokenInfo(null);
      setUserDeposit('0');
    } finally {
      setQuerying(false);
    }
  };

  const handleWithdraw = async () => {
    if (!provider || !account || !tokenId) return;

    try {
      setLoading(true);
      await withdrawToken(provider, account, parseInt(tokenId));
      toast.success(t('withdraw.success'));
      setTokenId('');
      setTokenInfo(null);
      setUserDeposit('0');
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || t('withdraw.error'));
      console.error('Withdraw error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 hover:shadow-lg hover:shadow-accent/20 transition-all duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-yellow-600 flex items-center justify-center">
          <span className="text-white font-bold">💰</span>
        </div>
        <h3 className="text-xl font-bold text-accent">{t('withdraw.title')}</h3>
      </div>
      
      <div className="space-y-4">
        {/* Token ID Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">{t('withdraw.tokenId')}</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="1"
              className="glass-input flex-1"
              disabled={loading || querying}
            />
            <button
              onClick={handleQueryToken}
              disabled={!tokenId || querying || loading}
              className="glass-button-secondary px-4 disabled:opacity-50"
            >
              {querying ? '...' : 'Query'}
            </button>
          </div>
        </div>

        {/* Token Info Display */}
        {tokenInfo && (
          <div className="bg-gradient-to-br from-accent/10 to-yellow-500/5 rounded-lg p-4 border border-accent/20 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">Symbol</p>
                <p className="text-white font-bold">{tokenInfo.symbol}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Your Deposit</p>
                <p className="text-accent font-bold">{userDeposit} GT</p>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-gray-400 mb-1">Progress</p>
              <p className="text-sm text-secondary">{parseFloat(tokenInfo.balance).toFixed(1)}/500 GT</p>
            </div>
          </div>
        )}

        {/* Refund Info */}
        {parseFloat(userDeposit) > 0 && (
          <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg p-4 border border-green-500/20">
            <p className="text-green-400 text-sm font-medium">
              ✅ You can refund <span className="font-bold">{userDeposit} GT</span>
            </p>
          </div>
        )}

        {parseFloat(userDeposit) === 0 && tokenInfo && (
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-lg p-4 border border-yellow-500/20">
            <p className="text-yellow-400 text-sm font-medium">
              ℹ️ No deposit found for this token
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleWithdraw}
          disabled={!tokenId || parseFloat(userDeposit) === 0 || loading}
          className="w-full glass-button mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? `${t('withdraw.withdrawing')}...` : t('withdraw.button')}
        </button>
      </div>
    </div>
  );
}

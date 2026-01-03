import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '@/contexts/Web3Context';
import { depositToken, getTokenInfo } from '@/lib/web3';
import { toast } from 'sonner';

interface TokenDepositSectionProps {
  onSuccess?: () => void;
}

export default function TokenDepositSection({ onSuccess }: TokenDepositSectionProps) {
  const { t } = useTranslation();
  const { provider, account } = useWeb3();
  const [tokenId, setTokenId] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [querying, setQuerying] = useState(false);

  const isValidAmount = amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0;
  const isMultipleOfTenth = isValidAmount && (parseFloat(amount) * 10) % 1 === 0;
  const isFormValid = tokenId && isValidAmount && isMultipleOfTenth;

  const handleQueryToken = async () => {
    if (!provider || !tokenId) return;

    try {
      setQuerying(true);
      const info = await getTokenInfo(provider, parseInt(tokenId));
      setTokenInfo(info);
    } catch (err: any) {
      toast.error('Failed to query token');
      setTokenInfo(null);
    } finally {
      setQuerying(false);
    }
  };

  const handleDeposit = async () => {
    if (!provider || !account || !isFormValid) return;

    try {
      setLoading(true);
      await depositToken(provider, account, parseInt(tokenId), amount);
      toast.success(t('deposit.success'));
      setTokenId('');
      setAmount('');
      setTokenInfo(null);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || t('deposit.error'));
      console.error('Deposit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = tokenInfo ? (parseFloat(tokenInfo.balance) / 500) * 100 : 0;

  return (
    <div className="glass-card p-6 hover:shadow-lg hover:shadow-secondary/20 transition-all duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-emerald-600 flex items-center justify-center">
          <span className="text-white font-bold">🔄</span>
        </div>
        <h3 className="text-xl font-bold text-secondary">{t('deposit.title')}</h3>
      </div>
      
      <div className="space-y-4">
        {/* Token ID Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">{t('deposit.tokenId')}</label>
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
          <div className="bg-gradient-to-br from-secondary/10 to-emerald-500/5 rounded-lg p-4 border border-secondary/20 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">Symbol</p>
                <p className="text-white font-bold">{tokenInfo.symbol}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Name</p>
                <p className="text-white text-sm truncate">{tokenInfo.fullName}</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-gray-400">Progress</p>
                <p className="text-sm font-bold text-secondary">{parseFloat(tokenInfo.balance).toFixed(1)}/500 GT</p>
              </div>
              <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-secondary to-emerald-400 h-full transition-all duration-500"
                  style={{ width: `${Math.min(progressPercent, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">{t('deposit.amount')}</label>
          <input
            type="number"
            step="0.1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.1"
            className="glass-input w-full"
            disabled={loading}
          />
          {amount && !isMultipleOfTenth && (
            <p className="text-red-400 text-xs mt-1">❌ Amount must be a multiple of 0.1</p>
          )}
          {amount && isMultipleOfTenth && (
            <p className="text-green-400 text-xs mt-1">✅ Valid amount</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleDeposit}
          disabled={!isFormValid || loading}
          className="w-full glass-button mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? `${t('deposit.depositing')}...` : t('deposit.button')}
        </button>
      </div>
    </div>
  );
}

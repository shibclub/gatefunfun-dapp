import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '@/contexts/Web3Context';
import { createToken } from '@/lib/web3';
import { toast } from 'sonner';

/**
 * TokenCreateSection 组件 - 代币创建
 * 设计特点：
 * - 表单验证反馈
 * - 玻璃态输入框
 * - 加载状态提示
 */
interface TokenCreateSectionProps {
  onSuccess?: () => void;
}

export default function TokenCreateSection({ onSuccess }: TokenCreateSectionProps) {
  const { t } = useTranslation();
  const { provider, account } = useWeb3();
  const [symbol, setSymbol] = useState('');
  const [fullName, setFullName] = useState('');
  const [telegram, setTelegram] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidTelegram = telegram.match(/^https:\/\/t\.me\/[A-Za-z0-9_]+$/);
  const isFormValid = symbol && fullName && isValidTelegram;

  const handleCreate = async () => {
    if (!provider || !account || !isFormValid) return;

    try {
      setLoading(true);
      await createToken(provider, account, symbol, fullName, telegram);
      toast.success(t('token.created'));
      setSymbol('');
      setFullName('');
      setTelegram('');
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || t('token.createError'));
      console.error('Create token error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
          <span className="text-white font-bold">💎</span>
        </div>
        <h3 className="text-xl font-bold text-primary">{t('token.create')}</h3>
      </div>
      
      <div className="space-y-4">
        {/* Token Symbol */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            {t('token.symbol')}
          </label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="GDOG"
            maxLength={20}
            className="glass-input w-full"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">{symbol.length}/20 characters</p>
        </div>

        {/* Token Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            {t('token.name')}
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="GDOG Token"
            maxLength={100}
            className="glass-input w-full"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">{fullName.length}/100 characters</p>
        </div>

        {/* Telegram Link */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            {t('token.telegram')}
          </label>
          <input
            type="text"
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
            placeholder="https://t.me/username"
            className="glass-input w-full"
            disabled={loading}
          />
          {telegram && !isValidTelegram && (
            <p className="text-red-400 text-xs mt-1">❌ Invalid Telegram URL format</p>
          )}
          {telegram && isValidTelegram && (
            <p className="text-green-400 text-xs mt-1">✅ Valid Telegram URL</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleCreate}
          disabled={!isFormValid || loading}
          className="w-full glass-button mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center space-x-2">
              <span className="spinner">⚙️</span>
              <span>{t('token.creating')}</span>
            </span>
          ) : (
            t('token.createButton')
          )}
        </button>
      </div>
    </div>
  );
}

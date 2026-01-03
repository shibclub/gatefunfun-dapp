import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '@/contexts/Web3Context';
import { getCreatorTokens, getTokenInfo } from '@/lib/web3';

interface MyTokensSectionProps {
  refreshTrigger?: number;
}

export default function MyTokensSection({ refreshTrigger = 0 }: MyTokensSectionProps) {
  const { t } = useTranslation();
  const { provider, account } = useWeb3();
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account && provider) {
      fetchTokens();
    }
  }, [account, provider, refreshTrigger]);

  const fetchTokens = async () => {
    if (!provider || !account) return;

    try {
      setLoading(true);
      const tokenIds = await getCreatorTokens(provider, account);
      
      const tokenDetails = await Promise.all(
        tokenIds.map(async (id: string) => {
          try {
            const info = await getTokenInfo(provider, parseInt(id));
            return { id, ...info };
          } catch (err) {
            return { id, error: true };
          }
        })
      );

      setTokens(tokenDetails.filter(t => !t.error));
    } catch (err) {
      console.error('Failed to fetch tokens:', err);
      setTokens([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return 'bg-green-500/10 border-green-500/20 text-green-400';
      case 1:
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
      case 2:
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return t('myTokens.statusActive');
      case 1:
        return t('myTokens.statusFull');
      case 2:
        return t('myTokens.statusClosed');
      default:
        return 'Unknown';
    }
  };

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 0:
        return '🟢';
      case 1:
        return '🟡';
      case 2:
        return '🔴';
      default:
        return '⚪';
    }
  };

  return (
    <div className="glass-card p-6 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold">📊</span>
          </div>
          <h3 className="text-xl font-bold text-primary">{t('myTokens.title')}</h3>
        </div>
        {tokens.length > 0 && (
          <span className="text-sm font-semibold text-gray-400 bg-white/5 px-3 py-1 rounded-full">
            {tokens.length} token{tokens.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">⚙️ {t('common.loading')}...</p>
        </div>
      ) : tokens.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-2">{t('myTokens.empty')}</p>
          <p className="text-xs text-gray-500">Create a token to see it here</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-3 text-gray-400 font-semibold">{t('myTokens.id')}</th>
                <th className="text-left py-3 px-3 text-gray-400 font-semibold">{t('myTokens.symbol')}</th>
                <th className="text-left py-3 px-3 text-gray-400 font-semibold">{t('myTokens.name')}</th>
                <th className="text-left py-3 px-3 text-gray-400 font-semibold">{t('myTokens.progress')}</th>
                <th className="text-left py-3 px-3 text-gray-400 font-semibold">{t('myTokens.status')}</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token, idx) => (
                <tr 
                  key={token.id} 
                  className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
                >
                  <td className="py-3 px-3 text-white font-mono text-xs">{token.id}</td>
                  <td className="py-3 px-3 text-white font-bold">{token.symbol}</td>
                  <td className="py-3 px-3 text-gray-300 truncate">{token.fullName}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-black/30 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-secondary to-emerald-400 h-full"
                          style={{ width: `${Math.min((parseFloat(token.balance) / 500) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-secondary font-semibold text-xs whitespace-nowrap">
                        {parseFloat(token.balance).toFixed(1)}/500
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full border font-semibold text-xs ${getStatusColor(token.status)}`}>
                      <span>{getStatusIcon(token.status)}</span>
                      <span>{getStatusText(token.status)}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '@/contexts/Web3Context';
import { Link } from 'wouter';

/**
 * Header 组件 - 导航和钱包连接
 * 设计特点：
 * - 玻璃态背景 + 模糊效果
 * - 响应式导航菜单
 * - 实时账户显示和语言切换
 */
export default function Header() {
  const { t, i18n } = useTranslation();
  const { account, isConnected, connect, disconnect } = useWeb3();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <header className="fixed w-full z-50 bg-[#0a0e27]/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo 和品牌 */}
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/50 hover:ring-primary transition-all">
            <img 
              src="https://www.woofswap.finance/image/tokens/gdog.png" 
              alt="GDOG Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-2xl font-bold glow-text hidden sm:inline">Gatefunfun</span>
        </Link>

        {/* 桌面导航 */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-300 hover:text-primary transition-colors duration-200 font-medium">
            {t('nav.home')}
          </Link>
          <Link href="/claim" className="text-gray-300 hover:text-secondary transition-colors duration-200 font-medium">
            {t('nav.claim')}
          </Link>

          {/* 语言切换 */}
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 text-sm font-medium border border-white/10"
            title="Switch language"
          >
            {i18n.language === 'zh' ? 'EN' : '中文'}
          </button>

          {/* 钱包按钮 */}
          {isConnected ? (
            <div className="flex items-center space-x-3 pl-3 border-l border-white/10">
              <div className="text-right">
                <p className="text-xs text-gray-400">Connected</p>
                <p className="text-sm text-white font-mono font-semibold">{truncateAddress(account!)}</p>
              </div>
              <button
                onClick={disconnect}
                className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all duration-200 text-sm font-medium border border-red-500/30"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-200 text-sm"
            >
              {t('wallet.connect')}
            </button>
          )}
        </div>

        {/* 移动菜单按钮 */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={toggleLanguage}
            className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 text-xs font-medium"
          >
            {i18n.language === 'zh' ? 'EN' : '中文'}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-2xl text-primary hover:text-secondary transition-colors duration-200"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* 移动菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0e27]/95 backdrop-blur-xl border-t border-white/10 p-4 space-y-4 animate-in fade-in slide-in-from-top-2">
          <Link href="/" className="block text-gray-300 hover:text-primary py-2 transition-colors">
            {t('nav.home')}
          </Link>
          <Link href="/claim" className="block text-gray-300 hover:text-secondary py-2 transition-colors">
            {t('nav.claim')}
          </Link>
          <div className="border-t border-white/10 pt-4">
            {isConnected ? (
              <>
                <div className="text-sm text-gray-400 py-2 mb-3">
                  <p className="text-xs text-gray-500">Connected Account</p>
                  <p className="font-mono text-white font-semibold">{truncateAddress(account!)}</p>
                </div>
                <button
                  onClick={() => {
                    disconnect();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-red-500/20 text-red-400 font-medium transition-all"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  connect();
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold transition-all"
              >
                {t('wallet.connect')}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

import { useTranslation } from 'react-i18next';
import { useWeb3 } from '@/contexts/Web3Context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WalletSection from '@/components/WalletSection';
import ClaimSection from '@/components/ClaimSection';

/**
 * 领取页面 - Gatefunfun DApp
 * 设计理念：
 * - 简洁清晰的布局
 * - 聚焦于领取功能
 * - 一致的 DeFi 风格
 */
export default function Claim() {
  const { t } = useTranslation();
  const { isConnected } = useWeb3();

  return (
    <div className="min-h-screen bg-[#0a0e27] relative overflow-hidden">
      {/* 背景渐变球体 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-emerald-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-l from-yellow-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* 网格背景 */}
      <div className="fixed inset-0 bg-grid opacity-10 pointer-events-none"></div>

      {/* 主内容 */}
      <div className="relative z-10">
        <Header />

        <main className="min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-4">
            {/* 英雄部分 */}
            <section className="mb-16 text-center">
              <div className="inline-block mb-8 float-animation">
                <img 
                  src="https://www.woofswap.finance/image/tokens/gdog.png" 
                  alt="GDOG Logo" 
                  className="w-24 h-24 rounded-full border-2 border-secondary/50 shadow-lg glow-border"
                />
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-4 glow-text">
                🎁 Claim Rewards
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                Query and claim your token rewards from completed subscriptions
              </p>
            </section>

            {/* 钱包连接部分 */}
            <WalletSection />

            {/* 领取功能区域 */}
            {isConnected && (
              <div className="mt-16 max-w-2xl mx-auto">
                <ClaimSection />
              </div>
            )}

            {/* 未连接钱包提示 */}
            {!isConnected && (
              <div className="mt-12 text-center">
                <div className="glass-card p-12 max-w-2xl mx-auto">
                  <div className="mb-6">
                    <p className="text-2xl font-bold text-primary mb-4">🔗 Connect Your Wallet</p>
                    <p className="text-gray-400 mb-2">Please connect your wallet to claim tokens</p>
                    <p className="text-sm text-gray-500">Supports MetaMask and other EVM-compatible wallets</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '@/contexts/Web3Context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WalletSection from '@/components/WalletSection';
import TokenCreateSection from '@/components/TokenCreateSection';
import TokenDepositSection from '@/components/TokenDepositSection';
import TokenWithdrawSection from '@/components/TokenWithdrawSection';
import MyTokensSection from '@/components/MyTokensSection';

/**
 * 首页 - Gatefunfun DApp
 * 设计理念：现代极简 DeFi 风格 + 高科技感
 * - 深色背景 (#0a0e27) 提供专业感
 * - 玻璃态卡片营造分层感
 * - 蓝色 (#0068FF) 和青绿色 (#18E5A0) 强调信息
 * - 流畅动画提升交互体验
 */
export default function Home() {
  const { t } = useTranslation();
  const { provider, account, isConnected } = useWeb3();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] relative overflow-hidden">
      {/* 背景渐变球体 - 营造深度感 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-emerald-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-l from-yellow-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* 网格背景 - 增加科技感 */}
      <div className="fixed inset-0 bg-grid opacity-10 pointer-events-none"></div>

      {/* 主内容 */}
      <div className="relative z-10">
        <Header />

        <main className="min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-4">
            {/* 英雄部分 - 品牌展示 */}
            <section className="mb-16 text-center">
              <div className="inline-block mb-8 float-animation">
                <img 
                  src="https://www.woofswap.finance/image/tokens/gdog.png" 
                  alt="GDOG Logo" 
                  className="w-24 h-24 rounded-full border-2 border-secondary/50 shadow-lg glow-border"
                />
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 glow-text">
                Gatefunfun
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                创建代币，参与认购，随时退款！加入 Gatefunfun，在 Gatefun 上启动，满 500 GT 100%！4 亿令牌公平预售！
              </p>

              {/* 功能亮点 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
                <div className="glass-card p-4 hover:shadow-lg hover:shadow-primary/50 transition-all">
                  <p className="text-sm text-gray-400 mb-2">💎 创建代币</p>
                  <p className="text-white font-semibold">一键启动</p>
                </div>
                <div className="glass-card p-4 hover:shadow-lg hover:shadow-secondary/50 transition-all">
                  <p className="text-sm text-gray-400 mb-2">🔄 灵活认购</p>
                  <p className="text-white font-semibold">随时退款</p>
                </div>
                <div className="glass-card p-4 hover:shadow-lg hover:shadow-accent/50 transition-all">
                  <p className="text-sm text-gray-400 mb-2">🎁 领取奖励</p>
                  <p className="text-white font-semibold">公平分配</p>
                </div>
              </div>
            </section>

            {/* 钱包连接部分 */}
            <WalletSection />

            {/* 功能区域 - 响应式布局 */}
            {isConnected && (
              <div className="mt-16">
                <h2 className="text-3xl font-bold mb-8 text-center glow-text">功能面板</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* 左列 - 创建和认购 */}
                  <div className="space-y-8">
                    <TokenCreateSection onSuccess={handleRefresh} />
                    <TokenDepositSection onSuccess={handleRefresh} />
                  </div>

                  {/* 右列 - 退款和我的代币 */}
                  <div className="space-y-8">
                    <TokenWithdrawSection onSuccess={handleRefresh} />
                    <MyTokensSection refreshTrigger={refreshTrigger} />
                  </div>
                </div>
              </div>
            )}

            {/* 未连接钱包提示 */}
            {!isConnected && (
              <div className="mt-12 text-center">
                <div className="glass-card p-12 max-w-2xl mx-auto">
                  <div className="mb-6">
                    <p className="text-2xl font-bold text-primary mb-4">🔗 连接您的钱包</p>
                    <p className="text-gray-400 mb-2">请连接钱包以使用 Gatefunfun 的所有功能</p>
                    <p className="text-sm text-gray-500">支持 MetaMask 和其他 EVM 兼容钱包</p>
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

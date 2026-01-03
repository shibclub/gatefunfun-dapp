import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // 导航
      'nav.home': 'Home',
      'nav.claim': 'Claim',
      'nav.language': 'Language',

      // 钱包连接
      'wallet.connect': 'Connect Wallet',
      'wallet.connected': 'Connected',
      'wallet.disconnect': 'Disconnect',
      'wallet.switchNetwork': 'Switch to Gate Layer',
      'wallet.installMetaMask': 'Please install MetaMask',
      'wallet.networkStatus': 'Network Status',
      'wallet.balance': 'Balance',

      // 代币创建
      'token.create': 'Create Token',
      'token.symbol': 'Token Symbol (e.g., GDOG)',
      'token.name': 'Token Full Name (e.g., GDOG Token)',
      'token.telegram': 'Telegram Link (https://t.me/username)',
      'token.createButton': 'Create',
      'token.creating': 'Creating...',
      'token.created': 'Token created successfully!',
      'token.createError': 'Failed to create token',

      // 代币认购
      'deposit.title': 'Subscribe Token',
      'deposit.tokenId': 'Token ID',
      'deposit.amount': 'Amount (GT, multiples of 0.1)',
      'deposit.info': 'Token Info: Enter ID to query',
      'deposit.button': 'Subscribe',
      'deposit.depositing': 'Subscribing...',
      'deposit.success': 'Subscription successful!',
      'deposit.error': 'Subscription failed',

      // 退款
      'withdraw.title': 'Refund',
      'withdraw.tokenId': 'Token ID',
      'withdraw.info': 'Token Info: Enter ID to query',
      'withdraw.button': 'Refund',
      'withdraw.withdrawing': 'Processing refund...',
      'withdraw.success': 'Refund successful!',
      'withdraw.error': 'Refund failed',

      // 我的代币
      'myTokens.title': 'My Tokens',
      'myTokens.empty': 'No tokens yet',
      'myTokens.id': 'ID',
      'myTokens.symbol': 'Symbol',
      'myTokens.name': 'Name',
      'myTokens.telegram': 'Telegram',
      'myTokens.progress': 'Progress',
      'myTokens.status': 'Status',
      'myTokens.statusActive': 'Active',
      'myTokens.statusFull': 'Full',
      'myTokens.statusClosed': 'Closed',

      // 领取
      'claim.title': 'Claim Tokens',
      'claim.tokenId': 'Token ID',
      'claim.info': 'Claimable Tokens: Enter ID to query',
      'claim.button': 'Claim',
      'claim.claiming': 'Claiming...',
      'claim.success': 'Claim successful!',
      'claim.error': 'Claim failed',
      'claim.noTokens': 'No tokens to claim',
      'claim.contractNotSet': 'Token contract not set',

      // 通用
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.cancel': 'Cancel',
      'common.copy': 'Copy',
      'common.copied': 'Copied!',
      'common.contractAddress': 'Contract Address',
      'common.transactionHash': 'Transaction Hash',
    },
  },
  zh: {
    translation: {
      // 导航
      'nav.home': '首页',
      'nav.claim': '领取',
      'nav.language': '语言',

      // 钱包连接
      'wallet.connect': '连接钱包',
      'wallet.connected': '已连接',
      'wallet.disconnect': '断开连接',
      'wallet.switchNetwork': '切换到 Gate Layer',
      'wallet.installMetaMask': '请安装 MetaMask',
      'wallet.networkStatus': '网络状态',
      'wallet.balance': '余额',

      // 代币创建
      'token.create': '创建代币',
      'token.symbol': '代币符号（如 GDOG）',
      'token.name': '代币全称（如 GDOG Token）',
      'token.telegram': 'Telegram 链接（https://t.me/username）',
      'token.createButton': '创建',
      'token.creating': '创建中...',
      'token.created': '代币创建成功！',
      'token.createError': '代币创建失败',

      // 代币认购
      'deposit.title': '认购代币',
      'deposit.tokenId': '代币编号',
      'deposit.amount': '认购金额（GT，0.1 的倍数）',
      'deposit.info': '代币信息：请先输入编号查询',
      'deposit.button': '认购',
      'deposit.depositing': '认购中...',
      'deposit.success': '认购成功！',
      'deposit.error': '认购失败',

      // 退款
      'withdraw.title': '退款',
      'withdraw.tokenId': '代币编号',
      'withdraw.info': '代币信息：请先输入编号查询',
      'withdraw.button': '退款',
      'withdraw.withdrawing': '退款处理中...',
      'withdraw.success': '退款成功！',
      'withdraw.error': '退款失败',

      // 我的代币
      'myTokens.title': '我创建的代币',
      'myTokens.empty': '暂无代币数据',
      'myTokens.id': '编号',
      'myTokens.symbol': '符号',
      'myTokens.name': '全称',
      'myTokens.telegram': 'Telegram',
      'myTokens.progress': '进度',
      'myTokens.status': '状态',
      'myTokens.statusActive': '活跃',
      'myTokens.statusFull': '已满',
      'myTokens.statusClosed': '已关闭',

      // 领取
      'claim.title': '领取代币',
      'claim.tokenId': '代币编号',
      'claim.info': '可领取代币：请先输入编号查询',
      'claim.button': '领取',
      'claim.claiming': '领取中...',
      'claim.success': '领取成功！',
      'claim.error': '领取失败',
      'claim.noTokens': '无代币可领取',
      'claim.contractNotSet': '代币合约未设置',

      // 通用
      'common.loading': '加载中...',
      'common.error': '错误',
      'common.success': '成功',
      'common.cancel': '取消',
      'common.copy': '复制',
      'common.copied': '已复制！',
      'common.contractAddress': '合约地址',
      'common.transactionHash': '交易哈希',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'zh',
  fallbackLng: 'zh',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

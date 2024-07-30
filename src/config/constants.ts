export const LAYOUT_ROUTES = {
  account: "/account",
  auth: "/auth",
  admin: "/admin",
};

export const ROUTES = {
  dashboard: {
    homepage: "/dashboard",
    backButton: "/account/dashboard",
  },
  signals: "/signals",
  portfolio: {
    homepage: "/portfolio",
    openTrade: "../open-trades",
    tradeHistory: "../trade-history",
    tradingRules: "../trading-rules",
    backButton: "/account/portfolio",
    manageTrade: "manage-trade",
  },
  wallet: {
    homepage: "/wallet",
    wallets: "../main",
    spot: "../spot",
    futures: "../futures",
    backButton: "/account/wallet/wallets",
    deposit: "/account/wallet/deposit",
    convert: "/account/wallet/convert",
    withdraw: "/account/wallet/withdraw",
    transfer: "/account/wallet/transfer",
    transactionDetails: "transaction-details",
  },
  referrals: "/referrals",
  settings: "/settings",
  login: "/login",
  signup: "/signup",
  passwordrecover: "/password/recover",
  passwordreset: "/password/reset",

  //admin routes
  usermanagement: {
    homepage: "/user-management",
    edit: `/edit`,
    details: "/details",
    create: "create-user",
  },

  financemodel: "/finance-model",
  signalmanagement: "/signal-management",
  systemmanagement: "/system-management",
  aggregateview: "/aggregate-view",
};

export const ENDPOINTS = {
  assets: "http://localhost:8080",
};
export const ItemType: Record<string, string> = Object.freeze({
  text: "text",
  link: "link",
});

export const EmailValidation = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

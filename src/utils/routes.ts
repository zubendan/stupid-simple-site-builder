export const routes = {
  HOME: '/',
  SIGN_OUT: '/sign-out',
  SIGN_IN: '/sign-in',
  ABOUT: '/about',
  DO_NOT_SELL: '/about/do-not-sell',
  PRIVACY: '/about/privacy',
  TERMS_OF_USE: '/about/terms-of-use',
  TEMPALTES: '/templates',
  ACCOUNT: '/account',
  INBOX: '/account/inbox',
  ORGANIZATION: '/account/organizations',
  SETTINGS: '/account/settings',
  DASHBOARD: (hashid: string) => `/${hashid}`,
  COMPONENTS: (hashid: string) => `/${hashid}/components`,
  DOMAINS: (hashid: string) => `/${hashid}/domains`,
  TEMPLATES: (hashid: string) => `/${hashid}/templates`,
  ERROR: '/404',
};

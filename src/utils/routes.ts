export const routes = {
  HOME: '/',
  SIGN_OUT: '/sign-out',
  SIGN_IN: '/sign-in',
  ABOUT: '/about',
  PRICING: '/pricing',
  DO_NOT_SELL: '/about/do-not-sell',
  PRIVACY: '/about/privacy',
  TERMS_OF_USE: '/about/terms-of-use',
  PUBLIC_TEMPALTES: '/templates',
  ACCOUNT: '/account',
  INBOX: '/account/inbox',
  ORGANIZATIONS: '/account/organizations',
  USER_SETTINGS: '/account/settings',
  DASHBOARD: (hashid: string) => `/org/${hashid}`,
  COMPONENTS: (hashid: string) => `/org/${hashid}/components`,
  COMPONENT: (hashid: string, componentHashid: string) =>
    `/org/${hashid}/components${componentHashid}`,
  DOMAINS: (hashid: string) => `/org/${hashid}/domains`,
  DOMAIN: (hashid: string, domainHashid: string) =>
    `/org/${hashid}/domains/${domainHashid}`,
  TEMPLATES: (hashid: string) => `/org/${hashid}/templates`,
  TEMPLATE: (hashid: string, templateHashid: string) =>
    `/org/${hashid}/templates${templateHashid}`,
  TEMPLATE_VERSION: (
    hashid: string,
    templateHashid: string,
    versionHashid: string,
  ) => `/org/${hashid}/templates${templateHashid}/versions/${versionHashid}`,
  TEMPLATE_PAGE: (
    hashid: string,
    templateHashid: string,
    versionHashid: string,
    pageHashid: string,
  ) =>
    `/org/${hashid}/templates${templateHashid}/versions/${versionHashid}/pages/${pageHashid}`,
  USERS: (hashid: string) => `/org/${hashid}/users`,
  USER: (hashid: string, userHashid: string) =>
    `/org/${hashid}/users${userHashid}`,
  SETTINGS: (hashid: string) => `/org/${hashid}/settings`,
  ROLES: (hashid: string) => `/org/${hashid}/settings/roles`,
  INVITE: (hashid: string, token: string) => `/org/${hashid}/invite/${token}`,
  INVITE_EXPIRED: (hashid: string) => `/org/${hashid}/invite/expired`,
  ERROR: '/404',
};

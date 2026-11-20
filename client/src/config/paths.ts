export const paths = {
  home: {
    getHref: () => "/",
  },
  auth: {
    login: {
      getHref: (next?: string) =>
        `/login${next ? `?next=${encodeURIComponent(next)}` : ""}`,
    },
    register: {
      getHref: (next?: string) =>
        `/register${next ? `?next=${encodeURIComponent(next)}` : ""}`,
    },
  },
  app: {
    dashboard: {
      getHref: () => "/dashboard",
    },
    compose: {
      getHref: () => "/compose",
    },
    history: {
      getHref: () => "/history",
    },
    notifications: {
      getHref: () => "/notifications",
    },
    account: {
      getHref: () => "/account",
    },
  },
} as const;

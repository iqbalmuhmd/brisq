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
  },
} as const;

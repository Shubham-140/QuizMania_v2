export const isQuizInProgress = (pathname: string) =>
  /^\/quiz\/[^/]+\/?$/.test(pathname);

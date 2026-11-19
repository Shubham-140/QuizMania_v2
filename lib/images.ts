export const allowedImageHosts = ["avatars.githubusercontent.com"];

export function isAllowedImageUrl(url: string) {
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === "https:" && allowedImageHosts.includes(hostname);
  } catch {
    return false;
  }
}

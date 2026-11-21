export const DEMO_USERNAME = "TestUser";
export const DEMO_PASSWORD = "Test@123456";

export const isDemoUser = (username: string | null | undefined) =>
  username === DEMO_USERNAME;

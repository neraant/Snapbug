export type TokenPort = {
  generatePasswordResetToken: () => Promise<string>;
};

import bcrypt from "bcryptjs";

const ROUNDS = 12;

export class AuthService {
  async hashPassword(plain: string): Promise<string> {
    return await bcrypt.hash(plain, ROUNDS);
  }

  async verifyPassword(plain: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plain, hash);
  }

  async generatePasswordResetToken(): Promise<string> {
    const token = crypto.randomUUID();
    return token;
  }
}

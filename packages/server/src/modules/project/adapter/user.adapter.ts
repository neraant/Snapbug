import type { UserRepository } from "@workspace/server/modules/identity/repository/user.repository";
import type { ProjectUserPort } from "@workspace/server/modules/project/port/user.port";

export class ProjectUserAdapter implements ProjectUserPort {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(userId: string): Promise<{ id: string } | null> {
    const user = await this.userRepository.findById(userId);
    return user ? { id: user.id } : null;
  }
}

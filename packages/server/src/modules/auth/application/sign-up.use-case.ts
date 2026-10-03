import type { UserPort } from "@workspace/server/modules/auth/port/user.port";
import type { AuthService } from "@workspace/server/modules/auth/service/auth.service";
import { ConflictError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  CreateUserInputDtoType,
  CreateUserOutputDtoType,
} from "@workspace/validation/modules/user/dto/create-user.schema";

export class SignUpUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly userPort: UserPort,
  ) {}

  async execute(input: CreateUserInputDtoType): Promise<CreateUserOutputDtoType> {
    const existing = await this.userPort.findByEmail(input.email);
    if (existing) throw new ConflictError(ERROR_CODES.EMAIL_ALREADY_TAKEN);

    const passwordHash = await this.authService.hashPassword(input.password);
    return await this.userPort.create({ email: input.email, name: input.name, passwordHash });
  }
}

import { JSON_SCHEMA_REGISTRY } from "@orpc/zod/zod4";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { createUserInputDtoSchema } from "@workspace/validation/modules/user/dto/create-user.schema";
import { userModelSchema } from "@workspace/validation/modules/user/dto/user.model";

JSON_SCHEMA_REGISTRY.add(userModelSchema, {
  title: "User",
  description: "Public user profile",
  examples: [
    { id: "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4", name: "Jane Doe", email: "user@example.com", role: UserRole.USER },
  ],
});

JSON_SCHEMA_REGISTRY.add(createUserInputDtoSchema, {
  title: "Sign up",
  description: "Create an account",
  examples: [{ email: "user@example.com", name: "Jane Doe", password: "password1" }],
});

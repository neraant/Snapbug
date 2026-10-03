import "@workspace/database/env/load-root-env";

import { pool } from "@workspace/database";
import { seedMembership } from "@workspace/database/seed/membership";
import { seedOrganization } from "@workspace/database/seed/organization";
import { seedUser } from "@workspace/database/seed/user";

async function main() {
  const users = await seedUser();
  const organizations = await seedOrganization();
  await seedMembership(users, organizations);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });

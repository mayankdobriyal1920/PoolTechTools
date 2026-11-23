import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: false,
  // Postgres is provisioned via the connection string in DATABASE_URL.
  // Branch policy: per-branch tuning
  branch: (branch) => {
    if (branch.isDefault) {
      return {};
    }
    if (!branch.exists) {
      return { ttl: "7d" };
    }
    return {};
  },
});

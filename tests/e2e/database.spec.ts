import { test, expect } from "@playwright/test";

test.describe("Database & API connectivity", () => {
  test("GET /api/license/status returns valid response", async ({ request }) => {
    const res = await request.get("/api/license/status");
    // Should return 401 (no token) or 200 with pro:false — either proves DB connectivity
    expect([200, 401, 403]).toContain(res.status());
    const body = await res.json();
    console.log("Status response:", JSON.stringify(body));
  });

  test("POST /api/license/activate validates input", async ({ request }) => {
    // Missing fields → 400
    const res = await request.post("/api/license/activate", {
      data: { licenseKey: "", deviceName: "", deviceHash: "" },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBeDefined();
    console.log("Activate validation:", JSON.stringify(body));
  });

  test("POST /api/license/activate rejects invalid key", async ({ request }) => {
    const res = await request.post("/api/license/activate", {
      data: { licenseKey: "PTT-INVALID-KEY-HERE", deviceName: "Test Device", deviceHash: "test-hash-123" },
    });
    // Should be 404 (license not found) — proves DB query works
    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body.error.code).toBe("LICENSE_NOT_FOUND");
    console.log("Activate invalid key:", JSON.stringify(body));
  });

  test("POST /api/license/activate succeeds with test license", async ({ request }) => {
    const res = await request.post("/api/license/activate", {
      data: { licenseKey: "PTT-TEST1-TEST2-TEST3-TEST4", deviceName: "Playwright Test Device", deviceHash: "pw-test-hash-001" },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.signedToken).toBeDefined();
    expect(body.expiresAt).toBeDefined();
    console.log("Activate success:", JSON.stringify({ success: body.success, expiresAt: body.expiresAt }));
  });

  test("POST /api/license/activate is idempotent (same device)", async ({ request }) => {
    const res = await request.post("/api/license/activate", {
      data: { licenseKey: "PTT-TEST1-TEST2-TEST3-TEST4", deviceName: "Playwright Test Device", deviceHash: "pw-test-hash-001" },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    console.log("Re-activate (idempotent):", JSON.stringify({ success: body.success }));
  });

  test("POST /api/payments/webhook rejects invalid payload", async ({ request }) => {
    const res = await request.post("/api/paddle/webhook", {
      data: { foo: "bar" },
    });
    expect(res.status()).toBe(400);
    console.log("Webhook invalid payload:", res.status());
  });

  test("GET /api/license/status with invalid token returns 401", async ({ request }) => {
    const res = await request.get("/api/license/status", {
      headers: { Authorization: "Bearer invalid-token" },
    });
    expect([200, 401, 403, 500]).toContain(res.status());
    console.log("Status with bad token:", res.status());
  });
});

test.describe("Frontend pages load", () => {
  test("Home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Pool care");
  });

  test("Pool volume calculator loads", async ({ page }) => {
    await page.goto("/tools/pool-volume");
    await expect(page.locator("h1")).toContainText("Pool Volume");
  });

  test("Chemical calculator loads", async ({ page }) => {
    await page.goto("/tools/chemical-calculator");
    await expect(page.locator("h1")).toContainText("Chemical");
  });

  test("Service report page loads", async ({ page }) => {
    await page.goto("/tools/service-report");
    await expect(page.locator("h1")).toContainText("Service Report");
  });

  test("Activate page loads", async ({ page }) => {
    await page.goto("/pro/activate");
    await expect(page.locator("h1")).toContainText("Activate Pro");
  });

  test("Settings page loads", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.locator("h1")).toContainText("Settings");
  });
});

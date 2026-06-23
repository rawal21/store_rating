/**
 * Seed script — bootstraps the first ADMIN user and sample data.
 *
 * Usage:
 *   npm run seed
 *
 * Safe to re-run — uses upsert so it won't create duplicates.
 */

import { loadConfig } from "@/common/helper/config.helper";
loadConfig();

import bcrypt from "bcrypt";
import { getPrisma } from "@/common/service/database.service";

const prisma = getPrisma();

async function main() {
  console.log("🌱  Starting seed...\n");

  // ── 1. Admin user ───────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("Admin@12345", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@storerate.com" },
    update: {},
    create: {
      name: "System Administrator Account",
      email: "admin@storerate.com",
      passwordHash: adminPassword,
      address: "123 Admin Street, Platform HQ",
      role: "ADMIN",
    },
  });
  console.log(`✅  Admin user:       ${admin.email}  (password: Admin@12345)`);

  // ── 2. Store owner ──────────────────────────────────────────────────────────
  const ownerPassword = await bcrypt.hash("Owner@12345", 10);
  const owner = await prisma.user.upsert({
    where: { email: "owner@bestgroceries.com" },
    update: {},
    create: {
      name: "Best Groceries Store Owner",
      email: "owner@bestgroceries.com",
      passwordHash: ownerPassword,
      address: "45 Market Lane, Springfield",
      role: "STORE_OWNER",
    },
  });
  console.log(`✅  Store owner:      ${owner.email}  (password: Owner@12345)`);

  // ── 3. Normal users ─────────────────────────────────────────────────────────
  const userPassword = await bcrypt.hash("User@12345", 10);

  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      name: "Alice Marie Johnson Williams",
      email: "alice@example.com",
      passwordHash: userPassword,
      address: "10 Elm Street, Shelbyville",
      role: "NORMAL_USER",
    },
  });
  console.log(`✅  Normal user:      ${alice.email}  (password: User@12345)`);

  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      name: "Robert James Anderson Cooper",
      email: "bob@example.com",
      passwordHash: userPassword,
      address: "22 Oak Avenue, Capital City",
      role: "NORMAL_USER",
    },
  });
  console.log(`✅  Normal user:      ${bob.email}  (password: User@12345)`);

  // ── 4. Stores ───────────────────────────────────────────────────────────────
  const store1 = await prisma.store.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Best Groceries",
      email: "contact@bestgroceries.com",
      address: "45 Market Lane, Springfield",
      ownerId: owner.id,
    },
  });
  console.log(`✅  Store:            ${store1.name}`);

  const store2 = await prisma.store.upsert({
    where: { id: "00000000-0000-0000-0000-000000000002" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000002",
      name: "Tech Gadgets Superstore",
      email: "info@techgadgets.com",
      address: "99 Silicon Blvd, Techville",
      ownerId: null,
    },
  });
  console.log(`✅  Store:            ${store2.name}`);

  // ── 5. Sample ratings ───────────────────────────────────────────────────────
  const rating1 = await prisma.rating.upsert({
    where: { userId_storeId: { userId: alice.id, storeId: store1.id } },
    update: {},
    create: { userId: alice.id, storeId: store1.id, value: 4 },
  });
  console.log(`✅  Rating:           ${alice.name} → ${store1.name}: ${rating1.value}/5`);

  const rating2 = await prisma.rating.upsert({
    where: { userId_storeId: { userId: bob.id, storeId: store1.id } },
    update: {},
    create: { userId: bob.id, storeId: store1.id, value: 5 },
  });
  console.log(`✅  Rating:           ${bob.name} → ${store1.name}: ${rating2.value}/5`);

  const rating3 = await prisma.rating.upsert({
    where: { userId_storeId: { userId: alice.id, storeId: store2.id } },
    update: {},
    create: { userId: alice.id, storeId: store2.id, value: 3 },
  });
  console.log(`✅  Rating:           ${alice.name} → ${store2.name}: ${rating3.value}/5`);

  console.log("\n🎉  Seed complete!\n");
  console.log("Credentials summary:");
  console.log("  Admin       → admin@storerate.com       / Admin@12345");
  console.log("  Store Owner → owner@bestgroceries.com   / Owner@12345");
  console.log("  User        → alice@example.com         / User@12345");
  console.log("  User        → bob@example.com           / User@12345");
}

main()
  .catch((e) => {
    console.error("❌  Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

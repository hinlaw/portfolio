import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const mockExpenses = [
  {
    merchant: "7-Eleven",
    amount: 105.5,
    date: "2025-02-20",
    imageUrl: "https://placehold.co/400x300/1a1a2e/eee?text=7-Eleven",
  },
  {
    merchant: "全家便利商店",
    amount: 89,
    date: "2025-02-21",
    imageUrl: "https://placehold.co/400x300/16213e/eee?text=全家",
  },
  {
    merchant: "Starbucks",
    amount: 150,
    date: "2025-02-22",
    imageUrl: "https://placehold.co/400x300/0f3460/eee?text=Starbucks",
  },
  {
    merchant: "麥當勞",
    amount: 230,
    date: "2025-02-23",
    imageUrl: "https://placehold.co/400x300/533483/eee?text=麥當勞",
  },
  {
    merchant: "家樂福",
    amount: 1250,
    date: "2025-02-24",
    imageUrl: "https://placehold.co/400x300/e94560/eee?text=家樂福",
  },
];

async function main() {
  console.log("🌱 Seeding mock data...");

  // 清空既有資料（方便重複測試）
  await prisma.expense.deleteMany();
  console.log("   Cleared existing expenses");

  const result = await prisma.expense.createManyAndReturn({
    data: mockExpenses,
  });

  console.log(`✅ Created ${result.length} expense records`);
  result.forEach((exp) => {
    console.log(`   - ${exp.merchant}: $${exp.amount} (${exp.date})`);
  });
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

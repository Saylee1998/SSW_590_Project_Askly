import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const existingUsers = await prisma.user.count();

  if (existingUsers > 0) {
    console.log("Seed skipped: database not empty.");
    process.exit(0);  
  }

  console.log("Seeding database...");

  const filePath = path.join(__dirname, "..", "data", "seed-data.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(raw);

  const users = new Map();
  const tags = new Map();
  const questions = new Map();

  for (const u of data.users) {
    const created = await prisma.user.create({
      data: {
        email: u.email,
        username: u.username,
        password: u.password,
        role: u.role
      }
    });
    users.set(created.email, created);
    console.log("User:", created.email);
  }

  for (const t of data.tags) {
    const created = await prisma.tag.create({
      data: {
        name: t.name,
        description: t.description
      }
    });
    tags.set(created.name, created);
    console.log("Tag:", created.name);
  }

  for (const q of data.questions) {
    const author = users.get(q.authorEmail);
    const connectTags = q.tagNames.map((name) => ({ id: tags.get(name).id }));

    const created = await prisma.question.create({
      data: {
        title: q.title,
        content: q.content,
        author: { connect: { id: author.id } },
        tags: { connect: connectTags }
      }
    });

    questions.set(created.title, created);
    console.log("Question:", created.title);
  }

  for (const a of data.answers) {
    const author = users.get(a.authorEmail);
    const question = questions.get(a.questionTitle);

    await prisma.answer.create({
      data: {
        content: a.content,
        isAccepted: a.isAccepted || false,
        author: { connect: { id: author.id } },
        question: { connect: { id: question.id } }
      }
    });

    console.log(`Answer on "${a.questionTitle}" by ${a.authorEmail}`);
  }

  console.log("Seed completed!");
}

main()
  .catch((err) => {
    console.error("Seed failed", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

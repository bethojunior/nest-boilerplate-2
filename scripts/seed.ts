const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const existingUser = await prisma.user.count();

  if (existingUser === 0) {
    const plainPassword = '123456789';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const userClient = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'jhon@doe.com.br',
        phone: '8599999999',
        password: hashedPassword,
      },
    });

    console.log('✅ User Seed success:', userClient);
  } else {
    console.log('⚠️ Database was initialized.');
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

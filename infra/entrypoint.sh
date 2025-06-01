#!/bin/sh

echo "➡️ Executando Prisma Generate"
npx prisma generate

echo "➡️ Executando Prisma Migrate Deploy"
npx prisma migrate deploy

echo "➡️ Executando script de seed para inserir as chaves no banco (se necessário)"
node scripts/seed.ts

echo "➡️ Iniciando aplicação Node.js"
exec node dist/src/main
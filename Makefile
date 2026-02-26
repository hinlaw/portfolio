.PHONY: dev build start install lint db-generate db-migrate db-push db-seed db-studio db-reset clean

# Development
dev:
	npm run dev

build:
	npm run build

start:
	npm run start

# Database (Prisma)
db-generate:
	npx prisma generate

db-migrate:
	npx prisma migrate dev

db-push:
	npx prisma db push

db-studio:
	npx prisma studio

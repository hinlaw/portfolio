.PHONY: dev build start install lint test test-watch db-generate db-migrate db-push db-seed db-studio db-reset clean

# Development
dev:
	npm run dev

build:
	npm run build

start:
	npm run start

# Test
test:
	npm test

test-watch:
	npm run test:watch

# Database (Prisma)
db-generate:
	npx prisma generate

db-migrate:
	npx prisma migrate dev

db-push:
	npx prisma db push

db-studio:
	npx prisma studio

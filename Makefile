.PHONY: frontend backend dev install-frontend install-backend clean help

# 預設端口
FRONTEND_PORT ?= 3000
BACKEND_PORT ?= 5000

dev: ## 執行前端開發伺服器
	cd frontend && npm run dev

build: ## 執行後端伺服器
	cd backend && PORT=$(BACKEND_PORT) go run cmd/api/main.go

build-frontend: ## 建置前端生產版本
	cd frontend && npm run build

clean: ## 清理建置檔案
	rm -rf frontend/.next
	rm -rf frontend/node_modules/.cache
	rm -rf backend/bin

install-frontend: ## 安裝前端依賴
	cd frontend && npm install

install-backend: ## 安裝後端依賴
	cd backend && go mod download

install: install-frontend install-backend ## 安裝所有依賴
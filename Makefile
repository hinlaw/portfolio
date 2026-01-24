.PHONY: frontend backend dev install-frontend install-backend clean help

# 預設端口
FRONTEND_PORT ?= 3000
BACKEND_PORT ?= 5000

install-frontend: ## 安裝前端依賴
	@echo "安裝前端依賴..."
	cd frontend && npm install

install-backend: ## 安裝後端依賴
	@echo "安裝後端依賴..."
	cd backend && go mod download

install: install-frontend install-backend ## 安裝所有依賴

frontend: ## 執行前端開發伺服器
	@echo "啟動前端伺服器 (http://localhost:$(FRONTEND_PORT))..."
	cd frontend && npm run dev

backend: ## 執行後端伺服器
	@echo "啟動後端伺服器 (http://127.0.0.1:$(BACKEND_PORT))..."
	cd backend && PORT=$(BACKEND_PORT) go run cmd/api/main.go

dev: ## 同時執行前端和後端（並行）
	@echo "同時啟動前端和後端..."
	@echo "前端: http://localhost:$(FRONTEND_PORT)"
	@echo "後端: http://127.0.0.1:$(BACKEND_PORT)"
	@make -j2 frontend backend

build-frontend: ## 建置前端生產版本
	@echo "建置前端..."
	cd frontend && npm run build

build-backend: ## 建置後端可執行檔
	@echo "建置後端..."
	cd backend && go build -o bin/api cmd/api/main.go

build: build-frontend build-backend ## 建置所有專案

clean: ## 清理建置檔案
	@echo "清理建置檔案..."
	rm -rf frontend/.next
	rm -rf frontend/node_modules/.cache
	rm -rf backend/bin

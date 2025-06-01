docker-build-and-up:
	@echo "🐳 Buildando e subindo containers..."
	@docker compose -f infra/docker-compose.yaml up -d --build

docker-re-build-and-up:
	@echo "🐳 Derrubando containers existentes..."
	@docker compose -f infra/docker-compose.yaml down
	@echo "🐳 Buildando e subindo containers..."
	@docker compose -f infra/docker-compose.yaml up -d --build

up-dev:
	@echo "⬆️  Subindo containers..."
	@docker compose -f infra/docker-compose.dev.yaml up -d

down-dev:
	@echo "⬇️  Derrubando containers..."
	@docker compose -f infra/docker-compose.dev.yaml down

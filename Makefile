.PHONY: help dev test build setup

help:
	@echo "PulsePilot Monorepo Commands:"
	@echo "  make dev      - Start Vault, MCP Server, and Next.js Web app concurrently"
	@echo "  make test     - Run full pytest suite for Vault and MCP gating"
	@echo "  make build    - Build Next.js and Chrome Extension production bundles"
	@echo "  make setup    - Install Python and Node dependencies"

setup:
	python3 -m venv .venv
	./.venv/bin/pip install -r vault/requirements.txt -r mcp-server/requirements.txt
	cd web && npm install --legacy-peer-deps
	cd extension && npm install

build:
	cd web && npm run build
	cd extension && npm run build

test:
	PYTHONPATH=. ./.venv/bin/pytest vault/tests/ mcp-server/tests/ -v

dev:
	python3 dev.py

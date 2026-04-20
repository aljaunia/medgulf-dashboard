#!/bin/bash
set -e

echo "🚀 Deploying MedGulf Dashboard to Hetzner..."

# 1. Ensure the shared network exists (n8n likely already uses this)
docker network create medgulf-net 2>/dev/null || echo "Network already exists ✓"

# 2. Build and start
docker compose --env-file .env up -d --build

echo ""
echo "✅ Done! Dashboard will be live at:"
echo "   https://$(grep DASHBOARD_DOMAIN .env | cut -d= -f2)"
echo ""
echo "📋 Useful commands:"
echo "   docker compose logs -f dashboard     # live logs"
echo "   docker compose restart dashboard     # restart app"
echo "   docker compose down                  # stop everything"
echo "   docker compose up -d --build         # rebuild + redeploy"
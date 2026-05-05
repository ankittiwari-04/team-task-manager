#!/bin/bash

# ============================================================
# GitHub Repository Setup Script
# Run this ONCE after pushing to GitHub to configure the repo
# Requires: GitHub CLI (gh) — install from https://cli.github.com
# Usage: bash scripts/setup-github-repo.sh
# ============================================================

REPO="ankittiwari-04/team-task-manager"

echo "Setting up GitHub repository metadata..."

# Set description and website (update URL after deployment)
gh repo edit "$REPO" \
  --description "Full-stack team task manager — Kanban boards, JWT auth, role-based access, real-time notifications, analytics dashboard" \
  --homepage "https://your-vercel-url.vercel.app" \
  --add-topic "react" \
  --add-topic "typescript" \
  --add-topic "nodejs" \
  --add-topic "express" \
  --add-topic "prisma" \
  --add-topic "postgresql" \
  --add-topic "tailwindcss" \
  --add-topic "zustand" \
  --add-topic "react-query" \
  --add-topic "jwt" \
  --add-topic "kanban" \
  --add-topic "fullstack"

echo "✅ Repository metadata updated."
echo ""
echo "Next steps:"
echo "  1. Deploy backend to Railway: https://railway.app"
echo "  2. Deploy frontend to Vercel: https://vercel.com"
echo "  3. Update --homepage above with your real Vercel URL"
echo "  4. Run: gh repo edit $REPO --homepage YOUR_VERCEL_URL"

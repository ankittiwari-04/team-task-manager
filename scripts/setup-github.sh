#!/bin/bash
set -e

# Ensure gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI (gh) could not be found. Please install it first."
    exit 1
fi

echo "Setting up GitHub repository configuration..."

# Set repository description
gh repo edit --description "Full-stack team task manager — Kanban boards, JWT auth, role-based access control, real-time notifications & analytics dashboard. Built with React, Node.js & PostgreSQL."

# Set repository topics
gh repo edit --add-topic "react" \
  --add-topic "typescript" \
  --add-topic "nodejs" \
  --add-topic "express" \
  --add-topic "postgresql" \
  --add-topic "prisma" \
  --add-topic "tailwindcss" \
  --add-topic "zustand" \
  --add-topic "react-query" \
  --add-topic "jwt" \
  --add-topic "kanban" \
  --add-topic "fullstack" \
  --add-topic "project-management"

echo "✅ GitHub repository updated successfully!"
echo "--------------------------------------------------------"
echo "Instructions: To add your Vercel website URL to the repo"
echo "header, go to GitHub, click the gear icon (⚙️) next to"
echo "the 'About' section, and paste your Live URL."
echo "--------------------------------------------------------"

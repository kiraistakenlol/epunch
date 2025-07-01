#!/bin/bash

echo "🚀 Starting v2 Migration Setup..."

# Navigate to merchant-app directory
cd "$(dirname "$0")"

echo "📦 Installing shadcn/ui dependencies..."
yarn add tailwindcss-animate class-variance-authority clsx tailwind-merge lucide-react
yarn add -D tailwindcss postcss autoprefixer

echo "🎨 Initializing shadcn/ui..."
npx shadcn-ui@latest init --yes --default --src-dir src --use-typescript

echo "🧩 Installing core shadcn/ui components..."
npx shadcn-ui@latest add button input card table form select switch dialog toast badge tabs sheet dropdown-menu separator skeleton progress alert avatar checkbox label scroll-area --yes

echo "📁 Creating v2 directory structure..."

# Create main v2 directory
mkdir -p src/components/v2

# Create subdirectories with hooks where needed
mkdir -p src/components/v2/ui
mkdir -p src/components/v2/layout
mkdir -p src/components/v2/auth
mkdir -p src/components/v2/scanner/hooks
mkdir -p src/components/v2/loyalty/hooks
mkdir -p src/components/v2/design/hooks
mkdir -p src/components/v2/dashboard/hooks
mkdir -p src/components/v2/forms/hooks
mkdir -p src/components/v2/data-display
mkdir -p src/components/v2/onboarding/hooks
mkdir -p src/components/v2/mockups
mkdir -p src/components/v2/feedback
mkdir -p src/components/v2/qr/hooks

echo "📝 Creating index files..."

# Create main v2 index
cat > src/components/v2/index.ts << 'EOF'
// v2 Components - Clean Architecture

// Re-export all shadcn/ui components
export * from './ui/button';
export * from './ui/input';
export * from './ui/card';
export * from './ui/table';
export * from './ui/form';
export * from './ui/select';
export * from './ui/switch';
export * from './ui/dialog';
export * from './ui/toast';
export * from './ui/badge';
export * from './ui/tabs';
export * from './ui/sheet';
export * from './ui/dropdown-menu';

// Layout components
export * from './layout/AppLayout';
export * from './layout/AppHeader';
export * from './layout/AppSidebar';
export * from './layout/PageContainer';
export * from './layout/ProfileMenu';

// Auth components
export * from './auth/LoginForm';
export * from './auth/AuthGuard';
export * from './auth/RoleGuard';

// Feature components (will be added during migration)
// export * from './scanner';
// export * from './loyalty';
// export * from './design';
// export * from './dashboard';
// export * from './forms';
// export * from './data-display';
EOF

# Create feature index files
features=("layout" "auth" "scanner" "loyalty" "design" "dashboard" "forms" "data-display" "onboarding" "mockups" "feedback" "qr")

for feature in "${features[@]}"; do
  cat > "src/components/v2/$feature/index.ts" << EOF
// $feature components
// TODO: Add exports as components are created
EOF
done

echo "🎨 Updating Tailwind config for v2..."

# Update tailwind.config.js to include v2 directory
if [ -f "tailwind.config.js" ]; then
  sed -i '' 's|"./src/\*\*/\*\.{js,ts,jsx,tsx}"|"./src/**/*.{js,ts,jsx,tsx}"|g' tailwind.config.js
fi

echo "✅ v2 Migration setup complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Start with Phase 1: Create layout components in src/components/v2/layout/"
echo "2. Import from 'src/components/v2' instead of foundational/shared"
echo "3. Use Tailwind classes + CSS Modules for styling"
echo "4. Co-locate hooks with their components"
echo ""
echo "🔍 Key Files:"
echo "- src/components/v2/index.ts (main exports)"
echo "- src/components/v2-structure-proposal.md (full plan)"
echo "- shadcn-migration-plan.md (detailed migration guide)"
echo ""
echo "🚀 Ready to start building v2 components!" 
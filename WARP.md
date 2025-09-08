# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Daily Check-in is a comprehensive personal productivity and habit tracking application built with Next.js. It helps users track daily goals, habits, tasks, projects, and reflections through a sophisticated database-driven system.

## Common Commands

### Development
```bash
# Start development server with Turbopack
pnpm dev

# Build for production with Turbopack
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

### Database Operations
```bash
# Generate Prisma client after schema changes
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Reset and seed database (if needed)
npx prisma migrate reset

# Open Prisma Studio for database inspection
npx prisma studio
```

## Architecture Overview

### Core Data Model
The application is built around a comprehensive Prisma schema with the following key entities:

- **User**: Central user model with timezone and preferences support
- **Day**: Daily check-in entries with metrics, reflections, and completion status
- **Project**: Hierarchical project management system with sub-projects
- **Task**: Task management within projects with time tracking
- **Goal**: Goal system with quantifiable targets and daily goal tracking
- **Habit**: Habit tracking with daily logs and frequency targets
- **Note**: Enhanced note system with types (GENERAL, MEETING, IDEA, LEARNING, REFLECTION, PLANNING)
- **Category/Tag**: Flexible organization system

### State Management Architecture
- **Zustand stores** in `/stores/` directory for client-side state management
- Each major entity has its own store (day.ts, project.ts, goal.ts, etc.)
- Store pattern includes: state, getters, setters, and reset functionality

### Authentication
- **NextAuth v5** (beta) with JWT strategy
- **Google OAuth** provider configured
- **Prisma adapter** for user/session persistence
- Session includes user ID and access token

### UI Component Structure
- **shadcn/ui** components with "new-york" style and neutral base color
- **Radix UI** primitives for accessibility
- **Tailwind CSS** for styling with CSS variables for theming
- **Framer Motion** for animations
- Component organization:
  - `/components/ui/`: Base UI components
  - `/components/days/`: Day-specific components
  - `/components/settings/`: Settings and customization components
  - `/components/global/`: Shared application components

### Database Configuration
- **PostgreSQL** with Supabase
- **Connection pooling** via DATABASE_URL
- **Direct connection** via DIRECT_URL for migrations
- Comprehensive indexing strategy for performance

## Key Development Patterns

### Component Structure
```typescript
// Typical component pattern used throughout
"use client";
import { useState, useEffect } from "react";
import { useStore } from "@/stores/entityStore";

export default function Component() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return <Skeleton />; // Prevent hydration issues
  }
  
  return <div>...</div>;
}
```

### Store Pattern
```typescript
// Standard Zustand store structure
interface EntityState {
  entities: Entity[];
  selectedEntity: Entity | null;
  loading: boolean;
  error: string | null;
  
  // Getters
  getEntities: () => Entity[];
  getEntityById: (id: string) => Entity | undefined;
  
  // Setters
  setEntities: (entities: Entity[]) => void;
  addEntity: (entity: Entity) => void;
  updateEntity: (id: string, updates: Partial<Entity>) => void;
  removeEntity: (id: string) => void;
  reset: () => void;
}
```

### Server Actions Pattern
Server actions are located in `/actions/` directory and follow this structure:
- User session validation
- Zustand store integration
- Error handling with try-catch blocks

## Environment Setup

Required environment variables (see `env.example`):
- `AUTH_SECRET`: NextAuth secret key
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Google OAuth credentials
- `NEXTAUTH_URL`: Application URL (http://localhost:3000 for development)
- `NEXT_PUBLIC_SUPABASE_URL` & related Supabase keys
- `DATABASE_URL` & `DIRECT_URL`: PostgreSQL connection strings

## Project-Specific Considerations

### Day Customization System
Users can customize which sections appear in their daily view through localStorage persistence:
- Default sections: notes, reflections, tasks, goals, metrics, habits
- Customization stored in localStorage as `dayCustomization`
- Component-level customization in `DayTrackingCustomization.tsx`

### Landing Page Structure
The main page (`app/page.tsx`) is a marketing landing page with sections:
- HeroSection
- FeaturesSection  
- HowItWorksSection
- TestimonialsSection
- CallToActionSection
- Footer

### Hierarchical Data Models
Several entities support hierarchical relationships:
- Projects can have sub-projects (parentId/subprojects)
- Tasks can have subtasks (parentId/subtasks)
- Goals can have sub-goals (parentId/subgoals)

### Time Zone Support
User model includes timezone field for proper date/time handling across different time zones.

## File Organization Principles

- `/app/`: Next.js 13+ app router pages and layouts
- `/components/`: React components organized by feature
- `/lib/`: Utility functions, database client, authentication
- `/stores/`: Zustand state management stores
- `/actions/`: Server actions for data mutations
- `/hooks/`: Custom React hooks
- `/prisma/`: Database schema and migrations
- `/public/`: Static assets

## Notes for AI Development

When working with this codebase:
1. Always check if components need client-side rendering (`"use client"`)
2. Use the established Zustand store patterns for state management
3. Follow the Prisma schema relationships when implementing features
4. Maintain the hierarchical nature of projects, tasks, and goals
5. Consider timezone implications for date-based features
6. Use the existing UI component library (shadcn/ui with Radix primitives)
7. Follow the server action patterns in `/actions/` for data mutations
8. Remember that this is both a landing page and a productivity application

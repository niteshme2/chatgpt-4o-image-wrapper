# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `npm run dev`: Start development server
- `npm run build`: Build the application for production
- `npm run start`: Start the production server
- `npm run lint`: Run ESLint for code linting

## Code Style Guidelines
- **Imports**: Group imports by type: React, next/*, external libraries, internal components, utils
- **Formatting**: Use 2-space indentation, double quotes for strings, and semi-colons
- **Component Structure**: Prefer functional components with explicit types
- **Naming**:
  - Components: PascalCase
  - Functions and variables: camelCase
  - Files: kebab-case for component files, camelCase for utilities
- **Types**: Always use explicit type definitions, prefer interfaces for objects
- **Utilities**: Use centralized utils (src/lib/utils.ts)
- **Styling**: Use CSS variables for theming, Tailwind for components with cn() utility
- **Error Handling**: Use try/catch for API calls, return proper error responses
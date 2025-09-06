
# ScodeQRMihome - Xiaomi Mijia Smart Home Control

**ALWAYS follow these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

ScodeQRMihome is a Next.js TypeScript web application for managing Xiaomi Mijia smart home devices. It features a cyberpunk-themed UI with QR code authentication, device control dashboard, and API integration with Xiaomi's Mijia ecosystem.

## Working Effectively

### Prerequisites and Initial Setup
- Run `npm install` to install all dependencies
  - Takes approximately 12-40 seconds to complete (12s with cache, 40s clean install)
  - NEVER CANCEL: Wait for full completion
  - Installs 423+ packages without vulnerabilities

### Build and Development Commands
- **Development server**: `npm run dev`
  - Starts in approximately 1 second using Turbopack
  - Runs on http://localhost:3000 (or next available port like 3001)
  - NEVER CANCEL: Server starts quickly but may take time for hot reloads
  - Set timeout to 60+ seconds for any build operations

- **Production build**: `npm run build`
  - Takes approximately 14 seconds with Turbopack optimization
  - NEVER CANCEL: Build process is fast but critical for deployment
  - Set timeout to 120+ seconds to be safe
  - Generates optimized static pages and API routes

- **Production start**: `npm run start`
  - **KNOWN ISSUE**: Currently fails with routes manifest error when using Turbopack
  - Use after running `npm run build`
  - For production testing, use `npm run dev` instead

- **Linting**: `npm run lint`
  - Takes approximately 3 seconds to complete
  - Currently has 25 errors and 42 warnings (mostly TypeScript `any` types and unused variables)
  - Build succeeds despite linting issues due to `ignoreBuildErrors: true` in next.config.ts
  - NEVER CANCEL: Linting provides valuable feedback

## Application Structure and Navigation

### Key Directories
```
/src/app/          - Next.js app router pages and API routes
├── api/           - API endpoints for auth, devices, homes, scenes
├── dashboard/     - Main device management interface  
├── login/         - Authentication pages
└── page.tsx       - Homepage with QR login

/src/components/   - Reusable UI components
├── dashboard/     - Dashboard-specific components
├── layout/        - Layout components (sidebar, etc.)
└── ui/           - Base UI components (buttons, cards, etc.)

/src/lib/          - Business logic and utilities
├── mijia/         - Xiaomi Mijia API integration
├── api.ts         - API client wrapper
├── store.ts       - State management
└── utils.ts       - Utility functions
```

### API Routes
- `/api/auth/qr` - QR code authentication
- `/api/auth/qr-test` - Test QR code generation
- `/api/devices` - Device management
- `/api/devices/[id]` - Individual device control
- `/api/homes` - Home/room management  
- `/api/scenes/[homeId]` - Scene management
- `/api/scenes/run` - Execute scenes

## Validation and Testing

### CRITICAL: Manual Validation Requirements
After making any changes, ALWAYS run through these complete scenarios:

1. **Homepage QR Generation Flow**:
   - Navigate to http://localhost:3000
   - Click "Tạo mã QR" button
   - Verify error handling when Xiaomi service unavailable (expected: shows "Lỗi khi tạo mã QR" with retry button)
   - Test retry functionality

2. **Dashboard Interface**:
   - Navigate to http://localhost:3000/dashboard  
   - Verify dashboard loads with device statistics (0 devices expected without auth)
   - Test tab navigation between "Thiết bị", "Kịch bản", "Chia sẻ"
   - Verify responsive cyberpunk-themed UI

3. **Login Page Functionality**:
   - Navigate to http://localhost:3000/login
   - Test tab switching between "📱 QR Code" and "👤 Tài khoản" 
   - Verify QR generation button works
   - Check cyberpunk styling and animations

### Build Validation
ALWAYS run these commands after making changes:
```bash
npm run lint    # Check for code issues (expect warnings, not errors)
npm run build   # Verify production build succeeds (14s, NEVER CANCEL)
npm run dev     # Test development server (1s startup, NEVER CANCEL)
```

### Linting Expectations
- Current linting shows 67 problems (25 errors, 42 warnings)
- Most errors are TypeScript `@typescript-eslint/no-explicit-any` 
- Build succeeds despite errors due to `ignoreBuildErrors: true`
- Do NOT fix unrelated linting issues unless directly related to your changes

## Technology Stack and Configuration

### Core Technologies
- **Next.js 15.5.2** with Turbopack for fast builds
- **React 19.1.0** with TypeScript
- **Tailwind CSS 4** with custom cyberpunk theme
- **Radix UI** components for accessibility
- **Zustand** for state management
- **QRCode.js** for QR generation

### Key Configuration Files
- `next.config.ts` - Next.js config with build error ignoring
- `tailwind.config.ts` - Custom cyberpunk theme with animations
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - ESLint rules (extends Next.js standards)
- `package.json` - Dependencies and npm scripts

### Environment and Dependencies
- Uses `--turbopack` flag for faster development and builds
- No test framework configured (no Jest, Cypress, or Playwright)
- No Docker or deployment configuration present
- Runs on Node.js with standard npm package management

## Common Development Tasks

### Adding New Features
1. ALWAYS run the validation scenarios first to establish baseline
2. Use existing component patterns from `/src/components/ui/`
3. Follow the cyberpunk theme color scheme (cyber-primary: #00fff7, etc.)
4. Add API routes in `/src/app/api/` following existing patterns
5. Update Mijia integration in `/src/lib/mijia/` if needed

### Debugging Issues
1. Check browser console for errors (app uses extensive console logging)
2. Verify development server is running on correct port
3. Check API route responses in Network tab
4. Examine Zustand store state for client-side issues

### UI Development
- Components use Tailwind classes with custom cyberpunk theme
- Animations use CSS keyframes defined in `tailwind.config.ts`
- Icons from `lucide-react` library
- Responsive design with mobile-first approach

## Important Notes and Limitations

### Current Limitations
- QR authentication requires connection to Xiaomi services (may fail in sandboxed environments)
- No automated test suite - rely on manual validation
- Linting has many warnings but build succeeds
- No CI/CD pipeline configured
- **Production start (`npm run start`) currently fails with Turbopack - use `npm run dev` for testing**

### Performance Considerations
- Turbopack provides fast builds and hot reloads
- Images should use Next.js Image component (current warnings about `<img>` tags)
- API calls have proper error handling but may timeout without external connectivity

### Security Notes
- Authentication tokens handled in Zustand store
- API routes include proper error handling
- No sensitive credentials in codebase (uses environment variables pattern)

## Troubleshooting

### Build Failures
- Run `npm install` if dependencies are missing
- Clear `.next` directory and rebuild if cache issues occur
- Check Node.js version compatibility

### Development Server Issues  
- Port conflicts: Server auto-assigns available port (3000, 3001, etc.)
- Hot reload issues: Restart development server
- Style conflicts: Clear browser cache

### API Connection Issues
- Expected behavior: QR generation fails without Xiaomi service access
- Dashboard shows empty state without authentication
- Error messages provide user feedback

## File Reference

### Quick Access Files
```bash
# Main pages
src/app/page.tsx              # Homepage with QR login
src/app/dashboard/page.tsx    # Main dashboard interface  
src/app/login/page.tsx        # Authentication page

# Key API routes
src/app/api/auth/qr/route.ts  # QR authentication logic
src/app/api/devices/route.ts  # Device management API

# Core business logic
src/lib/mijia/api.ts          # Xiaomi API integration
src/lib/api.ts                # API client wrapper
src/lib/store.ts              # Application state management

# Configuration
next.config.ts                # Next.js configuration
tailwind.config.ts            # Tailwind/styling configuration
package.json                  # Dependencies and scripts
```

### Common Command Summary
```bash
npm install           # Install dependencies (12-40s depending on cache)
npm run dev          # Start development (1s)
npm run build        # Production build (14s) 
npm run lint         # Code linting (3s)
# npm run start      # Production server (currently broken with Turbopack)
```

**Remember: NEVER CANCEL any build operations. Set timeouts to 120+ seconds minimum.**
=======
# scodeQRMihome - Xiaomi Mijia Smart Home Control

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

This is a Next.js 15.5.2 TypeScript application that integrates with Xiaomi Mijia/Mi Home APIs to provide QR code authentication and smart home device management. The application features a cyberpunk-styled UI with Vietnamese language support.

## Working Effectively

### Bootstrap and Setup
- Install Node.js dependencies: `npm install` -- takes 20 seconds. Safe to use default timeout.
- The application uses Node.js v20.19.4 and npm v10.8.2.
- **NEVER CANCEL**: Build process takes 15 seconds but allow 2+ minutes timeout for safety.
- **NEVER CANCEL**: Development server starts in 1 second but allow 1+ minute timeout for safety.

### Core Development Commands
- Build the application: `npm run build` -- takes 15 seconds. **NEVER CANCEL**: Set timeout to 3+ minutes.
- Start development server: `npm run dev` -- starts in 1 second. **NEVER CANCEL**: Set timeout to 2+ minutes.
- Start production server: `npm start` -- starts quickly after build.
- Run linting: `npm run lint` -- takes 3 seconds but has many warnings/errors (expected).

### Validation Requirements
**ALWAYS run these validation steps after making changes:**
1. Build the application: `npm run build` to ensure no build errors.
2. Start the dev server: `npm run dev` and verify it starts on http://localhost:3000.
3. Test QR code generation: Navigate to http://localhost:3000 and click "Tạo mã QR" button.
4. Test the offline QR endpoint: `curl -X POST http://localhost:3000/api/auth/qr-test`
5. Navigate to dashboard: http://localhost:3000/dashboard to verify UI functionality.

## Manual Testing Scenarios

### Primary User Flow Validation
**ALWAYS test these complete scenarios after making changes:**

1. **QR Code Authentication Flow**:
   - Navigate to http://localhost:3000
   - Click the "Tạo mã QR" button 
   - Verify error handling (503 expected in test environment)
   - Test offline QR generation: `curl -X POST http://localhost:3000/api/auth/qr-test`
   - Verify JSON response contains qrUrl, qrId, and loginUrl

2. **Dashboard Interface**:
   - Navigate to http://localhost:3000/dashboard
   - Verify cyberpunk-styled interface loads with Vietnamese text
   - Check device count cards (0 devices expected without authentication)
   - Test tab navigation: "Thiết bị", "Kịch bản", "Chia sẻ"
   - Verify "Tải lại" button functionality

3. **API Endpoint Testing**:
   - Test QR test endpoint: `curl -X POST http://localhost:3000/api/auth/qr-test`
   - Test devices endpoint: `curl -X GET http://localhost:3000/api/devices` (error expected)
   - Test homes endpoint: `curl -X GET http://localhost:3000/api/homes` (error expected)

## Build Configuration

### Known Issues
- ESLint reports 67 problems (25 errors, 42 warnings) - this is expected and build still succeeds.
- TypeScript errors are disabled during builds (`ignoreBuildErrors: true` in next.config.ts).
- ESLint is disabled during builds (`ignoreDuringBuilds: true` in next.config.ts).
- External API calls to Xiaomi services fail in test environments (expected).

### Build Artifacts
- Production build creates `.next/` directory
- Static pages are pre-rendered
- Build outputs show route information and bundle sizes
- Total First Load JS: ~129 kB shared by all pages

## Code Structure and Navigation

### Key Directories
- **`src/app/`** - Next.js app router pages and API routes
  - **`src/app/api/auth/`** - Authentication endpoints (QR, QR-test)
  - **`src/app/api/devices/`** - Device management endpoints
  - **`src/app/api/homes/`** - Home/room management endpoints
  - **`src/app/api/scenes/`** - Scene/automation endpoints
  - **`src/app/dashboard/`** - Main dashboard page
  - **`src/app/login/`** - Login page
  - **`src/app/page.tsx`** - Home page with QR authentication

- **`src/lib/mijia/`** - Mijia API integration library
  - **`auth.ts`** - QR code and password authentication
  - **`api.ts`** - Main Mijia API client
  - **`device.ts`** - Device control wrapper
  - **`types.ts`** - TypeScript interfaces
  - **`index.ts`** - Module exports

- **`src/components/`** - React components
  - **`ui/`** - Shadcn UI components
  - **`dashboard/`** - Dashboard-specific components
  - **`layout/`** - Layout components (Sidebar, etc.)

### Critical Files to Monitor
- **Always check** `src/app/api/auth/qr/route.ts` when modifying authentication
- **Always check** `src/lib/mijia/auth.ts` when changing Mijia integration
- **Always check** `src/app/globals.css` when modifying cyberpunk styling
- **Always check** `MIJIA_INTEGRATION.md` for API usage examples

## Environment and Dependencies

### Runtime Requirements
- Node.js v20.19.4+ (verified working)
- npm v10.8.2+ (verified working)
- Next.js 15.5.2 with Turbopack
- TypeScript 5+

### Key Dependencies
- **UI**: @radix-ui components, TailwindCSS, Lucide React icons
- **State**: Zustand for state management
- **QR**: qrcode library for QR generation
- **Auth**: uuid for session management
- **Styling**: tailwindcss-animate, next-themes for dark mode

### Configuration Files
- **`next.config.ts`** - Next.js configuration with disabled error checking
- **`tailwind.config.ts`** - TailwindCSS with cyberpunk color scheme
- **`tsconfig.json`** - TypeScript configuration with path aliases (@/*)
- **`eslint.config.mjs`** - ESLint configuration (many warnings expected)

## Development Workflow

### Before Making Changes
1. Always run `npm install` in a fresh environment
2. Verify build: `npm run build` (15 seconds, use 3+ minute timeout)
3. Start dev server: `npm run dev` (1 second, use 2+ minute timeout)
4. Test core functionality by visiting http://localhost:3000

### After Making Changes
1. **NEVER CANCEL**: Always let builds complete (3+ minute timeout minimum)
2. Test build: `npm run build`
3. Test development server: `npm run dev`
4. **MANDATORY**: Test QR generation: navigate to / and click "Tạo mã QR"
5. **MANDATORY**: Test dashboard: navigate to /dashboard
6. **MANDATORY**: Test API: `curl -X POST http://localhost:3000/api/auth/qr-test`
7. Run `npm run lint` (warnings expected, focus on new errors only)

### Debugging Tips
- Console logs are extensive - check browser developer tools
- QR test endpoint always works offline: `/api/auth/qr-test`
- Main QR endpoint requires Xiaomi service connectivity: `/api/auth/qr`
- Dashboard shows 0 devices without authentication (expected)
- Application uses Vietnamese language interface

## Common Tasks and Outputs

### Repository Root Structure
```
.
├── .github/
├── .git/
├── .gitignore
├── MIJIA_INTEGRATION.md
├── README.md
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public/
├── src/
├── tailwind.config.ts
└── tsconfig.json
```

### Sample npm run build Output
```
Creating an optimized production build ...
✓ Compiled successfully in 4.4s
✓ Generating static pages (12/12)
✓ Finalizing page optimization

Route (app)                     Size  First Load JS
┌ ○ /                        7.29 kB         132 kB
├ ○ /dashboard              58.5 kB         183 kB
├ ○ /login                  26.7 kB         152 kB
├ ƒ /api/auth/qr                0 B            0 B
├ ƒ /api/auth/qr-test           0 B            0 B
[... more routes ...]
```

### Sample QR Test API Response
```json
{
  "success": true,
  "data": {
    "qrUrl": "data:image/png;base64,[base64-encoded-qr]",
    "qrId": "uuid-string",
    "loginUrl": "https://account.xiaomi.com/oauth2/authorize?...",
    "note": "This is a test QR code based on Xiaomi URL patterns"
  }
}
```

## Important Notes

- **TIMING**: All build commands use measured timings +50% buffer for timeouts
- **VALIDATION**: Always test both QR endpoints - live and test versions
- **UI**: Application features cyberpunk styling with cyan/purple color scheme
- **LANGUAGE**: Interface is in Vietnamese - key terms: "Đăng nhập" (login), "Thiết bị" (devices), "Kịch bản" (scenarios)
- **AUTHENTICATION**: Real Xiaomi authentication requires Mi Home app integration
- **OFFLINE TESTING**: Use `/api/auth/qr-test` endpoint for offline QR testing
- **ERROR HANDLING**: 503 errors on live endpoints are expected in test environments

# NIRMAAN LaunchPad - Frontend

![Nirmaan Logo](public/nirmaan%20logo.png)

## About NIRMAAN

NIRMAAN is IITM's Pre-Incubation Center, dedicated to nurturing early-stage startups and providing them with the resources, mentorship, and funding needed to transform innovative ideas into successful ventures.

## Project Overview

This is the frontend application for the NIRMAAN LaunchPad platform, built with [Next.js](https://nextjs.org). The platform facilitates:

- **Startup Applications**: A comprehensive application form for pre-incubation program
- **Admin Dashboard**: Management interface for reviewing and evaluating applications
- **User Management**: Role-based access control for managers and reviewers
- **Application Tracking**: Real-time status updates and evaluation workflows

## Features

- 🌱 **Green Theme**: Beautiful green color scheme matching NIRMAAN branding
- 🎨 **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- 🔐 **Secure Authentication**: Powered by Supabase Auth
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🌙 **Dark Mode Support**: Automatic dark mode detection
- ⚡ **Fast Performance**: Optimized with Next.js 15 and React 19

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Authentication**: Supabase
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables.

   **Local:** create `.env.local` in the project root.

   **Production:** set the same variables in your host’s dashboard (e.g. Vercel → Project → Settings → Environment Variables).

```env
# Required for auth and data
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: app URL for emails/links (defaults: local → http://localhost:3000, Vercel → from VERCEL_URL)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Required for sending welcome emails when creating users (local + prod)
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=your_16_char_app_password
```

**Why email might not send:** If welcome emails don’t go out, check that `GMAIL_USER` and `GMAIL_APP_PASSWORD` are set in the environment where the app runs (`.env.local` for local, host env for production). Use a [Gmail App Password](https://support.google.com/accounts/answer/185833), not your normal password.

### Local and deployed (production)

The same code runs in both environments; only env values change:

| Use case | What to set |
|----------|-------------|
| **Local** | `.env.local` with the vars above. `NEXT_PUBLIC_APP_URL=http://localhost:3000` is optional (default). |
| **Deployed (e.g. Vercel)** | Same vars in the host’s env. `NEXT_PUBLIC_APP_URL` can be your live URL, or omit it on Vercel (app URL is taken from `VERCEL_URL`). |
| **Email (both)** | `GMAIL_USER` and `GMAIL_APP_PASSWORD` in the same env (local or prod) where the API runs. |

Config is in `lib/config.ts`: `backendUrl` for the API, `appUrl` for links and emails.

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
incubation-frontend/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── login/             # Admin login
│   ├── apply/             # Application form
│   └── dashboard/         # Admin dashboard
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── dashboard/        # Dashboard-specific components
├── lib/                  # Utility functions and configs
└── public/               # Static assets (images, etc.)
```

## Color Scheme

The application uses NIRMAAN's signature green color:

- **Primary Green**: `#6cb86c`
- Used throughout buttons, badges, highlights, and branding elements
- Full color palette defined in `app/globals.css`

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Supabase](https://supabase.com/docs)

## Contributing

This is a private project for IITM NIRMAAN. For any questions or issues, please contact the development team.

---

Built with ❤️ for IITM NIRMAAN Pre-Incubation Center

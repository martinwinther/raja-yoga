# Daily Sutra

A year-long journey through the Yoga Sūtras, guiding users through 52 weeks of contemplative practices with daily tracking and reflection tools.

## Features

- **52-week curriculum** linked to specific sūtras from Patañjali's Yoga Sūtras
- **Daily practice tracking** with checkbox completion and personal notes
- **Weekly review system** with completion flags, enjoyment ratings, bookmarks, and reflection notes
- **Progress dashboard** showing statistics, daily notes, weekly reflections, and bookmarked weeks
- **Email-based authentication** powered by Firebase Auth
- **Trial subscription model** with 4-week free access (weeks 1-4), then editing locked unless upgraded
- **Stripe Checkout integration** for one-time payment to unlock remaining 48 weeks (weeks 5-52)
- **PWA support** with installable manifest, icons, and basic offline functionality
- **Local backup/restore** of journey data as JSON files

## Tech Stack

- **Next.js App Router** with TypeScript
- **Tailwind CSS** with custom "glass" UI components
- **Firebase Auth** for user authentication
- **Firestore** for real-time data synchronization
- **Stripe Checkout** for subscription payments
- **next-pwa** for Progressive Web App functionality

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Firebase project with Auth and Firestore enabled
- Stripe account (test mode for development)

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/martinwinther/dailysutra
   cd dailysutra
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project
   - Enable Email/Password authentication in Firebase Auth
   - Create a Firestore database
   - Note: Firestore rules allow user-owned documents at `users/{uid}` and `journeys` subcollection

4. **Set up Stripe**
   - Create a Stripe account and get your test keys
   - Create a product with a one-time payment price (not recurring)
   - Copy the price ID for your one-time payment
   - Set up a webhook endpoint (see Stripe Integration section below)

5. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in all required values (see Environment Variables section below)

6. **Start development server**

   ```bash
   npm run dev
   ```

### Available Routes

- `/` – Home dashboard (requires authentication)
- `/auth` – Sign up / Sign in page
- `/day/[dayNumber]` – Individual day practice page (1-364)
- `/progress` – Progress statistics, daily notes, weekly reflections, and bookmarked weeks
- `/settings` – Account settings, backup/restore, subscription management
- `/about` – Information about the program
- `/offline` – Offline fallback page
- `/checkout/success` – Post-payment success page

## Environment Variables

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id # Optional: Get from Firebase Console → Project Settings → Cloud Messaging (Sender ID)

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_... # Your one-time payment price ID
STRIPE_WEBHOOK_SECRET=whsec_... # Webhook signing secret from Stripe dashboard

# Firebase Admin (for webhooks)
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}' # JSON string of service account key

# App URL (fallback for Stripe checkout URLs)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Firebase Cloud Messaging (for push notifications)
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key # Get from Firebase Console → Project Settings → Cloud Messaging
```

## Firebase Structure

### User Documents (`users/{uid}`)

```javascript
{
  subscriptionStatus: "none" | "trial" | "active" | "expired",
  trialStartedAt: Timestamp,
  upgradedAt: Timestamp, // Set when payment is completed
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Journey Documents (`users/{uid}/journeys/dailysutra-v1`)

```javascript
{
  programKey: "dailysutra-v1",
  programVersion: "1.0",
  dayProgress: {
    1: { completed: true, notes: "..." },
    2: { completed: false, notes: "" },
    // ... up to day 364
  },
  weekProgress: {
    1: { 
      completed: true, 
      enjoyed: true, 
      bookmarked: false, 
      reflection: "..." 
    },
    // ... up to week 52
  },
  settings: {
    theme: "dark" | "light" | "system"
  },
  updatedAt: Timestamp
}
```

**Note:** Subscription gating is enforced both client-side (via `SubscriptionProvider`) and server-side (via Firestore security rules). The security rules prevent unauthorized writes to journey data based on subscription status and day/week access restrictions.

## Stripe Integration

The payment flow works as follows:

1. `/api/create-checkout-session` creates a Stripe Checkout session for a one-time payment
2. Session metadata includes the user's `firebaseUid`
3. After successful payment, Stripe redirects to `/checkout/success`
4. Success page verifies the session with `/api/verify-session` before updating status
5. Stripe webhook (`/api/webhooks/stripe`) also processes `checkout.session.completed` events
6. User's `subscriptionStatus` is set to "active" in Firestore, granting access to all 52 weeks

### Setting Up Stripe Webhooks

For production, you must configure Stripe webhooks:

1. **Get your webhook signing secret:**
   - Go to Stripe Dashboard → Developers → Webhooks
   - Click "Add endpoint" or use an existing one
   - Set the endpoint URL to: `https://yourdomain.com/api/webhooks/stripe`
   - Select event: `checkout.session.completed`
   - Copy the "Signing secret" (starts with `whsec_`)

2. **Set environment variable:**

   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_your_signing_secret
   ```

3. **Set up Firebase Service Account:**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Copy the entire JSON content
   - Set as environment variable (as a JSON string on a single line):

   ```bash
   FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"...","private_key":"...",...}'
   ```

   **Important:** The JSON must be on a single line. Remove all line breaks and ensure proper escaping of quotes within the JSON string.

**Note:** The webhook provides server-side verification and is the authoritative source for payment status. The success page verification is a fallback for immediate user feedback.

## PWA Behavior

- **Manifest** with app icons and metadata for installation
- **Service Worker** via next-pwa caches static assets
- **Offline detection** with `AppStatusBanner` component
- **Offline page** served when network is unavailable
- **Firebase requests** are network-only (not cached)

PWA functionality is disabled in development mode (`NODE_ENV=development`).

## Push Notifications

The app supports push notifications for daily practice reminders using Firebase Cloud Messaging (FCM).

### Setup Instructions

1. **Enable Cloud Messaging in Firebase Console:**
   - Go to Firebase Console → Project Settings → Cloud Messaging tab
   - Ensure "Firebase Cloud Messaging API (V1)" is enabled (should show a green checkmark)
   - Scroll down to "Web configuration" → "Web Push certificates"
   - Click "Generate key pair" button
   - Copy the generated public key (this is your VAPID key - it will be a long string)

2. **Set environment variable:**
   ```bash
   NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_generated_vapid_key_here
   ```
   Paste the key you copied from step 1.
   
   **Note:** The `messagingSenderId` is automatically extracted from your `NEXT_PUBLIC_FIREBASE_APP_ID` (it's the numeric part between the colons, e.g., `1:729974618674:web:...`). If you need to override it, you can set `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` explicitly.

3. **Generate service worker (after setting up Firebase config):**
   ```bash
   node scripts/generate-firebase-messaging-sw.js
   ```
   This script injects your Firebase config into the service worker.

4. **User preferences:**
   - Users can enable/disable notifications in Settings
   - Users can customize reminder time and days of week
   - FCM tokens are stored in Firestore at `users/{uid}/fcmTokens/{token}`

### Sending Notifications

To send scheduled daily reminders, you can:
- Use a cron job or scheduled function (e.g., Vercel Cron, Cloud Functions)
- Call `/api/notifications/send` with user ID and notification content
- The API will send to all registered FCM tokens for that user

## Development Notes

### 52-Week Program Structure

The complete curriculum is defined in `data/yogaProgram.ts` as the `YOGA_PROGRAM` array. Each week includes:

- Week number (1-52)
- Theme and core sūtras
- Key philosophical idea
- Specific weekly practice instructions

To modify program content, edit this file without touching the application logic.

### Glass UI Design

The app uses a custom "glass morphism" design system with:

- Semi-transparent backgrounds
- Backdrop blur effects
- Subtle borders and shadows
- Dark theme optimized for contemplative use

## Future Work / TODO
- **Create admin dashboard** for program content management
- **Implement caching strategies** for better offline experience with journey data

## License

Private project - all rights reserved.

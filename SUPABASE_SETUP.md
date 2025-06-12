# Supabase Authentication Setup Guide

## 1. Supabase Project Setup

### Create Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in project details and create

### Get Project Credentials
1. Go to Settings → API
2. Copy your project URL and anon key
3. Add to your `.env` file:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 2. Authentication Configuration

### Enable Email Authentication
1. Go to Authentication → Settings
2. Under "Auth Providers", ensure Email is enabled
3. Configure email settings:
   - **Enable email confirmations**: OFF (for development)
   - **Enable email change confirmations**: ON
   - **Enable secure email change**: ON

### Configure OAuth Providers

#### Google OAuth Setup
1. Go to Authentication → Settings → Auth Providers
2. Enable Google provider
3. Get Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing
   - Enable Google+ API
   - Go to Credentials → Create Credentials → OAuth 2.0 Client ID
   - Set authorized redirect URIs:
     ```
     https://your-project-ref.supabase.co/auth/v1/callback
     ```
   - Copy Client ID and Client Secret to Supabase

#### Apple OAuth Setup
1. Go to Authentication → Settings → Auth Providers
2. Enable Apple provider
3. Get Apple OAuth credentials:
   - Go to [Apple Developer Console](https://developer.apple.com/)
   - Create App ID and Service ID
   - Configure Sign in with Apple
   - Set redirect URL:
     ```
     https://your-project-ref.supabase.co/auth/v1/callback
     ```
   - Generate private key and get Team ID
   - Add credentials to Supabase

### URL Configuration
1. Go to Authentication → Settings → URL Configuration
2. Set Site URL: `http://localhost:5173` (for development)
3. Add Redirect URLs:
   ```
   http://localhost:5173/auth/callback
   http://localhost:5173/auth/reset-password
   https://your-production-domain.com/auth/callback
   https://your-production-domain.com/auth/reset-password
   ```

## 3. Database Setup

### Run Migrations
The database schema is already set up in the migration files. The existing migrations include:
- User-related tables with RLS policies
- Legal cases and documents tables
- Precedent cases database
- Proper security policies

### Row Level Security (RLS)
RLS is already enabled on all tables with proper policies:
- Users can only access their own data
- Precedent cases are readable by all authenticated users
- All user-specific data is protected

## 4. Edge Functions Setup

### Deploy Functions
1. Install Supabase CLI
2. Login to Supabase: `supabase login`
3. Link project: `supabase link --project-ref your-project-ref`
4. Deploy functions: `supabase functions deploy`

### Environment Variables for Functions
Add these to your Supabase project:
1. Go to Settings → Edge Functions
2. Add environment variables:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   ```

## 5. Testing Authentication

### Test Email/Password
1. Try signing up with email/password
2. Check if user appears in Authentication → Users
3. Test sign in functionality

### Test OAuth
1. Try signing in with Google
2. Try signing in with Apple
3. Verify OAuth users appear in dashboard

### Test Password Reset
1. Use forgot password functionality
2. Check email for reset link
3. Test password update process

## 6. Production Deployment

### Update URLs
1. Update Site URL to production domain
2. Add production redirect URLs
3. Update OAuth provider redirect URLs

### Security Checklist
- [ ] RLS enabled on all tables
- [ ] Proper policies in place
- [ ] OAuth providers configured
- [ ] Email templates customized
- [ ] Rate limiting configured
- [ ] CAPTCHA enabled (if needed)

## 7. Troubleshooting

### Common Issues
1. **OAuth redirect errors**: Check redirect URLs match exactly
2. **Email not sending**: Check email provider settings
3. **RLS blocking queries**: Verify policies are correct
4. **CORS errors**: Check allowed origins in settings

### Debug Steps
1. Check browser console for errors
2. Check Supabase logs in dashboard
3. Verify environment variables
4. Test with Supabase CLI locally

## 8. Additional Features

### Email Templates
Customize email templates in Authentication → Settings → Email Templates:
- Confirmation email
- Password reset email
- Email change confirmation

### Rate Limiting
Configure rate limiting in Authentication → Settings → Rate Limiting:
- Sign up rate limit
- Sign in rate limit
- Password reset rate limit

### Security
Enable additional security features:
- CAPTCHA protection
- Session timeout
- Multi-factor authentication (if needed)
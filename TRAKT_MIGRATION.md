# Trakt Migration Guide

This guide will help you migrate from SIMKL to Trakt for tracking movies and TV shows.

## Step 1: Get Trakt API Credentials

1. Go to https://trakt.tv/oauth/applications
2. Click "New Application"
3. Fill in the form:
   - **Name**: Your site name (e.g., "jmartucci.com")
   - **Redirect URI**: `urn:ietf:wg:oauth:2.0:oob`
   - **Description**: (optional)
4. Click "Save App"
5. Copy your **Client ID** and **Client Secret**

## Step 2: Get TMDb API Key (Optional)

**This step is optional.** Trakt doesn't provide images directly, so we use TMDb for poster images. If you skip this step, the script will work fine but won't download poster images.

To get images:
1. Go to https://www.themoviedb.org/settings/api
2. Request an API key (free)
3. Copy your **API Key (v3 auth)**

## Step 3: Update .env File

Add these variables to your `.env` file:

```env
TRAKT_CLIENT_ID=your_client_id_here
TRAKT_CLIENT_SECRET=your_client_secret_here
TRAKT_REDIRECT_URI=urn:ietf:wg:oauth:2.0:oob

# Optional - only needed for poster images
TMDB_API_KEY=your_tmdb_api_key_here
```

You can remove the old SIMKL variables:
```env
# SIMKL_ID=...
# SIMKL_SECRET=...
# SIMKL_ACCESS_TOKEN=...
```

## Step 4: Authenticate with Trakt

Run the OAuth helper script:

```bash
npm run trakt:auth
```

This will:
1. Display a URL to visit in your browser
2. Prompt you to authorize the application
3. Ask you to paste the authorization code
4. Output your access token

Copy the `TRAKT_ACCESS_TOKEN` and add it to your `.env` file.

## Step 5: Backup and Remove SIMKL Data

Backup your existing watching data (optional):

```bash
cp -r src/content/watching src/content/watching.backup
```

Remove old SIMKL data:

```bash
rm -rf src/content/watching/20*
rm -rf src/content/watching/images/*
```

## Step 6: Fetch from Trakt

Run the Trakt fetch script:

```bash
npm run fetch:watching
```

This will:
- Fetch all watched shows and movies from Trakt
- Download poster images from TMDb
- Create markdown files organized by year
- Preserve your ratings

## Step 7: Update Build Script (Optional)

The build script already uses `fetch:watching`, so it will automatically use Trakt now.

## Verification

Check that your `/stream` page displays correctly:

```bash
npm run dev
```

Visit http://localhost:4321/stream

## What Changed

### Links
- **Old**: `https://simkl.com/tv/{id}`
- **New**: `https://trakt.tv/shows/{slug}` or `https://trakt.tv/movies/{slug}`

### Image Source
- **Old**: SIMKL CDN
- **New**: TMDb via their API

### Rating System
- Both use 1-10 scale, no changes needed

## Troubleshooting

### "Invalid Trakt access token"
- Run `npm run trakt:auth` again to get a new token
- Access tokens expire after 3 months

### No images downloading
- Make sure you have `TMDB_API_KEY` in your `.env` file
- Check that the API key is valid at https://www.themoviedb.org/settings/api

### Rate limit errors
- Trakt has generous rate limits (1000 requests per 5 minutes)
- If you hit the limit, wait a few minutes and try again

## Rollback (If Needed)

If you need to go back to SIMKL:

1. Restore backup: `cp -r src/content/watching.backup/* src/content/watching/`
2. Update package.json to use `fetch-simkl-watching.ts`
3. Restore SIMKL credentials in `.env`

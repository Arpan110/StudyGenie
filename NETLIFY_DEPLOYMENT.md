# Deploying StudyGenie to Netlify

## Prerequisites

- A GitHub repository with your StudyGenie project
- A Netlify account

## Deployment Steps

### 1. Push your code to GitHub

Make sure your code is pushed to a GitHub repository. If you haven't done this yet, follow these steps:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Connect to Netlify

1. Log in to your Netlify account
2. Click "Add new site" > "Import an existing project"
3. Select GitHub as your Git provider
4. Authorize Netlify to access your GitHub account
5. Select your StudyGenie repository

### 3. Configure Build Settings

Use the following settings:

- **Build command**: `npm run netlify-build`
- **Publish directory**: `.next`

### 4. Configure Environment Variables

Add the following environment variable in Netlify's site settings under "Site settings" > "Environment variables":

- `GOOGLE_GENERATIVE_AI_API_KEY`: Your Google Generative AI API key
- `NODE_ENV`: Set to `production` (this helps avoid issues with test files during build)

**Important**: Never commit your actual API keys to your repository. The `.env.local` file should be in your `.gitignore` file. The `.env.production` file in your repository should not contain actual values, only placeholders.

### 5. Deploy

Click "Deploy site" and wait for the build to complete.

### 6. Custom Domain (Optional)

You can set up a custom domain for your StudyGenie application in Netlify's site settings under "Domain management".

## Troubleshooting

### API Issues

If you encounter issues with the API calls, check:

1. That your environment variables are correctly set in Netlify
2. That your API endpoints are correctly configured for production
3. That CORS is properly configured if needed

#### Next.js API Routes on Netlify

Netlify handles Next.js API routes as serverless functions. There are a few things to keep in mind:

1. API routes have a maximum execution time of 10 seconds on Netlify's free tier
2. The Google Generative AI API calls might sometimes take longer than this limit
3. Consider implementing proper error handling and retry logic in your frontend

If you need longer execution times, you might need to upgrade to a paid Netlify plan or consider other deployment options for your API routes.

### Build Failures

If your build fails, check the build logs in Netlify for specific errors. Common issues include:

- Missing dependencies
- Environment variable issues
- Build script errors
- PDF-parse test file issues

#### PDF-Parse Module Issues

The `pdf-parse` module used for PDF processing has test files that can cause build failures in Netlify. We've implemented the following fixes:

1. Created a custom wrapper for pdf-parse in `lib/pdf-parse-fix.js` that avoids accessing test files
2. Updated API routes to use this custom wrapper
3. Set `NODE_ENV=production` in the build environment to prevent test code execution

If you encounter errors related to `test/data/05-versions-space.pdf` during build, make sure these fixes are properly implemented.

## Continuous Deployment

### Option 1: Netlify's Built-in CI/CD

Netlify automatically rebuilds and redeploys your site when you push changes to your GitHub repository. No additional configuration is needed for this feature.

### Option 2: GitHub Actions Workflow

We've included a GitHub Actions workflow file (`.github/workflows/netlify-deploy.yml`) that automates the deployment process. To use this workflow:

1. Add the following secrets to your GitHub repository:
   - `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token
   - `NETLIFY_SITE_ID`: The API ID of your Netlify site
   - `GOOGLE_GENERATIVE_AI_API_KEY`: Your Google Generative AI API key

2. Push changes to the `main` branch to trigger the deployment workflow.

This workflow will:
- Check out your code
- Set up Node.js
- Install dependencies
- Build your Next.js application
- Deploy to Netlify

You can monitor the workflow runs in the "Actions" tab of your GitHub repository.
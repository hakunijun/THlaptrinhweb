# Git Setup and Push Instructions

## Prerequisites

### 1. Install Git
If Git is not installed, download and install it from:
- **Official Website**: https://git-scm.com/download/win
- Or use: `winget install Git.Git` (if winget is available)

After installation, restart your terminal/PowerShell.

## Steps to Push to GitHub

### 2. Initialize Git Repository
```bash
git init
```

### 3. Add Remote Repository
```bash
git remote add origin https://github.com/hakunijun/THlaptrinhweb.git
```

### 4. Stage All Files
```bash
git add .
```

### 5. Create Initial Commit
```bash
git commit -m "Initial commit: Hospital Appointment Scheduler with database backend"
```

### 6. Set Default Branch (if needed)
```bash
git branch -M main
```

### 7. Push to GitHub
```bash
git push -u origin main
```

**Note**: You'll be prompted for your GitHub username and password (or personal access token).

## Alternative: Using GitHub CLI (gh)

If you have GitHub CLI installed, you can also use:
```bash
gh repo create THlaptrinhweb --public --source=. --remote=origin --push
```

## Troubleshooting

### If you get authentication errors:
1. Use a Personal Access Token instead of password:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate a new token with `repo` permissions
   - Use the token as your password when pushing

### If the repository already has content:
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

## Quick Command Sequence

Once Git is installed, run these commands in order:

```bash
# Initialize repository
git init

# Add remote
git remote add origin https://github.com/hakunijun/THlaptrinhweb.git

# Stage all files
git add .

# Commit
git commit -m "Initial commit: Hospital Appointment Scheduler with database backend"

# Push
git push -u origin main
```


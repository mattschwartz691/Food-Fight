# Food Fight! 🍕⚔️🍔

A fun, interactive game where you pick the better food in head-to-head matchups!

## How to Play

1. Open `index.html` in your web browser
2. Click on your favorite food in each matchup
3. Watch the winner celebrate and the loser get knocked out!
4. See which foods become champions on the scoreboard

## Features

- 20 different foods to choose from
- Fun animations and effects
- Real-time scoreboard tracking
- Responsive design for mobile and desktop

## Automated Code Review

This repository includes an automated code review system that runs on every push:

### What It Does

- **Automatic Linting**: Runs ESLint on all JavaScript files
- **Auto-Fix**: Automatically fixes simple code style issues and commits them
- **Issue Creation**: Opens GitHub issues for complex problems that need manual review
- **Reports**: Generates detailed reports available as workflow artifacts

### How It Works

The GitHub Actions workflow (`.github/workflows/code-review.yml`) triggers on every push that modifies JavaScript, HTML, or CSS files. It:

1. Checks out the code
2. Installs ESLint and configures it for browser-based JavaScript
3. Runs ESLint to find code quality issues
4. Attempts to auto-fix simple problems (like formatting, semicolons, quotes)
5. Commits and pushes the fixes if any were made
6. If there are remaining issues that can't be auto-fixed, it creates a GitHub issue with details

### Viewing Results

- **Workflow Runs**: Check the "Actions" tab in GitHub to see workflow execution
- **Auto-Fixes**: Look for commits from `github-actions[bot]` with message "Auto-fix: Apply ESLint fixes"
- **Issues**: Check the "Issues" tab for any problems labeled `code-review` and `automated`
- **Detailed Reports**: Download the `eslint-report` artifact from workflow runs for full details

## Development

No build process required! This is a simple static web application.

## Technologies Used

- HTML5
- CSS3 (with animations and gradients)
- Vanilla JavaScript
- Unsplash API for food images

## License

Open source - feel free to fork and modify!

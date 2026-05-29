# x-post

Post to **X** from the terminal. Part of [Ariadne](https://github.com/Ariadne-Dev).

## Setup

1. Create an app at [developer.x.com](https://developer.x.com/en/portal/dashboard)
2. Enable **OAuth 1.0a** with **Read and Write** permissions
3. Generate Access Token and Secret for your account
4. Copy credentials:

```bash
cp .env.example .env
# Edit .env with your four keys
```

5. Install and build:

```bash
pnpm install
pnpm build
```

## Usage

```bash
# Post a message
pnpm post "Hello from Ariadne — leave a thread, find your way."

# Or after linking the bin
node dist/cli.js "Hello world"

# Preview without posting
pnpm dev -- --dry-run "Testing the waters"

# Post from a file (useful for longer drafts)
pnpm dev -- --file draft.txt
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `X_API_KEY` | API Key (Consumer Key) |
| `X_API_SECRET` | API Key Secret (Consumer Secret) |
| `X_ACCESS_TOKEN` | Access Token |
| `X_ACCESS_TOKEN_SECRET` | Access Token Secret |

`.env` is gitignored — never commit credentials.

## Notes

- Standard posts are limited to **280 characters** (checked before posting).
- Free X API tiers may have rate limits; check your developer portal.
- Posts appear from whichever X account owns the access token.

---

*Ariadne · ariadne@pablovallejo.dev*

# Contributing to BlackRoad OS — RoadChain

Thank you for your interest in contributing to RoadChain.

> ⚠️ **IMPORTANT: Contributor access is GATED. You must obtain a valid API gateway token before any code contribution is accepted or reviewed.**

---

## 🔐 Contributor Access Gateway (Required)

BlackRoad OS routes **all** vendor API traffic through its own proprietary infrastructure. External AI providers (OpenAI, Anthropic, GitHub Copilot, Codex, etc.) are **NOT permitted** for contribution tooling or code generation.

### Step 1 — Obtain a Contributor Token

Contact BlackRoad OS to request a contributor token:
- **Email:** blackroad.systems@gmail.com
- **Subject:** `Contributor Token Request — <your GitHub username>`

Your token will be issued after identity verification and agreement to the [LICENSE](LICENSE).

### Step 2 — Configure Your Environment

Copy `.env.example` to `.env` and populate:

```bash
cp .env.example .env
```

Required variables:
```
BLACKROAD_GATEWAY_TOKEN=your_contributor_token_here
BLACKROAD_GATEWAY_URL=https://gateway.blackroad.io
STRIPE_PUBLISHABLE_KEY=your_stripe_key  # if working on payments
```

### Step 3 — Start the Converter API

All vendor API calls from your local environment must route through the BlackRoad gateway:

```bash
npm run gateway
```

This starts the converter API at `http://localhost:4000`. See [docs/GATEWAY.md](docs/GATEWAY.md) for full documentation.

### Step 4 — Verify Access

```bash
curl -H "X-BlackRoad-Token: $BLACKROAD_GATEWAY_TOKEN" http://localhost:4000/health
# Expected: {"status":"ok","authorized":true}
```

> **If you do not have a valid token, API calls will be rejected with HTTP 401.**

---

## 🌟 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🎯 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if relevant**
- **Include browser/OS information**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any similar features in other projects**

### Pull Requests

- Fill in the required template
- Follow the [BlackRoad Brand System](https://brand.blackroad.io)
- Include screenshots for UI changes
- Update documentation as needed
- End all files with a newline

## 🎨 Brand Compliance Guidelines

All contributions MUST follow the BlackRoad Brand System:

### Required Colors

```css
--amber: #F5A623
--hot-pink: #FF1D6C      /* Primary Brand Color */
--electric-blue: #2979FF
--violet: #9C27B0
--black: #000000
--white: #FFFFFF
```

### Forbidden Colors (DO NOT USE)

❌ #FF9D00, #FF6B00, #FF0066, #FF006B, #D600AA, #7700FF, #0066FF

### Spacing System

Use Golden Ratio (φ = 1.618):

```css
--space-xs: 8px      /* Base */
--space-sm: 13px     /* 8 × φ */
--space-md: 21px     /* 13 × φ */
--space-lg: 34px     /* 21 × φ */
--space-xl: 55px     /* 34 × φ */
--space-2xl: 89px    /* 55 × φ */
--space-3xl: 144px   /* 89 × φ */
```

### Typography

```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
line-height: 1.618; /* Golden Ratio */
```

### Gradients

```css
background: linear-gradient(135deg,
  var(--amber) 0%,
  var(--hot-pink) 38.2%,    /* Golden Ratio */
  var(--violet) 61.8%,      /* Golden Ratio */
  var(--electric-blue) 100%);
```

## 🔄 Development Process

1. **Obtain a contributor token** (see above — this is mandatory)
2. **Fork** the repository
3. **Clone** your fork locally
4. **Configure `.env`** with your contributor token
5. **Start the gateway** with `npm run gateway`
6. **Create a branch** for your feature/fix
7. **Make your changes** following our guidelines
8. **Test** your changes thoroughly
9. **Commit** with a descriptive message
10. **Push** to your fork
11. **Open a Pull Request**

### Commit Message Format

Use conventional commits:

```
✨ feat: Add new feature
🐛 fix: Fix bug in component
📝 docs: Update documentation
🎨 style: Improve styling
♻️ refactor: Refactor code
✅ test: Add tests
🔧 chore: Update config
```

## 🧪 Testing

Before submitting a PR:

1. **Visual Test:** Open `index.html` in multiple browsers
2. **Responsiveness:** Test on mobile, tablet, desktop
3. **Brand Compliance:** Verify all colors match brand system
4. **Accessibility:** Check color contrast, keyboard navigation
5. **Performance:** Ensure fast load times

## 📋 Pull Request Checklist

- [ ] I have a valid contributor API token configured
- [ ] All API calls route through the BlackRoad gateway (no direct vendor calls)
- [ ] My code follows the brand system guidelines
- [ ] I have tested on multiple browsers
- [ ] I have tested responsiveness
- [ ] I have updated documentation
- [ ] My commits follow the conventional format
- [ ] I have added screenshots for UI changes
- [ ] No forbidden colors are used
- [ ] Golden ratio spacing is applied
- [ ] Line height is 1.618

## 🚀 After Your PR is Merged

After your pull request is merged:

1. You can safely delete your branch
2. Pull the latest changes from main
3. Your contribution will auto-deploy to Cloudflare Pages
4. You'll be added to the contributors list!

## 💡 Getting Help

- **Documentation:** https://docs.blackroad.io
- **Gateway Docs:** [docs/GATEWAY.md](docs/GATEWAY.md)
- **Issues:** Use GitHub Issues for questions
- **Email:** blackroad.systems@gmail.com

## 🙏 Recognition

All contributors will be recognized in our README and on our website!

---

**Copyright © 2026 BlackRoad OS, Inc. All Rights Reserved.**

See [LICENSE](LICENSE) for complete terms.

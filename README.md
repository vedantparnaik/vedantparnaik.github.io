# Vedant Parnaik — Portfolio

A static personal portfolio site for **Vedant Parnaik**, Robotics AI Engineer.

Built with vanilla HTML, CSS, and JavaScript — no build step, no dependencies. Loads fast and deploys anywhere.

## Files

- `index.html` — all page content (Hero, About, Experience, Skills, Projects, Publications, Contact).
- `styles.css` — custom dark theme, typography, responsive layout, animations.
- `script.js` — scroll reveals, mobile menu, smooth scroll, hero parallax.

## Preview locally

Just open the file in your browser:

```bash
open index.html
```

Or run a tiny local server (recommended, so anchor scrolling and font preconnect behave normally):

```bash
# Python 3
python3 -m http.server 5500

# then visit http://localhost:5500
```

## Customize content

All copy lives in `index.html`. Common things to tweak:

| What | Where |
|---|---|
| Headline / tagline | `<section class="hero">` |
| About paragraphs | `<section id="about">` → `.about-text` |
| Experience entries | `<section id="experience">` → `.timeline-item` blocks |
| Skills cards | `<section id="skills">` → `.skill-card` blocks |
| Project cards | `<section id="projects">` → `.project-card` blocks |
| Publications | `<section id="publications">` |
| Contact details | `<section id="contact">` |
| Accent color | `:root --accent` in `styles.css` |

## Deploy

Pick whichever you prefer — all are free and take a couple minutes.

### Option 1 — GitHub Pages (recommended, ties to your GitHub brand)

1. Create a new public repo named `vedantparnaik.github.io` on GitHub.
2. From this folder:

   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/vedantparnaik/vedantparnaik.github.io.git
   git push -u origin main
   ```

3. Site will be live at `https://vedantparnaik.github.io` within a minute.

If you'd rather keep your username repo for something else, push to any repo and enable Pages under **Settings → Pages → Deploy from branch → main**. The URL will be `https://vedantparnaik.github.io/<repo-name>/`.

### Option 2 — Vercel (zero-config, great DX, free custom domain)

1. Sign up at [vercel.com](https://vercel.com) with GitHub.
2. Push this folder to a GitHub repo (see commands above, but to any repo name).
3. In Vercel: **Add New → Project → Import** the repo. Accept defaults. Deploy.
4. You'll get a `https://your-project.vercel.app` URL instantly.
5. Add your own domain under **Settings → Domains**.

### Option 3 — Netlify (drag-and-drop, no Git required)

1. Sign up at [app.netlify.com](https://app.netlify.com).
2. **Sites → Add new site → Deploy manually**.
3. Drag this `Portfolio` folder into the upload area.
4. Done — you'll get a `https://<random-name>.netlify.app` URL. Rename it under **Site settings → Change site name**.

### Option 4 — Cloudflare Pages

1. Push to GitHub.
2. In Cloudflare dashboard: **Pages → Create application → Connect to Git**.
3. Build command: *(leave blank)*. Build output: `/`. Deploy.

## Custom domain

Once live on any of the above, add `vedantparnaik.com` (or similar) by:

1. Buying the domain on Namecheap / Cloudflare / Google Domains.
2. In your host (Vercel / Netlify / Pages): **Settings → Domains → Add domain**.
3. Update DNS records as instructed. Propagates in minutes to a few hours.

## Notes

- Site is fully responsive (mobile, tablet, desktop).
- Respects `prefers-reduced-motion`.
- Lighthouse-friendly — no external JS frameworks, single-stylesheet, system-font fallback.
- All images are inline SVG; nothing to optimize.

---

Built June 2026.

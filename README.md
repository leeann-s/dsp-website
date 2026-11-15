# dspumd.com: Gamma Sigma Chapter of Delta Sigma Pi

The chapter website, rebuilt off Wix as a plain static site. There's no build step and no framework, so any free static host can serve it as-is.

## What's in here

```
index.html, about.html, brothers.html, recruitment.html, sponsorship.html
                       Thin page shells. You rarely need to touch these.
content/*.json         ALL words, photos, brothers, events and links. Edit these.
assets/css/style.css   Design: colors and fonts are at the top in :root.
assets/js/site.js      Reads content/*.json and builds each page.
assets/fonts/          Self-hosted Manrope, Instrument Serif and Noto Serif Display (SIL OFL).
images/                Photos (empty until you run the Wix download script).
images/uploads/        Where photos uploaded through the editor go.
.pages.yml             Setup for the Pages CMS editor (form-based editing).
EDITING-GUIDE.md       Instructions for whoever updates the site.
scripts/download-images-from-wix.sh
                       Copies every photo off Wix. Run it before cancelling Wix.
Preview Site.command   Double-click on a Mac to preview the site locally.
```

## Preview it

Browsers won't load the `content` files if you open `index.html` straight from Finder, so preview through a little local server:

- **Mac:** double-click `Preview Site.command`. The first time, right-click it, choose Open, then click Open again.
- **Anywhere else:** run `python3 -m http.server` in this folder and open http://localhost:8000.

## Before you cancel Wix (important)

Right now the photos still load from Wix's servers, so they'll disappear when the Wix plan ends. Copy them over first:

```bash
bash scripts/download-images-from-wix.sh
```

The script downloads about 140 images into `images/`, resized for the web, and updates the `content` files to use the local copies. Preview the site afterwards to confirm everything shows up, then commit.

## Going live (suggested setup, free)

1. **Put this folder in a GitHub repo** (for example `dsp-website`) under the chapter's GitHub account or org.
2. **Host it.** Either option works:
   - **Cloudflare Pages:** connect the repo, leave the build command empty and set the output directory to `/`.
   - **GitHub Pages:** go to repo Settings → Pages → Deploy from branch → `main` / root.
   Every push, including saves from the editor, redeploys the site automatically.
3. **Point the domain.** Add `dspumd.com` as a custom domain on the host and follow its DNS instructions.
   - The domain is registered through Wix. To move it, unlock it and get the transfer/authorization code from Wix's domain settings, then start the transfer at the new registrar (Cloudflare Registrar sells domains at cost).
   - A domain can't be transferred within 60 days of being registered or last transferred.
   - Keep Wix running until the new site is live on the domain, so there's no downtime.
4. **Turn on the editor.** The editors sign in at https://app.pagescms.org with GitHub and open the repo. `.pages.yml` already describes every editable field. Add the editors as collaborators on the repo.

## Contact form

The form on the Home and Sponsorship pages is a placeholder. It looks finished, but pressing Send shows a message pointing people to the outreach email. Look for `CONTACT FORM PLACEHOLDER` in `assets/js/site.js` when it's time to hook one up. Formspree, Web3Forms or a Cloudflare Pages Function all work with a static site.

## Content to double-check

These were carried over from the Wix site and look wrong there too:

- **Broken LinkedIn links on Wix that were fixed here:** Ethan Lee's exec card pointed to Laili Saleh's profile; it now uses his own (`ethanleeumd`, from his Chi Class card). Celia Pham's link was mangled; it was cleaned up.
- **No LinkedIn yet:** Michelle Yuen (her Wix link went to Olivia Yuen), Srujan Mandavilli (his went to Jacqueline Day) and Aiden Luckenbaugh (his went to LinkedIn's generic "/me" page). Their cards show without a link until real URLs are added.
- **Interviews date:** Wix said "Sunday, September 19, 2026", but September 19, 2026 is a Saturday. The site now shows the weekday automatically from the date, so fix the date in `content/recruitment.json` if it should be the 20th.
- **About page history photo:** the text says "Pictured below are the founding members". Check that `historyPhoto` really is the founding-members photo.
- **Recruitment** still shows Fall 2026, which has already happened. Update it for spring.

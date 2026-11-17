/* ==========================================================================
   Delta Sigma Pi, Gamma Sigma Chapter — site script
   --------------------------------------------------------------------------
   You should NOT need to edit this file to change words, photos, brothers or
   events. All of that lives in the /content folder (see EDITING-GUIDE.md).
   This file just reads those files and builds each page.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Small helpers ---------- */

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const paras = (text) => String(text ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join("");
  const shuffle = (list) => {
    const a = [...list];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  // "Dare to be Delta" collage: photos in shuffled order, laid out in blocks
  // that pack neatly into three rows. Every tile keeps a normal 3:2 photo shape.
  //   A = big tile on top, two small below     B = small, big below, small
  //   C = three small stacked
  const collageTiles = (list) => {
    const blocks = { A: ["big", "small", "small"], B: ["small", "big", "small"], C: ["small", "small", "small"] };
    const pattern = ["A", "C", "B", "C"];
    const photos = shuffle(list);
    const sizes = [];
    for (let i = 0; sizes.length < photos.length; i++) sizes.push(...blocks[pattern[i % pattern.length]]);
    return photos.map((g, i) => {
      const tilt = (Math.random() * 2.4 - 1.2).toFixed(2);
      return `<figure class="t-${sizes[i]}" style="--tilt:${tilt}deg"><img src="${img(g, 1000)}" alt="Gamma Sigma brothers at a chapter event" loading="lazy"></figure>`;
    }).join("");
  };
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  // Wix-hosted photos get resized on the fly so pages load fast.
  // Local photos (after running scripts/download-images) are used as-is.
  function img(src, size) {
    if (!src) return "";
    const m = /^https:\/\/static\.wixstatic\.com\/media\/([^/]+)$/.exec(src);
    if (m) {
      const ext = (m[1].split(".").pop() || "jpg").toLowerCase();
      return `${src}/v1/fit/w_${size},h_${size},q_85/photo.${ext}`;
    }
    return src;
  }

  async function load(name) {
    if (window.__CONTENT && window.__CONTENT[name]) return window.__CONTENT[name];
    const res = await fetch(`content/${name}.json`, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Couldn't load content/${name}.json (${res.status})`);
    return res.json();
  }

  const icon = {
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52C22 2.68 21.31 2 20.45 2zM7.93 18.75H4.98V9.2h2.95v9.55zM6.45 7.9a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42zm12.3 10.85H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.3h.04c.39-.74 1.35-1.53 2.78-1.53 2.98 0 3.53 1.96 3.53 4.51v5.27z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7.5h2.53l.38-2.94H13.5V8.69c0-.85.24-1.43 1.46-1.43h1.56V4.63A21 21 0 0 0 14.25 4.5c-2.25 0-3.79 1.37-3.79 3.9v2.16H7.92v2.94h2.54V21h3.04z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 5h16v11H9l-5 4V5z"/></svg>',
    out: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.6 2.5L16 9.5"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19.5h14"/></svg>',
    hand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1V4.5a1.5 1.5 0 0 1 3 0V11m0-4.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-.6a6 6 0 0 1-4.6-2.2L3.4 14.6a1.6 1.6 0 0 1 2.3-2.2L9 15"/></svg>',
  };

  const NAV = [
    { href: "about.html", label: "About", page: "about" },
    { href: "brothers.html", label: "Brothers", page: "brothers" },
    { href: "recruitment.html", label: "Recruitment", page: "recruitment" },
    { href: "sponsorship.html", label: "Sponsorship", page: "sponsorship" },
  ];

  /* ---------- Shared pieces: header, footer, contact ---------- */

  function header(page, s) {
    const links = NAV.map((n) => `<a href="${n.href}"${n.page === page ? ' aria-current="page"' : ""}>${n.label}</a>`).join("");
    return `
      <div class="wrap header-inner">
        <a class="brand" href="index.html" aria-label="Delta Sigma Pi home">
          <span class="brand-letters" aria-hidden="true">ΔΣΠ</span>
          <span class="brand-text"><strong>Delta Sigma Pi</strong><span>${esc(s.chapterName)}, UMD</span></span>
        </a>
        <button class="nav-toggle" aria-expanded="false" aria-controls="main-nav"><span class="visually-hidden">Menu</span>${icon.menu}</button>
        <nav class="main-nav" id="main-nav" aria-label="Main">
          ${links}
          <a class="btn btn-gold" href="recruitment.html">Join us</a>
        </nav>
      </div>`;
  }

  function footer(s) {
    const year = new Date().getFullYear();
    const social = [
      s.instagram && `<li><a href="${esc(s.instagram)}" target="_blank" rel="noopener">Instagram</a></li>`,
      s.linkedin && `<li><a href="${esc(s.linkedin)}" target="_blank" rel="noopener">LinkedIn</a></li>`,
      s.facebook && `<li><a href="${esc(s.facebook)}" target="_blank" rel="noopener">Facebook</a></li>`,
    ].filter(Boolean).join("");
    return `
      <div class="wrap">
        <div class="footer-top">
          <p class="footer-motto">Delta Sigma Pi<br><em>${esc(s.chapterName)}</em></p>
          <div class="footer-cols">
            <div><h2>Explore</h2><ul>
              <li><a href="index.html">Home</a></li>
              ${NAV.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join("")}
            </ul></div>
            <div><h2>Follow</h2><ul>${social}</ul></div>
            <div><h2>Contact</h2><ul>
              <li><a href="mailto:${esc(s.contactEmail)}">${esc(s.contactEmail)}</a></li>
            </ul></div>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${year} by ${esc(s.footerLine)}</span>
          <span>${esc(s.school)}, College Park</span>
        </div>
      </div>`;
  }

  function contactSection(s) {
    /* CONTACT FORM
       Messages are emailed through Web3Forms (web3forms.com, free up to 250 a
       month) to whichever inbox the access key in content/settings.json
       ("contactFormKey") was created for. With no key, the form tells people
       to email us instead. */
    return `
      <section class="section on-white" id="contact" aria-labelledby="contact-title">
        <div class="wrap contact">
          <div class="contact-info">
            <h2 class="h-lg" id="contact-title">Contact us</h2>
            <p>Questions about recruitment, events or partnering with our chapter? Send us a note.</p>
            <ul class="contact-links">
              <li><a href="mailto:${esc(s.contactEmail)}">${icon.mail}${esc(s.contactEmail)}</a></li>
              ${s.instagram ? `<li><a href="${esc(s.instagram)}" target="_blank" rel="noopener">${icon.instagram}${esc(s.instagramHandle || "Instagram")}</a></li>` : ""}
              ${s.linkedin ? `<li><a href="${esc(s.linkedin)}" target="_blank" rel="noopener">${icon.linkedin}LinkedIn</a></li>` : ""}
              ${s.facebook ? `<li><a href="${esc(s.facebook)}" target="_blank" rel="noopener">${icon.facebook}Facebook</a></li>` : ""}
            </ul>
          </div>
          <form class="form-placeholder" data-contact-form>
            <div class="form-grid">
              <div class="field"><label for="cf-first">First name</label><input id="cf-first" name="first" autocomplete="given-name" required></div>
              <div class="field"><label for="cf-last">Last name</label><input id="cf-last" name="last" autocomplete="family-name"></div>
              <div class="field"><label for="cf-email">Email</label><input id="cf-email" name="email" type="email" autocomplete="email" required></div>
              <div class="field"><label for="cf-phone">Phone</label><input id="cf-phone" name="phone" type="tel" autocomplete="tel"></div>
              <div class="field full"><label for="cf-msg">Message</label><textarea id="cf-msg" name="message" required></textarea></div>
              <input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true" style="display:none">
            </div>
            <div class="form-actions">
              <button class="btn btn-purple" type="submit">Send message</button>
              <p class="form-note" role="status" aria-live="polite"></p>
            </div>
          </form>
        </div>
      </section>`;
  }

  /* Photo strip: drifts sideways on its own, pauses on hover/touch, and can be
     swiped or dragged. The photos are repeated once so it loops seamlessly. */
  function wireMarquee() {
    document.querySelectorAll("[data-marquee]").forEach((box) => {
      const track = box.querySelector(".marquee-track");
      if (!track || !track.children.length) return;
      track.insertAdjacentHTML("beforeend", track.innerHTML.replace(/<figure /g, '<figure aria-hidden="true" '));
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let pos = 0, last = 0, paused = false, resumeTimer = null;
      const SPEED = 40; // pixels per second
      const pause = () => { paused = true; clearTimeout(resumeTimer); };
      const resumeSoon = (ms = 1500) => { clearTimeout(resumeTimer); resumeTimer = setTimeout(() => { paused = false; }, ms); };
      box.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") pause(); });
      box.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") resumeSoon(300); });
      box.addEventListener("touchstart", pause, { passive: true });
      box.addEventListener("touchend", () => resumeSoon(2500), { passive: true });
      box.addEventListener("focusin", pause);
      box.addEventListener("focusout", () => resumeSoon(300));
      box.addEventListener("scroll", () => {
        const half = track.scrollWidth / 2;
        if (Math.abs(box.scrollLeft - pos) > 2) pos = box.scrollLeft; // the visitor scrolled it themselves
        if (box.scrollLeft >= half) { pos = box.scrollLeft - half; box.scrollLeft = pos; }
      }, { passive: true });
      // drag with the mouse
      let dragX = null, dragStart = 0;
      box.addEventListener("mousedown", (e) => { dragX = e.clientX; dragStart = box.scrollLeft; box.classList.add("is-dragging"); e.preventDefault(); });
      window.addEventListener("mousemove", (e) => { if (dragX !== null) { box.scrollLeft = dragStart - (e.clientX - dragX); pos = box.scrollLeft; } });
      window.addEventListener("mouseup", () => { dragX = null; box.classList.remove("is-dragging"); });
      if (reduce) return;
      const tick = (t) => {
        const dt = last ? Math.min(t - last, 64) / 1000 : 0; last = t;
        if (!paused && dragX === null) {
          const half = track.scrollWidth / 2;
          pos += SPEED * dt; if (half > 0 && pos >= half) pos -= half;
          box.scrollLeft = pos;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  function wireContactForm(s) {
    const emailLink = `<a href="mailto:${esc(s.contactEmail)}">${esc(s.contactEmail)}</a>`;
    document.querySelectorAll("[data-contact-form]").forEach((form) => {
      const note = form.querySelector(".form-note");
      const button = form.querySelector("button[type=submit]");
      const say = (html) => { note.dataset.state = "shown"; note.innerHTML = html; };

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!s.contactFormKey) {
          say(`Our contact form is coming soon. For now, email us at ${emailLink}.`);
          return;
        }
        const f = Object.fromEntries(new FormData(form));
        if (f.botcheck) return; // spam bot filled the hidden box
        const name = [f.first, f.last].filter(Boolean).join(" ").trim();
        button.disabled = true;
        say("Sending…");
        try {
          const res = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              access_key: s.contactFormKey,
              subject: `New message from dspumd.com: ${name}`,
              from_name: "DSP website",
              name,
              email: f.email,
              phone: f.phone || "Not given",
              message: f.message,
            }),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok || data.success === false) throw new Error(data.message || res.status);
          form.reset();
          say(`Thanks${f.first ? `, ${esc(f.first)}` : ""}! Your message was sent. We'll get back to you soon.`);
        } catch (err) {
          console.error(err);
          say(`Your message couldn't be sent. Please email us at ${emailLink}.`);
        } finally {
          button.disabled = false;
        }
      });
    });
  }

  function pageHead({ title, lede, image, letters = true, extra = "" }) {
    return `
      <header class="page-head">
        ${image ? `<div class="page-head-media"><img src="${img(image, 2000)}" alt=""></div>` : ""}
        ${letters ? '<span class="page-head-letters" aria-hidden="true">ΔΣΠ</span>' : ""}
        <div class="wrap page-head-inner">
          <h1 class="display">${esc(title)}</h1>
          ${lede ? `<p class="lede">${esc(lede)}</p>` : ""}
          ${extra}
        </div>
      </header>`;
  }

  /* ---------- Home ---------- */

  function renderHome(d, s, sp) {
    return `
      <section class="hero">
        <div class="hero-media"><img src="${img(d.heroImage, 2400)}" alt="Brothers of the Gamma Sigma Chapter in business attire"></div>
        <div class="wrap hero-content">
          <div class="hero-copy">
            <h1 class="display">${esc(d.heroTitle)}</h1>
            <p class="hero-tagline">${esc(d.heroTagline)}</p>
            <p class="hero-sub">${esc(d.heroSubline)}</p>
            <div class="hero-actions">
              <a class="btn btn-gold" href="recruitment.html">Join us</a>
              <a class="btn btn-ghost" href="brothers.html">Meet the brothers</a>
            </div>
          </div>
        </div>
      </section>

      <section class="section" aria-label="Who we are">
        <div class="wrap">
          <div class="intro">
            <p class="intro-statement">${esc(d.introStatement)}</p>
            ${d.crest ? `<img class="intro-crest" src="${img(d.crest, 500)}" alt="The Delta Sigma Pi seal">` : ""}
          </div>
          <div class="stats">
            ${(d.stats || []).map((x) => `<div class="stat"><strong>${esc(x.number)}</strong><span>${esc(x.label)}</span></div>`).join("")}
          </div>
        </div>
      </section>

      <section class="section on-lilac" aria-labelledby="pillars-title" style="padding-top:calc(var(--section)*.8)">
        <div class="wrap">
          <div class="section-head">
            <h2 class="h-lg" id="pillars-title">${esc(d.pillarsTitle)}</h2>
            <p><a href="about.html">Read more about what we value</a></p>
          </div>
          <div class="pillars">
            ${(d.pillars || []).map((p) => `
              <article class="pillar" tabindex="0">
                <img src="${img(p.photo, 1200)}" alt="" loading="lazy">
                <div class="pillar-body"><h3>${esc(p.name)}</h3><p>${esc(p.text)}</p></div>
              </article>`).join("")}
          </div>
        </div>
      </section>

      <section class="section on-dark" aria-labelledby="letter-title">
        <div class="wrap letter">
          <figure class="letter-photo">
            <img src="${img(d.president.photo, 1000)}" alt="${esc(d.president.name)}" loading="lazy">
            <figcaption><strong>${esc(d.president.name)}</strong>${esc(d.president.role)}, ${esc(s.chapterName)}</figcaption>
          </figure>
          <div class="letter-body">
            <p class="kicker" id="letter-title">${esc(d.president.title)}</p>
            <div class="prose">${paras(d.president.letter)}</div>
            <div class="signature"><span>${esc(d.president.signoff)}</span><strong>${esc(d.president.name)}</strong><span>${esc(d.president.role)}</span></div>
          </div>
        </div>
      </section>

      <section class="section gallery-section" aria-labelledby="gallery-title">
        <div class="wrap">
          <h2 class="display gallery-title" id="gallery-title">${esc(d.galleryTitle)}</h2>
        </div>
        <div class="marquee" data-marquee tabindex="0" aria-label="Photos from chapter events. Scroll sideways to see more.">
          <div class="marquee-track">
            <div class="collage">${collageTiles(d.gallery || [])}</div>
          </div>
        </div>
      </section>

      ${sponsorsBlock(sp, "section-tight on-lilac")}
      ${contactSection(s)}`;
  }

  function sponsorsBlock(sp, cls) {
    if (!sp || !(sp.sponsors || []).length) return "";
    return `
      <section class="${cls}" aria-labelledby="sponsors-title">
        <div class="wrap">
          <div class="section-head">
            <h2 class="h-md" id="sponsors-title">${esc(sp.sponsorsTitle)}</h2>
            <p><a href="sponsorship.html">Become a sponsor</a></p>
          </div>
          <div class="sponsors">
            ${sp.sponsors.map((x) => {
              const inner = `<img src="${img(x.logo, 500)}" alt="${esc(x.name)}" loading="lazy">`;
              return x.website ? `<a class="sponsor" href="${esc(x.website)}" target="_blank" rel="noopener">${inner}</a>` : `<div class="sponsor">${inner}</div>`;
            }).join("")}
          </div>
        </div>
      </section>`;
  }

  /* ---------- About ---------- */

  function renderAbout(d, s) {
    return `
      ${pageHead({ title: d.title, image: d.heroImage, lede: `${s.chapterName} of Delta Sigma Pi at the ${s.school}.` })}

      <section class="section">
        <div class="wrap split">
          <div class="split-crest">
            ${d.crest ? `<img src="${img(d.crest, 400)}" alt="Delta Sigma Pi crest" loading="lazy">` : ""}
            <h2 class="h-lg">${esc(d.fraternityTitle)}</h2>
          </div>
          <div class="prose">${paras(d.fraternityText)}</div>
        </div>
      </section>

      <section class="section on-purple">
        <div class="wrap split">
          <h2 class="h-lg" style="color:var(--gold)">${esc(d.purposeTitle)}</h2>
          <p class="purpose">${esc(d.purposeText)}</p>
        </div>
      </section>

      <section class="section">
        <div class="wrap">
          <div class="split">
            <h2 class="h-lg">${esc(d.historyTitle)}</h2>
            <div class="prose">${paras(d.historyText)}</div>
          </div>
          ${d.historyPhoto ? `<figure class="history-photo"><img src="${img(d.historyPhoto, 2000)}" alt="Brothers of the Gamma Sigma Chapter" loading="lazy"></figure>` : ""}
          ${(d.timeline || []).length ? `<ol class="timeline">${d.timeline.map((t) => `<li><strong>${esc(t.year)}</strong><span>${esc(t.text)}</span></li>`).join("")}</ol>` : ""}
        </div>
      </section>

      <section class="section on-lilac" aria-labelledby="values-title">
        <div class="wrap">
          <div class="section-head"><h2 class="h-lg" id="values-title">${esc(d.valuesTitle)}</h2></div>
          <div class="values">
            ${(d.values || []).map((v) => `
              <article class="value">
                <div class="value-media"><img src="${img(v.photo, 1400)}" alt="" loading="lazy"></div>
                <div><h3>${esc(v.name)}</h3><div class="prose">${paras(v.text)}</div></div>
              </article>`).join("")}
          </div>
        </div>
      </section>`;
  }

  /* ---------- Brothers ---------- */

  function memberCard(b) {
    const role = (b.role || "Brother").trim();
    const isBrother = role.toLowerCase() === "brother";
    const photo = `<img src="${img(b.photo, 700)}" alt="" loading="lazy">`;
    const text = `<p class="member-name">${esc(b.name)}</p><p class="member-role${isBrother ? " is-brother" : ""}">${esc(role)}</p>`;
    if (!b.linkedin) {
      return `<div class="member"><div class="member-photo">${photo}</div>${text}</div>`;
    }
    return `
      <a class="member" href="${esc(b.linkedin)}" target="_blank" rel="noopener" aria-label="${esc(b.name)}, ${esc(role)}, on LinkedIn (opens in a new tab)">
        <div class="member-photo">
          ${photo}
          <span class="member-badge" aria-hidden="true">${icon.linkedin}</span>
        </div>
        ${text}
      </a>`;
  }

  function renderBrothers(d) {
    const groups = [{ name: d.executiveBoardTitle || "Executive Board", id: "executive-board", label: "Executive Board", brothers: d.executiveBoard || [] }]
      .concat((d.classes || []).map((c) => ({ name: c.name, id: slug(c.name), label: c.name, brothers: c.brothers || [] })));

    const chips = groups.map((g, i) => `<button class="chip" data-filter="${g.id}" aria-pressed="${i === 0}">${esc(g.label)}</button>`).join("")
      + `<button class="chip" data-filter="all" aria-pressed="false">Everyone</button>`;

    return `
      ${pageHead({
        title: "Brothers",
        lede: d.intro,
      })}
      <div class="filter-bar"><div class="wrap"><div class="filters" role="toolbar" aria-label="Filter brothers by class">${chips}</div></div></div>
      <div class="wrap roster-wrap">
        ${groups.map((g, i) => `
          <section class="group" data-group="${g.id}" id="${g.id}" ${i === 0 ? "" : "hidden"} aria-labelledby="g-${g.id}">
            <div class="group-head"><h2 class="h-md" id="g-${g.id}">${esc(g.name)}</h2><span>${g.brothers.length} ${g.brothers.length === 1 ? "brother" : "brothers"}</span></div>
            <div class="roster">${g.brothers.map(memberCard).join("")}</div>
          </section>`).join("")}
      </div>`;
  }

  function wireBrothers() {
    const chips = [...document.querySelectorAll(".chip")];
    const groups = [...document.querySelectorAll(".group")];
    const valid = new Set(chips.map((c) => c.dataset.filter));
    function show(id, push) {
      if (!valid.has(id)) id = chips[0].dataset.filter;
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.filter === id)));
      groups.forEach((g) => { g.hidden = id === "all" ? g.dataset.group === "executive-board" : g.dataset.group !== id; });
      if (push) history.replaceState(null, "", id === chips[0].dataset.filter ? location.pathname : `#${id}`);
    }
    chips.forEach((c) => c.addEventListener("click", () => {
      show(c.dataset.filter, true);
      const bar = document.querySelector(".filter-bar");
      if (bar.getBoundingClientRect().top <= 77) window.scrollTo({ top: bar.offsetTop - 76, behavior: "smooth" });
    }));
    window.addEventListener("hashchange", () => show(location.hash.slice(1), false));
    show(location.hash.slice(1), false);
  }

  /* ---------- Recruitment ---------- */

  function parseDate(str) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(str || "");
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }

  function videoEmbed(url) {
    if (!url) return "";
    let id = null;
    let m = /youtu\.be\/([\w-]{6,})/.exec(url) || /[?&]v=([\w-]{6,})/.exec(url) || /youtube\.com\/(?:shorts|embed)\/([\w-]{6,})/.exec(url);
    if (m) id = m[1];
    if (id) return `<iframe src="https://www.youtube-nocookie.com/embed/${id}" title="Rush video" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    m = /vimeo\.com\/(\d+)/.exec(url);
    if (m) return `<iframe src="https://player.vimeo.com/video/${m[1]}" title="Rush video" allow="fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    return `<a class="btn btn-gold" href="${esc(url)}" target="_blank" rel="noopener">Watch the video</a>`;
  }

  function renderRecruitment(d, s) {
    const events = (d.events || []).map((e) => {
      const dt = parseDate(e.date);
      const month = dt ? dt.toLocaleDateString("en-US", { month: "short" }) : "";
      const day = dt ? dt.getDate() : "";
      const wk = dt ? dt.toLocaleDateString("en-US", { weekday: "long" }) : "";
      const meta = [e.time && `<span>${esc(e.time)}</span>`, e.location && `<span>${esc(e.location)}</span>`].filter(Boolean).join("");
      return `
        <li class="event${e.inviteOnly ? " is-invite" : ""}">
          <div class="event-date"><span class="m">${month}</span><span class="d">${day}</span><span class="w">${wk}</span></div>
          <div><h3>${esc(e.name)}</h3>${meta ? `<p class="event-meta">${meta}</p>` : ""}</div>
          <span class="tag${e.inviteOnly ? "" : " open"}">${e.inviteOnly ? "Invite only" : "Open to all"}</span>
        </li>`;
    }).join("");

    return `
      ${pageHead({
        title: d.title,
        lede: d.intro,
        extra: s.groupme ? `<div class="hero-actions"><a class="btn btn-gold" href="${esc(s.groupme)}" target="_blank" rel="noopener">${icon.chat}Join our GroupMe</a></div>` : "",
      })}

      <section class="section" aria-labelledby="events-title">
        <div class="wrap rush-layout">
          <div>
            <div class="section-head" style="margin-bottom:28px"><h2 class="h-lg" id="events-title">Recruitment events</h2></div>
            ${d.requirementNote ? `<p class="notice">${icon.info}<span>${esc(d.requirementNote)}</span></p>` : ""}
            <ol class="events">${events}</ol>
          </div>
          ${d.flyer ? `<figure class="rush-flyer" style="margin:0"><img src="${img(d.flyer, 900)}" alt="Recruitment flyer with this semester's event schedule" loading="lazy"></figure>` : ""}
        </div>
      </section>

      <section class="section on-lilac" aria-labelledby="video-title">
        <div class="wrap">
          <div class="section-head"><h2 class="h-lg" id="video-title">${esc(d.videoTitle)}</h2></div>
          <div class="video-slot">
            ${d.videoUrl ? videoEmbed(d.videoUrl) : `<div><div class="play">${icon.play}</div><p class="soon">Coming soon</p></div>`}
          </div>
        </div>
      </section>

      <section class="section" aria-labelledby="elig-title">
        <div class="wrap">
          <div class="section-head"><h2 class="h-lg" id="elig-title">${esc(d.eligibilityTitle)}</h2><p>To rush Delta Sigma Pi you need to meet all of the following.</p></div>
          <ul class="eligibility">${(d.eligibility || []).map((x) => `<li>${icon.check}<p>${esc(x)}</p></li>`).join("")}</ul>
        </div>
      </section>

      ${(d.pastFlyers || []).length ? `
      <section class="section on-white" aria-labelledby="flyers-title">
        <div class="wrap">
          <div class="section-head"><h2 class="h-lg" id="flyers-title">${esc(d.flyersTitle)}</h2></div>
          <div class="flyers">${d.pastFlyers.map((f) => `<figure><img src="${img(f, 700)}" alt="Past recruitment flyer" loading="lazy"></figure>`).join("")}</div>
        </div>
      </section>` : ""}`;
  }

  /* ---------- Sponsorship ---------- */

  function renderSponsorship(d, s) {
    const pdf = d.packetLink;
    const fileName = pdf ? decodeURIComponent(pdf.split("/").pop().split("?")[0]) : "";
    const packetButtons = pdf ? `
              <a class="btn btn-gold" href="${esc(pdf)}" target="_blank" rel="noopener">${icon.doc}View the packet</a>
              <a class="btn btn-ghost" href="${esc(pdf)}" download="${esc(fileName)}">${icon.download}Download PDF</a>` : "";
    return `
      ${pageHead({ title: d.title, lede: d.intro })}
      <section class="section">
        <div class="wrap split">
          <div>
            <div class="prose">${paras(d.text)}</div>
            ${(d.benefits || []).length ? `<ul class="benefits">${d.benefits.map((b) => `<li>${icon.check}${esc(b)}</li>`).join("")}</ul>` : ""}
          </div>
          <aside class="cta-panel">
            <h2>Partner with us</h2>
            <p>${pdf ? "Our sponsorship packet covers our events, members and sponsorship tiers." : "Reach out for our sponsorship packet and tier details."}</p>
            <div class="hero-actions" style="margin-top:0">
              ${packetButtons || `<a class="btn btn-gold" href="mailto:${esc(s.contactEmail)}?subject=Sponsorship%20inquiry">${icon.mail}Email our outreach team</a>`}
            </div>
            <p class="cta-contact">Questions? Email <a href="mailto:${esc(s.contactEmail)}?subject=Sponsorship%20inquiry">${esc(s.contactEmail)}</a></p>
          </aside>
        </div>
      </section>
      ${pdf ? `
      <section class="section on-dark" id="packet" aria-labelledby="packet-title">
        <div class="wrap">
          <div class="section-head">
            <h2 class="h-lg" id="packet-title">${esc(d.packetTitle || "Sponsorship packet")}</h2>
            <div class="hero-actions" style="margin-top:0">${packetButtons}</div>
          </div>
          <div class="packet-viewer">
            <iframe src="${esc(pdf)}#view=FitH" title="${esc(d.packetTitle || "Sponsorship packet")} (PDF)" loading="lazy"></iframe>
          </div>
          ${d.packetCover ? `<a class="packet-cover" href="${esc(pdf)}" target="_blank" rel="noopener"><img src="${img(d.packetCover, 900)}" alt="Cover of the sponsorship packet. Tap to open the full PDF." loading="lazy"><span>Tap to open the full packet</span></a>` : ""}
        </div>
      </section>` : ""}
      ${sponsorsBlock(d, "section-tight on-lilac")}
      ${contactSection(s)}`;
  }

  /* ---------- Boot ---------- */

  function wireHeader() {
    const head = document.querySelector(".site-header");
    const onScroll = () => head.classList.toggle("is-solid", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const toggle = head.querySelector(".nav-toggle");
    const nav = head.querySelector(".main-nav");
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.innerHTML = `<span class="visually-hidden">${open ? "Close menu" : "Menu"}</span>${open ? icon.close : icon.menu}`;
      head.classList.toggle("is-solid", open || window.scrollY > 40);
    });
  }

  async function boot() {
    const page = document.body.dataset.page || "home";
    const main = document.getElementById("main");
    try {
      const s = await load("settings");
      document.querySelector(".site-header").innerHTML = header(page, s);
      document.querySelector(".site-footer").innerHTML = footer(s);
      wireHeader();

      if (page === "home") {
        const [d, sp] = await Promise.all([load("home"), load("sponsorship")]);
        main.innerHTML = renderHome(d, s, sp);
        wireMarquee();
      } else if (page === "about") {
        main.innerHTML = renderAbout(await load("about"), s);
      } else if (page === "brothers") {
        main.innerHTML = renderBrothers(await load("brothers"));
        wireBrothers();
      } else if (page === "recruitment") {
        main.innerHTML = renderRecruitment(await load("recruitment"), s);
      } else if (page === "sponsorship") {
        main.innerHTML = renderSponsorship(await load("sponsorship"), s);
      }
      wireContactForm(s);
    } catch (err) {
      console.error(err);
      const local = location.protocol === "file:";
      main.innerHTML = `
        <div class="load-error">
          <h1>This page couldn't load</h1>
          <p>${local
            ? "You opened the file straight from your computer, which browsers block. On a Mac, double-click <code>Preview Site.command</code> in the site folder instead."
            : `Something is wrong with a file in the <code>content</code> folder. The most common cause is a missing comma or quote after an edit. Details: <code>${esc(err.message)}</code>`}</p>
        </div>`;
    }
  }

  window.__dspBoot = boot; // used by the preview tool only
  boot();
})();

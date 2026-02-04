// --------------------
// basic config
// --------------------
const GITHUB_USER = "MaximPollak";
const EMAIL = "maxim.pollak2016@gmail.com";

// projects I want to show (screenshots are local in /assets)
const FEATURED = [
  {
    repo: "ClashOfTitans",
    image: "assets/Screenshot_ClashOfTitans.png",
    source: "github",
  },
  {
    repo: "CCL3-WS2025", // NEOKey
    image: "assets/Screenshot_NEOKey.png",
    source: "github",
  },
  {
    repo: "RentMyRide",
    image: "assets/Screenshot_RentMyRide.png",
    source: "github",
  },
  {
    title: "IT Insiders",
    description:
      "Matura project — web application (IT forum). Built user accounts, admin/moderation features, and full CRUD using PHP + MySQL.",
    tech: ["PHP", "MySQL", "HTML", "CSS", "JavaScript"],
    year: "2023",
    image: "assets/Screenshot_MaturaProject.jpeg",
    source: "matura",
  },
];

// --------------------
// typing effect for roles
// --------------------
const roles = ["Software Developer (Full-stack)", "Data Analyst"];

const typingEl = document.getElementById("typingRole");
const a11yEl = document.getElementById("typingA11y");

// typing speed settings
const TYPE_SPEED = 55;
const ERASE_SPEED = 35;
const HOLD_TIME = 1100;
const BETWEEN_TIME = 250;

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function typeText(text) {
  for (let i = 0; i <= text.length; i++) {
    typingEl.textContent = text.slice(0, i);
    if (a11yEl) a11yEl.textContent = text;
    await sleep(TYPE_SPEED);
  }
}

async function eraseText(text) {
  for (let i = text.length; i >= 0; i--) {
    typingEl.textContent = text.slice(0, i);
    await sleep(ERASE_SPEED);
  }
}

async function startTypingLoop() {
  if (!typingEl) return;

  // if user prefers reduced motion, don't animate typing
  if (prefersReducedMotion()) {
    let i = 0;
    typingEl.textContent = roles[i];
    if (a11yEl) a11yEl.textContent = roles[i];

    setInterval(() => {
      i = (i + 1) % roles.length;
      typingEl.textContent = roles[i];
      if (a11yEl) a11yEl.textContent = roles[i];
    }, 2200);

    return;
  }

  let idx = 0;
  while (true) {
    const current = roles[idx];
    await typeText(current);
    await sleep(HOLD_TIME);
    await eraseText(current);
    await sleep(BETWEEN_TIME);
    idx = (idx + 1) % roles.length;
  }
}

startTypingLoop();

// --------------------
// mobile navbar
// --------------------
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  // close menu after clicking a link (mobile)
  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });

  // close menu if user clicks outside
  document.addEventListener("click", (e) => {
    const inside = nav.contains(e.target) || menuBtn.contains(e.target);
    if (!inside) {
      nav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });
}

// --------------------
// footer year
// --------------------
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// --------------------
// copy email button
// --------------------
const copyEmailBtn = document.getElementById("copyEmailBtn");
const toast = document.getElementById("toast");

// small toast message
function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => (toast.textContent = ""), 1800);
}

if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      showToast("Email copied ✅");
    } catch {
      showToast("Couldn't copy — please copy manually.");
    }
  });
}

// --------------------
// project slider
// --------------------
const projectTrack = document.getElementById("projectTrack");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let slideIndex = 0;
let slidesCount = 0;

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

// build one project card (GitHub repo or my local matura project)
function createSlide(item) {
  // non-GitHub project (Matura)
  if (item.source === "matura") {
    const el = document.createElement("div");
    el.className = "slide";
    el.innerHTML = `
      <article class="project-card">
        <div class="project-cover">
          <img src="${item.image}" alt="Screenshot of ${item.title}" loading="lazy" />
        </div>

        <div class="project-body">
          <div class="project-top">
            <h3 class="project-name">${item.title}</h3>
            <div class="project-year">${item.year}</div>
          </div>

          <p class="project-desc">${item.description}</p>

          <div class="project-meta">
            ${item.tech.map((t) => `<span class="badge-pill">${t}</span>`).join("")}
            <span class="badge-pill">Matura Project</span>
          </div>
        </div>
      </article>
    `;
    return el;
  }

  // GitHub project
  const repo = item.repo;
  const year = new Date(repo.pushed_at).getFullYear();
  const homepage = (repo.homepage || "").trim();
  const hasLive = homepage && homepage.startsWith("http");

  const lang = repo.language ? repo.language : "—";
  const stars = repo.stargazers_count ?? 0;
  const updated = fmtDate(repo.pushed_at);

  const el = document.createElement("div");
  el.className = "slide";
  el.innerHTML = `
    <article class="project-card">
      <div class="project-cover">
        <img src="${item.image}" alt="Screenshot of ${repo.name}" loading="lazy" />
      </div>

      <div class="project-body">
        <div class="project-top">
          <h3 class="project-name">${repo.name}</h3>
          <div class="project-year">${year}</div>
        </div>

        <p class="project-desc">${repo.description ?? ""}</p>

        <div class="project-meta">
          <span class="badge-pill">${lang}</span>
          <span class="badge-pill">★ ${stars}</span>
          <span class="badge-pill">Updated ${updated}</span>
        </div>

        <div class="project-actions">
          <a class="btn primary" href="${repo.html_url}" target="_blank" rel="noreferrer">
            View on GitHub
          </a>
          ${hasLive ? `<a class="btn" href="${homepage}" target="_blank" rel="noreferrer">Live demo</a>` : ``}
        </div>
      </div>
    </article>
  `;
  return el;
}

// update slider position
function updateCarousel() {
  if (!projectTrack) return;
  const x = -slideIndex * 100;
  projectTrack.style.transform = `translateX(${x}%)`;
}

// keep the slider looping
function clampIndex(i) {
  if (slidesCount === 0) return 0;
  if (i < 0) return slidesCount - 1;
  if (i >= slidesCount) return 0;
  return i;
}

// slider arrows
if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    slideIndex = clampIndex(slideIndex - 1);
    updateCarousel();
  });
}
if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    slideIndex = clampIndex(slideIndex + 1);
    updateCarousel();
  });
}

// keyboard controls (left/right)
document.addEventListener("keydown", (e) => {
  if (!slidesCount) return;
  if (e.key === "ArrowLeft") {
    slideIndex = clampIndex(slideIndex - 1);
    updateCarousel();
  }
  if (e.key === "ArrowRight") {
    slideIndex = clampIndex(slideIndex + 1);
    updateCarousel();
  }
});

// load GitHub repos and match them with my FEATURED list
async function loadGithubRepos() {
  try {
    const url = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

    const repos = await res.json();

    // keep it clean: no forks, no archived
    const clean = repos.filter((r) => !r.fork && !r.archived);

    const featured = [];

    FEATURED.forEach((item) => {
      // Matura project (local)
      if (item.source === "matura") {
        featured.push(item);
        return;
      }

      // GitHub project
      const repo = clean.find((r) => r.name === item.repo);
      if (repo) {
        featured.push({ ...item, repo });
      }
    });

    if (projectTrack) {
      projectTrack.innerHTML = "";
      featured.forEach((item) => projectTrack.appendChild(createSlide(item)));
      slidesCount = featured.length;
      slideIndex = 0;
      updateCarousel();
    }
  } catch (err) {
    console.error(err);
  }
}

// start loading projects
loadGithubRepos();

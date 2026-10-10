document.addEventListener('DOMContentLoaded', () => {
  initConsoleEasterEgg();
  initBackgroundVideo();
  initAmbientCyberCanvas();
  initGlitchAvatarMorph();
  initRoleTypewriter();
  initDynamicAgeEngine();
  initEducationCards();
  initExperienceCards();
  initMonkeytypeStats();
  initProjectsCarousel();
  initTracksCards();
  initWarmupDrill();
  initMobileDock();
});

function initBackgroundVideo() {
  const video = document.getElementById('bg-video');
  const toggleBtn = document.getElementById('video-toggle-btn');
  if (!video) return;

  const targetRate = 0.45;

  video.playbackRate = targetRate;
  video.addEventListener('loadedmetadata', () => { video.playbackRate = targetRate; });
  video.addEventListener('play', () => { video.playbackRate = targetRate; });

  video.muted = true;
  video.play().then(() => {
    video.playbackRate = targetRate;
  }).catch(() => {
    const playOnTouch = () => {
      video.playbackRate = targetRate;
      video.play();
      document.removeEventListener('touchstart', playOnTouch);
      document.removeEventListener('click', playOnTouch);
    };
    document.addEventListener('touchstart', playOnTouch, { passive: true, once: true });
    document.addEventListener('click', playOnTouch, { once: true });
  });

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (video.paused) {
        video.playbackRate = targetRate;
        video.play();
        toggleBtn.innerHTML = '<i class="fa-solid fa-pause"></i> <span>VIDEO</span>';
      } else {
        video.pause();
        toggleBtn.innerHTML = '<i class="fa-solid fa-play"></i> <span>VIDEO</span>';
      }
    });
  }
}

function initAmbientCyberCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 38;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
      this.radius = Math.random() * 1.5 + 0.6;
      this.alpha = Math.random() * 0.35 + 0.15;
      this.isRed = Math.random() > 0.45;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0) this.x = width;
      else if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      else if (this.y > height) this.y = 0;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.isRed 
        ? `rgba(255, 0, 59, ${this.alpha})` 
        : `rgba(255, 255, 255, ${this.alpha * 0.6})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(loop);
  }
  loop();
}

function initGlitchAvatarMorph() {
  const container = document.getElementById('avatar-container');
  const photo = document.getElementById('avatar-photo');
  const logo = document.getElementById('avatar-logo');
  const indicator = document.getElementById('morph-indicator-text');

  if (!container || !photo || !logo) return;

  if (XIV4M_CONFIG.avatars) {
    if (XIV4M_CONFIG.avatars.photo) photo.src = XIV4M_CONFIG.avatars.photo;
    if (XIV4M_CONFIG.avatars.logo) logo.src = XIV4M_CONFIG.avatars.logo;
  }

  let showingPhoto = true;

  function triggerMorph() {
    container.classList.add('glitching');

    setTimeout(() => {
      if (showingPhoto) {
        photo.classList.remove('active');
        logo.classList.add('active');
        showingPhoto = false;
        if (indicator) indicator.innerHTML = 'XIV4M &bull; THE MASK';
      } else {
        logo.classList.remove('active');
        photo.classList.add('active');
        showingPhoto = true;
        if (indicator) indicator.innerHTML = 'SHIVAM KUMAR &bull; PHOTO';
      }
    }, 180);

    setTimeout(() => {
      container.classList.remove('glitching');
    }, 420);
  }

  container.addEventListener('click', triggerMorph);
  container.addEventListener('touchstart', (e) => {
    e.stopPropagation();
    triggerMorph();
  }, { passive: true });

  setInterval(triggerMorph, 4800);
}

function initRoleTypewriter() {
  const el = document.getElementById('typewriter-target');
  if (!el || !XIV4M_CONFIG.roles || !XIV4M_CONFIG.roles.length) return;

  const roles = XIV4M_CONFIG.roles;
  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function typeLoop() {
    const current = roles[roleIdx];

    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 35;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 70;
    }

    if (!isDeleting && charIdx === current.length) {
      typingSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(typeLoop, typingSpeed);
  }

  typeLoop();
}

function initDynamicAgeEngine() {
  const heroLive = document.getElementById('hero-live-age');
  const bdayEl = document.getElementById('birthday-countdown');

  if (!XIV4M_CONFIG.birthDate) return;

  const birthDate = new Date(XIV4M_CONFIG.birthDate);

  function updateChrono() {
    const now = new Date();
    const diff = now - birthDate;
    const ageDecimal = diff / (1000 * 60 * 60 * 24 * 365.2425);
    const formatted = ageDecimal.toFixed(8);

    if (heroLive) {
      const [intPart, decPart] = formatted.split('.');
      heroLive.innerHTML = `<span class="chrono-int">${intPart}</span><span class="chrono-dot">.</span><span class="chrono-dec">${decPart}</span>`;
    }

    if (bdayEl) {
      const currentYear = now.getFullYear();
      let nextBday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
      if (now > nextBday) {
        nextBday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());
      }
      const daysLeft = Math.ceil((nextBday - now) / (1000 * 60 * 60 * 24));
      bdayEl.textContent = `${daysLeft}d to Birthday`;
    }
  }

  updateChrono();
  setInterval(updateChrono, 50);
}

function initEducationCards() {
  const container = document.getElementById('education-container');
  if (!container || !XIV4M_CONFIG.education) return;

  container.innerHTML = XIV4M_CONFIG.education.map(edu => {
    const isPursuing = edu.status.toLowerCase().includes('pursuing');
    const isDropped = edu.status.toLowerCase().includes('drop');
    const statusClass = isPursuing ? 'status-pursuing' : (isDropped ? 'status-dropped' : 'status-completed');

    return `
      <div class="spotlight-card">
        <div class="spotlight-visual">
          <div class="spotlight-img-wrap">
            <img src="${edu.logo}" alt="${edu.institution} Logo" loading="lazy">
          </div>
          <div class="spotlight-vignette"></div>
        </div>

        <div class="spotlight-info">
          <h3 class="spotlight-name">${edu.institution}</h3>
          <div class="spotlight-sub">${edu.degree}</div>
          <p class="spotlight-desc">${edu.desc}</p>
          <div class="spotlight-bottom">
            <span class="spotlight-pill ${statusClass}">
              ${isPursuing ? '<span class="status-pulse-dot"></span>' : ''}
              ${edu.status} &bull; ${edu.badge}
            </span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function initExperienceCards() {
  const container = document.getElementById('experience-container');
  if (!container || !XIV4M_CONFIG.experience) return;

  container.innerHTML = XIV4M_CONFIG.experience.map(exp => `
    <div class="spotlight-card">
      <div class="spotlight-visual">
        <div class="spotlight-img-wrap">
          <img src="${exp.logo}" alt="${exp.company} Logo" loading="lazy">
        </div>
        <div class="spotlight-vignette"></div>
      </div>

      <div class="spotlight-info">
        <h3 class="spotlight-name">${exp.company}</h3>
        <div class="spotlight-sub">${exp.role}</div>
        <p class="spotlight-desc">${exp.desc}</p>
        <div class="spotlight-bottom">
          <span class="spotlight-pill status-completed">
            ${exp.period} &bull; ${exp.tag}
          </span>
        </div>
      </div>
    </div>
  `).join('');
}

async function initMonkeytypeStats() {
  const bestWpm = document.getElementById('mt-best-wpm');
  const accuracy = document.getElementById('mt-accuracy');
  const completed = document.getElementById('mt-completed');

  const mt = XIV4M_CONFIG.monkeytype;

  try {
    if (mt.username && mt.username !== 'your_monkeytype_username') {
      const res = await fetch(`https://api.monkeytype.com/users/${mt.username}/profile`);
      if (res.ok) {
        const json = await res.json();
        const pb = json.data?.personalBests?.time?.[60] || json.data?.personalBests?.time?.[15] || [];
        const topPB = pb[0] || {};
        const wpm = topPB.wpm ? Math.round(topPB.wpm) : mt.fallbackWpm;
        const acc = topPB.acc ? Math.round(topPB.acc) : mt.fallbackAcc;
        const tests = json.data?.typingStats?.completedTests || mt.fallbackTests;
        renderMT(wpm, acc, tests);
        return;
      }
    }
  } catch (e) {
  }

  renderMT(mt.fallbackWpm, mt.fallbackAcc, mt.fallbackTests);

  function renderMT(wpm, acc, tests) {
    if (bestWpm) bestWpm.textContent = wpm;
    if (accuracy) accuracy.textContent = `${acc}%`;
    if (completed) completed.textContent = `${tests}+`;
  }
}

async function initProjectsCarousel() {
  const container = document.getElementById('projects-container');
  const btnLeft = document.getElementById('proj-scroll-left');
  const btnRight = document.getElementById('proj-scroll-right');

  if (container && btnLeft && btnRight) {
    btnLeft.onclick = () => container.scrollBy({ left: -360, behavior: 'smooth' });
    btnRight.onclick = () => container.scrollBy({ left: 360, behavior: 'smooth' });
  }

  if (!container) return;

  try {
    const res = await fetch('https://api.github.com/users/xiv4m/repos?sort=updated&per_page=12');
    if (res.ok) {
      const repos = await res.json();
      if (Array.isArray(repos) && repos.length > 0) {
        const originalRepos = repos.filter(r => !r.fork && r.name !== 'xiv4m');
        const displayList = originalRepos.length > 0 ? originalRepos.slice(0, 8) : repos.slice(0, 8);

        container.innerHTML = displayList.map(repo => {
          const lang = repo.language || 'Code';
          const desc = repo.description || 'Public engineering repository by @xiv4m on GitHub.';
          const cleanName = repo.name.replace(/[-_]/g, ' ');
          const stars = repo.stargazers_count;
          const forks = repo.forks_count;

          return `
            <div class="project-carousel-card">
              <div class="pcc-vignette"></div>
              <div class="pcc-top">
                <span class="pcc-lang-badge">[ ${lang.toUpperCase()} ]</span>
                <div class="pcc-stars-forks">
                  ${stars > 0 ? `<span><i class="fa-solid fa-star"></i> ${stars}</span>` : ''}
                  ${forks > 0 ? `<span><i class="fa-solid fa-code-fork"></i> ${forks}</span>` : ''}
                </div>
              </div>
              <h3 class="pcc-title">${cleanName}</h3>
              <p class="pcc-desc">${desc}</p>
              <div class="pcc-tags-row">
                <span class="pcc-tag">${lang}</span>
                <span class="pcc-tag"><i class="fa-regular fa-clock"></i> ${new Date(repo.updated_at).toLocaleDateString()}</span>
              </div>
              <a href="${repo.html_url}" target="_blank" class="pcc-link">
                <span>View on GitHub</span>
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            </div>
          `;
        }).join('');
        return;
      }
    }
  } catch (err) {
  }

  if (XIV4M_CONFIG.projects) {
    container.innerHTML = XIV4M_CONFIG.projects.map(p => `
      <div class="project-carousel-card">
        <div class="pcc-top">
          <span class="pcc-lang-badge">[ ${p.badge} ]</span>
        </div>
        <h3 class="pcc-title">${p.title}</h3>
        <p class="pcc-desc">${p.desc}</p>
        <div class="pcc-tags-row">
          ${p.tech.map(t => `<span class="pcc-tag">${t}</span>`).join('')}
        </div>
        <a href="${p.link}" target="_blank" class="pcc-link">
          <span>Explore Repository</span>
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
      </div>
    `).join('');
  }
}

function initConsoleEasterEgg() {
  const titleStyle = 'color: #ff003b; font-size: 22px; font-weight: 900; text-shadow: 0 0 12px rgba(255,0,59,0.8); font-family: monospace;';
  const subStyle = 'color: #10b981; font-size: 13px; font-weight: 700; font-family: monospace;';
  const memeStyle = 'color: #f1f5f9; font-size: 12px; font-family: monospace; line-height: 1.6;';
  const redditStyle = 'color: #ff4500; font-size: 11px; font-weight: 600; font-family: monospace;';
  const discordStyle = 'color: #5865f2; font-size: 11px; font-weight: 600; font-family: monospace;';

  console.log('%c⚠ WHOA THERE, MR. ROBOT ⚠', titleStyle);
  console.log('%c[!] Inspect element detected... checking your security clearance: FAILED 💀', subStyle);
  console.log(
    '%c' +
    'Bro pressed F12 thinking he found the mainframe password.\n' +
    'Looking for the secret API key? It is: `sudo rm -rf /* --no-preserve-root` (do NOT run that lmao).\n\n' +
    'If you are trying to:\n' +
    ' • Steal the CSS: Just ask on IG (@its.shivam.2003), I wont bite.\n' +
    ' • Hack my age ticker: Good luck, math is undefeated.\n' +
    ' • Judge my code: "It compiled on my machine, so it works."\n',
    memeStyle
  );
  console.log('%cr/ProgrammerHumor: "99 little bugs in the code, fix 1 bug... 127 little bugs in the code."', redditStyle);
  console.log('%cDiscord ping: @xiv4m is currently vibing to 808s and hacking Wi-Fi cameras.', discordStyle);
  console.log('%c\n[ Systems verified. Have a nice day, curious human! ]', 'color: #ff003b; font-weight: bold;');
}

async function initTracksCards() {
  const container = document.getElementById('tracks-container');
  if (!container) return;

  try {
    const res = await fetch('https://itunes.apple.com/lookup?id=1856245537&entity=song');
    if (res.ok) {
      const data = await res.json();
      const songs = data.results ? data.results.filter(r => r.wrapperType === 'track') : [];

      if (songs.length > 0) {
        container.innerHTML = songs.map(s => {
          const highResCover = s.artworkUrl100 ? s.artworkUrl100.replace('100x100bb', '600x600bb') : 'assets/preview_frame.jpg';
          return `
            <a href="${s.trackViewUrl}" target="_blank" class="track-card">
              <img src="${highResCover}" alt="${s.trackName}" class="track-art" loading="lazy" onerror="this.src='assets/the-mask-cover.jpg'">
              <div class="track-details">
                <span class="track-name">${s.trackName}</span>
                <span class="track-artist">${s.artistName} &bull; ${new Date(s.releaseDate).getFullYear()}</span>
              </div>
              <div class="track-play-btn"><i class="fa-solid fa-play"></i></div>
            </a>
          `;
        }).join('');
        return;
      }
    }
  } catch (err) {
  }

  if (XIV4M_CONFIG.tracks) {
    container.innerHTML = XIV4M_CONFIG.tracks.map(t => `
      <a href="${t.link}" target="_blank" class="track-card">
        <img src="${t.cover}" alt="${t.title}" class="track-art" loading="lazy" onerror="this.src='assets/preview_frame.jpg'">
        <div class="track-details">
          <span class="track-name">${t.title}</span>
          <span class="track-artist">${t.artist}</span>
        </div>
        <div class="track-play-btn"><i class="fa-solid fa-play"></i></div>
      </a>
    `).join('');
  }
}

function initWarmupDrill() {
  const prompt = document.getElementById('drill-phrase-box');
  const input = document.getElementById('drill-input');
  const resetBtn = document.getElementById('drill-reset');
  const timerEl = document.getElementById('drill-timer');
  const wpmEl = document.getElementById('drill-live-wpm');
  const accEl = document.getElementById('drill-live-acc');

  if (!prompt || !input) return;

  const phrase = prompt.textContent.trim();
  let startTime = null;
  let timerId = null;
  let done = false;

  input.addEventListener('input', () => {
    if (done) return;

    if (!startTime) {
      startTime = new Date();
      timerId = setInterval(() => {
        const elapsed = Math.floor((new Date() - startTime) / 1000);
        const rem = Math.max(0, 60 - elapsed);
        if (timerEl) timerEl.textContent = rem;
        if (rem <= 0) finish();
      }, 1000);
    }

    const val = input.value;
    const elapsedMin = (new Date() - startTime) / 60000;

    let correct = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === phrase[i]) correct++;
    }

    const accuracy = val.length > 0 ? Math.round((correct / val.length) * 100) : 100;
    const words = correct / 5;
    const wpm = elapsedMin > 0 ? Math.round(words / elapsedMin) : 0;

    if (wpmEl) wpmEl.textContent = wpm;
    if (accEl) accEl.textContent = `${accuracy}%`;

    if (val.length >= phrase.length) {
      finish();
    }
  });

  function finish() {
    done = true;
    clearInterval(timerId);
    input.disabled = true;
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      clearInterval(timerId);
      startTime = null;
      done = false;
      input.disabled = false;
      input.value = '';
      if (timerEl) timerEl.textContent = '60';
      if (wpmEl) wpmEl.textContent = '0';
      if (accEl) accEl.textContent = '100%';
      input.focus();
    });
  }
}

function initMobileDock() {
  const dockItems = document.querySelectorAll('.mobile-dock .dock-item');
  dockItems.forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('highlight')) return;
      dockItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

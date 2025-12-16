// --- Intro plein écran avec cadeaux flottants ---
let typeIndex = 0;

window.addEventListener('load', () => {
    spawnGifts(32); // cadeaux animés
    // Fin de l'intro après 4.5s
    setTimeout(() => {
        const introScreen = document.getElementById('intro-screen');
        introScreen.classList.add('fade-out');
        setTimeout(() => {
            introScreen.style.display = 'none';
            document.getElementById('main').classList.remove('hidden');
            typeIntro();
        }, 900);
    }, 4500);
});

function spawnGifts(count) {
    const intro = document.getElementById('intro-screen');
    const width = window.innerWidth;
    for (let i = 0; i < count; i++) {
        const span = document.createElement('span');
        span.className = 'gift';
        span.textContent = Math.random() < 0.33 ? '🎁' : (Math.random() < 0.5 ? '🎈' : '🎂');
        const left = Math.random() * width;
        const delay = Math.random() * 2200;
        const dur = 5000 + Math.random() * 4000;
        span.style.left = left + 'px';
        span.style.animationDuration = dur + 'ms';
        span.style.animationDelay = delay + 'ms';
        intro.appendChild(span);
        // cleanup
        setTimeout(() => { span.remove(); }, delay + dur + 500);
    }
}

function typeIntro() {
    const target = document.getElementById('intro');
    const text = target?.dataset?.introText || '';
    if (typeIndex < text.length) {
        target.innerText += text.charAt(typeIndex);
        typeIndex++;
        setTimeout(typeIntro, 45);
    } else {
        document.getElementById('choices').classList.remove('hidden');
    }
}

// Effet survol boutons (rayon lumineux)
document.addEventListener('pointermove', (e) => {
    if (!(e.target instanceof HTMLElement)) return;
    if (e.target.tagName.toLowerCase() === 'button') {
        const rect = e.target.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        e.target.style.setProperty('--x', x + '%');
        e.target.style.setProperty('--y', y + '%');
    }
});

// --- Affichage des messages ---
function showMessage(type) {
    const messageEl = document.getElementById('message');
    messageEl.innerHTML = '';

    if (type === 'sincere') {
        // Message sincère en mode "paroles" façon Apple Music
        const lines = [
            "💛 Séphanie Natacha,",
            "Aujourd’hui, je te souhaite un très doux anniversaire 🎂",
            "À mon arrivée en France, tu as été la première à m’ouvrir ton cœur,",
            "et ce lien me marquera toujours.",
            "",
            "J’admire ta force, ta douceur et ton courage,",
            "ce sourire qui illumine tout autour de toi ✨",
            "",
            "Merci d’être toi, simplement et sincèrement.",
            "Bon anniversaire 💛 Je t’aime."
        ];
        playKaraoke(lines, 1700);
        return;
    }

    if (type === 'surprise') {
        showFireworksOverlay(
            "🎆 Joyeux anniversaire,\nSéphanie!\n\nQue cette journée soit pleine de lumière, de force\net de sourires. Amitiés sincères 💛"
        );
        return;
    }
}

// --- Karaoke style ---
function playKaraoke(lines, interval = 1500) {
    const messageEl = document.getElementById('message');
    const wrap = document.createElement('div');
    wrap.className = 'lyrics';
    messageEl.appendChild(wrap);

    let i = 0;
    function next() {
        if (i >= lines.length) return;
        const p = document.createElement('p');
        p.className = 'lyric-line';
        p.textContent = lines[i];
        wrap.appendChild(p);
        // Activer la ligne avec un léger délai pour transition CSS
        requestAnimationFrame(() => { p.classList.add('active'); });
        // Scroll doux vers le bas
        wrap.scrollTo({ top: wrap.scrollHeight, behavior: 'smooth' });
        i++;
        setTimeout(next, interval);
    }
    next();
}

// Ouvrir le message sincère dans une nouvelle page centrée
function openSincerePage(lines, interval = 1500) {
    const win = window.open('', '_blank');
    if (!win) {
        // Si le popup est bloqué, bascule en mode in-page en secours
        playKaraoke(lines, interval);
        return;
    }
    const safeLines = JSON.stringify(lines);
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>💛 Message sincère</title>
  <style>
    html, body { height: 100%; margin: 0; }
    body {
      background: radial-gradient(1000px 500px at 50% -10%, #ffe3ec, #ff9a9e 60%, #ff6a88 100%);
      display: grid; place-items: center; font-family: Arial, sans-serif; color: #222;
    }
    .card {
      width: min(90vw, 800px);
      background: #fff; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,.15);
      padding: 24px; text-align: center;
    }
    h1 { margin: 0 0 10px; color: #b30045; }
    .lyrics { max-height: 60vh; overflow: auto; text-align: left; margin-top: 8px; padding-right: 8px; }
    .lyric-line { opacity: .5; transform: translateY(6px); transition: all 300ms ease; margin: 8px 0; }
    .lyric-line.active { opacity: 1; transform: translateY(0); color: #b30045; }
    .hint { margin-top: 12px; font-size: 12px; opacity: .7; }
  </style>
  </head>
  <body>
    <div class="card">
      <h1>💛 Message pour Séphanie Natacha</h1>
      <div id="wrap" class="lyrics"></div>
    </div>
    <script>
      const LINES = ${safeLines};
      const INTERVAL = ${Number(interval)};
      const wrap = document.getElementById('wrap');
      let i = 0;
      function next() {
        if (i >= LINES.length) return;
        const p = document.createElement('p');
        p.className = 'lyric-line';
        p.textContent = LINES[i];
        wrap.appendChild(p);
        requestAnimationFrame(() => p.classList.add('active'));
        wrap.scrollTo({ top: wrap.scrollHeight, behavior: 'smooth' });
        i++;
        setTimeout(next, INTERVAL);
      }
      next();
    <\/script>
  </body>
</html>`;
    win.document.open();
    win.document.write(html);
    win.document.close();
}

// --- Overlay Feu d'artifice ---
function showFireworksOverlay(centerMessage) {
    const overlay = document.getElementById('fx-overlay');
    const canvas = document.getElementById('fx-canvas');
    const ctx = canvas.getContext('2d');
    const msg = document.getElementById('fx-message');
    msg.textContent = centerMessage;
    overlay.classList.remove('hidden');

    // Ajuster la taille
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    let particles = [];
    let rockets = [];
    const gravity = 0.06;
    const colors = ['#ffd166', '#06d6a0', '#118ab2', '#ef476f', '#f0f', '#ff6a88'];

    function launchRocket() {
        const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
        const y = canvas.height + 10;
        const vx = (Math.random() - 0.5) * 2;
        const vy = - (6 + Math.random() * 2.5);
        rockets.push({ x, y, vx, vy, life: 50 + Math.random() * 20 });
    }

    function explode(x, y) {
        const count = 60 + Math.floor(Math.random() * 40);
        const color = colors[Math.floor(Math.random() * colors.length)];
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2) * (i / count);
            const speed = 2 + Math.random() * 3;
            particles.push({
                x, y,
                vx: Math.cos(angle) * speed * (0.7 + Math.random()*0.6),
                vy: Math.sin(angle) * speed * (0.7 + Math.random()*0.6),
                alpha: 1,
                color,
                size: 2 + Math.random() * 2
            });
        }
    }

    let animId;
    function step() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Lancer des fusées
        if (Math.random() < 0.08) launchRocket();
        // Update rockets
        rockets = rockets.filter(r => r.life > 0);
        rockets.forEach(r => {
            r.life -= 1;
            r.x += r.vx;
            r.y += r.vy;
            r.vy += gravity * 0.2;
            // trainée
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.fillRect(r.x - 1, r.y - 1, 2, 2);
            if (r.vy >= -0.5 || r.life <= 0) {
                explode(r.x, r.y);
                r.life = 0;
            }
        });
        // Update particles
        particles = particles.filter(p => p.alpha > 0.02);
        particles.forEach(p => {
            p.vy += gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.alpha *= 0.98;
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        });
        animId = requestAnimationFrame(step);
    }
    step();

    function close() {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', resize);
        overlay.classList.add('hidden');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Auto-fermeture après 8s ou clic
    const timer = setTimeout(close, 8000);
    overlay.addEventListener('click', () => { clearTimeout(timer); close(); }, { once: true });
}

// --- Musique de fond (lecture en boucle tant que la page est ouverte) ---
const bgMusic = document.getElementById('audio');

function startMusic() {
    if (!bgMusic) return;
    bgMusic.loop = true; // s’assurer de la boucle
    bgMusic.volume = 0.35;
    bgMusic.play().catch(() => {});
}

// Lancer la musique au premier clic utilisateur (mobile friendly)
document.addEventListener('click', startMusic, { once: true });

// Optionnel: gestion d’un éventuel bouton de toggle s’il existe dans la page
const toggleBtn = document.getElementById('music-toggle');
if (toggleBtn && bgMusic) {
    toggleBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            toggleBtn.textContent = '🔊 Musique';
        } else {
            bgMusic.pause();
            toggleBtn.textContent = '🔇 Musique';
        }
    });
}

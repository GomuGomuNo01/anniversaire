// --- Intro plein écran avec cadeaux flottants ---

window.addEventListener('load', () => {
    spawnGifts(32); // cadeaux animés
    // Fin de l'intro après 4.5s
    setTimeout(() => {
        const introScreen = document.getElementById('intro-screen');
        introScreen.classList.add('fade-out');
        setTimeout(() => {
            introScreen.style.display = 'none';
            // Lancer directement la célébration (feux d'artifice + message centré + musique)
            startCelebration();
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

// (supprimé) ancien flux d'intro avec saisie progressive

// Démarre la célébration plein écran avec feux d'artifice, paroles centrées et musique
function startCelebration() {
    // Texte sincère façon Apple Music (une ligne à la fois)
    const lines = [
        "💛 Séphanie,",
        "Aujourd’hui, le monde célèbre la merveilleuse personne que tu es 🎂",
        "Depuis mon arrivée en France, tu as été la première amie qui a illuminé mon quotidien,",
        "et ce lien précieux restera gravé dans mon cœur pour toujours.",
        "",
        "Ta force, ta douceur et ton courage sont inspirants,",
        "ton sourire illumine tous ceux qui ont la chance de te connaître ✨",
        "",
        "Merci d’être toi, simplement et sincèrement.",
        "Joyeux anniversaire 💛 Avec tout mon amour et mon affection."
    ];

    // Afficher l'overlay feux d'artifice
    showFireworksOverlay("");

    // Lancer les paroles au centre de l'écran
    playOverlayLyrics(lines, 1700);

    // Tenter l'autoplay de la musique
    startMusic();
}

// (supprimé) effets hover pour boutons — plus de boutons à l'écran

// (supprimé) ancien système de boutons pour afficher les messages

// (supprimé) ancien mode karaoké dans le conteneur principal

// Ouvrir le message sincère dans une nouvelle page centrée
// (supprimé) ouverture d'une page secondaire pour le message

// --- Overlay Feu d'artifice ---
function showFireworksOverlay(centerMessage) {
    const overlay = document.getElementById('fx-overlay');
    const canvas = document.getElementById('fx-canvas');
    const ctx = canvas.getContext('2d');
    const msg = document.getElementById('fx-message');
    // Permettra d'afficher des paroles animées au centre
    msg.innerHTML = centerMessage ? `<div class="overlay-lyrics"><p class="overlay-line active">${centerMessage}</p></div>` : '<div class="overlay-lyrics"></div>';
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

    // Pas de fermeture automatique: l'overlay reste pour profiter du spectacle et des paroles
}

// Affiche des paroles façon Apple Music au centre de l'écran (dans l'overlay)
function playOverlayLyrics(lines, interval = 1500) {
    const msg = document.getElementById('fx-message');
    if (!msg) return;
    let wrap = msg.querySelector('.overlay-lyrics');
    if (!wrap) {
        wrap = document.createElement('div');
        wrap.className = 'overlay-lyrics';
        msg.innerHTML = '';
        msg.appendChild(wrap);
    } else {
        wrap.innerHTML = '';
    }

    let i = 0;
    function next() {
        if (i >= lines.length) return;
        const p = document.createElement('p');
        p.className = 'overlay-line';
        p.textContent = lines[i] === '' ? '\u00A0' : lines[i];
        wrap.appendChild(p);
        requestAnimationFrame(() => p.classList.add('active'));
        wrap.scrollTo({ top: wrap.scrollHeight, behavior: 'smooth' });
        i++;
        setTimeout(next, interval);
    }
    next();
}

// --- Musique de fond (lecture en boucle tant que la page est ouverte) ---
const bgMusic = document.getElementById('audio');

function startMusic() {
    if (!bgMusic) return;
    bgMusic.loop = true;
    bgMusic.volume = 0; // démarre silencieux
    bgMusic.play().then(() => {
        // augmenter progressivement le volume pour contourner certains blocages autoplay
        let vol = 0;
        const fadeIn = setInterval(() => {
            vol += 0.01;
            if (vol >= 0.35) {
                vol = 0.35;
                clearInterval(fadeIn);
            }
            bgMusic.volume = vol;
        }, 100);
    }).catch(() => {
        // fallback : le clic reste utile sur mobile
        console.log("Autoplay bloqué, musique prête au clic.");
    });
}


// Lancer la musique au premier clic utilisateur (fallback si l'autoplay est bloqué)
//document.addEventListener('click', startMusic, { once: true });

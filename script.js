
const stars = document.getElementById("stars");
const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

// CREAR ESTRELLAS
const starCount = window.innerWidth < 600 ? 85 : 150;

for (let i = 0; i < starCount; i++) {
  const star = document.createElement("span");

  star.className = "star";
  star.style.left = Math.random() * 100 + "%";
  star.style.top = Math.random() * 100 + "%";
  star.style.animationDelay = Math.random() * 4 + "s";
  star.style.opacity = 0.2 + Math.random() * 0.7;

  const size = Math.random() > 0.9 ? 3 : 2;

  star.style.width = size + "px";
  star.style.height = size + "px";

  stars.appendChild(star);
}

// ABRIR Y CERRAR LA CARTA
const letterSection = document.getElementById("letterSection");
const openButton = document.getElementById("openLetter");
const closeButton = document.getElementById("closeLetter");

openButton.addEventListener("click", () => {
  const opening = !letterSection.classList.contains("visible");

  letterSection.classList.toggle("visible", opening);
  letterSection.setAttribute("aria-hidden", String(!opening));

  openButton.innerHTML = opening
    ? "<span>Volver a leer la carta</span><span class='btn-heart'>♡</span>"
    : "<span>Descubre tu carta</span><span class='btn-heart'>♡</span>";

  if (opening) {
    burstHearts(24);

    setTimeout(() => {
      letterSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  }
});

closeButton.addEventListener("click", () => {
  letterSection.classList.remove("visible");
  letterSection.setAttribute("aria-hidden", "true");

  openButton.innerHTML =
    "<span>Descubre tu carta</span><span class='btn-heart'>♡</span>";

  openButton.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
});

// MENSAJE TEMPORAL
const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2300);
}

// COPIAR ENLACE DE LA CANCIÓN
const youtubeLink = document.getElementById("youtubeLink");
const copyButton = document.getElementById("copyLink");

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(youtubeLink.href);
    showToast("¡Enlace copiado! ❤️");
  } catch (error) {
    showToast("Pulsa Escuchar canción para abrir YouTube 🎵");
  }
});

// ANIMACIÓN DE CORAZONES
let width;
let height;
let hearts = [];

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * ratio;
  canvas.height = height * ratio;

  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function makeHeart(x, y) {
  return {
    x: x ?? Math.random() * width,
    y: y ?? height + 20,
    size: 4 + Math.random() * 9,
    speed: 0.25 + Math.random() * 0.7,
    drift: (Math.random() - 0.5) * 0.45,
    alpha: 0.2 + Math.random() * 0.45,
    angle: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.012,
    burst: false,
    life: 0
  };
}

function drawHeart(heart) {
  ctx.save();

  ctx.translate(heart.x, heart.y);
  ctx.rotate(heart.angle);
  ctx.globalAlpha = Math.max(0, heart.alpha);

  ctx.fillStyle = heart.color || "#ff9dcf";

  const size = heart.size;

  ctx.beginPath();
  ctx.moveTo(0, size * 0.32);

  ctx.bezierCurveTo(
    -size * 1.2, -size * 0.35,
    -size * 0.55, -size * 1.05,
    0, -size * 0.5
  );

  ctx.bezierCurveTo(
    size * 0.55, -size * 1.05,
    size * 1.2, -size * 0.35,
    0, size * 0.32
  );

  ctx.fill();
  ctx.restore();
}

// EXPLOSIÓN DE CORAZONES AL ABRIR LA CARTA
function burstHearts(amount) {
  for (let i = 0; i < amount; i++) {
    const heart = makeHeart(
      width * (0.25 + Math.random() * 0.5),
      height * (0.35 + Math.random() * 0.3)
    );

    heart.burst = true;
    heart.vx = (Math.random() - 0.5) * 4;
    heart.vy = -1 - Math.random() * 3;
    heart.alpha = 0.9;
    heart.size = 5 + Math.random() * 10;
    heart.life = 0;

    heart.color = Math.random() > 0.5
      ? "#ff9dcf"
      : "#c9c5ff";

    hearts.push(heart);
  }
}

// BUCLE DE ANIMACIÓN
function animate() {
  ctx.clearRect(0, 0, width, height);

  if (hearts.length < 34 && Math.random() < 0.25) {
    hearts.push(makeHeart());
  }

  hearts = hearts.filter(heart => {
    return heart.alpha > 0.025 &&
      heart.y > -30 &&
      heart.life < 200;
  });

  for (const heart of hearts) {
    if (heart.burst) {
      heart.x += heart.vx;
      heart.y += heart.vy;
      heart.vy += 0.025;
      heart.alpha -= 0.009;
      heart.life++;
    } else {
      heart.y -= heart.speed;
      heart.x += heart.drift;
      heart.angle += heart.spin;
    }

    drawHeart(heart);
  }

  requestAnimationFrame(animate);
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

animate();

const canvas = document.getElementById("spaceCanvas");
const ctx = canvas.getContext("2d");
const cursorGlow = document.getElementById("cursorGlow");
const reactor = document.getElementById("reactor");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = [...document.querySelectorAll(".nav-link")];
const reveals = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");
const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

let stars = [];
let width = 0;
let height = 0;
let mouseX = 0;
let mouseY = 0;

function resizeCanvas() {
  width = canvas.width = window.innerWidth * devicePixelRatio;
  height = canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;

  stars = Array.from({ length: Math.min(180, Math.floor(window.innerWidth / 7)) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    z: Math.random() * 1 + 0.2,
    size: Math.random() * 1.4 + 0.2
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, width, height);
  for (const star of stars) {
    star.y += star.z * 0.18 * devicePixelRatio;
    if (star.y > height) {
      star.y = 0;
      star.x = Math.random() * width;
    }

    const shiftX = (mouseX - window.innerWidth / 2) * star.z * 0.012 * devicePixelRatio;
    const shiftY = (mouseY - window.innerHeight / 2) * star.z * 0.012 * devicePixelRatio;

    ctx.beginPath();
    ctx.arc(star.x + shiftX, star.y + shiftY, star.size * devicePixelRatio, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(170, 210, 255, ${0.18 + star.z * 0.45})`;
    ctx.fill();
  }
  requestAnimationFrame(drawStars);
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;

  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;

  if (reactor) {
    const rotateY = (event.clientX / window.innerWidth - 0.5) * 14;
    const rotateX = -(event.clientY / window.innerHeight - 0.5) * 14;
    reactor.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }
});

resizeCanvas();
drawStars();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

reveals.forEach((item) => observer.observe(item));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    let current = 0;
    const increment = Math.max(1, Math.floor(target / 40));

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current;
    }, 32);

    counterObserver.unobserve(el);
  });
}, { threshold: 0.7 });

counters.forEach((counter) => counterObserver.observe(counter));

const phrases = [
  "deploying cinematic experience...",
  "optimizing data flow...",
  "scaling cloud services...",
  "system ready."
];

let phraseIndex = 0;
let letterIndex = 0;
let deleting = false;
const typingText = document.getElementById("typingText");

function typeLoop() {
  const phrase = phrases[phraseIndex];

  if (!deleting) {
    typingText.textContent = phrase.slice(0, letterIndex++);
    if (letterIndex > phrase.length) {
      deleting = true;
      setTimeout(typeLoop, 1250);
      return;
    }
  } else {
    typingText.textContent = phrase.slice(0, letterIndex--);
    if (letterIndex < 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      letterIndex = 0;
    }
  }

  setTimeout(typeLoop, deleting ? 34 : 62);
}

typeLoop();

menuToggle.addEventListener("click", () => {
  const open = navMenu.classList.toggle("open");
  menuToggle.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  });
});

const sections = [...document.querySelectorAll("main section[id]")];
window.addEventListener("scroll", () => {
  let current = "home";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 180) current = section.id;
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
});

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = -((y / rect.height) - 0.5) * 10;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

document.querySelectorAll(".project-link:not(.project-live)").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    modalTitle.textContent = link.dataset.project;
    modal.classList.add("open");
  });
});

document.querySelectorAll("[data-close-modal]").forEach((item) => {
  item.addEventListener("click", () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const name = data.get("name");
  formStatus.textContent = `Message simulation complete. Thank you, ${name}.`;
  contactForm.reset();
  setTimeout(() => {
    formStatus.textContent = "";
  }, 4500);
});

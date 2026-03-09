/* ============================================
   PARTICLE CANVAS – Matrix-like code rain
   ============================================ */
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const particles = [];
const PARTICLE_COUNT = 60;
const CODE_CHARS = "01{}[]<>/=;:()const let var => function import export async await".split("");

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * -canvas.height;
    this.speed = 0.3 + Math.random() * 1.2;
    this.char = CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    this.opacity = 0.05 + Math.random() * 0.15;
    this.size = 10 + Math.random() * 4;
    this.drift = (Math.random() - 0.5) * 0.3;
  }

  update() {
    this.y += this.speed;
    this.x += this.drift;
    if (this.y > canvas.height + 20) {
      this.reset();
      this.y = -20;
    }
  }

  draw() {
    ctx.fillStyle = `rgba(100, 255, 218, ${this.opacity})`;
    ctx.font = `${this.size}px "JetBrains Mono", monospace`;
    ctx.fillText(this.char, this.x, this.y);
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ============================================
   DOM REFERENCES
   ============================================ */
const header = document.querySelector(".header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-link");
const typedText = document.getElementById("typed-text");
const revealElements = document.querySelectorAll(".reveal");
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");
const footerYear = document.getElementById("footer-year");

const sectionTargets = Array.from(navItems)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

/* ============================================
   TYPING EFFECT – Multiple phrases
   ============================================ */
const typingPhrases = [
  "Full Stack Developer",
  "CSE Student @ Chandigarh University",
  "IoT Enthusiast",
  "Building the Future, One Commit at a Time"
];

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {
  const currentPhrase = typingPhrases[phraseIndex];

  if (!deleting) {
    charIndex += 1;
    typedText.textContent = currentPhrase.slice(0, charIndex);

    if (charIndex === currentPhrase.length) {
      deleting = true;
      setTimeout(typeEffect, 2200);
      return;
    }
  } else {
    charIndex -= 1;
    typedText.textContent = currentPhrase.slice(0, charIndex);

    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % typingPhrases.length;
    }
  }

  const speed = deleting ? 30 : 65;
  setTimeout(typeEffect, speed);
}

/* ============================================
   NAVIGATION
   ============================================ */
function toggleMenu() {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
}

function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function smoothScroll(event) {
  const targetId = event.currentTarget.getAttribute("href");

  if (!targetId || !targetId.startsWith("#")) {
    return;
  }

  const targetElement = document.querySelector(targetId);
  if (!targetElement) {
    return;
  }

  event.preventDefault();
  targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
  setActiveNavLink(targetId.slice(1));
  closeMenu();
}

function setActiveNavLink(activeId) {
  navItems.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

/* ============================================
   STICKY HEADER
   ============================================ */
function applyStickyEffect() {
  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

/* ============================================
   SCROLL REVEAL (Intersection Observer)
   ============================================ */
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

/* ============================================
   ACTIVE SECTION TRACKING
   ============================================ */
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.target.id) {
        setActiveNavLink(entry.target.id);
      }
    });
  },
  {
    root: null,
    threshold: 0.2,
    rootMargin: "-35% 0px -55% 0px"
  }
);

sectionTargets.forEach((section) => navObserver.observe(section));

/* ============================================
   STAGGERED SKILL CARD ANIMATION
   ============================================ */
const skillCards = document.querySelectorAll(".skill-card");
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll
          ? document.querySelectorAll(".skill-card")
          : [];
        cards.forEach((card, i) => {
          card.style.transitionDelay = `${i * 60}ms`;
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        });
        skillObserver.disconnect();
      }
    });
  },
  { threshold: 0.1 }
);

const skillsSection = document.getElementById("skills");
if (skillsSection) {
  skillCards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.5s ease, transform 0.5s ease, border-color 0.3s ease, box-shadow 0.3s ease";
  });
  skillObserver.observe(skillsSection);
}

/* ============================================
   CONTACT FORM
   ============================================ */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();
  const honey = contactForm.querySelector('input[name="_honey"]')?.value.trim();

  if (!name || !email || !message) {
    formMessage.textContent = "> Error: All fields are required.";
    formMessage.classList.remove("success");
    return;
  }

  if (!validateEmail(email)) {
    formMessage.textContent = "> Error: Invalid email format.";
    formMessage.classList.remove("success");
    return;
  }

  if (message.length < 10) {
    formMessage.textContent = "> Error: Message too short (min 10 chars).";
    formMessage.classList.remove("success");
    return;
  }

  if (honey) {
    formMessage.textContent = "> Spam detected. Blocked.";
    formMessage.classList.remove("success");
    return;
  }

  const submitButton = contactForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "⏳ Sending...";
  formMessage.textContent = "> Executing send()...";
  formMessage.classList.remove("success");

  try {
    const response = await fetch("https://formsubmit.co/ajax/krishnagopal102006@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        message,
        _subject: "New Portfolio Contact Message",
        _template: "table"
      })
    });

    if (!response.ok) {
      throw new Error("Submission failed.");
    }

    formMessage.textContent = "> ✓ Message sent successfully!";
    formMessage.classList.add("success");
    contactForm.reset();
  } catch (error) {
    formMessage.textContent = "> ✗ Failed to send. Try again later.";
    formMessage.classList.remove("success");
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = '<span class="btn-icon">⚡</span> Execute send()';
  }
});

/* ============================================
   PROJECT CARD TILT EFFECT
   ============================================ */
const projectCards = document.querySelectorAll(".project-card");
projectCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
  });
});

/* ============================================
   FOOTER YEAR
   ============================================ */
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

/* ============================================
   INITIALIZE
   ============================================ */
menuToggle.addEventListener("click", toggleMenu);
navItems.forEach((link) => link.addEventListener("click", smoothScroll));
window.addEventListener("scroll", applyStickyEffect);

applyStickyEffect();
setActiveNavLink((window.location.hash || "#home").slice(1));
typeEffect();

/* ============================================
   CLOSE NAV ON OUTSIDE CLICK
   ============================================ */
document.addEventListener("click", (e) => {
  if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
    closeMenu();
  }
});

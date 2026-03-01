const header = document.querySelector(".header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-link");
const typedText = document.getElementById("typed-text");
const revealElements = document.querySelectorAll(".reveal");
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");
const sectionTargets = Array.from(navItems)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const typingPhrases = [
  "CSE Student | Full Stack Developer | IoT Enthusiast"
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
      setTimeout(typeEffect, 1500);
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

  const speed = deleting ? 35 : 75;
  setTimeout(typeEffect, speed);
}

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

function applyStickyEffect() {
  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

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
    threshold: 0.14
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

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
    formMessage.textContent = "Please fill in all fields.";
    formMessage.classList.remove("success");
    return;
  }

  if (!validateEmail(email)) {
    formMessage.textContent = "Please enter a valid email address.";
    formMessage.classList.remove("success");
    return;
  }

  if (message.length < 10) {
    formMessage.textContent = "Message should be at least 10 characters long.";
    formMessage.classList.remove("success");
    return;
  }

  if (honey) {
    formMessage.textContent = "Spam detected. Message blocked.";
    formMessage.classList.remove("success");
    return;
  }

  const submitButton = contactForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "Sending...";
  formMessage.textContent = "Sending your message...";
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

    formMessage.textContent = "Message sent successfully. I will get it on email.";
    formMessage.classList.add("success");
    contactForm.reset();
  } catch (error) {
    formMessage.textContent = "Could not send right now. Please try again later.";
    formMessage.classList.remove("success");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Send Message";
  }
});

menuToggle.addEventListener("click", toggleMenu);
navItems.forEach((link) => link.addEventListener("click", smoothScroll));
window.addEventListener("scroll", applyStickyEffect);

applyStickyEffect();
setActiveNavLink((window.location.hash || "#home").slice(1));
typeEffect();

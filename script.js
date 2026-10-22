/* ==========================================================
   PORTFÓLIO HUGO — script.js

   COMO CONFIGURAR O ENVIO REAL DO FORMULÁRIO (passo a passo)
   ----------------------------------------------------------
   Um site feito só com HTML/CSS/JS não consegue enviar e-mails
   sozinho: é preciso um serviço que receba a mensagem. A opção
   mais simples e gratuita é o Formspree:

   1. Acesse https://formspree.io e crie uma conta gratuita.
   2. Clique em "New Form" e informe o e-mail onde quer receber
      as mensagens.
   3. O Formspree vai gerar um endereço parecido com:
         https://formspree.io/f/abcdwxyz
   4. Copie esse endereço e cole na constante FORM_ENDPOINT abaixo.
   5. Abra o site (de preferência publicado, ex.: GitHub Pages
      ou Netlify) e envie uma mensagem de teste. Na primeira vez,
      o Formspree pede para confirmar o seu e-mail.

   Alternativas: Web3Forms (https://web3forms.com) ou EmailJS
   (https://www.emailjs.com). Elas funcionam parecido, mas cada
   uma tem o seu próprio formato de envio.
   ========================================================== */

const FORM_ENDPOINT = ""; // <- cole aqui o endereço do Formspree

emailjs.init({
  publicKey: "PoksIHdbtn11orCSu"
});

/* ---------- Efeitos futuristas ---------- */

// Efeito de digitação no subtítulo
const typingEl = document.querySelector("[data-typing]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (typingEl && !reduceMotion) {
  const fullText = typingEl.textContent.trim();
  typingEl.setAttribute("aria-label", fullText);
  typingEl.textContent = "";
  typingEl.classList.add("typing");

  let charIndex = 0;
  const typeNext = () => {
    charIndex++;
    typingEl.textContent = fullText.slice(0, charIndex);
    if (charIndex < fullText.length) setTimeout(typeNext, 55);
  };
  setTimeout(typeNext, 700);
}

// Barra de progresso da rolagem
const progressBar = document.getElementById("scrollProgress");
function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
  progressBar.style.width = percent + "%";
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

// Luz que acompanha o mouse nos cartões
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", event.clientX - rect.left + "px");
    card.style.setProperty("--my", event.clientY - rect.top + "px");
  });
});

/* ---------- Ano atual no rodapé ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Menu mobile ---------- */
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

function closeMenu() {
  nav.classList.remove("open");
  menuToggle.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

/* ---------- Cabeçalho ao rolar + link ativo ---------- */
const header = document.getElementById("header");
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav__link");

function onScroll() {
  header.classList.toggle("scrolled", window.scrollY > 10);

  let current = "";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 140) current = section.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + current);
  });
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Animação de entrada (ao rolar) ---------- */
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealItems.forEach((el, i) => {
    el.style.transitionDelay = (i % 3) * 80 + "ms";
    observer.observe(el);
  });
} else {
  revealItems.forEach((el) => el.classList.add("visible"));
}

/* ---------- Contador das estatísticas ---------- */
const counters = document.querySelectorAll("[data-count]");

function animateCounter(el) {
  const target = Number(el.dataset.count);
  const duration = 1200;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * progress);
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => counterObserver.observe(el));
} else {
  counters.forEach((el) => (el.textContent = el.dataset.count));
}

/* ---------- Formulário de contato ---------- */
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

const validators = {
  nome(value) {
    if (!value.trim()) return "Digite o seu nome.";
    if (value.trim().length < 2) return "O nome precisa ter pelo menos 2 letras.";
    return "";
  },
  email(value) {
    if (!value.trim()) return "Digite o seu e-mail.";
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!pattern.test(value.trim())) return "Digite um e-mail válido (ex.: nome@email.com).";
    return "";
  },
  mensagem(value) {
    if (!value.trim()) return "Escreva uma mensagem.";
    if (value.trim().length < 10) return "A mensagem precisa ter pelo menos 10 caracteres.";
    return "";
  },
};

function showError(fieldName, message) {
  const input = form.elements[fieldName];
  const errorEl = form.querySelector(`[data-error-for="${fieldName}"]`);
  input.closest(".field").classList.toggle("invalid", Boolean(message));
  errorEl.textContent = message;
}

function validateField(fieldName) {
  const message = validators[fieldName](form.elements[fieldName].value);
  showError(fieldName, message);
  return !message;
}

// Valida enquanto a pessoa digita (depois de sair do campo uma vez)
Object.keys(validators).forEach((fieldName) => {
  const input = form.elements[fieldName];
  input.addEventListener("blur", () => validateField(fieldName));
  input.addEventListener("input", () => {
    if (input.closest(".field").classList.contains("invalid")) validateField(fieldName);
  });
});

function setStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = "form__status" + (type ? " " + type : "");
}


form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("", "");

  const results = Object.keys(validators).map(validateField);

  if (results.includes(false)) {
    setStatus("Corrija os campos destacados e tente novamente.", "fail");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";

  try {
    await emailjs.send(
      "service_emjybar",
      "template_hkvvr7s",
      {
        name: form.elements.nome.value.trim(),
        email: form.elements.email.value.trim(),
        message: form.elements.mensagem.value.trim()
      }
    );

    form.reset();
    setStatus("Mensagem enviada com sucesso! Obrigado pelo contato.", "success");
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    setStatus("Não foi possível enviar agora. Tente novamente.", "fail");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Enviar mensagem";
  }
});

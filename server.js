const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const progress = document.getElementById("progress");
function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

// Contact form -> your inbox, using FormSubmit (https://formsubmit.co). No backend needed.
// First submission: FormSubmit emails an activation link to the address below. Click it once.
// Tip: after activating, you can replace the email in this URL with the private token that
// FormSubmit sends you (https://formsubmit.co/ajax/<token>) so your address isn't in the page source.
const FORM_ENDPOINT = "https://formsubmit.co/ajax/manisaba561@gmail.com";

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = form.querySelector("button");
  button.disabled = true;
  status.style.color = "";
  status.textContent = "Sending...";
  try {
    const payload = Object.fromEntries(new FormData(form).entries());
    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        message: payload.message,
        _replyto: payload.email,
        _subject: `New portfolio message from ${payload.name}`,
        _template: "table",
        _captcha: "false"
      })
    });
    const result = await response.json().catch(() => ({}));
    const sent = response.ok && (result.success === true || result.success === "true");
    if (!sent) throw new Error(result.message || "Unable to send message.");
    status.textContent = "Thanks! Your message has been sent.";
    form.reset();
  } catch (error) {
    status.textContent = error.message || "Something went wrong. Please try again.";
    status.style.color = "#fda4af";
  } finally {
    button.disabled = false;
  }
});


// Certifications section built from the certificates supplied by Sabareshan.
(() => {
  const nav = document.getElementById("nav");
  const journey = document.getElementById("journey");
  if (!nav || !journey || document.getElementById("certifications")) return;

  const certNav = document.createElement("a");
  certNav.href = "#certifications";
  certNav.textContent = "Certifications";
  const journeyLink = [...nav.querySelectorAll("a")].find((link) => link.getAttribute("href") === "#journey");
  if (journeyLink) nav.insertBefore(certNav, journeyLink);
  else nav.appendChild(certNav);

  const section = document.createElement("section");
  section.className = "section certifications-section";
  section.id = "certifications";
  section.innerHTML = [
    '<div class="section-kicker reveal">04 — CERTIFICATIONS</div>',
    '<div class="section-heading reveal">',
    '<h2 class="section-title">Learning, recognised.<br><span class="gradient-text">Milestones earned.</span></h2>',
    '<p>Certificates from learning experiences in Agentic AI and Google AI in Education.</p>',
    '</div>',
    '<div class="cert-grid">',
    '<article class="cert-card reveal">',
    '<a class="cert-image-link" href="/certificates/agentic-ai-webinar.webp" target="_blank" rel="noopener noreferrer" aria-label="Open Agentic AI webinar certificate">',
    '<img src="/certificates/agentic-ai-webinar.webp" alt="Certificate of participation for the Agentic AI webinar held on 14 November 2026" loading="lazy">',
    '<span class="cert-view">VIEW CERTIFICATE ↗</span></a>',
    '<div class="cert-details"><div class="cert-issuer">BRAND MONK ACADEMY · WEBINAR</div>',
    '<h3>Agentic AI Webinar</h3><p>Certificate of Participation · 14 November 2026</p>',
    '<a class="cert-open" href="/certificates/agentic-ai-webinar.webp" target="_blank" rel="noopener noreferrer">View full certificate <span>↗</span></a></div></article>',
    '<article class="cert-card reveal">',
    '<a class="cert-image-link" href="/certificates/gemini-certified-student.webp" target="_blank" rel="noopener noreferrer" aria-label="Open Gemini Certified Student certificate">',
    '<img src="/certificates/gemini-certified-student.webp" alt="Google for Education Gemini Certified Student K12 certificate issued to Sabareshan M" loading="lazy">',
    '<span class="cert-view">VIEW CERTIFICATE ↗</span></a>',
    '<div class="cert-details"><div class="cert-issuer">GOOGLE FOR EDUCATION · K12</div>',
    '<h3>Gemini Certified Student</h3><p>Issued 15 November 2026 · Valid through 15 November 2029</p>',
    '<a class="cert-open" href="/certificates/gemini-certified-student.webp" target="_blank" rel="noopener noreferrer">View full certificate <span>↗</span></a></div></article>',
    '</div>'
  ].join("");

  journey.parentNode.insertBefore(section, journey);
  const journeyKicker = journey.querySelector(".section-kicker");
  const contactKicker = document.querySelector("#contact .section-kicker");
  if (journeyKicker) journeyKicker.textContent = "05 — THE JOURNEY";
  if (contactKicker) contactKicker.textContent = "06 — CONTACT";

  const style = document.createElement("style");
  style.textContent = [
    '.certifications-section{background:linear-gradient(180deg,#0c0915,#100b1a);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}',
    '.cert-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}',
    '.cert-card{overflow:hidden;border:1px solid var(--line);background:linear-gradient(145deg,rgba(26,20,43,.9),rgba(13,10,22,.95));transition:transform .3s,border-color .3s}',
    '.cert-card:hover{transform:translateY(-6px);border-color:rgba(167,139,250,.65)}',
    '.cert-image-link{display:block;position:relative;aspect-ratio:1.48;background:#f5f3f7;overflow:hidden}',
    '.cert-image-link img{display:block;width:100%;height:100%;object-fit:contain;transition:transform .35s}',
    '.cert-card:hover .cert-image-link img{transform:scale(1.025)}',
    '.cert-view{position:absolute;right:13px;bottom:13px;padding:9px 11px;background:rgba(12,8,22,.88);border:1px solid rgba(196,181,253,.35);color:#eee7ff;font:9px var(--mono);letter-spacing:.09em}',
    '.cert-details{padding:23px 24px 25px}',
    '.cert-issuer{font:9px var(--mono);letter-spacing:.12em;color:var(--purple)}',
    '.cert-details h3{font-size:20px;margin:12px 0 8px;letter-spacing:-.03em}',
    '.cert-details p{font-size:12px;line-height:1.7;color:var(--muted);margin:0 0 18px}',
    '.cert-open{display:inline-flex;gap:10px;align-items:center;padding-bottom:5px;border-bottom:1px solid rgba(167,139,250,.5);font:10px var(--mono);color:#e9ddff}',
    '.cert-open span{color:var(--pink)}',
    '@media(max-width:650px){.cert-grid{grid-template-columns:1fr}.cert-image-link{aspect-ratio:1.35}.cert-details{padding:20px}}'
  ].join("\n");
  document.head.appendChild(style);

  // Add the injected cards to the existing scroll-reveal observer effect.
  section.querySelectorAll(".reveal").forEach((el) => {
    if (typeof revealObserver !== "undefined") revealObserver.observe(el);
    else { el.classList.add("visible"); }
  });
})();

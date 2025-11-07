
const themeButton = document.getElementById('theme-button');

// Theme management: default is dark (no class). Add 'light-mode' class for light theme.
const THEME_KEY = 'orion_theme';

function applyTheme(mode) {
  const isLight = (mode === 'light');
  document.body.classList.toggle('light-mode', isLight);
  if (themeButton) {
    themeButton.setAttribute('aria-pressed', String(isLight));
    themeButton.textContent = isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode';
  }
}

function saveTheme(mode) {
  try { localStorage.setItem(THEME_KEY, mode); } catch (e) { /* ignore */ }
}

function initTheme() {
  let theme = 'dark';
  try { const stored = localStorage.getItem(THEME_KEY); if (stored) theme = stored; } catch (e) {}
  applyTheme(theme);
}

if (themeButton) {
  themeButton.addEventListener('click', () => {
    const isCurrentlyLight = document.body.classList.contains('light-mode');
    const newMode = isCurrentlyLight ? 'dark' : 'light';
    applyTheme(newMode);
    saveTheme(newMode);
  });
}

// Initialize theme on load
initTheme();

// Elements
const form = document.getElementById('rsvp-form');
const participantsDiv = document.querySelector('.rsvp-participants');
const modal = document.getElementById('success-modal');
const modalText = document.getElementById('modal-text');
const modalImage = document.getElementById('modal-img');

let rotateFactor = 0;
let animationInterval = null;

function animateImage() {
  if (!modalImage) return;
  rotateFactor = (rotateFactor === 0) ? -10 : 0;
  modalImage.style.transform = `rotate(${rotateFactor}deg)`;
}

function openModal(person) {
  if (!modal) return;
  if (modalText) modalText.textContent = `Thanks for RSVPing, ${person.name}! We can't wait to see you at Orion Fest.`;
  modal.classList.add('open');
  animationInterval = setInterval(animateImage, 500);
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  if (animationInterval) { clearInterval(animationInterval); animationInterval = null; }
}

// Close modal by clicking outside or pressing Escape
if (modal) {
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const stateField = document.getElementById('state');

    const person = {
      name: nameField?.value.trim() || '',
      email: emailField?.value.trim() || '',
      state: stateField?.value.trim() || ''
    };

    let isValid = true;

    [nameField, emailField, stateField].forEach(field => { if (field) field.style.border = '1px solid rgba(255,255,255,0.06)'; });

    if (!person.name) { if (nameField) nameField.style.border = '2px solid #e63946'; isValid = false; }
    if (!person.email || !person.email.includes('@')) { if (emailField) emailField.style.border = '2px solid #e63946'; isValid = false; }
    if (!person.state) { if (stateField) stateField.style.border = '2px solid #e63946'; isValid = false; }

    if (!isValid) return;

    const newP = document.createElement('p');
    newP.textContent = `🪐 ${person.name} from ${person.state} has RSVP'd.`;
    newP.style.opacity = '0';
    newP.style.transform = 'translateY(6px)';
    newP.style.transition = 'all 220ms ease';
    if (participantsDiv) participantsDiv.appendChild(newP);
    requestAnimationFrame(() => { newP.style.opacity = '1'; newP.style.transform = 'translateY(0)'; });

    form.reset();
    openModal(person);
    setTimeout(closeModal, 4500);
  });
}

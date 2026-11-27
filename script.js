// ===== EDIT THIS: your contact email =====
const EMAIL = 'yourname@example.com';
const GITHUB_USER = 'Abhay-106';

const root = document.documentElement;

// Dark / light mode
document.getElementById('theme-toggle').addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// Typing effect for the C program in the hero
const code = document.getElementById('code');
const output = document.getElementById('output');
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const text = code.textContent;
  let i = 0;
  code.textContent = '';
  output.hidden = true;
  (function type() {
    code.textContent = text.slice(0, ++i);
    if (i < text.length) setTimeout(type, 30);
    else output.hidden = false;
  })();
}

// Load repositories from GitHub (the static cards stay if this fails)
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&per_page=12`)
  .then(r => (r.ok ? r.json() : Promise.reject()))
  .then(repos => {
    const list = repos.filter(r => !r.fork && r.name !== GITHUB_USER);
    if (!list.length) return;
    document.getElementById('project-grid').innerHTML = list.map(r => `
      <a class="project" href="${esc(r.html_url)}" target="_blank" rel="noopener">
        <h3>${esc(r.name)}</h3>
        <p>${esc(r.description || 'No description yet.')}</p>
        <span class="lang">${esc(r.language || 'Code')}${r.stargazers_count ? ' · ★ ' + r.stargazers_count : ''}</span>
      </a>`).join('');
  })
  .catch(() => {});

// Contact: email link + form (opens the visitor's email app)
const link = document.getElementById('email-link');
link.href = 'mailto:' + EMAIL;
link.textContent = EMAIL;
document.getElementById('contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const body = `${f.get('message')}\n\nFrom: ${f.get('name')} (${f.get('email')})`;
  location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Portfolio message from ' + f.get('name'))}&body=${encodeURIComponent(body)}`;
});

document.getElementById('year').textContent = new Date().getFullYear();

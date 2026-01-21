// Smooth interactions 

// Mobile nav toggle with fade-in animation
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    navLinks.classList.toggle('fade-in');
  });
}

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Events data
const events = [
  { 
    title: "Wedding: Ijeoma & Ugochukwu", 
    type: "wedding", 
    date: "2026-01-24", 
    location: "Owerri, Imo State", 
    desc: "A gorgeous union in Owerri, 10am start.", 
    status: "upcoming",
    image: "Images/Ugo-Iv.jpg"   
  }, 
  { 
    title: "Wedding: Adeola & Marvelous", 
    type: "wedding", 
    date: "2026-01-03", 
    location: "Jabi, Abuja", 
    desc: "A beautiful union in Abuja, 4pm start.", 
    status: "passed",
    image: "Images/Marvelous-Iv.jpg"
  }, 
  { 
    title: "Wedding: Divine & Martins", 
    type: "wedding", 
    date: "2026-01-03", 
    location: "Owerri, Imo State", 
    desc: "Celebrating love in Owerri, 11am ceremony.", 
    status: "passed",
    image: "Images/Martins-Iv.jpg"
  }, 
  { 
    title: "Wedding: Jennifer & Obinna", 
    type: "wedding", 
    date: "2026-01-03", 
    location: "Nwaorieubi Mbaitolu L.G.A, Imo State", 
    desc: "Sacred vows exchanged at 10am.", 
    status: "passed",
    image: "Images/Obinna-Iv.jpg"
  }, 
  { 
    title: "Child Dedication: Zemira Chinemerem Gospel", 
    type: "other", 
    date: "2025-12-14", 
    location: "Owerri, Imo State", 
    desc: "Dedication service at 10am.", 
    status: "passed",
    image: "Images/Tama-iv.png"
  },
];

// Render events
const eventsGrid = document.getElementById('eventsGrid');
function renderEvents(filter = 'all') {
  eventsGrid.innerHTML = '';
  const filtered = filter === 'all' ? events : events.filter(e => e.type === filter);
  filtered.forEach(e => {
    const card = document.createElement('div');
    card.className = 'card hover-card';
    card.innerHTML = `
      <div class="card-content">
        <h3>${e.title}</h3>
        <p class="meta">${new Date(e.date).toLocaleDateString()} • ${e.location} • ${e.type.replace('-', ' ')}</p>
        <p>${e.desc}</p>
        <div>
          <button class="btn btn-ghost">Details</button>
        </div>
      </div>
      ${e.image ? `<div class="card-image"><img src="${e.image}" alt="${e.title} IV" /></div>` : ''} 
    `;

    // Click handler: only one open at a time
    card.addEventListener('click', () => {
      // Close all other cards
      document.querySelectorAll('.card.show-image').forEach(c => {
        if (c !== card) c.classList.remove('show-image');
      });
      // Open this one
      card.classList.toggle('show-image');
    });

    eventsGrid.appendChild(card);
  });
}
renderEvents();


// Filter chips
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    renderEvents(chip.dataset.filter);
  });
});



// Filter chips
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    renderEvents(chip.dataset.filter);
  });
});

// Financials from Google Sheet
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRjMzdE5g25gwJTamimPoUf-xvVLSqTb_dF8IRiPn7W82Uquj9K6kXtO-8FS1O-TjRPrIw1E0BS-U_8/gviz/tq?tqx=out:json";

const searchInput = document.getElementById('memberSearch');
const searchBtn = document.getElementById('searchBtn');
const financeResult = document.getElementById('financeResult');
const financeEmpty = document.getElementById('financeEmpty');

const memberNameEl = document.getElementById('memberName');
const memberStatusEl = document.getElementById('memberStatus');
const totalLeviesEl = document.getElementById('totalLevies');
const totalPaidEl = document.getElementById('totalPaid');
const totalOutstandingEl = document.getElementById('totalOutstanding');
const paymentTableEl = document.getElementById('paymentTable');

// NEW: Fetch and parse Google Sheet
let members = [];
fetch(SHEET_URL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substr(47).slice(0, -2)); // strip Google’s wrapper
    const rows = json.table.rows;
    members = rows.map(r => ({
      name: r.c[0]?.v || "",
      email: r.c[1]?.v || "",
      levies: [
        { label: "Annual Dues 2024", status: r.c[2]?.v || "N/A" },
        { label: "Annual Dues 2025", status: r.c[3]?.v || "N/A" },
      ]
    }));
    console.log(members); // Debug: check if your name appears here
  });

// Render finance info
function renderMemberFinance(member) {
  memberNameEl.textContent = member.name;
  memberStatusEl.textContent = (member.levies.some(l => l.status.includes("Cleared"))) ? 'Cleared' : 'Outstanding';
  memberStatusEl.className = (member.levies.some(l => l.status.includes("Cleared"))) ? 'badge badge-success' : 'badge badge-danger';

  // Totals are textual now, so we just display statuses
  totalLeviesEl.textContent = member.levies.map(l => l.label).join(", ");
  totalPaidEl.textContent = member.levies.filter(l => l.status.includes("Cleared")).map(l => l.label).join(", ");
  totalOutstandingEl.textContent = member.levies.filter(l => !l.status.includes("Cleared")).map(l => l.label).join(", ");

  paymentTableEl.innerHTML = '';
  member.levies.forEach(l => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${l.label}</td>
      <td>${l.status}</td>
    `;
    paymentTableEl.appendChild(tr);
  });
}

function searchMember() {
  const q = (searchInput.value || '').trim().toLowerCase();
  if (!q) return;

  const match = members.find(m => m.name.toLowerCase().includes(q));
  if (match) {
    financeEmpty.classList.add('hidden');
    financeResult.classList.remove('hidden');
    renderMemberFinance(match);
  } else {
    financeResult.classList.add('hidden');
    financeEmpty.classList.remove('hidden');
    searchInput.classList.add('shake');
    setTimeout(() => searchInput.classList.remove('shake'), 500);
  }
}

searchBtn.addEventListener('click', searchMember);
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') searchMember();
});

// Contact form (demo with styled success message)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.createElement('p');
    msg.textContent = '✅ Thanks for reaching out! We will get back to you soon.';
    msg.className = 'success-msg';
    contactForm.appendChild(msg);
    setTimeout(() => msg.remove(), 4000);
    contactForm.reset();
  });
}

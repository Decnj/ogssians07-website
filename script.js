// Smooth interactions and demo data

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

// Sample events data
const events = [
  { title: "Wedding: Ijeoma Bibiana Auocha & Ugochukwu Philip Amadi", type: "wedding", date: "2026-01-24", location: "Owerri, Imo State", desc: "A gorgeous union in Owerri, 10am start.",status: "upcoming" }, 
  { title: "Wedding: Adeola & Marvelous", type: "wedding", date: "2026-01-03", location: "Jabi, Abuja", desc: "A beautiful union in Abuja, 4pm start.", status: "passed" }, 
  { title: "Wedding: Divine & Martins", type: "wedding", date: "2026-01-03", location: "Owerri, Imo State", desc: "Celebrating love in Owerri, 11am ceremony.", status: "passed" }, 
  { title: "Wedding: Jennifer & Obinna", type: "wedding", date: "2026-01-03", location: "Nwaorieubi Mbaitolu L.G.A, Imo State", desc: "Sacred vows exchanged at 10am.", status: "passed" }, 
  { title: "Child Dedication: Zemira Chinemerem Gospel", type: "other", date: "2025-12-14", location: "Owerri, Imo State", desc: "Dedication service at 10am.", status: "passed" },
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
      <h3>${e.title}</h3>
      <p class="meta">${new Date(e.date).toLocaleDateString()} • ${e.location} • ${e.type.replace('-', ' ')}</p>
      <p>${e.desc}</p>
      <div>
        <button class="btn btn-ghost">Details</button>
      </div>
    `;
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

// Sample financials data (replace with real data or API)
const members = [
  {
    name: "Chinedu Okafor",
    levies: [
      { label: "Annual Dues 2025", amount: 20000, paid: true, date: "2025-01-15" },
      { label: "Project Levy", amount: 50000, paid: false, date: null },
      { label: "Event Support", amount: 15000, paid: true, date: "2025-06-10" },
    ],
  },
  {
    name: "Kelechi Nwosu",
    levies: [
      { label: "Annual Dues 2025", amount: 20000, paid: true, date: "2025-01-20" },
      { label: "Project Levy", amount: 50000, paid: true, date: "2025-07-02" },
      { label: "Event Support", amount: 15000, paid: false, date: null },
    ],
  },
  {
    name: "Emeka Uzo",
    levies: [
      { label: "Annual Dues 2025", amount: 20000, paid: false, date: null },
      { label: "Project Levy", amount: 50000, paid: false, date: null },
      { label: "Event Support", amount: 15000, paid: false, date: null },
    ],
  },
];

// Finance search
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

function formatCurrency(n) {
  return `₦${n.toLocaleString('en-NG')}`;
}

function renderMemberFinance(member) {
  const totalLevies = member.levies.reduce((sum, l) => sum + l.amount, 0);
  const totalPaid = member.levies.filter(l => l.paid).reduce((sum, l) => sum + l.amount, 0);
  const outstanding = totalLevies - totalPaid;

  memberNameEl.textContent = member.name;
  memberStatusEl.textContent = outstanding > 0 ? 'Outstanding' : 'Cleared';
  memberStatusEl.className = outstanding > 0 ? 'badge badge-danger' : 'badge badge-success';

  totalLeviesEl.textContent = formatCurrency(totalLevies);
  totalPaidEl.textContent = formatCurrency(totalPaid);
  totalOutstandingEl.textContent = formatCurrency(outstanding);

  paymentTableEl.innerHTML = '';
  member.levies.forEach(l => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${l.label}</td>
      <td>${formatCurrency(l.amount)}</td>
      <td>${l.paid ? 'Paid' : 'Unpaid'}</td>
      <td>${l.date ? new Date(l.date).toLocaleDateString() : '-'}</td>
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

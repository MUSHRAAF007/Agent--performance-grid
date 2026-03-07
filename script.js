// ─── CONFIGURATION ───────────────────────────────────────
const CONFIG = {
  REFRESH_INTERVAL: 5000, // 5 seconds
};

// ─── MOCK DATA GENERATOR ─────────────────────────────────
// Simulating data that would come from Google Sheets
const AGENT_NAMES = [
  "Vikram Singh", "Priya Sharma", "Rahul Verma", "Anjali Gupta", 
  "Amit Patel", "Sneha Reddy", "Karan Malhotra", "Riya Kapoor"
];

const AGENT_IMAGES = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
];

// Generate random stats for agents
function generateAgentData() {
  return AGENT_NAMES.map((name, index) => {
    // Randomize stats to simulate live changes
    const ros = Math.floor(Math.random() * 15) + 5;
    const towing = Math.floor(Math.random() * 8) + 2;
    const assigned = Math.floor(Math.random() * 5);
    const dealer = Math.floor(Math.random() * 4);
    const failed = Math.floor(Math.random() * 2);
    const total = ros + towing + assigned + dealer + failed;
    
    // Calculate efficiency
    const efficiency = Math.round((ros / total) * 100);
    
    // Determine status
    let status = 'online';
    if (assigned > 2) status = 'busy';
    if (total < 5) status = 'offline';

    return {
      id: index,
      name: name,
      image: AGENT_IMAGES[index],
      stats: {
        total: total,
        ros: ros,
        towing: towing,
        assigned: assigned,
        dealer: dealer,
        failed: failed
      },
      efficiency: efficiency,
      status: status
    };
  }); // Removed sort to stop swapping of agent grid
}

let globalAgents = [];

// ─── RENDER FUNCTIONS ────────────────────────────────────

function renderAgentCard(agent) {
  return `
    <div class="agent-card p-4 sm:p-5 flex flex-col gap-4 sm:gap-5 border-slate-700 cursor-pointer" onclick="openAgentModal(${agent.id})">
      
      <!-- TOP SECTION: PROFILE -->
      <div class="flex items-center gap-3 sm:gap-4">
        <div class="relative shrink-0">
          <img src="${agent.image}" alt="${agent.name}" class="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-[0.125rem] border-slate-600 shadow-lg shadow-cyan-500/10">
        </div>
        <div class="flex-1 min-w-0 flex items-center">
          <h3 class="text-white font-bold text-base sm:text-lg leading-tight truncate" title="${agent.name}">${agent.name}</h3>
        </div>
      </div>

      <!-- MIDDLE SECTION: TOTAL CASES (HERO METRIC) -->
      <div class="bg-slate-800/40 rounded-xl p-2 sm:p-3 border border-slate-700/50 flex items-center justify-between">
        <div class="text-[0.65rem] sm:text-xs text-slate-400 font-heading tracking-widest">TOTAL CASES</div>
        <div class="text-2xl sm:text-3xl font-heading text-white neon-text font-bold">${agent.stats.total}</div>
      </div>

      <!-- BOTTOM SECTION: METRICS GRID -->
      <div class="grid grid-cols-2 gap-1.5 sm:gap-2">
        
        <!-- ROS -->
        <div class="metric-box p-1.5 sm:p-2 flex flex-col items-center justify-center text-center">
          <div class="text-lg sm:text-xl font-bold text-green-400 neon-text-green font-heading">${agent.stats.ros}</div>
          <div class="text-[0.5rem] sm:text-[0.5625rem] text-slate-500 font-bold tracking-wider mt-1">ROS DONE</div>
        </div>

        <!-- TOWING -->
        <div class="metric-box p-1.5 sm:p-2 flex flex-col items-center justify-center text-center">
          <div class="text-lg sm:text-xl font-bold text-orange-400 neon-text-orange font-heading">${agent.stats.towing}</div>
          <div class="text-[0.5rem] sm:text-[0.5625rem] text-slate-500 font-bold tracking-wider mt-1">TOWING</div>
        </div>

      </div>

    </div>
  `;
}

function updateDashboard() {
  const agents = generateAgentData();
  globalAgents = agents; // Store for modal access
  const grid = document.getElementById('agent-grid');
  
  // Render Agents
  grid.innerHTML = agents.map(agent => renderAgentCard(agent)).join('');

  // Update Global KPIs based on agent data
  const totals = agents.reduce((acc, agent) => {
    acc.total += agent.stats.total;
    acc.ros += agent.stats.ros;
    acc.towing += agent.stats.towing;
    acc.assigned += agent.stats.assigned;
    acc.dealer += agent.stats.dealer;
    acc.failed += agent.stats.failed;
    return acc;
  }, { total: 0, ros: 0, towing: 0, assigned: 0, dealer: 0, failed: 0 });

  // Animate Numbers (Simple text update for now)
  document.getElementById('kpi-total').textContent = totals.total;
  document.getElementById('kpi-active').textContent = totals.assigned; // Active = Assigned roughly
  document.getElementById('kpi-ros').textContent = totals.ros;
  document.getElementById('kpi-towing').textContent = totals.towing;
  document.getElementById('kpi-dealer').textContent = totals.dealer;
  document.getElementById('kpi-failed').textContent = totals.failed;
  
  document.getElementById('header-agent-count').textContent = agents.length;
}

// ─── CLOCK ───────────────────────────────────────────────
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString('en-US', { hour12: false });
}

// ─── INITIALIZATION ──────────────────────────────────────
setInterval(updateClock, 1000);
updateClock();
updateDashboard();
setInterval(updateDashboard, CONFIG.REFRESH_INTERVAL);

// ─── MODAL LOGIC ─────────────────────────────────────────
function openAgentModal(agentId) {
  const agent = globalAgents.find(a => a.id === agentId);
  if (!agent) return;
  
  document.getElementById('modal-agent-name').textContent = agent.name;
  document.getElementById('modal-agent-id').textContent = `ID: RSA-00${agent.id + 1}`;
  document.getElementById('modal-total').textContent = agent.stats.total;
  document.getElementById('modal-ros').textContent = agent.stats.ros;
  document.getElementById('modal-towing').textContent = agent.stats.towing;
  document.getElementById('modal-dealer').textContent = agent.stats.dealer;
  document.getElementById('modal-agent-image').src = agent.image;
  
  const modal = document.getElementById('agent-modal');
  modal.classList.remove('hidden');
}

function closeModal() {
  const modal = document.getElementById('agent-modal');
  modal.classList.add('hidden');
}

// Close modal when clicking outside the content
document.getElementById('agent-modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

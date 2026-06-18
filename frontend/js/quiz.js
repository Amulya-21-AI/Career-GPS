const TOTAL_STEPS = 6;
let currentStep = 1;

function csv(id) {
  return (document.getElementById(id)?.value || "")
    .split(",").map(s => s.trim()).filter(Boolean);
}
function val(id)  { return document.getElementById(id)?.value || ""; }
function num(id)  { return parseInt(document.getElementById(id)?.value || "5", 10); }

function renderDots() {
  const wrap = document.getElementById("step-dots");
  wrap.innerHTML = Array.from({ length: TOTAL_STEPS }, (_, i) => {
    const n = i + 1;
    const done    = n < currentStep;
    const active  = n === currentStep;
    const bg      = done ? "var(--green)" : active ? "var(--primary)" : "var(--border2)";
    const size    = active ? "10px" : "8px";
    return `<div style="width:${size};height:${size};border-radius:50%;background:${bg};transition:all .3s;"></div>`;
  }).join("");
}

function showStep(n) {
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    document.getElementById(`step-${i}`)?.classList.add("hidden");
  }
  document.getElementById(`step-${n}`)?.classList.remove("hidden");

  const pct = Math.round(((n - 1) / TOTAL_STEPS) * 100);
  document.getElementById("progress-bar").style.width = pct + "%";
  document.getElementById("step-label").textContent   = `Step ${n} of ${TOTAL_STEPS}`;
  document.getElementById("step-pct").textContent     = pct + "%";
  document.getElementById("btn-back").style.visibility = n === 1 ? "hidden" : "visible";
  document.getElementById("btn-next").textContent = n === TOTAL_STEPS ? "Generate My Report →" : "Next →";
  renderDots();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function prevStep() {
  if (currentStep > 1) { currentStep--; showStep(currentStep); }
}

async function nextStep() {
  if (currentStep < TOTAL_STEPS) {
    currentStep++;
    showStep(currentStep);
    return;
  }

  const profile = {
    id:                "guest-" + Date.now(),
    name:              val("name"),
    ageRange:          val("ageRange"),
    stage:             val("stage"),
    educationStream:   val("educationStream"),
    degree:            val("degree"),
    subjects:          csv("subjects"),
    currentSkills:     csv("currentSkills"),
    interests:         csv("interests"),
    workStyle:         csv("workStyle"),
    values:            csv("values"),
    riskTolerance:     val("riskTolerance"),
    timeline:          val("timeline"),
    desiredIncome:     val("desiredIncome"),
    careersConsidered: csv("careersConsidered"),
    careersAvoided:    csv("careersAvoided"),
    techComfort:       num("techComfort"),
    peopleComfort:     num("peopleComfort"),
    creativeComfort:   num("creativeComfort"),
    analyticalComfort: num("analyticalComfort"),
  };

  localStorage.setItem("careerGpsProfile", JSON.stringify(profile));

  const resultArea = document.getElementById("result-area");
  resultArea.classList.remove("hidden");
  resultArea.innerHTML = `
    <div class="card loading-card">
      <div class="spinner"></div>
      <p>Matching your profile against 60+ careers…</p>
      <p class="text-muted text-sm">Running ML scoring across 10 dimensions</p>
    </div>`;

  document.getElementById("btn-next").disabled = true;
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

  try {
    const res = await fetch("http://localhost:8000/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile }),
    });
    const data = await res.json();
    const top  = data.topMatches?.[0];

    resultArea.innerHTML = `
      <div class="card card-glow-green">
        <div class="flex gap-12 items-center mb-16">
          <span style="font-size:32px;">🎯</span>
          <div>
            <h2 class="text-green">Profile Matched!</h2>
            <p class="text-muted text-sm mt-4">We found your top career fits. Your #1 match:</p>
          </div>
        </div>
        <div class="card mb-16" style="background:var(--bg);">
          <div class="flex justify-between items-center mb-8">
            <h3>${top?.career?.title || "Career"}</h3>
            <span style="font-size:28px; font-weight:900; color:var(--green);">${top?.matchScore || 0}%</span>
          </div>
          <span class="badge badge-blue mb-8">${top?.career?.category || ""}</span>
          <p class="text-muted text-sm mt-8 mb-16">${top?.career?.description || ""}</p>
          <div class="flex gap-16 flex-wrap" style="font-size:13px; color:var(--muted);">
            <span>💰 Entry: <strong style="color:var(--text)">${top?.career?.salaryRangeEntry || ""}</strong></span>
            <span>🕐 <strong style="color:var(--text)">~${top?.career?.timelineMonths || "?"} months</strong> to job-ready</span>
            <span>📡 Demand: <strong style="color:var(--text)">${top?.career?.demandScore || "?"}/10</strong></span>
          </div>
        </div>
        <div class="flex gap-12 flex-wrap">
          <a href="report.html" class="btn btn-primary btn-lg">View Full GPS Report →</a>
          <a href="chat.html" class="btn btn-outline">Chat with Future Me</a>
        </div>
      </div>`;
  } catch (e) {
    resultArea.innerHTML = `
      <div class="card" style="padding:32px; text-align:center;">
        <p class="text-muted">⚠️ Could not reach backend.<br>
        Your profile was saved — <a href="report.html">view your report</a> when the server is running.</p>
      </div>`;
  }
}

// Init
showStep(1);

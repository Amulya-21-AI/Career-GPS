// Central API client — all fetch() calls to the Python backend live here
const BASE_URL = "http://localhost:8000/api";

async function apiPost(endpoint, body) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// POST /api/chat
async function sendChatMessage(messages, profile = null, sessionId = null) {
  return apiPost("/chat", { messages, profile, session_id: sessionId });
}

// POST /api/match
async function getCareerMatches(profile) {
  return apiPost("/match", { profile });
}

// POST /api/report
async function getGPSReport(profile) {
  return apiPost("/report", { profile });
}

// POST /api/interest-test
async function submitInterestTest(answers, profile = null, userId = null) {
  return apiPost("/interest-test", { answers, profile, user_id: userId });
}

export { sendChatMessage, getCareerMatches, getGPSReport, submitInterestTest };

const profile    = JSON.parse(localStorage.getItem("careerGpsProfile") || "null");
const messages   = [];
let   sessionId  = null;

// Show profile chip if quiz was completed
if (profile) {
  const chip = document.getElementById("profile-chip");
  const name = document.getElementById("profile-name-chip");
  if (chip) chip.classList.remove("hidden");
  if (name) name.textContent = `${profile.name || "Profile"} loaded ✓`;
}

function appendMsg(role, content) {
  const win = document.getElementById("chat-window");
  const div = document.createElement("div");
  div.className = `msg msg-${role}`;
  div.innerHTML = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");
  win.appendChild(div);
  win.scrollTop = win.scrollHeight;
}

function setLoading(on) {
  const btn = document.getElementById("send-btn");
  const inp = document.getElementById("chat-input");
  btn.disabled = on;
  inp.disabled = on;
  btn.textContent = on ? "…" : "Send";
}

async function sendMessage() {
  const input = document.getElementById("chat-input");
  const text  = input.value.trim();
  if (!text) return;

  input.value = "";
  messages.push({ role: "user", content: text });
  appendMsg("user", text);
  setLoading(true);

  try {
    const res = await fetch("http://localhost:8000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, profile, session_id: sessionId }),
    });
    const data = await res.json();

    sessionId = data.session_id || sessionId;
    messages.push({ role: "assistant", content: data.reply });
    appendMsg("assistant", data.reply);
  } catch (e) {
    appendMsg("assistant", "⚠️ Could not reach the backend. Make sure the Python server is running on port 8000.");
  } finally {
    setLoading(false);
    document.getElementById("chat-input").focus();
  }
}

function ask(text) {
  document.getElementById("chat-input").value = text;
  sendMessage();
}

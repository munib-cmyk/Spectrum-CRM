// assets/js/leads-dashboard.js

function initLeadsDashboard() {
  if (!window.db) {
    console.error("❌ Firestore not available. Falling back to dummy data.");
    renderLeadsDummy();
    return;
  }

  console.log("✅ Initializing Leads Dashboard with Firestore");

  const leadsTable = document.getElementById("leadsTableBody");
  if (!leadsTable) {
    console.warn("⚠️ No #leadsTableBody element found in HTML.");
    return;
  }

  // Subscribe in real-time
  db.collection("leads")
    .orderBy("created", "desc")
    .limit(20)
    .onSnapshot(snapshot => {
      leadsTable.innerHTML = ""; // clear
      snapshot.forEach(doc => {
        const d = doc.data();
        const row = `
          <tr>
            <td>${d.id || ""}</td>
            <td>${d.name || ""}</td>
            <td>${d.phone || ""}</td>
            <td>${d.email || ""}</td>
            <td>${d.service || ""}</td>
            <td>${d.stage || ""}</td>
            <td>${d.created || ""}</td>
          </tr>`;
        leadsTable.insertAdjacentHTML("beforeend", row);
      });
    }, err => {
      console.error("❌ Firestore error:", err);
      renderLeadsDummy();
    });
}

function renderLeadsDummy() {
  const leadsTable = document.getElementById("leadsTableBody");
  if (!leadsTable) return;
  leadsTable.innerHTML = `
    <tr><td>1</td><td>Jane Doe</td><td>555-111-2222</td><td>jane@example.com</td><td>Botox</td><td>New</td><td>2025-08-29</td></tr>
    <tr><td>2</td><td>John Smith</td><td>555-333-4444</td><td>john@example.com</td><td>Fillers</td><td>Follow-up</td><td>2025-08-28</td></tr>
  `;
}

window.addEventListener("load", initLeadsDashboard);

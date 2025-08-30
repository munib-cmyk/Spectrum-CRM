// CRM Dashboard - Live Firestore Charts
// Requires: firebase-config.js, ApexCharts

$(document).ready(function() {
  // Initialize CRM dashboard when Firebase is ready
  if (typeof db !== 'undefined') {
    initCrmDashboard();
  } else {
    // Wait for Firebase to load
    setTimeout(initCrmDashboard, 1000);
  }
});

async function initCrmDashboard() {
  try {
    // Query leads from Firestore
    const leadsSnapshot = await db.collection('leads').get();
    
    if (leadsSnapshot.empty) {
      // Use dummy data if no Firestore data
      renderCrmWithDummyData();
      return;
    }
    
    const leads = [];
    leadsSnapshot.forEach(doc => {
      leads.push({ id: doc.id, ...doc.data() });
    });
    
    // Render stage distribution pie chart
    renderStageChart(leads);
    
    // Render recent leads table
    renderRecentLeadsTable(leads);
    
    console.log(`CRM Dashboard loaded with ${leads.length} leads`);
    
  } catch (error) {
    console.error('Error loading CRM dashboard:', error);
    renderCrmWithDummyData();
  }
}

function renderStageChart(leads) {
  // Count leads by stage
  const stageCounts = {};
  leads.forEach(lead => {
    const stage = lead.stage || 'Unknown';
    stageCounts[stage] = (stageCounts[stage] || 0) + 1;
  });
  
  const series = Object.values(stageCounts);
  const labels = Object.keys(stageCounts);
  
  const options = {
    chart: {
      type: 'pie',
      height: 350
    },
    series: series,
    labels: labels,
    colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'],
    legend: {
      position: 'bottom'
    },
    title: {
      text: 'Leads by Stage',
      align: 'center'
    }
  };
  
  // Create chart container if it doesn't exist
  let chartContainer = document.getElementById('CrmStageChart');
  if (!chartContainer) {
    // Find a suitable container and create chart div
    const container = document.querySelector('.card-body') || document.querySelector('.page-content');
    if (container) {
      const chartDiv = document.createElement('div');
      chartDiv.id = 'CrmStageChart';
      chartDiv.className = 'mb-4';
      container.appendChild(chartDiv);
      chartContainer = chartDiv;
    }
  }
  
  if (chartContainer) {
    const chart = new ApexCharts(chartContainer, options);
    chart.render();
  }
}

function renderRecentLeadsTable(leads) {
  // Sort by created date (most recent first)
  const recentLeads = leads
    .sort((a, b) => new Date(b.created || 0) - new Date(a.created || 0))
    .slice(0, 5);
  
  let tableContainer = document.getElementById('RecentLeadsTable');
  if (!tableContainer) {
    // Create table container
    const container = document.querySelector('.card-body') || document.querySelector('.page-content');
    if (container) {
      const tableDiv = document.createElement('div');
      tableDiv.id = 'RecentLeadsTable';
      tableDiv.className = 'mb-4';
      container.appendChild(tableDiv);
      tableContainer = tableDiv;
    }
  }
  
  if (!tableContainer) return;
  
  let tableHTML = `
    <div class="card">
      <div class="card-body">
        <h4 class="header-title">Recent Leads</h4>
        <div class="table-responsive">
          <table class="table table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Service</th>
                <th>Stage</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
  `;
  
  recentLeads.forEach(lead => {
    const created = lead.created ? new Date(lead.created).toLocaleDateString() : 'N/A';
    tableHTML += `
      <tr>
        <td>${lead.id || 'N/A'}</td>
        <td>${lead.name || 'N/A'}</td>
        <td>${lead.service || 'N/A'}</td>
        <td><span class="badge badge-${getStageColor(lead.stage)}">${lead.stage || 'Unknown'}</span></td>
        <td>${created}</td>
      </tr>
    `;
  });
  
  tableHTML += `
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  
  tableContainer.innerHTML = tableHTML;
}

function getStageColor(stage) {
  const colors = {
    'New': 'primary',
    'Follow-up': 'warning', 
    'Follow-Up': 'warning',
    'Consulted': 'info',
    'Proposal': 'secondary',
    'Converted': 'success',
    'Lost': 'danger'
  };
  return colors[stage] || 'secondary';
}

function renderCrmWithDummyData() {
  console.log('Using dummy data for CRM dashboard');
  
  // Dummy stage distribution
  const dummyStages = {
    'New': 12,
    'Follow-up': 8,
    'Consulted': 5,
    'Converted': 15,
    'Lost': 3
  };
  
  const dummyLeads = [
    { id: 'D001', name: 'John Doe', service: 'Botox', stage: 'New', created: '2025-01-15' },
    { id: 'D002', name: 'Jane Smith', service: 'HydraFacial', stage: 'Follow-up', created: '2025-01-14' },
    { id: 'D003', name: 'Mike Johnson', service: 'Laser Hair Removal', stage: 'Converted', created: '2025-01-13' },
    { id: 'D004', name: 'Sarah Wilson', service: 'Lip Filler', stage: 'Consulted', created: '2025-01-12' },
    { id: 'D005', name: 'Tom Brown', service: 'Chemical Peel', stage: 'New', created: '2025-01-11' }
  ];
  
  // Render with dummy data
  const series = Object.values(dummyStages);
  const labels = Object.keys(dummyStages);
  
  const options = {
    chart: {
      type: 'pie',
      height: 350
    },
    series: series,
    labels: labels,
    colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'],
    legend: {
      position: 'bottom'
    },
    title: {
      text: 'Leads by Stage (Demo Data)',
      align: 'center'
    }
  };
  
  // Find or create chart container
  let chartContainer = document.getElementById('CrmStageChart');
  if (!chartContainer) {
    const container = document.querySelector('.card-body') || document.querySelector('.page-content');
    if (container) {
      const chartDiv = document.createElement('div');
      chartDiv.id = 'CrmStageChart';
      chartDiv.className = 'mb-4';
      container.appendChild(chartDiv);
      chartContainer = chartDiv;
    }
  }
  
  if (chartContainer) {
    const chart = new ApexCharts(chartContainer, options);
    chart.render();
  }
  
  // Render dummy leads table
  renderRecentLeadsTable(dummyLeads);
}

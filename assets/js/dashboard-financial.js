// Financial Dashboard - Live Firestore Charts
// Requires: firebase-config.js, ApexCharts

// Fallback for non-module environments
window.db = window.db || (typeof firebase !== 'undefined' ? firebase.firestore() : null);

$(document).ready(function() {
  if (typeof db !== 'undefined' && db !== null) {
    initFinancialDashboard();
  } else {
    setTimeout(initFinancialDashboard, 1000);
  }
});

async function initFinancialDashboard() {
  try {
    // Get leads and pricing data
    const [leadsSnapshot, pricingSnapshot] = await Promise.all([
      db.collection('leads').get(),
      db.collection('pricing').get()
    ]);
    
    if (leadsSnapshot.empty) {
      renderFinancialWithDummyData();
      return;
    }
    
    const leads = [];
    leadsSnapshot.forEach(doc => {
      leads.push({ id: doc.id, ...doc.data() });
    });
    
    const pricing = {};
    pricingSnapshot.forEach(doc => {
      const data = doc.data();
      pricing[data.service] = data.price || 0;
    });
    
    // Calculate revenue data
    const revenueData = calculateRevenueData(leads, pricing);
    
    // Render revenue by month area chart
    renderRevenueChart(revenueData.monthly);
    
    // Render KPI cards
    renderKPICards(revenueData.kpis);
    
    console.log(`Financial Dashboard loaded with ${leads.length} leads`);
    
  } catch (error) {
    console.error('Error loading Financial dashboard:', error);
    renderFinancialWithDummyData();
  }
}

function calculateRevenueData(leads, pricing) {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const monthlyRevenue = {};
  let totalRevenue = 0;
  let totalPatients = 0;
  const convertedLeads = leads.filter(lead => 
    lead.stage === 'Converted' || lead.stage === 'converted'
  );
  
  // Initialize months
  for (let i = 0; i < 6; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
    monthlyRevenue[monthKey] = 0;
  }
  
  convertedLeads.forEach(lead => {
    let revenue = 0;
    
    // Use lead value if present, else lookup service price
    if (lead.value && !isNaN(lead.value)) {
      revenue = parseFloat(lead.value);
    } else if (lead.service && pricing[lead.service]) {
      revenue = pricing[lead.service];
    }
    
    if (revenue > 0) {
      totalRevenue += revenue;
      totalPatients++;
      
      // Add to monthly if within last 6 months
      if (lead.created) {
        const leadDate = new Date(lead.created);
        if (leadDate >= sixMonthsAgo) {
          const monthKey = leadDate.toISOString().slice(0, 7);
          if (monthlyRevenue.hasOwnProperty(monthKey)) {
            monthlyRevenue[monthKey] += revenue;
          }
        }
      }
    }
  });
  
  const avgRevenuePerPatient = totalPatients > 0 ? totalRevenue / totalPatients : 0;
  
  return {
    monthly: monthlyRevenue,
    kpis: {
      totalRevenue,
      avgRevenuePerPatient,
      totalPatients
    }
  };
}

function renderRevenueChart(monthlyRevenue) {
  const categories = Object.keys(monthlyRevenue).map(month => {
    const date = new Date(month + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  });
  
  const series = [{
    name: 'Revenue',
    data: Object.values(monthlyRevenue)
  }];
  
  const options = {
    chart: {
      type: 'area',
      height: 350
    },
    series: series,
    xaxis: {
      categories: categories
    },
    colors: ['#27ae60'],
    title: {
      text: 'Revenue by Month (Last 6 Months)',
      align: 'center'
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    yaxis: {
      labels: {
        formatter: function(val) {
          return '$' + val.toLocaleString();
        }
      }
    }
  };
  
  let chartContainer = document.getElementById('FinancialRevenueChart');
  if (!chartContainer) {
    const container = document.querySelector('.card-body') || document.querySelector('.page-content');
    if (container) {
      const chartDiv = document.createElement('div');
      chartDiv.id = 'FinancialRevenueChart';
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

function renderKPICards(kpis) {
  let kpiContainer = document.getElementById('FinancialKPIs');
  if (!kpiContainer) {
    const container = document.querySelector('.card-body') || document.querySelector('.page-content');
    if (container) {
      const kpiDiv = document.createElement('div');
      kpiDiv.id = 'FinancialKPIs';
      kpiDiv.className = 'row mb-4';
      container.appendChild(kpiDiv);
      kpiContainer = kpiDiv;
    }
  }
  
  if (!kpiContainer) return;
  
  const kpiHTML = `
    <div class="col-md-4">
      <div class="card text-center">
        <div class="card-body">
          <h3 class="text-success">$${kpis.totalRevenue.toLocaleString()}</h3>
          <p class="text-muted mb-0">Total Revenue</p>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card text-center">
        <div class="card-body">
          <h3 class="text-primary">$${Math.round(kpis.avgRevenuePerPatient).toLocaleString()}</h3>
          <p class="text-muted mb-0">Avg Revenue/Patient</p>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card text-center">
        <div class="card-body">
          <h3 class="text-info">${kpis.totalPatients}</h3>
          <p class="text-muted mb-0"># Patients</p>
        </div>
      </div>
    </div>
  `;
  
  kpiContainer.innerHTML = kpiHTML;
}

function renderFinancialWithDummyData() {
  console.log('Using dummy data for Financial dashboard');
  
  // Dummy monthly revenue (last 6 months)
  const dummyMonthly = {
    '2024-08': 15000,
    '2024-09': 18000,
    '2024-10': 22000,
    '2024-11': 19000,
    '2024-12': 25000,
    '2025-01': 21000
  };
  
  const dummyKPIs = {
    totalRevenue: 120000,
    avgRevenuePerPatient: 850,
    totalPatients: 141
  };
  
  // Render revenue chart
  const categories = Object.keys(dummyMonthly).map(month => {
    const date = new Date(month + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  });
  
  const options = {
    chart: {
      type: 'area',
      height: 350
    },
    series: [{
      name: 'Revenue',
      data: Object.values(dummyMonthly)
    }],
    xaxis: {
      categories: categories
    },
    colors: ['#27ae60'],
    title: {
      text: 'Revenue by Month (Demo Data)',
      align: 'center'
    },
    yaxis: {
      labels: {
        formatter: function(val) {
          return '$' + val.toLocaleString();
        }
      }
    }
  };
  
  let chartContainer = document.getElementById('FinancialRevenueChart');
  if (!chartContainer) {
    const container = document.querySelector('.card-body') || document.querySelector('.page-content');
    if (container) {
      const chartDiv = document.createElement('div');
      chartDiv.id = 'FinancialRevenueChart';
      chartDiv.className = 'mb-4';
      container.appendChild(chartDiv);
      chartContainer = chartDiv;
    }
  }
  
  if (chartContainer) {
    const chart = new ApexCharts(chartContainer, options);
    chart.render();
  }
  
  // Render KPI cards
  renderKPICards(dummyKPIs);
}

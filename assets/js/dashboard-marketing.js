// Marketing Dashboard - Live Firestore Charts
// Requires: firebase-config.js, ApexCharts

// Fallback for non-module environments
window.db = window.db || (typeof firebase !== 'undefined' ? firebase.firestore() : null);

$(document).ready(function() {
  if (typeof db !== 'undefined' && db !== null) {
    initMarketingDashboard();
  } else {
    setTimeout(initMarketingDashboard, 1000);
  }
});

async function initMarketingDashboard() {
  try {
    const leadsSnapshot = await db.collection('leads').get();
    
    if (leadsSnapshot.empty) {
      renderMarketingWithDummyData();
      return;
    }
    
    const leads = [];
    leadsSnapshot.forEach(doc => {
      leads.push({ id: doc.id, ...doc.data() });
    });
    
    // Render leads by source bar chart
    renderSourceChart(leads);
    
    // Render daily leads line chart (last 14 days)
    renderDailyLeadsChart(leads);
    
    console.log(`Marketing Dashboard loaded with ${leads.length} leads`);
    
  } catch (error) {
    console.error('Error loading Marketing dashboard:', error);
    renderMarketingWithDummyData();
  }
}

function renderSourceChart(leads) {
  // Count leads by source
  const sourceCounts = {};
  leads.forEach(lead => {
    const source = lead.source || 'Other';
    sourceCounts[source] = (sourceCounts[source] || 0) + 1;
  });
  
  const categories = Object.keys(sourceCounts);
  const series = [{
    name: 'Leads',
    data: Object.values(sourceCounts)
  }];
  
  const options = {
    chart: {
      type: 'bar',
      height: 350
    },
    series: series,
    xaxis: {
      categories: categories
    },
    colors: ['#3498db'],
    title: {
      text: 'Leads by Source',
      align: 'center'
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
      }
    }
  };
  
  let chartContainer = document.getElementById('MarketingSourceChart');
  if (!chartContainer) {
    const container = document.querySelector('.card-body') || document.querySelector('.page-content');
    if (container) {
      const chartDiv = document.createElement('div');
      chartDiv.id = 'MarketingSourceChart';
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

function renderDailyLeadsChart(leads) {
  // Get last 14 days of leads
  const today = new Date();
  const fourteenDaysAgo = new Date(today);
  fourteenDaysAgo.setDate(today.getDate() - 14);
  
  const dailyCounts = {};
  
  // Initialize all days with 0
  for (let i = 0; i < 14; i++) {
    const date = new Date(fourteenDaysAgo);
    date.setDate(fourteenDaysAgo.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    dailyCounts[dateStr] = 0;
  }
  
  // Count actual leads
  leads.forEach(lead => {
    if (lead.created) {
      const createdDate = new Date(lead.created).toISOString().split('T')[0];
      if (dailyCounts.hasOwnProperty(createdDate)) {
        dailyCounts[createdDate]++;
      }
    }
  });
  
  const categories = Object.keys(dailyCounts).map(date => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  
  const series = [{
    name: 'New Leads',
    data: Object.values(dailyCounts)
  }];
  
  const options = {
    chart: {
      type: 'line',
      height: 350
    },
    series: series,
    xaxis: {
      categories: categories
    },
    colors: ['#e74c3c'],
    title: {
      text: 'Daily Leads (Last 14 Days)',
      align: 'center'
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    markers: {
      size: 5
    }
  };
  
  let chartContainer = document.getElementById('MarketingDailyChart');
  if (!chartContainer) {
    const container = document.querySelector('.card-body') || document.querySelector('.page-content');
    if (container) {
      const chartDiv = document.createElement('div');
      chartDiv.id = 'MarketingDailyChart';
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

function renderMarketingWithDummyData() {
  console.log('Using dummy data for Marketing dashboard');
  
  // Dummy source data
  const dummySources = {
    'Google': 25,
    'Instagram': 18,
    'Facebook': 12,
    'Referral': 15,
    'Website': 8
  };
  
  // Dummy daily data (last 14 days)
  const dummyDaily = [2, 4, 3, 6, 5, 8, 7, 4, 3, 5, 6, 9, 7, 5];
  
  // Render source chart
  const sourceOptions = {
    chart: {
      type: 'bar',
      height: 350
    },
    series: [{
      name: 'Leads',
      data: Object.values(dummySources)
    }],
    xaxis: {
      categories: Object.keys(dummySources)
    },
    colors: ['#3498db'],
    title: {
      text: 'Leads by Source (Demo Data)',
      align: 'center'
    }
  };
  
  let sourceContainer = document.getElementById('MarketingSourceChart');
  if (!sourceContainer) {
    const container = document.querySelector('.card-body') || document.querySelector('.page-content');
    if (container) {
      const chartDiv = document.createElement('div');
      chartDiv.id = 'MarketingSourceChart';
      chartDiv.className = 'mb-4';
      container.appendChild(chartDiv);
      sourceContainer = chartDiv;
    }
  }
  
  if (sourceContainer) {
    const sourceChart = new ApexCharts(sourceContainer, sourceOptions);
    sourceChart.render();
  }
  
  // Render daily chart
  const dailyCategories = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dailyCategories.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }
  
  const dailyOptions = {
    chart: {
      type: 'line',
      height: 350
    },
    series: [{
      name: 'New Leads',
      data: dummyDaily
    }],
    xaxis: {
      categories: dailyCategories
    },
    colors: ['#e74c3c'],
    title: {
      text: 'Daily Leads (Demo Data)',
      align: 'center'
    }
  };
  
  let dailyContainer = document.getElementById('MarketingDailyChart');
  if (!dailyContainer) {
    const container = document.querySelector('.card-body') || document.querySelector('.page-content');
    if (container) {
      const chartDiv = document.createElement('div');
      chartDiv.id = 'MarketingDailyChart';
      chartDiv.className = 'mb-4';
      container.appendChild(chartDiv);
      dailyContainer = chartDiv;
    }
  }
  
  if (dailyContainer) {
    const dailyChart = new ApexCharts(dailyContainer, dailyOptions);
    dailyChart.render();
  }
}

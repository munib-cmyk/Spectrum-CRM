// Operations Dashboard - Live Firestore Charts
// Requires: firebase-config.js, ApexCharts

$(document).ready(function() {
  if (typeof db !== 'undefined') {
    initOperationsDashboard();
  } else {
    setTimeout(initOperationsDashboard, 1000);
  }
});

async function initOperationsDashboard() {
  try {
    // Try to get inventory data from Firestore
    const inventorySnapshot = await db.collection('inventory').get();
    
    if (inventorySnapshot.empty) {
      // If no inventory collection, use pricing collection as fallback
      const pricingSnapshot = await db.collection('pricing').get();
      if (pricingSnapshot.empty) {
        renderOperationsWithDummyData();
        return;
      }
      
      const services = [];
      pricingSnapshot.forEach(doc => {
        services.push({ id: doc.id, ...doc.data() });
      });
      
      renderServiceAnalytics(services);
    } else {
      const inventory = [];
      inventorySnapshot.forEach(doc => {
        inventory.push({ id: doc.id, ...doc.data() });
      });
      
      renderInventoryAnalytics(inventory);
    }
    
    console.log('Operations Dashboard loaded');
    
  } catch (error) {
    console.error('Error loading Operations dashboard:', error);
    renderOperationsWithDummyData();
  }
}

function renderInventoryAnalytics(inventory) {
  // Filter low stock items (quantity < reorder_level)
  const lowStockItems = inventory.filter(item => 
    item.quantity && item.reorder_level && 
    parseInt(item.quantity) < parseInt(item.reorder_level)
  );
  
  // Count items by category
  const categoryCounts = {};
  inventory.forEach(item => {
    const category = item.category || 'Other';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });
  
  renderLowStockTable(lowStockItems);
  renderCategoryChart(categoryCounts, 'Inventory Items by Category');
}

function renderServiceAnalytics(services) {
  // Count active services by category
  const categoryCounts = {};
  services.forEach(service => {
    if (service.active) {
      const category = service.category || 'Other';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    }
  });
  
  renderCategoryChart(categoryCounts, 'Active Services by Category');
  renderServicesTable(services);
}

function renderLowStockTable(lowStockItems) {
  let tableContainer = document.getElementById('LowStockTable');
  if (!tableContainer) {
    const container = document.querySelector('.card-body') || document.querySelector('.page-content');
    if (container) {
      const tableDiv = document.createElement('div');
      tableDiv.id = 'LowStockTable';
      tableDiv.className = 'mb-4';
      container.appendChild(tableDiv);
      tableContainer = tableDiv;
    }
  }
  
  if (!tableContainer) return;
  
  let tableHTML = `
    <div class="card">
      <div class="card-body">
        <h4 class="header-title">Low Stock Items</h4>
        <div class="table-responsive">
          <table class="table table-sm">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Current Stock</th>
                <th>Reorder Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
  `;
  
  if (lowStockItems.length === 0) {
    tableHTML += `
      <tr>
        <td colspan="4" class="text-center text-muted">All items are adequately stocked</td>
      </tr>
    `;
  } else {
    lowStockItems.forEach(item => {
      const urgency = parseInt(item.quantity) === 0 ? 'danger' : 'warning';
      tableHTML += `
        <tr>
          <td>${item.product_name || item.name || 'N/A'}</td>
          <td>${item.quantity || 0}</td>
          <td>${item.reorder_level || 0}</td>
          <td><span class="badge badge-${urgency}">Low Stock</span></td>
        </tr>
      `;
    });
  }
  
  tableHTML += `
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  
  tableContainer.innerHTML = tableHTML;
}

function renderServicesTable(services) {
  let tableContainer = document.getElementById('ServicesTable');
  if (!tableContainer) {
    const container = document.querySelector('.card-body') || document.querySelector('.page-content');
    if (container) {
      const tableDiv = document.createElement('div');
      tableDiv.id = 'ServicesTable';
      tableDiv.className = 'mb-4';
      container.appendChild(tableDiv);
      tableContainer = tableDiv;
    }
  }
  
  if (!tableContainer) return;
  
  const activeServices = services.filter(s => s.active);
  
  let tableHTML = `
    <div class="card">
      <div class="card-body">
        <h4 class="header-title">Active Services</h4>
        <div class="table-responsive">
          <table class="table table-sm">
            <thead>
              <tr>
                <th>Service</th>
                <th>Category</th>
                <th>Price</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
  `;
  
  activeServices.slice(0, 10).forEach(service => {
    tableHTML += `
      <tr>
        <td>${service.service || 'N/A'}</td>
        <td>${service.category || 'N/A'}</td>
        <td>$${service.price || 0}</td>
        <td>${service.duration_min || 0} min</td>
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

function renderCategoryChart(categoryCounts, title) {
  const series = Object.values(categoryCounts);
  const labels = Object.keys(categoryCounts);
  
  const options = {
    chart: {
      type: 'donut',
      height: 350
    },
    series: series,
    labels: labels,
    colors: ['#3498db', '#e74c3c', '#f39c12', '#27ae60', '#9b59b6'],
    title: {
      text: title,
      align: 'center'
    },
    legend: {
      position: 'bottom'
    }
  };
  
  let chartContainer = document.getElementById('OperationsCategoryChart');
  if (!chartContainer) {
    const container = document.querySelector('.card-body') || document.querySelector('.page-content');
    if (container) {
      const chartDiv = document.createElement('div');
      chartDiv.id = 'OperationsCategoryChart';
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

function renderOperationsWithDummyData() {
  console.log('Using dummy data for Operations dashboard');
  
  // Dummy low stock items
  const dummyLowStock = [
    { product_name: 'Botox 100U', quantity: 5, reorder_level: 10 },
    { product_name: 'Sculptra Vial', quantity: 2, reorder_level: 3 },
    { product_name: 'Chemical Peel Kit', quantity: 1, reorder_level: 3 }
  ];
  
  // Dummy category distribution
  const dummyCategories = {
    'Injectables': 8,
    'Facial': 5,
    'Laser': 3,
    'Body': 4,
    'Supplies': 12
  };
  
  // Render low stock table
  let tableContainer = document.getElementById('LowStockTable');
  if (!tableContainer) {
    const container = document.querySelector('.card-body') || document.querySelector('.page-content');
    if (container) {
      const tableDiv = document.createElement('div');
      tableDiv.id = 'LowStockTable';
      tableDiv.className = 'mb-4';
      container.appendChild(tableDiv);
      tableContainer = tableDiv;
    }
  }
  
  if (tableContainer) {
    let tableHTML = `
      <div class="card">
        <div class="card-body">
          <h4 class="header-title">Low Stock Items (Demo Data)</h4>
          <div class="table-responsive">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Current Stock</th>
                  <th>Reorder Level</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
    `;
    
    dummyLowStock.forEach(item => {
      const urgency = item.quantity === 0 ? 'danger' : 'warning';
      tableHTML += `
        <tr>
          <td>${item.product_name}</td>
          <td>${item.quantity}</td>
          <td>${item.reorder_level}</td>
          <td><span class="badge badge-${urgency}">Low Stock</span></td>
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
  
  // Render category chart
  renderCategoryChart(dummyCategories, 'Items by Category (Demo Data)');
}

// Admin CSV Engine
// Provides importCsv() and exportCsv() functions for localStorage data management

// Simple CSV parser
function parseCSV(csvText) {
  const lines = String(csvText || '').replace(/\r/g, '').split('\n').filter(l => l.trim().length);
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const cols = [];
    let cur = '';
    let inQuotes = false;
    
    for (let c = 0; c < line.length; c++) {
      const ch = line[c];
      if (ch === '"') {
        if (inQuotes && line[c + 1] === '"') {
          cur += '"';
          c++; // skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        cols.push(cur.trim().replace(/^"|"$/g, ''));
        cur = '';
      } else {
        cur += ch;
      }
    }
    cols.push(cur.trim().replace(/^"|"$/g, ''));
    
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = (cols[idx] || '').trim();
    });
    rows.push(row);
  }
  
  return rows;
}

// CSV export function
function exportCsv(storageKey) {
  try {
    const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (!data.length) {
      alert('No data to export for key: ' + storageKey);
      return;
    }
    
    // Get all unique keys from the data
    const headers = [...new Set(data.flatMap(obj => Object.keys(obj)))];
    
    // Create CSV content
    const csvRows = [headers.join(',')];
    data.forEach(row => {
      const csvRow = headers.map(header => {
        const value = (row[header] ?? '').toString().replace(/"/g, '""');
        return `"${value}"`;
      });
      csvRows.push(csvRow.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Generate filename with current date
    const today = new Date().toISOString().split('T')[0];
    const filename = `${storageKey}_${today}.csv`;
    
    // Download the file
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Export error:', error);
    alert('Error exporting data: ' + error.message);
  }
}

// CSV import function
function importCsv(storageKey, fileInput, statusElement) {
  const file = fileInput.files?.[0];
  if (!file) {
    if (statusElement) statusElement.textContent = 'Please select a CSV file first.';
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const csvText = e.target.result;
      const parsed = parseCSV(csvText);
      
      if (!parsed.length) {
        if (statusElement) statusElement.textContent = 'No data rows found in CSV.';
        return;
      }
      
      // Get existing data
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      // Add parsed data to existing (append mode)
      const combined = [...existing, ...parsed];
      
      // Save back to localStorage
      localStorage.setItem(storageKey, JSON.stringify(combined));
      
      if (statusElement) {
        statusElement.textContent = `✓ Imported ${parsed.length} rows into ${storageKey}. Total: ${combined.length} records.`;
      }
      
      // Clear file input
      fileInput.value = '';
      
    } catch (error) {
      console.error('Import error:', error);
      if (statusElement) {
        statusElement.textContent = `✗ Import failed: ${error.message}`;
      }
    }
  };
  
  reader.onerror = function() {
    if (statusElement) statusElement.textContent = '✗ Failed to read file.';
  };
  
  reader.readAsText(file);
}

// Utility functions for localStorage management
function readJSON(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (_) {
    return [];
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value || []));
  } catch (_) {
    console.error('Failed to write to localStorage:', key);
  }
}

// Export functions for global access
window.exportCsv = exportCsv;
window.importCsv = importCsv;
window.readJSON = readJSON;
window.writeJSON = writeJSON;

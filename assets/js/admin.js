(function(){
  // storage keys
  const K = {
    leads: 'spectrum_crm_leads',
    inventory: 'spectrum_crm_inventory',
    vendors: 'spectrum_crm_vendors',
    gallery: 'spectrum_crm_gallery',
    prices: 'spectrum_crm_prices',
    followups: 'spectrum_crm_followups' // used on sales page too
  };

  // helpers
  const load = k => { try{return JSON.parse(localStorage.getItem(k)||'[]')}catch(_){return[]} };
  const save = (k, v) => { try{localStorage.setItem(k, JSON.stringify(v||[]))}catch(_){ } };

  // ---------- CSV generic ----------
  function importCSV(fileInput, mapRow, key, doneMsg){
    const f = fileInput?.files?.[0];
    if(!f){ alert('Choose a CSV file first.'); return; }
    const reader = new FileReader();
    reader.onload = ()=>{
      const rows = window.parseCSVToObjects(reader.result);
      if(!rows.length){ alert('No rows found.'); return; }
      const mapped = rows.map(mapRow);
      const current = load(key);
      save(key, mapped.concat(current));
      alert(doneMsg.replace('%N%', mapped.length));
    };
    reader.readAsText(f);
  }

  function exportCSV(key, headers, fname){
    const data = load(key);
    if(!data.length){ alert('No records to export.'); return; }
    const csv = [headers.join(',')].concat(
      data.map(row => headers.map(h=>{
        const v = (row[h]??'').toString().replace(/"/g,'""');
        return `"${v}"`;
      }).join(','))
    ).join('\n');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = fname; a.click();
    URL.revokeObjectURL(url);
  }

  // ---------- Leads ----------
  const mapLead = r => ({
    id: 'L'+Date.now()+Math.random().toString(36).slice(2,6),
    stage: r.stage || 'New',
    name: r.name || '—',
    phone: r.phone || '',
    email: r.email || '',
    source: r.source || '',
    category: r.category || '',
    service: r.service || '',
    value: Number(r.value||0),
    priority: r.priority || 'Medium',
    created: r.created || new Date().toISOString().slice(0,10),
    apptDate: r.apptDate || '',
    dueDate: r.dueDate || '',
    dueTime: r.dueTime || '',
    notes: r.notes || '',
    history: []
  });

  document.getElementById('btnImportLeads')?.addEventListener('click', ()=>{
    importCSV(document.getElementById('csvLeads'), mapLead, K.leads, 'Imported %N% lead(s).');
  });
  document.getElementById('btnExportLeads')?.addEventListener('click', ()=>{
    exportCSV(K.leads,
      ['id','stage','name','phone','email','source','category','service','value','priority','created','apptDate','dueDate','dueTime','notes'],
      'leads-export.csv');
  });

  // ---------- Inventory ----------
  const mapInventory = r => ({
    sku: r.sku||'',
    name: r.name||'',
    category: r.category||'',
    qty: Number(r.qty||0),
    unitCost: Number(r.unitCost||0),
    reorderPoint: Number(r.reorderPoint||0),
    notes: r.notes||''
  });
  document.getElementById('btnImportInventory')?.addEventListener('click', ()=>{
    importCSV(document.getElementById('csvInventory'), mapInventory, K.inventory, 'Imported %N% inventory item(s).');
  });
  document.getElementById('btnExportInventory')?.addEventListener('click', ()=>{
    exportCSV(K.inventory, ['sku','name','category','qty','unitCost','reorderPoint','notes'], 'inventory-export.csv');
  });

  // ---------- Vendors ----------
  const mapVendor = r => ({
    name: r.name||'',
    contact: r.contact||'',
    email: r.email||'',
    phone: r.phone||'',
    terms: r.terms||'',
    notes: r.notes||''
  });
  document.getElementById('btnImportVendors')?.addEventListener('click', ()=>{
    importCSV(document.getElementById('csvVendors'), mapVendor, K.vendors, 'Imported %N% vendor(s).');
  });
  document.getElementById('btnExportVendors')?.addEventListener('click', ()=>{
    exportCSV(K.vendors, ['name','contact','email','phone','terms','notes'], 'vendors-export.csv');
  });

  // ---------- Gallery metadata ----------
  const mapGallery = r => ({
    title: r.title||'',
    tag: r.tag||'',
    url: r.url||'',
    patientInitials: r.patientInitials||'',
    date: r.date||''
  });
  document.getElementById('btnImportGallery')?.addEventListener('click', ()=>{
    importCSV(document.getElementById('csvGallery'), mapGallery, K.gallery, 'Imported %N% gallery record(s).');
  });
  document.getElementById('btnExportGallery')?.addEventListener('click', ()=>{
    exportCSV(K.gallery, ['title','tag','url','patientInitials','date'], 'gallery-export.csv');
  });

  // ---------- Pricing Editor ----------
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  function pricesLoad(){ return load(K.prices); }
  function pricesSave(arr){ save(K.prices, arr||[]); }

  function rowTpl(p={}, idx){
    return `<tr data-i="${idx}">
      <td contenteditable="true">${p.category||''}</td>
      <td contenteditable="true">${p.service||''}</td>
      <td contenteditable="true">${p.price||''}</td>
      <td contenteditable="true">${p.duration||''}</td>
      <td contenteditable="true">${p.sku||''}</td>
      <td class="text-center"><button class="btn btn-sm btn-outline-danger btnDel">✕</button></td>
    </tr>`;
  }

  function renderPrices(){
    const data = pricesLoad();
    const tb = $('#tblPrices tbody');
    if(!tb) return;
    tb.innerHTML = data.length ? data.map((p,i)=>rowTpl(p,i)).join('') : rowTpl({},0);
    tb.querySelectorAll('.btnDel').forEach(btn=>{
      btn.onclick = e => { e.target.closest('tr').remove(); };
    });
  }

  function collectPrices(){
    return $$('#tblPrices tbody tr').map(tr=>{
      const tds = tr.querySelectorAll('td');
      return {
        category: tds[0].innerText.trim(),
        service : tds[1].innerText.trim(),
        price   : tds[2].innerText.trim(),
        duration: tds[3].innerText.trim(),
        sku     : tds[4].innerText.trim(),
      };
    }).filter(x=> x.category || x.service);
  }

  document.getElementById('btnAddPriceRow')?.addEventListener('click', ()=>{
    const tb = $('#tblPrices tbody');
    tb.insertAdjacentHTML('beforeend', rowTpl({}, (tb.querySelectorAll('tr').length||0)));
    tb.querySelectorAll('.btnDel').forEach(btn=>{
      btn.onclick = e => { e.target.closest('tr').remove(); };
    });
  });
  document.getElementById('btnSavePrices')?.addEventListener('click', ()=>{
    pricesSave(collectPrices());
    alert('Pricing saved.');
  });
  document.getElementById('btnLoadSamplePrices')?.addEventListener('click', ()=>{
    const sample = [
      {category:'Injectables', service:'Botox (20u)', price:'$249', duration:'20', sku:'BTX-20'},
      {category:'Skin Health', service:'HydraFacial MD', price:'$199', duration:'45', sku:'HF-STD'},
      {category:'Laser', service:'Laser Hair Removal (Underarm)', price:'$129', duration:'25', sku:'LHR-UA'}
    ];
    pricesSave(sample); renderPrices();
  });

  renderPrices();
})();

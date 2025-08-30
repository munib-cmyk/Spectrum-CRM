// super small CSV -> array of objects (headers on first row)
window.parseCSVToObjects = function(csvText){
  const lines = String(csvText||'').replace(/\r/g,'').split('\n').filter(l=>l.trim().length);
  if(lines.length === 0) return [];
  const headers = lines[0].split(',').map(h=>h.trim());
  const out = [];
  for(let i=1;i<lines.length;i++){
    const line = lines[i];
    const cols = []; let cur=''; let inQ=false;
    for(let c=0;c<line.length;c++){
      const ch = line[c];
      if(ch === '"'){
        if(inQ && line[c+1] === '"'){ cur+='"'; c++; }
        else { inQ = !inQ; }
      } else if(ch === ',' && !inQ){ cols.push(cur); cur=''; }
      else { cur += ch; }
    }
    cols.push(cur);
    const row = {};
    headers.forEach((h,idx)=> row[h] = (cols[idx]||'').trim());
    out.push(row);
  }
  return out;
};

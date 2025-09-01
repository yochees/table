const data = [
  { title: 'Customer Feedback Analysis.csv', type: { label: 'Survey', tone: 'gold' }, owner: { vendor: 'XM', name: 'Qualtrics' }, created: '19 March 2025', updated: '19 March 2025' },
  { title: 'User Experience Survey.csv', type: { label: 'Survey', tone: 'gold' }, owner: { vendor: 'XM', name: 'Qualtrics' }, created: '10 March 2025', updated: '17 March 2025' },
  { title: 'Stakeholder Feedback Session.txt', type: { label: 'Interview', tone: 'purple' }, owner: { avatar: 'EJ', name: 'Emily Johnson' }, created: '10 March 2025', updated: '10 March 2025' },
  { title: 'Product Feature Requests.csv', type: { label: 'Survey', tone: 'gold' }, owner: { vendor: 'XM', name: 'Qualtrics' }, created: '4 March 2025', updated: '11 March 2025' },
  { title: 'User Journey Mapping.txt', type: { label: 'Interview', tone: 'purple' }, owner: { avatar: 'LS', name: 'Liam Smith' }, created: '18 March 2025', updated: '18 March 2025' },
  { title: 'Client Satisfaction Report.csv', type: { label: 'Survey', tone: 'gold' }, owner: { vendor: 'XM', name: 'Qualtrics' }, created: '31 February 2025', updated: '12 March 2025' },
  { title: 'Market Research Insights.csv', type: { label: 'Survey', tone: 'gold' }, owner: { vendor: 'XM', name: 'Qualtrics' }, created: '23 February 2025', updated: '6 March 2025' },
  { title: 'Service Improvement Suggestions.csv', type: { label: 'Survey', tone: 'gold' }, owner: { vendor: 'XM', name: 'Qualtrics' }, created: '22 February 2025', updated: '9 March 2025' },
  { title: 'Interview with Alex.txt', type: { label: 'Interview', tone: 'purple' }, owner: { avatar: 'ZW', name: 'Zoe Williams' }, created: '16 February 2025', updated: '16 February 2025' },
  { title: 'User Feedback Compilation.txt', type: { label: 'Interview', tone: 'purple' }, owner: { avatar: 'NB', name: 'Noah Brown' }, created: '8 February 2025', updated: '8 February 2025' },
  { title: 'Customer Insights Overview.csv', type: { label: 'Survey', tone: 'gold' }, owner: { vendor: 'XM', name: 'Qualtrics' }, created: '7 February 2025', updated: '7 March 2025' },
  { title: 'Feature Prioritization.csv', type: { label: 'Survey', tone: 'gold' }, owner: { vendor: 'XM', name: 'Qualtrics' }, created: '15 January 2025', updated: '15 March 2025' },
  { title: 'User Needs Analysis.txt', type: { label: 'Interview', tone: 'purple' }, owner: { avatar: 'AD', name: 'Ava Davis' }, created: '14 January 2025', updated: '14 January 2025' }
];

function init(){
  const tableEl = document.getElementById('table');
  const tbodyEl = document.getElementById('tbody');
  const rowTemplate = document.getElementById('row-template');
  if(!tableEl || !tbodyEl || !rowTemplate){
    return;
  }

  const state = {
    sortBy: 'updated',
    sortDir: 'desc',
    columnWidths: {
      title: null, // null -> grid minmax(200px, 1fr)
      type: 180,
      owner: 180,
      created: 200,
      updated: 200,
    },
  };

  function getComparableValue(row, key){
    if(key === 'type') return row.type.label;
    if(key === 'owner') return row.owner.name;
    return row[key];
  }

  function formatOwner(owner){
    if(owner.vendor){
      return `<span class="owner"><span class="vendor"><span class="xm">XM</span></span> ${owner.name}</span>`;
    }
    return `<span class="owner"><span class="avatar" aria-hidden="true"></span> ${owner.name}</span>`;
  }

  function render(){
    const sorted = [...data].sort((a,b)=>{
      const key = state.sortBy;
      const avRaw = getComparableValue(a, key);
      const bvRaw = getComparableValue(b, key);
      const da = Date.parse(avRaw);
      const db = Date.parse(bvRaw);
      let cmp;
      if(!Number.isNaN(da) && !Number.isNaN(db)){
        cmp = da - db;
      } else {
        cmp = String(avRaw).localeCompare(String(bvRaw), undefined, { sensitivity: 'base' });
      }
      return state.sortDir === 'asc' ? cmp : -cmp;
    });

    tbodyEl.innerHTML = '';
    for(const row of sorted){
      const node = rowTemplate.content.firstElementChild.cloneNode(true);
      node.querySelector('[data-col="title"]').textContent = row.title;
      const typeCell = node.querySelector('[data-col="type"]');
      const badgeClass = row.type.tone === 'purple' ? 'badge purple' : 'badge';
      typeCell.innerHTML = `<span class="${badgeClass}">${row.type.label}</span>`;
      node.querySelector('[data-col="owner"]').innerHTML = formatOwner(row.owner);
      node.querySelector('[data-col="created"]').textContent = row.created;
      node.querySelector('[data-col="updated"]').textContent = row.updated;
      tbodyEl.appendChild(node);
    }

    applyColumnWidths();
    updateHeaderSortIcons();
  }

  function applyColumnWidths(){
    const grid = [
      state.columnWidths.title ? `${state.columnWidths.title}px` : 'minmax(200px, 2fr)',
      `${state.columnWidths.type}px`,
      `${state.columnWidths.owner}px`,
      `${state.columnWidths.created}px`,
      `minmax(${state.columnWidths.updated}px, 1fr)`,
    ].join(' ');
    const rows = tableEl.querySelectorAll('.tr');
    rows.forEach(r=>{ r.style.gridTemplateColumns = grid; });
  }

  function updateHeaderSortIcons(){
    const headers = tableEl.querySelectorAll('.th');
    headers.forEach(h=>{
      const col = h.dataset.col;
      h.setAttribute('aria-sort', col === state.sortBy ? (state.sortDir === 'asc' ? 'ascending' : 'descending') : 'none');
    });
  }

  function calculateOptimalColumnWidth(col){
    // Create a temporary element to measure content width
    const tempEl = document.createElement('div');
    tempEl.style.position = 'absolute';
    tempEl.style.visibility = 'hidden';
    tempEl.style.whiteSpace = 'nowrap';
    tempEl.style.padding = '10px 12px';
    tempEl.style.fontSize = getComputedStyle(document.body).fontSize;
    tempEl.style.fontFamily = getComputedStyle(document.body).fontFamily;
    document.body.appendChild(tempEl);

    let maxWidth = 0;

    // Measure header content
    const headerTh = tableEl.querySelector(`.th[data-col="${col}"]`);
    if(headerTh){
      const headerContent = headerTh.querySelector('.th-content');
      if(headerContent){
        tempEl.innerHTML = headerContent.innerHTML;
        maxWidth = Math.max(maxWidth, tempEl.offsetWidth + 40); // +40 for sort icon space
      }
    }

    // Measure all cell contents for this column
    const cells = tableEl.querySelectorAll(`.td[data-col="${col}"]`);
    cells.forEach(cell=>{
      tempEl.innerHTML = cell.innerHTML;
      maxWidth = Math.max(maxWidth, tempEl.offsetWidth);
    });

    document.body.removeChild(tempEl);

    // Apply minimum widths
    const min = col === 'title' ? 200 : 80;
    return Math.max(min, Math.ceil(maxWidth));
  }

  // Sorting behavior (click on title/icon only)
  tableEl.querySelectorAll('.th .th-content').forEach(thContent=>{
    thContent.addEventListener('click', (e)=>{
      const th = e.currentTarget.closest('.th');
      const col = th.dataset.col;
      if(state.sortBy === col){
        state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortBy = col;
        state.sortDir = 'asc';
      }
      render();
      e.preventDefault();
      e.stopPropagation();
    });
  });

  // Resize behavior - only the target column resizes
  let resizing = null; // {col, startX, startWidth}

  tableEl.querySelectorAll('.th .resize-handle').forEach(h=>{
    h.addEventListener('mousedown', (e)=>{
      const th = e.currentTarget.parentElement;
      const col = th.dataset.col;
      const rect = th.getBoundingClientRect();
      const startWidth = state.columnWidths[col] || rect.width;
      resizing = { col, startX: e.clientX, startWidth };
      th.classList.add('resizing');
      document.body.style.cursor = 'col-resize';
      e.preventDefault();
      e.stopPropagation();
    });

    // Double-click to auto-fit column width
    h.addEventListener('dblclick', (e)=>{
      const th = e.currentTarget.parentElement;
      const col = th.dataset.col;
      const autoWidth = calculateOptimalColumnWidth(col);
      state.columnWidths[col] = autoWidth;
      applyColumnWidths();
      e.preventDefault();
      e.stopPropagation();
    });
  });

  window.addEventListener('mousemove', (e)=>{
    if(!resizing) return;
    const delta = e.clientX - resizing.startX;
    const min = resizing.col === 'title' ? 200 : 80;
    const newWidth = Math.max(min, Math.round(resizing.startWidth + delta));
    state.columnWidths[resizing.col] = newWidth;
    applyColumnWidths();
  });

  window.addEventListener('mouseup', ()=>{
    if(!resizing) return;
    const th = tableEl.querySelector(`.th[data-col="${resizing.col}"]`);
    th && th.classList.remove('resizing');
    document.body.style.cursor = '';
    resizing = null;
  });

  render();
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}



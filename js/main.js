document.getElementById('convertBtn').addEventListener('click', () => {
    const month = parseInt(document.getElementById('lunarMonth').value);
    const day = parseInt(document.getElementById('lunarDay').value);
    const isLeap = document.getElementById('isLeap').checked;

    const dates = getSolarDates(month, day, isLeap);
    
    const listEl = document.getElementById('dateList');
    listEl.innerHTML = '';
    dates.forEach(date => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between';
        li.innerHTML = `<span>📅 ${date}</span> <span class="badge bg-info text-dark">양력</span>`;
        listEl.appendChild(li);
    });
    document.getElementById('previewSection').classList.remove('d-none');
});

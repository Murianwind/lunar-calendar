// js/main.js
document.getElementById('convertBtn').addEventListener('click', () => {
    const title = document.getElementById('eventTitle').value;
    const month = parseInt(document.getElementById('lunarMonth').value);
    const day = parseInt(document.getElementById('lunarDay').value);
    const isLeap = document.getElementById('isLeap').checked;
    const count = parseInt(document.getElementById('repeatYears').value) || 10;

    if (!title) { alert("일정 제목을 입력해주세요!"); return; }

    const dates = getSolarDates(month, day, isLeap, count);
    
    const listEl = document.getElementById('dateList');
    listEl.innerHTML = '';
    
    dates.forEach(date => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `<span>${title} (${date})</span> <span class="badge bg-primary">양력</span>`;
        listEl.appendChild(li);
    });
    
    document.getElementById('previewSection').classList.remove('d-none');
});

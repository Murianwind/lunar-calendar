// js/main.js
document.getElementById('convertBtn').addEventListener('click', () => {
    const month = document.getElementById('lunarMonth').value;
    const day = document.getElementById('lunarDay').value;
    const isLeap = document.getElementById('isLeap').checked;
    const years = document.getElementById('repeatYears').value; // 이 부분이 추가되어야 합니다.

    if (!month || !day) {
        alert("월과 일을 입력해주세요!");
        return;
    }

    // calendar.js의 함수 호출 (문자열을 숫자로 변환)
    const dates = getSolarDates(parseInt(month), parseInt(day), isLeap, parseInt(years));
    
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

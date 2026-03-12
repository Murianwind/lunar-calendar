let cachedDates = [];
let foundEvents = [];

window.addEventListener('load', () => {
    document.getElementById('clientId').value = localStorage.getItem('google_client_id') || '';
    document.getElementById('apiKey').value = localStorage.getItem('google_api_key') || '';
});

// 월/일 범위 강제 보정
document.getElementById('lunarMonth').addEventListener('blur', function() {
    let val = parseInt(this.value);
    if (val < 1) this.value = 1;
    if (val > 12) this.value = 12;
});
document.getElementById('lunarDay').addEventListener('blur', function() {
    let val = parseInt(this.value);
    if (val < 1) this.value = 1;
    if (val > 31) this.value = 31;
});

document.getElementById('saveAuthBtn').addEventListener('click', () => {
    localStorage.setItem('google_client_id', document.getElementById('clientId').value);
    localStorage.setItem('google_api_key', document.getElementById('apiKey').value);
    alert("저장되었습니다.");
});

document.getElementById('clearAuthBtn').addEventListener('click', () => {
    localStorage.removeItem('google_client_id');
    localStorage.removeItem('google_api_key');
    location.reload();
});

document.getElementById('previewBtn').addEventListener('click', () => {
    const year = document.getElementById('lunarYear').value;
    const month = document.getElementById('lunarMonth').value;
    const day = document.getElementById('lunarDay').value;
    const isLeap = document.getElementById('isLeap').checked;
    const count = parseInt(document.getElementById('repeatYears').value) || 10;

    if (!year || !month || !day) return alert("날짜를 모두 입력하세요.");

    // 잘 되던 방식으로 호출 (체크 로직 삭제)
    cachedDates = getSolarDates(year, month, day, isLeap, count);
    document.getElementById('previewList').innerHTML = "<strong>결과:</strong><br>" + cachedDates.join('<br>');
});

document.getElementById('syncBtn').addEventListener('click', async () => {
    const title = document.getElementById('eventTitle').value;
    if (!title || cachedDates.length === 0) return alert("제목 입력과 미리보기를 완료하세요.");
    await addEventsToCalendar(title, document.getElementById('eventDescription').value, cachedDates);
});

document.getElementById('searchBtn').addEventListener('click', async () => {
    const kw = document.getElementById('deleteKeyword').value;
    foundEvents = await searchEvents(kw);
    const res = document.getElementById('searchResultList');
    res.innerHTML = foundEvents.map(e => `[${e.start.date || e.start.dateTime}] ${e.summary}`).join('<br>');
    document.getElementById('bulkDeleteBtn').style.display = foundEvents.length ? 'block' : 'none';
});

document.getElementById('bulkDeleteBtn').addEventListener('click', async () => {
    if(confirm("검색된 모든 일정을 삭제하시겠습니까?")) {
        await deleteEvents(foundEvents.map(e => e.id));
        location.reload();
    }
});

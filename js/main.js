let cachedDates = [];
let foundEvents = [];

// 페이지 로드 시 저장된 정보 불러오기
window.addEventListener('load', () => {
    document.getElementById('clientId').value = localStorage.getItem('google_client_id') || '';
    document.getElementById('apiKey').value = localStorage.getItem('google_api_key') || '';
});

// --- 사용자가 입력 범위를 벗어나면 자동으로 보정하는 로직 ---
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

// 인증정보 저장/삭제
document.getElementById('saveAuthBtn').addEventListener('click', () => {
    localStorage.setItem('google_client_id', document.getElementById('clientId').value);
    localStorage.setItem('google_api_key', document.getElementById('apiKey').value);
    alert("인증 정보가 브라우저에 저장되었습니다.");
});

document.getElementById('clearAuthBtn').addEventListener('click', () => {
    localStorage.removeItem('google_client_id');
    localStorage.removeItem('google_api_key');
    location.reload();
});

// 미리보기 (올해부터 10년치 계산)
document.getElementById('previewBtn').addEventListener('click', () => {
    const year = document.getElementById('lunarYear').value;
    const month = document.getElementById('lunarMonth').value;
    const day = document.getElementById('lunarDay').value;
    const isLeap = document.getElementById('isLeap').checked;
    const count = parseInt(document.getElementById('repeatYears').value) || 10;

    if (!month || !day) return alert("월과 일을 정확히 입력하세요.");

    cachedDates = getSolarDates(year, month, day, isLeap, count);
    document.getElementById('previewList').innerHTML = "<strong>올해(2026년)부터의 변환 결과:</strong><br>" + cachedDates.join('<br>');
});

// 구글 캘린더 등록
document.getElementById('syncBtn').addEventListener('click', async () => {
    const title = document.getElementById('eventTitle').value;
    if (!title || cachedDates.length === 0) return alert("제목 입력과 미리보기를 먼저 완료하세요.");
    await addEventsToCalendar(title, document.getElementById('eventDescription').value, cachedDates);
});

// 일정 검색
document.getElementById('searchBtn').addEventListener('click', async () => {
    const kw = document.getElementById('deleteKeyword').value;
    foundEvents = await searchEvents(kw);
    const res = document.getElementById('searchResultList');
    res.innerHTML = foundEvents.map(e => `[${e.start.date || e.start.dateTime}] ${e.summary}`).join('<br>');
    document.getElementById('bulkDeleteBtn').style.display = foundEvents.length ? 'block' : 'none';
});

// 일괄 삭제
document.getElementById('bulkDeleteBtn').addEventListener('click', async () => {
    if(confirm("검색된 모든 일정을 정말 삭제하시겠습니까?")) {
        await deleteEvents(foundEvents.map(e => e.id));
        location.reload();
    }
});

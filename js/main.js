let cachedDates = [];
let foundEvents = [];

// 페이지 로드 시 저장된 정보 불러오기
window.addEventListener('load', () => {
    document.getElementById('clientId').value = localStorage.getItem('google_client_id') || '';
    document.getElementById('apiKey').value = localStorage.getItem('google_api_key') || '';
});

// --- 입력값 범위 자동 보정 (사용자 요청 사항) ---
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
    alert("인증 정보가 저장되었습니다.");
});
document.getElementById('clearAuthBtn').addEventListener('click', () => {
    localStorage.removeItem('google_client_id');
    localStorage.removeItem('google_api_key');
    location.reload();
});

// 미리보기 및 양력 변환
document.getElementById('previewBtn').addEventListener('click', () => {
    const year = document.getElementById('lunarYear').value;
    const month = document.getElementById('lunarMonth').value;
    const day = document.getElementById('lunarDay').value;
    const isLeap = document.getElementById('isLeap').checked;
    const count = parseInt(document.getElementById('repeatYears').value) || 10;

    if (!year || !month || !day) return alert("연도, 월, 일을 입력하세요.");

    cachedDates = getSolarDates(year, month, day, isLeap, count);
    document.getElementById('previewList').innerHTML = "<strong>양력 변환 결과:</strong><br>" + cachedDates.join('<br>');
});

// 구글 등록
document.getElementById('syncBtn').addEventListener('click', async () => {
    const title = document.getElementById('eventTitle').value;
    if (!title || cachedDates.length === 0) return alert("제목과 날짜 미리보기를 완료하세요.");
    await addEventsToCalendar(title, document.getElementById('eventDescription').value, cachedDates);
});

// 일정 찾기
document.getElementById('searchBtn').addEventListener('click', async () => {
    const kw = document.getElementById('deleteKeyword').value;
    foundEvents = await searchEvents(kw);
    const res = document.getElementById('searchResultList');
    res.innerHTML = foundEvents.map(e => `[${e.start.date || e.start.dateTime}] ${e.summary}`).join('<br>');
    document.getElementById('bulkDeleteBtn').style.display = foundEvents.length ? 'block' : 'none';
});

// 일괄 삭제
document.getElementById('bulkDeleteBtn').addEventListener('click', async () => {
    if(confirm("정말 모두 삭제할까요?")) {
        await deleteEvents(foundEvents.map(e => e.id));
        location.reload();
    }
});

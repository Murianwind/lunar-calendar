/* main.js - 깔끔한 호출 로직 */
let cachedDates = [];
let foundEvents = [];

window.addEventListener('load', () => {
    document.getElementById('clientId').value = localStorage.getItem('google_client_id') || '';
    document.getElementById('apiKey').value = localStorage.getItem('google_api_key') || '';
});

// 입력 범위 보정
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
    alert("인증 정보가 저장되었습니다. 페이지를 새로고침합니다.");
    location.reload();
});

document.getElementById('clearAuthBtn').addEventListener('click', () => {
    localStorage.removeItem('google_client_id');
    localStorage.removeItem('google_api_key');
    location.reload();
});

// 미리보기
document.getElementById('previewBtn').addEventListener('click', () => {
    const year = document.getElementById('lunarYear').value;
    const month = document.getElementById('lunarMonth').value;
    const day = document.getElementById('lunarDay').value;
    const isLeap = document.getElementById('isLeap').checked;
    const count = parseInt(document.getElementById('repeatYears').value) || 10;

    if (!month || !day) return alert("월과 일을 입력하세요.");

    cachedDates = getSolarDates(year, month, day, isLeap, count);
    document.getElementById('previewList').innerHTML = "<strong>올해부터의 변환 결과:</strong><br>" + cachedDates.join('<br>');
});

// 등록 버튼 (이제 매번 로그인 창이 뜨지 않습니다)
document.getElementById('syncBtn').addEventListener('click', async () => {
    const title = document.getElementById('eventTitle').value;
    const desc = document.getElementById('eventDescription').value;
    if (!title || cachedDates.length === 0) return alert("제목과 미리보기를 확인하세요.");
    
    await addEventsToCalendar(title, desc, cachedDates);
});

// 검색 버튼
document.getElementById('searchBtn').addEventListener('click', async () => {
    const kw = document.getElementById('deleteKeyword').value;
    if (!kw) return alert("검색어를 입력하세요.");
    
    foundEvents = await searchEvents(kw);
    const res = document.getElementById('searchResultList');
    res.innerHTML = foundEvents.map(e => `[${e.start.date || e.start.dateTime}] ${e.summary}`).join('<br>');
    document.getElementById('bulkDeleteBtn').style.display = foundEvents.length ? 'block' : 'none';
});

// 삭제 버튼
document.getElementById('bulkDeleteBtn').addEventListener('click', async () => {
    if(confirm("정말 모두 삭제할까요?")) {
        await deleteEvents(foundEvents.map(e => e.id));
        document.getElementById('searchResultList').innerHTML = '';
        document.getElementById('bulkDeleteBtn').style.display = 'none';
    }
});

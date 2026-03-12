let cachedDates = [];
let foundEvents = [];

// 로드 시 인증정보 불러오기
window.addEventListener('load', () => {
    document.getElementById('clientId').value = localStorage.getItem('google_client_id') || '';
    document.getElementById('apiKey').value = localStorage.getItem('google_api_key') || '';
});

// 저장/삭제 버튼
document.getElementById('saveAuthBtn').addEventListener('click', () => {
    localStorage.setItem('google_client_id', document.getElementById('clientId').value);
    localStorage.setItem('google_api_key', document.getElementById('apiKey').value);
    alert("저장되었습니다.");
});
document.getElementById('clearAuthBtn').addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});

// 미리보기
document.getElementById('previewBtn').addEventListener('click', () => {
    const year = document.getElementById('lunarYear').value;
    const month = document.getElementById('lunarMonth').value;
    const day = document.getElementById('lunarDay').value;
    const isLeap = document.getElementById('isLeap').checked;
    const count = parseInt(document.getElementById('repeatYears').value) || 10;

    if (!year || !month || !day) return alert("연도, 월, 일을 입력하세요.");

    cachedDates = getSolarDates(year, month, day, isLeap, count);
    document.getElementById('previewList').innerHTML = "<strong>변환 날짜:</strong><br>" + cachedDates.join('<br>');
});

// 등록
document.getElementById('syncBtn').addEventListener('click', async () => {
    const title = document.getElementById('eventTitle').value;
    if (!title || cachedDates.length === 0) return alert("제목 입력과 미리보기를 완료하세요.");
    try {
        await addEventsToCalendar(title, document.getElementById('eventDescription').value, cachedDates);
    } catch (e) { alert("등록 중 오류 발생"); }
});

// 찾기 및 삭제
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

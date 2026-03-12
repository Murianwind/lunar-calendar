let cachedDates = [];
let foundEvents = [];

window.addEventListener('load', () => {
    const savedId = localStorage.getItem('google_client_id');
    const savedKey = localStorage.getItem('google_api_key');
    if (savedId) document.getElementById('clientId').value = savedId;
    if (savedKey) document.getElementById('apiKey').value = savedKey;
});

document.getElementById('saveAuthBtn').addEventListener('click', () => {
    localStorage.setItem('google_client_id', document.getElementById('clientId').value);
    localStorage.setItem('google_api_key', document.getElementById('apiKey').value);
    alert("저장되었습니다.");
    location.reload(); 
});

document.getElementById('clearAuthBtn').addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});

document.getElementById('previewBtn').addEventListener('click', () => {
    const year = document.getElementById('lunarYear').value;
    const month = document.getElementById('lunarMonth').value;
    const day = document.getElementById('lunarDay').value;
    const isLeap = document.getElementById('isLeap').checked;
    const count = parseInt(document.getElementById('repeatYears').value) || 10;

    if (!year || !month || !day) return alert("날짜를 입력하세요.");

    cachedDates = getSolarDates(year, month, day, isLeap, count);
    document.getElementById('previewList').innerHTML = "<strong>결과:</strong><br>" + cachedDates.join('<br>');
});

document.getElementById('syncBtn').addEventListener('click', async () => {
    const title = document.getElementById('eventTitle').value;
    if (!title || cachedDates.length === 0) return alert("제목 입력 및 미리보기를 완료하세요.");
    await addEventsToCalendar(title, document.getElementById('eventDescription').value, cachedDates);
});

document.getElementById('searchBtn').addEventListener('click', async () => {
    const kw = document.getElementById('deleteKeyword').value;
    foundEvents = await searchEvents(kw);
    const resDiv = document.getElementById('searchResultList');
    resDiv.innerHTML = foundEvents.map(e => `[${e.start.date || e.start.dateTime}] ${e.summary}`).join('<br>');
    document.getElementById('bulkDeleteBtn').style.display = foundEvents.length ? 'block' : 'none';
});

document.getElementById('bulkDeleteBtn').addEventListener('click', async () => {
    if(confirm("삭제할까요?")) {
        await deleteEvents(foundEvents.map(e => e.id));
        location.reload();
    }
});

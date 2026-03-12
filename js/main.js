/* main.js - 데이터 유지 및 UI 최적화 버전 */
let cachedDates = [];
let foundEvents = [];

// [중요] 페이지 로드 시 즉시 실행 (가장 먼저 실행되어 빈칸을 채움)
document.addEventListener('DOMContentLoaded', () => {
    const savedId = localStorage.getItem('google_client_id');
    const savedKey = localStorage.getItem('google_api_key');
    
    if (savedId) document.getElementById('clientId').value = savedId;
    if (savedKey) document.getElementById('apiKey').value = savedKey;
});

// 입력 범위 자동 보정
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

// 인증정보 저장 (이걸 한 번 눌러야 다음부터 자동으로 채워집니다)
document.getElementById('saveAuthBtn').addEventListener('click', () => {
    const cid = document.getElementById('clientId').value;
    const akey = document.getElementById('apiKey').value;
    
    if (!cid || !akey) return alert("ID와 Key를 모두 입력해주세요.");
    
    localStorage.setItem('google_client_id', cid);
    localStorage.setItem('google_api_key', akey);
    alert("인증 정보가 저장되었습니다. 반영을 위해 새로고침합니다.");
    location.reload(); 
});

document.getElementById('clearAuthBtn').addEventListener('click', () => {
    localStorage.removeItem('google_client_id');
    localStorage.removeItem('google_api_key');
    document.getElementById('clientId').value = '';
    document.getElementById('apiKey').value = '';
    alert("정보가 삭제되었습니다.");
});

// 미리보기 (연도와 상관없이 올해부터 계산)
document.getElementById('previewBtn').addEventListener('click', () => {
    const month = document.getElementById('lunarMonth').value;
    const day = document.getElementById('lunarDay').value;
    const isLeap = document.getElementById('isLeap').checked;
    const count = parseInt(document.getElementById('repeatYears').value) || 10;

    if (!month || !day) return alert("월과 일을 입력하세요.");

    // calendar.js의 함수 호출
    cachedDates = getSolarDates(null, month, day, isLeap, count);
    document.getElementById('previewList').innerHTML = "<strong>올해(2026년)부터의 변환 결과:</strong><br>" + cachedDates.join('<br>');
});

// 등록 버튼
document.getElementById('syncBtn').addEventListener('click', async () => {
    const title = document.getElementById('eventTitle').value;
    const desc = document.getElementById('eventDescription').value;
    if (!title || cachedDates.length === 0) return alert("제목 입력과 미리보기를 먼저 완료하세요.");
    await addEventsToCalendar(title, desc, cachedDates);
});

// 검색 버튼
document.getElementById('searchBtn').addEventListener('click', async () => {
    const kw = document.getElementById('deleteKeyword').value;
    if (!kw) return alert("검색어를 입력하세요.");
    
    foundEvents = await searchEvents(kw);
    const res = document.getElementById('searchResultList');
    
    if (foundEvents.length === 0) {
        res.innerHTML = "검색 결과가 없습니다.";
        document.getElementById('bulkDeleteBtn').style.display = 'none';
    } else {
        res.innerHTML = `<strong>검색된 일정 (${foundEvents.length}건):</strong><br>` + 
            foundEvents.map(e => `[${e.start.date || e.start.dateTime}] ${e.summary}`).join('<br>');
        document.getElementById('bulkDeleteBtn').style.display = 'block';
    }
});

// 삭제 버튼 (새로고침 없이 UI만 업데이트)
document.getElementById('bulkDeleteBtn').addEventListener('click', async () => {
    if (confirm("검색된 모든 일정을 삭제하시겠습니까?")) {
        const success = await deleteEvents(foundEvents.map(e => e.id));
        if (success) {
            alert("삭제 완료되었습니다.");
            // 새로고침을 하지 않으므로 ID와 Key가 그대로 유지됩니다.
            document.getElementById('searchResultList').innerHTML = "";
            document.getElementById('bulkDeleteBtn').style.display = 'none';
            foundEvents = [];
        }
    }
});

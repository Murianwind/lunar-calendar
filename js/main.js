let cachedDates = [];
let foundEvents = [];

// 페이지 로드 시 저장된 인증 정보만 불러오기
window.addEventListener('load', () => {
    const savedId = localStorage.getItem('google_client_id');
    const savedKey = localStorage.getItem('google_api_key');
    if (savedId) document.getElementById('clientId').value = savedId;
    if (savedKey) document.getElementById('apiKey').value = savedKey;
    
    // [삭제됨] 올해 연도 자동 입력 로직을 제거하여 빈칸으로 유지합니다.
});

// 미리보기 버튼
document.getElementById('previewBtn').addEventListener('click', () => {
    const year = parseInt(document.getElementById('lunarYear').value);
    const month = parseInt(document.getElementById('lunarMonth').value);
    const day = parseInt(document.getElementById('lunarDay').value);
    const isLeap = document.getElementById('isLeap').checked;
    const count = parseInt(document.getElementById('repeatYears').value) || 10;

    // 빈칸 체크 강화
    if (!year || !month || !day) {
        return alert("연도, 월, 일을 모두 입력해주세요.");
    }

    cachedDates = getSolarDates(year, month, day, isLeap, count);
    document.getElementById('previewList').innerHTML = "<strong>양력 변환 결과:</strong><br>" + cachedDates.join('<br>');
});

// ... (이하 인증 저장, 등록, 검색/삭제 로직은 동일)

// 인증정보 저장 버튼
document.getElementById('saveAuthBtn').addEventListener('click', () => {
    const clientId = document.getElementById('clientId').value;
    const apiKey = document.getElementById('apiKey').value;
    if (clientId && apiKey) {
        localStorage.setItem('google_client_id', clientId);
        localStorage.setItem('google_api_key', apiKey);
        alert("인증 정보가 브라우저에 저장되었습니다.");
        location.reload(); // 새로고침하여 API 재초기화
    } else {
        alert("ID와 Key를 모두 입력해주세요.");
    }
});

// 인증정보 삭제 버튼
document.getElementById('clearAuthBtn').addEventListener('click', () => {
    localStorage.removeItem('google_client_id');
    localStorage.removeItem('google_api_key');
    document.getElementById('clientId').value = '';
    document.getElementById('apiKey').value = '';
    alert("저장된 정보가 삭제되었습니다.");
});

document.getElementById('previewBtn').addEventListener('click', () => {
    // 1. 연도 입력값을 가져옵니다.
    const year = parseInt(document.getElementById('lunarYear').value);
    const month = parseInt(document.getElementById('lunarMonth').value);
    const day = parseInt(document.getElementById('lunarDay').value);
    const isLeap = document.getElementById('isLeap').checked;
    const count = parseInt(document.getElementById('repeatYears').value) || 10;

    if (!year || !month || !day) return alert("날짜를 입력하세요.");

    // 2. getSolarDates 함수에 연도(year)를 첫 번째 인자로 전달합니다.
    cachedDates = getSolarDates(year, month, day, isLeap, count);
    
    const previewDiv = document.getElementById('previewList');
    previewDiv.innerHTML = "<strong>변환 결과:</strong><br>" + cachedDates.join('<br>');
});

document.getElementById('syncBtn').addEventListener('click', async () => {
    const title = document.getElementById('eventTitle').value;
    const description = document.getElementById('eventDescription').value;
    if (cachedDates.length === 0) return alert("먼저 미리보기를 하세요.");
    try {
        await addEventsToCalendar(title, description, cachedDates);
    } catch (err) { alert("등록 실패: " + err.message); }
});

document.getElementById('searchBtn').addEventListener('click', async () => {
    const keyword = document.getElementById('deleteKeyword').value;
    if (!keyword) return alert("키워드를 입력하세요.");
    try {
        foundEvents = await searchEvents(keyword);
        const resultDiv = document.getElementById('searchResultList');
        if (foundEvents.length === 0) {
            resultDiv.innerText = "결과 없음";
            document.getElementById('bulkDeleteBtn').style.display = 'none';
        } else {
            resultDiv.innerHTML = foundEvents.map(e => `[${e.start.date || e.start.dateTime}] ${e.summary}`).join('<br>');
            document.getElementById('bulkDeleteBtn').style.display = 'block';
        }
    } catch (err) { alert("검색 실패. 콘솔 확인."); console.error(err); }
});

document.getElementById('bulkDeleteBtn').addEventListener('click', async () => {
    await deleteEvents(foundEvents.map(e => e.id));
    document.getElementById('searchResultList').innerHTML = '';
    document.getElementById('bulkDeleteBtn').style.display = 'none';
});

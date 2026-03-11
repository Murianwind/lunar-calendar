let cachedDates = [];
let foundEvents = [];

// [추가] 페이지 로드 시 저장된 정보가 있으면 불러오기
window.addEventListener('DOMContentLoaded', () => {
    const savedId = localStorage.getItem('google_client_id');
    const savedKey = localStorage.getItem('google_api_key');
    
    if (savedId && savedKey) {
        document.getElementById('clientId').value = savedId;
        document.getElementById('apiKey').value = savedKey;
        document.getElementById('saveInfo').checked = true;
    }
});

// 미리보기 버튼 클릭 이벤트
document.getElementById('previewBtn').addEventListener('click', () => {
    const month = parseInt(document.getElementById('lunarMonth').value);
    const day = parseInt(document.getElementById('lunarDay').value);
    const isLeap = document.getElementById('isLeap').checked;
    const count = parseInt(document.getElementById('repeatYears').value) || 10;

    // 입력 범위 유효성 검사 (HTML에서 막아두었지만 스크립트에서도 한 번 더 확인)
    if (!month || month < 1 || month > 12) return alert("월은 1~12 사이로 입력해주세요.");
    if (!day || day < 1 || day > 31) return alert("일은 1~31 사이로 입력해주세요.");

    cachedDates = getSolarDates(month, day, isLeap, count);
    const previewDiv = document.getElementById('previewList');
    previewDiv.innerHTML = "<strong>변환 결과:</strong><br>" + cachedDates.join('<br>');
});

// 구글 캘린더 등록 버튼 클릭 이벤트
document.getElementById('syncBtn').addEventListener('click', async () => {
    const title = document.getElementById('eventTitle').value;
    const description = document.getElementById('eventDescription').value;
    const clientId = document.getElementById('clientId').value;
    const apiKey = document.getElementById('apiKey').value;
    const shouldSave = document.getElementById('saveInfo').checked;
    
    if (!clientId || !apiKey) return alert("Client ID와 API Key를 입력해주세요.");
    if (cachedDates.length === 0) return alert("먼저 미리보기를 실행하여 양력 날짜를 확인하세요.");
    
    // [추가] 저장 여부에 따라 로컬스토리지 관리
    if (shouldSave) {
        localStorage.setItem('google_client_id', clientId);
        localStorage.setItem('google_api_key', apiKey);
    } else {
        localStorage.removeItem('google_client_id');
        localStorage.removeItem('google_api_key');
    }

    try {
        await addEventsToCalendar(title, description, cachedDates);
    } catch (err) {
        console.error(err);
        alert("등록 중 오류가 발생했습니다. 콘솔을 확인하세요.");
    }
});

// 삭제를 위한 일정 검색 버튼 클릭 이벤트
document.getElementById('searchBtn').addEventListener('click', async () => {
    const keyword = document.getElementById('deleteKeyword').value;
    if (!keyword) return alert("검색할 키워드를 입력하세요.");

    try {
        foundEvents = await searchEvents(keyword);
        const resultDiv = document.getElementById('searchResultList');
        
        if (foundEvents.length === 0) {
            resultDiv.innerText = "일치하는 일정이 없습니다.";
            document.getElementById('bulkDeleteBtn').style.display = 'none';
        } else {
            resultDiv.innerHTML = `<strong>검색 결과 (${foundEvents.length}건):</strong><br>` + 
                foundEvents.map(e => `[${e.start.date || e.start.dateTime}] ${e.summary}`).join('<br>');
            document.getElementById('bulkDeleteBtn').style.display = 'block';
        }
    } catch (err) {
        console.error(err);
        alert("검색 중 오류가 발생했습니다. API 설정과 로그인을 확인하세요.");
    }
});

// 일괄 삭제 실행 버튼 클릭 이벤트
document.getElementById('bulkDeleteBtn').addEventListener('click', async () => {
    const ids = foundEvents.map(e => e.id);
    await deleteEvents(ids);
    document.getElementById('searchResultList').innerHTML = '';
    document.getElementById('bulkDeleteBtn').style.display = 'none';
    foundEvents = [];
});

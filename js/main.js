let cachedDates = [];
let foundEvents = [];

// 페이지 로드 시 저장된 정보 불러오기
window.addEventListener('load', () => {
    const savedId = localStorage.getItem('google_client_id');
    const savedKey = localStorage.getItem('google_api_key');
    if (savedId) document.getElementById('clientId').value = savedId;
    if (savedKey) document.getElementById('apiKey').value = savedKey;
});

// 인증정보 저장 버튼
document.getElementById('saveAuthBtn').addEventListener('click', () => {
    const clientId = document.getElementById('clientId').value;
    const apiKey = document.getElementById('apiKey').value;
    if (clientId && apiKey) {
        localStorage.setItem('google_client_id', clientId);
        localStorage.setItem('google_api_key', apiKey);
        alert("인증 정보가 저장되었습니다.");
        location.reload(); 
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

// 미리보기 버튼
document.getElementById('previewBtn').addEventListener('click', () => {
    const year = document.getElementById('lunarYear').value;
    const month = document.getElementById('lunarMonth').value;
    const day = document.getElementById('lunarDay').value;
    const isLeap = document.getElementById('isLeap').checked;
    const count = parseInt(document.getElementById('repeatYears').value) || 10;

    if (!year || !month || !day) {
        return alert("연도, 월, 일을 모두 입력하세요.");
    }

    cachedDates = getSolarDates(year, month, day, isLeap, count);
    
    const previewDiv = document.getElementById('previewList');
    if (cachedDates.length === 0) {
        previewDiv.innerHTML = "변환 결과가 없습니다. 날짜를 확인하세요.";
    } else {
        previewDiv.innerHTML = "<strong>양력 변환 결과:</strong><br>" + cachedDates.join('<br>');
    }
});

// 구글 등록 버튼
document.getElementById('syncBtn').addEventListener('click', async () => {
    const title = document.getElementById('eventTitle').value;
    const description = document.getElementById('eventDescription').value;
    if (!title) return alert("일정 제목을 입력하세요.");
    if (cachedDates.length === 0) return alert("먼저 미리보기를 하세요.");
    
    try {
        await addEventsToCalendar(title, description, cachedDates);
    } catch (err) { 
        alert("등록 실패: " + err.message); 
    }
});

// 일정 찾기 버튼
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
            resultDiv.innerHTML = `<strong>검색 결과 (${foundEvents.length}건):</strong><br>` + 
                foundEvents.map(e => `[${e.start.date || e.start.dateTime}] ${e.summary}`).join('<br>');
            document.getElementById('bulkDeleteBtn').style.display = 'block';
        }
    } catch (err) { alert("검색 실패"); console.error(err); }
});

// 일괄 삭제 버튼
document.getElementById('bulkDeleteBtn').addEventListener('click', async () => {
    await deleteEvents(foundEvents.map(e => e.id));
    document.getElementById('searchResultList').innerHTML = '';
    document.getElementById('bulkDeleteBtn').style.display = 'none';
});

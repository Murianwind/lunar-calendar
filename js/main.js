let cachedDates = [];
let foundEvents = [];

window.addEventListener('load', () => {
    const savedId = localStorage.getItem('google_client_id');
    const savedKey = localStorage.getItem('google_api_key');
    if (savedId) document.getElementById('clientId').value = savedId;
    if (savedKey) document.getElementById('apiKey').value = savedKey;
});

document.getElementById('saveAuthBtn').addEventListener('click', () => {
    const clientId = document.getElementById('clientId').value;
    const apiKey = document.getElementById('apiKey').value;
    if (clientId && apiKey) {
        localStorage.setItem('google_client_id', clientId);
        localStorage.setItem('google_api_key', apiKey);
        alert("인증 정보 저장 완료");
        location.reload(); 
    } else {
        alert("ID와 Key를 입력하세요.");
    }
});

document.getElementById('clearAuthBtn').addEventListener('click', () => {
    localStorage.removeItem('google_client_id');
    localStorage.removeItem('google_api_key');
    alert("정보 삭제 완료");
    location.reload();
});

document.getElementById('previewBtn').addEventListener('click', () => {
    const year = document.getElementById('lunarYear').value;
    const month = document.getElementById('lunarMonth').value;
    const day = document.getElementById('lunarDay').value;
    const isLeap = document.getElementById('isLeap').checked;
    const count = parseInt(document.getElementById('repeatYears').value) || 10;

    if (!year || !month || !day) {
        alert("연도, 월, 일을 모두 입력하세요.");
        return;
    }

    cachedDates = getSolarDates(year, month, day, isLeap, count);
    
    const previewDiv = document.getElementById('previewList');
    if (cachedDates.length === 0) {
        previewDiv.innerHTML = "변환 실패 (날짜를 확인하세요)";
    } else {
        previewDiv.innerHTML = "<strong>양력 변환 결과:</strong><br>" + cachedDates.join('<br>');
    }
});

document.getElementById('syncBtn').addEventListener('click', async () => {
    const title = document.getElementById('eventTitle').value;
    const description = document.getElementById('eventDescription').value;
    if (!title) return alert("일정 제목을 입력하세요.");
    if (cachedDates.length === 0) return alert("미리보기를 먼저 해주세요.");
    
    try {
        await addEventsToCalendar(title, description, cachedDates);
    } catch (err) { 
        alert("등록 중 오류 발생"); 
    }
});

document.getElementById('searchBtn').addEventListener('click', async () => {
    const keyword = document.getElementById('deleteKeyword').value;
    if (!keyword) return alert("검색어를 입력하세요.");
    try {
        foundEvents = await searchEvents(keyword);
        const resultDiv = document.getElementById('searchResultList');
        if (foundEvents.length === 0) {
            resultDiv.innerText = "검색 결과가 없습니다.";
            document.getElementById('bulkDeleteBtn').style.display = 'none';
        } else {
            resultDiv.innerHTML = `<strong>검색된 일정 (${foundEvents.length}건):</strong><br>` + 
                foundEvents.map(e => `[${e.start.date || e.start.dateTime}] ${e.summary}`).join('<br>');
            document.getElementById('bulkDeleteBtn').style.display = 'block';
        }
    } catch (err) { alert("검색 실패"); }
});

document.getElementById('bulkDeleteBtn').addEventListener('click', async () => {
    if(confirm("정말 모두 삭제하시겠습니까?")) {
        await deleteEvents(foundEvents.map(e => e.id));
        document.getElementById('searchResultList').innerHTML = '';
        document.getElementById('bulkDeleteBtn').style.display = 'none';
    }
});

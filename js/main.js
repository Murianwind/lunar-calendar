// js/main.js
let cachedDates = [];
let foundEvents = [];

// 미리보기 버튼
document.getElementById('previewBtn').addEventListener('click', () => {
    const month = parseInt(document.getElementById('lunarMonth').value);
    const day = parseInt(document.getElementById('lunarDay').value);
    const isLeap = document.getElementById('isLeap').checked;
    const count = parseInt(document.getElementById('repeatYears').value) || 10;

    if (!month || !day) return alert("음력 날짜를 입력하세요.");

    cachedDates = getSolarDates(month, day, isLeap, count);
    const previewDiv = document.getElementById('previewList');
    previewDiv.innerHTML = "<strong>변환 결과:</strong><br>" + cachedDates.join('<br>');
});

// 구글 등록 버튼
document.getElementById('syncBtn').addEventListener('click', async () => {
    const title = document.getElementById('eventTitle').value;
    const description = document.getElementById('eventDescription').value;
    
    if (cachedDates.length === 0) return alert("먼저 미리보기를 실행하세요.");
    
    try {
        await addEventsToCalendar(title, description, cachedDates);
    } catch (err) {
        console.error(err);
        alert("등록 중 오류가 발생했습니다.");
    }
});

// 삭제를 위한 검색 버튼
document.getElementById('searchBtn').addEventListener('click', async () => {
    const keyword = document.getElementById('deleteKeyword').value;
    if (!keyword) return alert("검색할 키워드를 입력하세요.");

    foundEvents = await searchEvents(keyword);
    const resultDiv = document.getElementById('searchResultList');
    
    if (foundEvents.length === 0) {
        resultDiv.innerText = "일치하는 일정이 없습니다.";
        document.getElementById('bulkDeleteBtn').style.display = 'none';
    } else {
        resultDiv.innerHTML = foundEvents.map(e => `[${e.start.date || e.start.dateTime}] ${e.summary}`).join('<br>');
        document.getElementById('bulkDeleteBtn').style.display = 'block';
    }
});

// 일괄 삭제 실행 버튼
document.getElementById('bulkDeleteBtn').addEventListener('click', async () => {
    const ids = foundEvents.map(e => e.id);
    await deleteEvents(ids);
    document.getElementById('searchResultList').innerHTML = '';
    document.getElementById('bulkDeleteBtn').style.display = 'none';
});

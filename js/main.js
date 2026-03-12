/* main.js */
let cachedDates = [];
let foundEvents = [];

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('clientId').value = localStorage.getItem('google_client_id') || '';
    document.getElementById('apiKey').value = localStorage.getItem('google_api_key') || '';
});

// 입력 범위 보정
document.getElementById('lunarMonth').addEventListener('blur', function() {
    let val = parseInt(this.value);
    if (val < 1) this.value = 1; if (val > 12) this.value = 12;
});
document.getElementById('lunarDay').addEventListener('blur', function() {
    let val = parseInt(this.value);
    if (val < 1) this.value = 1; if (val > 31) this.value = 31;
});

// 인증 정보 저장/삭제
document.getElementById('saveAuthBtn').addEventListener('click', () => {
    localStorage.setItem('google_client_id', document.getElementById('clientId').value);
    localStorage.setItem('google_api_key', document.getElementById('apiKey').value);
    alert("인증 정보가 저장되었습니다.");
});
document.getElementById('clearAuthBtn').addEventListener('click', () => {
    localStorage.removeItem('google_client_id'); localStorage.removeItem('google_api_key');
    location.reload();
});

// 미리보기
document.getElementById('previewBtn').addEventListener('click', () => {
    const month = document.getElementById('lunarMonth').value;
    const day = document.getElementById('lunarDay').value;
    const isLeap = document.getElementById('isLeap').checked;
    const count = parseInt(document.getElementById('repeatYears').value) || 10;
    if (!month || !day) return alert("월과 일을 입력하세요.");
    cachedDates = getSolarDates(null, month, day, isLeap, count);
    document.getElementById('previewList').innerHTML = "<strong>올해부터의 변환 결과:</strong><br>" + cachedDates.join('<br>');
});

// [수정] 등록 버튼 이벤트 - 상태 메시지 및 버튼 비활성화 적용
document.getElementById('syncBtn').addEventListener('click', async () => {
    const title = document.getElementById('eventTitle').value;
    const desc = document.getElementById('eventDescription').value;
    const btn = document.getElementById('syncBtn');
    const status = document.getElementById('syncStatus');

    if (!title || cachedDates.length === 0) return alert("제목과 미리보기를 확인하세요.");

    // 진행 상태 표시
    btn.disabled = true;
    status.innerText = "⏳ 등록 중...";

    try {
        await addEventsToCalendar(title, desc, cachedDates);
        alert("모든 일정이 등록되었습니다.");
    } catch (err) {
        alert("등록 중 오류가 발생했습니다.");
    } finally {
        // 원래 상태로 복구
        status.innerText = "";
        btn.disabled = false;
    }
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

// [수정] 삭제 버튼 이벤트 - 상태 메시지 및 버튼 비활성화 적용
document.getElementById('bulkDeleteBtn').addEventListener('click', async () => {
    if (!confirm("검색된 모든 일정을 삭제하시겠습니까?")) return;

    const btn = document.getElementById('bulkDeleteBtn');
    const status = document.getElementById('deleteStatus');

    // 진행 상태 표시
    btn.disabled = true;
    status.innerText = "⏳ 삭제 중...";

    try {
        await deleteEvents(foundEvents.map(e => e.id));
        alert("삭제가 완료되었습니다.");
        document.getElementById('searchResultList').innerHTML = "";
        btn.style.display = 'none';
        foundEvents = [];
    } catch (err) {
        alert("삭제 중 오류가 발생했습니다.");
    } finally {
        status.innerText = "";
        btn.disabled = false;
    }
});

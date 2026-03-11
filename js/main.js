// js/main.js
document.getElementById('convertBtn').addEventListener('click', () => {
    // 1. 입력값 가져오기
    const title = document.getElementById('eventTitle').value;
    const month = parseInt(document.getElementById('lunarMonth').value);
    const day = parseInt(document.getElementById('lunarDay').value);
    const isLeap = document.getElementById('isLeap').checked;
    const count = parseInt(document.getElementById('repeatYears').value) || 10;

    // 2. 유효성 검사
    if (!title) {
        alert("일정 제목을 입력해주세요!");
        return;
    }
    if (isNaN(month) || isNaN(day)) {
        alert("정확한 음력 월/일을 입력해주세요!");
        return;
    }

    // 3. calendar.js의 함수를 이용해 양력 날짜들 계산
    const dates = getSolarDates(month, day, isLeap, count);
    
    // 4. 화면에 결과 출력
    const listEl = document.getElementById('dateList');
    listEl.innerHTML = ''; // 이전 목록 초기화
    
    dates.forEach(date => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <span><strong>${title}</strong></span>
            <span class="badge bg-info text-dark">${date} (양력)</span>
        `;
        listEl.appendChild(li);
    });
    
    // 5. 미리보기 영역 보이기
    document.getElementById('previewSection').classList.remove('d-none');
});

// js/main.js 하단부 수정

document.getElementById('syncBtn').addEventListener('click', async () => {
    const title = document.getElementById('eventTitle').value;
    const month = parseInt(document.getElementById('lunarMonth').value);
    const day = parseInt(document.getElementById('lunarDay').value);
    const isLeap = document.getElementById('isLeap').checked;
    const count = parseInt(document.getElementById('repeatYears').value) || 10;

    // 미리보기 목록에 있는 날짜들을 다시 가져옴
    const dates = getSolarDates(month, day, isLeap, count);

    if (dates.length === 0) {
        alert("먼저 양력 변환을 실행해주세요.");
        return;
    }

    // 구글 등록 함수 호출
    try {
        await addEventsToCalendar(title, dates);
    } catch (error) {
        console.error(error);
        alert("등록 중 오류가 발생했습니다. API 키와 클라이언트 ID를 확인해주세요.");
    }
});

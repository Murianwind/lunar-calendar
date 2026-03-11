// js/calendar.js
function getSolarDates(month, day, isLeap, count = 10) {
    // 라이브러리 로드 확인
    if (!window.KoreanLunarCalendar) {
        console.error("음력 변환 라이브러리가 로드되지 않았습니다.");
        return [];
    }

    const calendar = new window.KoreanLunarCalendar();
    const currentYear = new Date().getFullYear();
    const results = [];

    // 올해부터 사용자가 지정한 횟수(count)만큼 연도를 올리며 계산
    for (let i = 0; i < count; i++) {
        const targetYear = currentYear + i;
        
        // 음력 날짜를 설정 (윤달 여부 포함)
        calendar.setLunarDate(targetYear, month, day, isLeap);
        
        // 양력 변환 결과 가져오기
        const solar = calendar.getSolarCalendar();
        
        // 날짜 형식을 YYYY-MM-DD 형태로 저장
        const formattedDate = `${solar.year}-${String(solar.month).padStart(2, '0')}-${String(solar.day).padStart(2, '0')}`;
        results.push(formattedDate);
    }
    
    return results;
}

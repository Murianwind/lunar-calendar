// js/calendar.js
function getSolarDates(month, day, isLeap, count = 10) {
    const calendar = new window.KoreanLunarCalendar();
    const currentYear = new Date().getFullYear();
    const results = [];

    for (let i = 0; i < count; i++) {
        const targetYear = currentYear + i; // 올해부터 시작해서 한 해씩 증가
        
        // 해당 연도의 음력 날짜를 양력으로 변환
        calendar.setLunarDate(targetYear, month, day, isLeap);
        const solar = calendar.getSolarCalendar();
        
        results.push(`${solar.year}-${String(solar.month).padStart(2, '0')}-${String(solar.day).padStart(2, '0')}`);
    }
    return results;
}

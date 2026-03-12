function getSolarDates(year, month, day, isLeap, count) {
    const dates = [];
    // 라이브러리 객체 호출 (가장 안정적인 방식)
    const LunarClass = window.KoreanLunarCalendar || window.koreanLunarCalendar;
    
    if (!LunarClass) {
        alert("라이브러리 로드 실패! 새로고침 후 다시 시도하세요.");
        return [];
    }

    const lunar = new LunarClass();
    // 입력한 연도와 상관없이, 목록은 '올해(2026년)'부터 생성합니다.
    const startYear = new Date().getFullYear();

    for (let i = 0; i < count; i++) {
        const currentYear = startYear + i; 
        const currentMonth = Number(month);
        const currentDay = Number(day);
        
        lunar.setLunarDate(currentYear, currentMonth, currentDay, isLeap);
        const solar = lunar.getSolarCalendar();
        
        if (solar.year && solar.year !== 0) {
            const y = solar.year;
            const m = String(solar.month).padStart(2, '0');
            const d = String(solar.day).padStart(2, '0');
            dates.push(`${y}-${m}-${d}`);
        }
    }
    return dates;
}

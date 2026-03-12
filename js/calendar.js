function getSolarDates(year, month, day, isLeap, count) {
    const dates = [];
    
    // 라이브러리 객체 확인 (대소문자 무관하게 작동하도록 설정)
    const LunarClass = window.KoreanLunarCalendar || window.koreanLunarCalendar;
    
    if (!LunarClass) {
        alert("음력 변환 라이브러리를 불러오지 못했습니다. 네트워크 상태를 확인하세요.");
        return [];
    }

    const lunar = new LunarClass();

    for (let i = 0; i < count; i++) {
        const currentYear = Number(year) + i;
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

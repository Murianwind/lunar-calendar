function getSolarDates(year, month, day, isLeap, count) {
    const dates = [];
    
    // 라이브러리가 전역(window)에 로드되었는지 더 정확하게 확인
    const LunarLib = window.koreanLunarCalendar;

    if (!LunarLib) {
        alert("음력 변환 라이브러리를 아직 불러오는 중이거나 실패했습니다. 잠시 후 다시 시도해주세요.");
        return [];
    }

    const lunar = new LunarLib();

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

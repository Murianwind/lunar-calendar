function getSolarDates(year, month, day, isLeap, count) {
    const dates = [];
    
    // 라이브러리 로드 여부 체크
    if (typeof koreanLunarCalendar === 'undefined') {
        alert("라이브러리 로드 실패! 페이지를 새로고침(Ctrl+F5) 해주세요.");
        return [];
    }

    const lunar = new koreanLunarCalendar();

    for (let i = 0; i < count; i++) {
        // 입력받은 연도(year)에 i를 더해 매년 날짜 계산
        const currentYear = parseInt(year) + i;
        const currentMonth = parseInt(month);
        const currentDay = parseInt(day);
        
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

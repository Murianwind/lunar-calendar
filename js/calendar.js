function getSolarDates(year, month, day, isLeap, count) {
    const dates = [];
    
    // 라이브러리 로드 확인
    if (typeof koreanLunarCalendar === 'undefined') {
        alert("음력 변환 라이브러리가 로드되지 않았습니다. 순서를 확인하세요.");
        return [];
    }

    const lunar = new koreanLunarCalendar();

    for (let i = 0; i < count; i++) {
        // 입력받은 연도에 i를 더해 매년 음력을 양력으로 계산
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

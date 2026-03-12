function getSolarDates(year, month, day, isLeap, count) {
    const dates = [];
    // 예전 방식으로 복구
    const lunar = new koreanLunarCalendar();

    for (let i = 0; i < count; i++) {
        // 입력받은 연도를 숫자로 변환하여 i만큼 더함
        const currentYear = Number(year) + i;
        
        lunar.setLunarDate(currentYear, month, day, isLeap);
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

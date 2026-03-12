function getSolarDates(year, month, day, isLeap, count) {
    const dates = [];
    // 잘 되던 예전 방식으로 원복
    const lunar = new koreanLunarCalendar();

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

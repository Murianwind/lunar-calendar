function getSolarDates(month, day, isLeap, count = 10) {
    const calendar = new window.KoreanLunarCalendar();
    const currentYear = new Date().getFullYear();
    const results = [];

    for (let i = 0; i < count; i++) {
        const targetYear = currentYear + i;
        calendar.setLunarDate(targetYear, month, day, isLeap);
        const solar = calendar.getSolarCalendar();
        results.push(`${solar.year}-${String(solar.month).padStart(2, '0')}-${String(solar.day).padStart(2, '0')}`);
    }
    return results;
}

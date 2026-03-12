function getSolarDates(year, month, day, isLeap, count) {
    const dates = [];
    const lunar = new koreanLunarCalendar(); // 라이브러리 객체 생성

    // 라이브러리가 로드되었는지 확인
    if (typeof koreanLunarCalendar === 'undefined') {
        console.error("음력 변환 라이브러리가 로드되지 않았습니다.");
        return ["라이브러리 로드 오류"];
    }

    for (let i = 0; i < count; i++) {
        const currentYear = year + i;
        // 라이브러리에 연, 월, 일, 윤달 여부 전달
        lunar.setLunarDate(currentYear, month, day, isLeap);
        
        // 양력 변환 결과 가져오기
        const solar = lunar.getSolarCalendar();
        
        // 결과가 비정상적일 경우(0-00-00 방지)를 대비한 포맷팅
        const y = solar.year;
        const m = String(solar.month).padStart(2, '0');
        const d = String(solar.day).padStart(2, '0');
        
        if (y === 0) {
            dates.push(`${currentYear}년: 데이터 없음 (날짜 확인 필요)`);
        } else {
            dates.push(`${y}-${m}-${d}`);
        }
    }
    return dates;
}

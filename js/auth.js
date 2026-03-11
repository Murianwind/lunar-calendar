// js/auth.js

let gapiInited = false;
let gisInited = false;
let tokenClient;

// 1. Google API 초기화
function gapiLoaded() {
    gapi.load('client', intializeGapiClient);
}

async function intializeGapiClient() {
    const apiKey = document.getElementById('apiKey').value;
    if (!apiKey) return;

    await gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    });
    gapiInited = true;
}

// 2. Google Identity Services(GIS) 초기화
function gisLoaded() {
    const clientId = document.getElementById('clientId').value;
    if (!clientId) return;

    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/calendar.events',
        callback: '', // 나중에 정의
    });
    gisInited = true;
}

// 3. 실제 일정 등록 함수
async function addEventsToCalendar(title, dates) {
    if (!gapiInited || !gisInited) {
        // 입력된 키로 실시간 초기화 시도
        await intializeGapiClient();
        gisLoaded();
    }

    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) throw (resp);

        // 변환된 모든 날짜를 순회하며 등록
        for (const date of dates) {
            const event = {
                'summary': title,
                'start': { 'date': date }, // 하루 종일 이벤트
                'end': { 'date': date }
            };

            await gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': event,
            });
        }
        alert(dates.length + "개의 일정이 구글 캘린더에 등록되었습니다!");
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        tokenClient.requestAccessToken({prompt: ''});
    }
}

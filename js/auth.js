/* auth.js - 토큰 재사용 로직 적용 */
let tokenClient;
let gapiInited = false;
let gisInited = false;

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    const apiKey = localStorage.getItem('google_api_key');
    await gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    });
    gapiInited = true;
}

function gisLoaded() {
    const clientId = localStorage.getItem('google_client_id');
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/calendar',
        callback: '', // main.js에서 실행 시 결정
    });
    gisInited = true;
}

/**
 * 인증 토큰을 가져오는 핵심 함수
 * 이미 토큰이 있으면 로그인 창을 띄우지 않음
 */
function getAccessToken(callback) {
    // 이미 토큰이 유효한지 체크
    const token = gapi.client.getToken();
    if (token) {
        callback(token);
    } else {
        // 토큰이 없거나 만료된 경우에만 로그인 창 표시
        tokenClient.callback = (resp) => {
            if (resp.error) throw resp;
            callback(gapi.client.getToken());
        };
        tokenClient.requestAccessToken({ prompt: 'consent' });
    }
}

// 일정 등록 함수
async function addEventsToCalendar(title, description, dates) {
    getAccessToken(async () => {
        for (const date of dates) {
            const event = {
                'summary': title,
                'description': description,
                'start': { 'date': date },
                'end': { 'date': date }
            };
            await gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': event
            });
        }
        alert("모든 일정이 등록되었습니다.");
    });
}

// 일정 검색 함수
async function searchEvents(keyword) {
    return new Promise((resolve) => {
        getAccessToken(async () => {
            const response = await gapi.client.calendar.events.list({
                'calendarId': 'primary',
                'q': keyword,
                'timeMin': (new Date()).toISOString(),
                'showDeleted': false,
                'singleEvents': true
            });
            resolve(response.result.items);
        });
    });
}

// 일정 삭제 함수
async function deleteEvents(eventIds) {
    return new Promise((resolve) => {
        getAccessToken(async () => {
            for (const id of eventIds) {
                await gapi.client.calendar.events.delete({
                    'calendarId': 'primary',
                    'eventId': id
                });
            }
            alert("일괄 삭제 완료");
            resolve();
        });
    });
}

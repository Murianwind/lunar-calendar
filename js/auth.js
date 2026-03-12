/* auth.js - 인증 세션 유지 및 팝업 차단 버전 */
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
        callback: '', // 호출 시점에 정의
    });
    gisInited = true;
}

/**
 * 인증 토큰을 가져오는 함수
 * 이미 토큰이 있으면 팝업을 띄우지 않습니다.
 */
function getAccessToken(callback) {
    const token = gapi.client.getToken();
    if (token && token.access_token) {
        // 이미 토큰이 있으면 즉시 실행
        callback();
    } else {
        // 토큰이 없을 때만 딱 한 번 팝업을 띄움
        tokenClient.callback = (resp) => {
            if (resp.error) return console.error(resp);
            callback();
        };
        // prompt: 'consent'를 제거하여 반복 팝업 방지
        tokenClient.requestAccessToken({ prompt: '' });
    }
}

// 일정 등록 함수
async function addEventsToCalendar(title, description, dates) {
    getAccessToken(async () => {
        try {
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
        } catch (err) {
            console.error(err);
            alert("등록 중 오류가 발생했습니다.");
        }
    });
}

// 일정 검색 함수
async function searchEvents(keyword) {
    return new Promise((resolve) => {
        getAccessToken(async () => {
            try {
                const response = await gapi.client.calendar.events.list({
                    'calendarId': 'primary',
                    'q': keyword,
                    'timeMin': (new Date()).toISOString(),
                    'showDeleted': false,
                    'singleEvents': true
                });
                resolve(response.result.items || []);
            } catch (err) {
                console.error(err);
                resolve([]);
            }
        });
    });
}

// 일정 삭제 함수
async function deleteEvents(eventIds) {
    return new Promise((resolve) => {
        getAccessToken(async () => {
            try {
                for (const id of eventIds) {
                    await gapi.client.calendar.events.delete({
                        'calendarId': 'primary',
                        'eventId': id
                    });
                }
                alert("일괄 삭제가 완료되었습니다.");
                resolve();
            } catch (err) {
                console.error(err);
                alert("삭제 중 오류가 발생했습니다.");
                resolve();
            }
        });
    });
}

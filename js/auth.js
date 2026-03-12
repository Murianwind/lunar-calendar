/* auth.js - 인증 세션 유지 버전 */
let tokenClient;
let gapiInited = false;
let gisInited = false;

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    const apiKey = localStorage.getItem('google_api_key');
    if (!apiKey) return; 

    await gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    });
    gapiInited = true;
}

function gisLoaded() {
    const clientId = localStorage.getItem('google_client_id');
    if (!clientId) return;

    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/calendar',
        callback: '', 
    });
    gisInited = true;
}

// 토큰이 있으면 팝업을 띄우지 않는 핵심 함수
function getAccessToken(callback) {
    const token = gapi.client.getToken();
    if (token && token.access_token) {
        callback();
    } else {
        tokenClient.callback = (resp) => {
            if (resp.error) return console.error(resp);
            callback();
        };
        // prompt: 'consent'를 빼서 이미 로그인 된 경우 팝업 없이 진행
        tokenClient.requestAccessToken({ prompt: '' });
    }
}

async function addEventsToCalendar(title, description, dates) {
    getAccessToken(async () => {
        try {
            for (const date of dates) {
                await gapi.client.calendar.events.insert({
                    'calendarId': 'primary',
                    'resource': {
                        'summary': title,
                        'description': description,
                        'start': { 'date': date },
                        'end': { 'date': date }
                    }
                });
            }
            alert("모든 일정이 등록되었습니다.");
        } catch (err) {
            alert("등록 실패: " + err.message);
        }
    });
}

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
                resolve([]);
            }
        });
    });
}

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
                resolve(true); 
            } catch (err) {
                console.error(err);
                resolve(false);
            }
        });
    });
}

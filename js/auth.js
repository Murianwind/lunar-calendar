let gapiInited = false;
let gisInited = false;
let tokenClient;

function gapiLoaded() { gapi.load('client', intializeGapiClient); }

async function intializeGapiClient() {
    const apiKey = document.getElementById('apiKey').value || localStorage.getItem('google_api_key');
    if (!apiKey) return;
    try {
        await gapi.client.init({
            apiKey: apiKey,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        });
        gapiInited = true;
    } catch (e) { console.error("GAPI 초기화 실패", e); }
}

function gisLoaded() {
    const clientId = document.getElementById('clientId').value || localStorage.getItem('google_client_id');
    if (!clientId) return;
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/calendar.events',
        callback: '', 
    });
    gisInited = true;
}

// 공통 인증 체크 함수
async function ensureAuthenticated() {
    if (!gapiInited) await intializeGapiClient();
    if (!gisInited) gisLoaded();

    return new Promise((resolve) => {
        if (gapi.client.getToken() === null) {
            tokenClient.callback = (resp) => {
                if (resp.error !== undefined) throw (resp);
                resolve(true);
            };
            tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
            resolve(true);
        }
    });
}

async function addEventsToCalendar(title, description, dates) {
    await ensureAuthenticated();
    for (const date of dates) {
        await gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': {
                'summary': title,
                'description': description,
                'start': { 'date': date },
                'end': { 'date': date }
            },
        });
    }
    alert(dates.length + "개의 일정이 등록되었습니다!");
}

async function searchEvents(keyword) {
    await ensureAuthenticated(); // 검색 전 인증 확인
    const response = await gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'q': keyword,
        'singleEvents': true
    });
    return response.result.items || [];
}

async function deleteEvents(eventIds) {
    if (!confirm(eventIds.length + "개의 일정을 삭제하시겠습니까?")) return;
    for (const id of eventIds) {
        await gapi.client.calendar.events.delete({ 'calendarId': 'primary', 'eventId': id });
    }
    alert("삭제가 완료되었습니다.");
}

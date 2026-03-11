// js/auth.js
let gapiInited = false;
let gisInited = false;
let tokenClient;

function gapiLoaded() { gapi.load('client', intializeGapiClient); }
async function intializeGapiClient() {
    const apiKey = document.getElementById('apiKey').value;
    if (!apiKey) return;
    await gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    });
    gapiInited = true;
}

function gisLoaded() {
    const clientId = document.getElementById('clientId').value;
    if (!clientId) return;
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/calendar.events',
        callback: '', 
    });
    gisInited = true;
}

// 등록 함수 (설명 필드 추가됨)
async function addEventsToCalendar(title, description, dates) {
    if (!gapiInited || !gisInited) {
        await intializeGapiClient();
        gisLoaded();
    }

    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) throw (resp);
        for (const date of dates) {
            const event = {
                'summary': title,
                'description': description, // 사용자가 입력한 키워드가 들어감
                'start': { 'date': date },
                'end': { 'date': date }
            };
            await gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': event,
            });
        }
        alert(dates.length + "개의 일정이 등록되었습니다!");
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        tokenClient.requestAccessToken({prompt: ''});
    }
}

// 검색 함수
async function searchEvents(keyword) {
    const response = await gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'q': keyword,
        'singleEvents': true
    });
    return response.result.items || [];
}

// 삭제 함수
async function deleteEvents(eventIds) {
    if (!confirm(eventIds.length + "개의 일정을 삭제하시겠습니까?")) return;
    for (const id of eventIds) {
        await gapi.client.calendar.events.delete({
            'calendarId': 'primary',
            'eventId': id
        });
    }
    alert("삭제가 완료되었습니다.");
}

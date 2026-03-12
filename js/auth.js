/* auth.js */
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

function getAccessToken(callback) {
    const token = gapi.client.getToken();
    if (token && token.access_token) {
        callback();
    } else {
        tokenClient.callback = (resp) => {
            if (resp.error) return console.error(resp);
            callback();
        };
        tokenClient.requestAccessToken({ prompt: '' });
    }
}

// [수정] Promise를 반환하여 호출 측에서 기다릴 수 있게 함
async function addEventsToCalendar(title, description, dates) {
    return new Promise((resolve, reject) => {
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
                resolve();
            } catch (err) {
                reject(err);
            }
        });
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
    return new Promise((resolve, reject) => {
        getAccessToken(async () => {
            try {
                for (const id of eventIds) {
                    await gapi.client.calendar.events.delete({
                        'calendarId': 'primary',
                        'eventId': id
                    });
                }
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    });
}

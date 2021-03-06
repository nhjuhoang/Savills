import Types from './';
import Configs from '../../../utils/linkApi';

export function getMyEvents(accessTokenAPI, buildingId, language = vi) {
    return {
        type: Types.GET_MY_EVENTS,
        payload: {
            api: Configs.API_BOOKING + `/api/events/myevents?buildingId=${buildingId}&culture=${language}`,
            method: 'GET',
            token: accessTokenAPI,
        }
    }
}

export function getMyEventsOfDate(accessTokenAPI, buildingId, date) {
    return {
        type: Types.GET_EVENTS_OF_DATE,
        payload: {
            api: Configs.API_BOOKING + `/api/events/myevents?buildingId=${buildingId}&fromDate=${date}&toDate=${date}`,
            method: 'GET',
            token: accessTokenAPI,
        }
    }
}

export function getOverviewMyEvents(accessTokenAPI, fromDate, toDate) {
    return {
        type: Types.GET_OVERVIEW,
        payload: {
            api: Configs.API_BOOKING + `/api/events/overview?fromDate=${fromDate}&toDate=${toDate}`,
            method: 'GET',
            token: accessTokenAPI,
        }
    }
}

export function getDetail(accessTokenAPI, eventID) {
    return {
        type: Types.GET_DETAIL,
        payload: {
            api: Configs.API_BOOKING + `/api/events/eventId?eventId=${eventID}`,
            method: 'GET',
            token: accessTokenAPI,
        }
    }
}





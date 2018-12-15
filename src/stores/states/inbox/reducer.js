import Types from './';
import createReducer from '../';

const INIT_STATE = ({
    listInbox: { items: [], success: false, totalCount: null },
    listInboxIsActive: { items: [], success: false, totalCount: null },
    setInboxActive: false,
    statusSetinbox: 0,
    detailInbox: {},
    setRead: {}
});

export default createReducer(INIT_STATE, {

    [Types.GET_LIST_INBOX]: (state, action) => {
        try {
            return {
                ...state
            };
        } catch (error) {
            console.log(error)
        }

    },

    [Types.GET_LIST_INBOX_SUCCESS]: (state, action) => {
        try {
            let tempState;
            tempState = Object.assign(
                {},
                { ...state },
                {
                    listInbox: {
                        items: action.response.result.items,
                        success: action.response.success,
                        totalCount: action.response.result.totalCount
                    },
                },
            );
            return tempState;
        } catch (error) {
            console.log(error)
        }

    },

    [Types.GET_LIST_INBOX_FAIL]: (state, action) => {
        try {
            return {
                ...state,
                listInbox: {},
            };
        } catch (error) {
            console.log(error)
        }
    },

    [Types.GET_LIST_INBOX_ISACTIVE]: (state, action) => {
        try {
            return {
                ...state
            };
        } catch (error) {
            console.log(error)
        }

    },

    [Types.GET_LIST_INBOX_ISACTIVE_SUCCESS]: (state, action) => {
        try {
            let tempState;
            tempState = Object.assign(
                {},
                { ...state },
                {
                    listInboxIsActive: {
                        items: action.response.result.items,
                        success: action.response.success,
                        totalCount: action.response.result.totalCount
                    },
                },
            );
            return tempState;
        } catch (error) {
            console.log(error)
        }

    },

    [Types.GET_LIST_INBOX_ISACTIVE_FAIL]: (state, action) => {
        try {
            return {
                ...state,
                listInboxIsActive: {},
            };
        } catch (error) {
            console.log(error)
        }
    },



    [Types.SET_INBOX_ACTIVE]: (state, action) => {
        try {
            return {
                ...state,
                setInboxActive: false
            };
        } catch (error) {
            console.log(error)
        }

    },

    [Types.SET_INBOX_ACTIVE_SUCCESS]: (state, action) => {
        try {
            let tempState;
            tempState = Object.assign(
                {},
                { ...state },
                {
                    setInboxActive: action.response.success,
                },
            );
            return tempState;
        } catch (error) {
            console.log(error)
        }

    },

    [Types.SET_INBOX_ACTIVE_FAIL]: (state, action) => {
        try {
            return {
                ...state,
                setInboxActive: false,
            };
        } catch (error) {
            console.log(error)
        }
    },



    [Types.GET_DETAIL]: (state, action) => {
        try {
            return {
                ...state,
            };
        } catch (error) {
            console.log(error)
        }

    },

    [Types.GET_DETAIL_SUCCESS]: (state, action) => {
        try {
            let tempState;
            tempState = Object.assign(
                {},
                { ...state },
                {
                    detailInbox: action.response,
                },
            );
            return tempState;
        } catch (error) {
            console.log(error)
        }

    },

    [Types.GET_DETAIL_FAIL]: (state, action) => {
        try {
            return {
                ...state,
                detailInbox: {},
            };
        } catch (error) {
            console.log(error)
        }
    },


    [Types.SET_READ_INBOX]: (state, action) => {
        try {
            return {
                ...state,
            };
        } catch (error) {
            console.log(error)
        }

    },

    [Types.SET_READ_INBOX_SUCCESS]: (state, action) => {
        try {
            let tempState;
            tempState = Object.assign(
                {},
                { ...state },
                {
                    setRead: action.response,
                },
            );
            return tempState;
        } catch (error) {
            console.log(error)
        }

    },

    [Types.SET_READ_INBOX_FAIL]: (state, action) => {
        try {
            return {
                ...state,
                setRead: {},
            };
        } catch (error) {
            console.log(error)
        }
    },

});
import Types from './';
import createReducer from '../';

const INIT_STATE = ({
    accessToken: '',
    accessTokenAPI: '',
    encToken: '',
    tenant: [],
    tenantLocal: {},
    success: null,
    error: null,
    switchAccount: {},
    linkedAccountAuthenticate: {},
    resetPassword: {},
    changePassword: {},
    sendCodeVerify: {},
    userSettings: {},
    isGetAccessToken: true,
    isGetTenant: true,
    isGetAccessTokenAPI: true,
    isGetSwichToUserAccount: true,
    isSendCodeVerify: true
});

export default createReducer(INIT_STATE, {

    // !LOGIN
    [Types.LOGIN]: (state, action) => {
        return {
            ...state,
        };
    },

    [Types.LOGIN_SUCCESS]: (state, action) => {
        // console.log('LOGIN_SUCCESS__', action)
        try {
            return {
                ...state,
                accessToken: action.response.result && action.response.result.accessToken || '',
                success: action.response.success,
                error: action.response.error,
                isGetAccessToken: false
            };
        } catch (error) {
            console.log(error);
        }

    },

    [Types.LOGIN_FAIL]: (state, action) => {
        return {
            ...state,
            accessToken: '',
            success: null,
            error: null
        };
    },

    // !GET_TENANT
    [Types.GET_TENANT]: (state, action) => {
        return {
            ...state,
            isGetAccessToken: true
        };
    },

    [Types.GET_TENANT_SUCCESS]: (state, action) => {
        return {
            ...state,
            tenant: action.response.result && action.response.result || [],
            isGetTenant: false
        };
    },

    [Types.GET_TENANT_FAIL]: (state, action) => {
        return {
            ...state,
            tenant: []
        };
    },

    // !GET_SWITCH TO USER ACCOUNT
    [Types.GET_SWITCHTOUSERACCOUNT]: (state, action) => {
        return {
            ...state,
            isGetTenant: true
        };
    },

    [Types.GET_SWITCHTOUSERACCOUNT_SUCCESS]: (state, action) => {
        return {
            ...state,
            switchAccount: action.response,
            isGetSwichToUserAccount: false
        };
    },

    [Types.GET_SWITCHTOUSERACCOUNT_FAIL]: (state, action) => {
        return {
            ...state,
            tenant: []
        };
    },

    // ! LINKEDACCOUNTAUTHEN
    [Types.LINKEDACCOUNTAUTHEN]: (state, action) => {
        return {
            ...state,
            isGetSwichToUserAccount: true
        };
    },

    [Types.LINKEDACCOUNTAUTHEN_SUCCESS]: (state, action) => {
        try {
            return {
                ...state,
                linkedAccountAuthenticate: action.response && action.response || {},
                isGetAccessTokenAPI: false
            };
        } catch (error) {
            console.log(error);
        }

    },

    [Types.LINKEDACCOUNTAUTHEN_FAIL]: (state, action) => {
        return {
            ...state,
            linkedAccountAuthenticate: {},
        };
    },


    // ! SEND CODE RESET PASS
    [Types.SENDCODERESETPASS]: (state, action) => {
        return {
            ...state,
        };
    },

    [Types.SENDCODERESETPASS_SUCCESS]: (state, action) => {
        // console.log('SENDCODERESETPASS_SUCCESS______', action)
        try {
            return {
                ...state,
                sendCodeVerify: action.response,
                isSendCodeVerify: false
            };
        } catch (error) {
            console.log(error);
        }

    },

    [Types.SENDCODERESETPASS_FAIL]: (state, action) => {
        return {
            ...state,
        };
    },

    // ! RESET PASSWORD
    [Types.RESETPASSWORD]: (state, action) => {
        return {
            ...state,
            isSendCodeVerify: true
        };
    },

    [Types.RESETPASSWORD_SUCCESS]: (state, action) => {
        // console.log('RESETPASSWORD_SUCCESS______', action)
        try {
            return {
                ...state,
                resetPassword: action.response
            };
        } catch (error) {
            console.log(error);
        }

    },

    [Types.RESETPASSWORD_FAIL]: (state, action) => {
        return {
            ...state,
        };
    },


    // ! GET USER_SETTING
    [Types.USER_SETTING]: (state, action) => {
        return {
            ...state,
        };
    },

    [Types.USER_SETTING_SUCCESS]: (state, action) => {
        // console.log('USER_SETTING_SUCCESS______', action)
        try {
            return {
                ...state,
                userSettings: action.response
            };
        } catch (error) {
            console.log(error);
        }

    },

    [Types.USER_SETTING_FAIL]: (state, action) => {
        return {
            ...state,
        };
    },


    // ! CHANGE PASSWORD
    [Types.CHANGE_PASSWORD]: (state, action) => {
        return {
            ...state,
        };
    },

    [Types.CHANGE_PASSWORD_SUCCESS]: (state, action) => {
        console.log('CHANGE_PASSWORD_SUCCESS______', action)
        try {
            return {
                ...state,
                changePassword: action.response
            };
        } catch (error) {
            console.log(error);
        }

    },

    [Types.CHANGE_PASSWORD_FAIL]: (state, action) => {
        return {
            ...state,
        };
    },




    // !   SET_IS_GETACCESSTOKEN_API
    [Types.SET_IS_GETACCESSTOKEN_API]: (state, action) => {
        return {
            ...state,
            isGetAccessTokenAPI: action.payload
        };
    },


    // !SET = Get ACCESSTOKEN
    [Types.SET_ACCESSTOKEN_SUCCESS]: (state, action) => {
        let tempState = Object.assign({}, { ...state },
            { accessToken: action.payload });
        return tempState;
    },



    [Types.GET_ACCESSTOKEN_SUCCESS]: (state, action) => {
        let tempState = Object.assign({}, { ...state },
            { accessToken: action.payload });
        return tempState;
    },

    // !SET = Get ACCESSTOKEN API
    [Types.SET_ACCESSTOKEN_API_SUCCESS]: (state, action) => {
        let tempState = Object.assign({}, { ...state },
            { accessTokenAPI: action.payload });
        return tempState;
    },

    [Types.GET_ACCESSTOKEN_API_SUCCESS]: (state, action) => {
        let tempState = Object.assign({}, { ...state },
            { accessTokenAPI: action.payload });
        return tempState;
    },

    // !SET = Get encToken 
    [Types.SET_ENC_TOKEN_SUCCESS]: (state, action) => {
        let tempState = Object.assign({}, { ...state },
            { encToken: action.payload });
        return tempState;
    },

    [Types.GET_ENC_TOKEN_SUCCESS]: (state, action) => {
        let tempState = Object.assign({}, { ...state },
            { encToken: action.payload });
        return tempState;
    },

    // ! SET_TENNANT_LOCAL
    [Types.SET_TENNANT_LOCAL_SUCCESS]: (state, action) => {
        console.log('SET_TENNANT_LOCAL_SUCCESS__________', action)
        let tempState = Object.assign({},
            { ...state },
            { tenantLocal: action.payload, isGetTenant: true }
        );
        return tempState;
    },

    [Types.GET_TENNANT_LOCAL_SUCCESS]: (state, action) => {
        let tempState = Object.assign({},
            { ...state },
            { tenantLocal: action.payload }
        );
        return tempState;
    },

    // ! LOGOUT
    [Types.LOGOUT_SUCCESS]: (state, action) => {
        let tempState = Object.assign({}, { ...state },
            {
                accessToken: '',
                accessTokenAPI: '',
                tenantLocal: {},
                encToken: '',
                userSettings: {},
                isGetTenant: true
            });
        return tempState;
    },

});
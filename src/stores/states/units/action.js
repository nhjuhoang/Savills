import Types from './';
import Configs from '../../../utils/linkApi';

export function getUnits(accessTokenAPI) {
    return {
        type: Types.GET_UNITS,
        payload: {
            api: Configs.API + '/api/units/UnitsByMember',
            method: 'GET',
            token: accessTokenAPI
        }
    }
}

export function getEmployeesByOu(accessTokenAPI) {
    return {
        type: Types.GET_EMP_BYOU,
        payload: {
            api: Configs.API + '/api/Units/EmployeesByOu',
            method: 'GET',
            token: accessTokenAPI
        }
    }
}

export function setUnitDefault(accessTokenAPI, unitID) {
    return {
        type: Types.SET_UNIT_DEFAULT,
        payload: {
            api: Configs.API + '/api/services/app/Units/SetUnitIsDefault',
            method: 'POST',
            token: accessTokenAPI,
            payload: {
                unitId: unitID
            }
        }
    }
}

export function setUnitLocal(data) {
    return {
        type: Types.SET_UNITLOCAL,
        payload: {
            storage: {
                key: 'UNITLOCAL',
                type: 'setArrayObject',
                data: data
            }
        }
    }
}

export function getUnitLocal() {
    return {
        type: Types.GET_UNITLOCAL,
        payload: {
            storage: {
                key: 'UNITLOCAL',
                type: 'getArrayObject',
            }
        }
    }
}

export function setIsGetlisUnit(bool = true) {
    return {
        type: Types.SET_IS_GETUNIT,
        payload: bool
    }
}

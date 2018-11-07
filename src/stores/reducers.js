import { combineReducers } from 'redux';

import app from './states/app/reducer';
import account from './states/account/reducer';
import units from './states/units/reducer';
import userProfile from './states/userProfile/reducer';
import events from './states/events/reducer';
import utilities from './states/utilities/reducer';
import workOrder from './states/workOrder/reducer';
import notification from './states/notification/reducer';

export default combineReducers({
  workOrder,
  app,
  account,
  units,
  userProfile,
  events,
  utilities,
  notification
});

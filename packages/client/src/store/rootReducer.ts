import { combineReducers } from "redux";
import authReducer from "./slices/authSlice";
import passwordRecordsReducer from "./slices/passwordRecordsSlice";
import sharedPasswordRecordsReducer from "./slices/sharedPasswordRecordsSlice";


const rootReducer = combineReducers({
    auth: authReducer,
    passwordRecords: passwordRecordsReducer,
    sharedPasswordRecords: sharedPasswordRecordsReducer,
});

export default rootReducer;
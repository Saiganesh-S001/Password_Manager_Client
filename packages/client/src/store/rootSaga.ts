import { all,fork } from 'redux-saga/effects';
import {watchAuthSaga} from './sagas/authSaga';
import {watchPasswordRecordSaga} from './sagas/passwordRecordSaga';
import {watchSharedPasswordRecords} from './sagas/sharedPasswordRecordSaga';

export default function* rootSaga() {
  yield all([
    fork(watchAuthSaga),
    fork(watchPasswordRecordSaga),
    fork(watchSharedPasswordRecords),
  ]);
} 
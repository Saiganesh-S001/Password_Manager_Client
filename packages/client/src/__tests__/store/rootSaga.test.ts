import { fork, all } from 'redux-saga/effects';
import rootSaga from '../../store/rootSaga';
import { watchAuthSaga } from '../../store/sagas/authSaga';
import { watchPasswordRecordSaga } from '../../store/sagas/passwordRecordSaga';
import { watchSharedPasswordRecords } from '../../store/sagas/sharedPasswordRecordSaga';

describe('rootSaga', () => {
  it('should fork all watchers', () => {
    const generator = rootSaga();
    const expected = all([
      fork(watchAuthSaga),
      fork(watchPasswordRecordSaga),
      fork(watchSharedPasswordRecords),
    ]);

    const actual = generator.next().value;
    expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected));
  });

  it('should be done after forking watchers', () => {
    const generator = rootSaga();
    generator.next(); // Fork watchers
    expect(generator.next().done).toBe(true);
  });
}); 
import { fork, all } from 'redux-saga/effects';
import rootSaga from '../../store/rootSaga';
import { watchAuthSaga } from '../../store/sagas/authSaga';
import { watchPasswordRecordSaga } from '../../store/sagas/passwordRecordSaga';
import { watchSharedPasswordRecords } from '../../store/sagas/sharedPasswordRecordSaga';

describe('rootSaga', () => {
  let generator: Generator;

  beforeEach(() => {
    generator = rootSaga();
  });

  it('should fork all watcher sagas', () => {
    const expected = all([
      fork(watchAuthSaga),
      fork(watchPasswordRecordSaga),
      fork(watchSharedPasswordRecords),
    ]);

    const actual = generator.next().value;
    expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected));
  });

  it('should fork auth saga', () => {
    const allEffect = generator.next().value as any;
    const forkEffects = allEffect.payload;
    
    expect(forkEffects).toContainEqual(fork(watchAuthSaga));
  });

  it('should fork password records saga', () => {
    const allEffect = generator.next().value as any;
    const forkEffects = allEffect.payload;
    
    expect(forkEffects).toContainEqual(fork(watchPasswordRecordSaga));
  });

  it('should fork shared password records saga', () => {
    const allEffect = generator.next().value as any;
    const forkEffects = allEffect.payload;
    
    expect(forkEffects).toContainEqual(fork(watchSharedPasswordRecords));
  });

  it('should be done after forking watchers', () => {
    generator.next(); // Fork watchers
    expect(generator.next().done).toBe(true);
  });

  it('should fork watchers in correct order', () => {
    const allEffect = generator.next().value as any;
    const forkEffects = allEffect.payload;
    
    expect(forkEffects[0]).toEqual(fork(watchAuthSaga));
    expect(forkEffects[1]).toEqual(fork(watchPasswordRecordSaga));
    expect(forkEffects[2]).toEqual(fork(watchSharedPasswordRecords));
  });
}); 
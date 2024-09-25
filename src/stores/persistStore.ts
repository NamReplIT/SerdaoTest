import { persistReducer as ReduxPersisReducer, persistStore as ReduxPersistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import transactionReducer from './reducers/transactionReducer';

/** Reducers */
const reducers = combineReducers({
    transactionReducer
})
/** Redux Persist */
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
};
const persistReducers = ReduxPersisReducer(persistConfig, reducers);
/** Config reduxStore and persistStore */
const reduxStore = configureStore({
    reducer: persistReducers,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

const persistStore = ReduxPersistStore(reduxStore);


export {
    reduxStore,
    persistStore
};

import Loader from '@/components/Loader';
import { TransactionProvider } from '@/contexts/TransactionContext';
import Main from './Main';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { reduxStore, persistStore } from '@/stores/persistStore';

const App = () => {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <Provider store={reduxStore}>
        <PersistGate loading={<Loader />} persistor={persistStore}>
          <TransactionProvider>
            <Main />
          </TransactionProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;

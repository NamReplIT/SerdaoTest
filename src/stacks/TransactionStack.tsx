import TransactionScreenCreateEdit from '@/screens/transaction/TransactionScreenCreateEdit';
import TransactionScreenIndex from '@/screens/transaction/TransactionScreenIndex';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="TransactionIndex" component={TransactionScreenIndex} />
            <Stack.Screen name="CreateEditTransaction" component={TransactionScreenCreateEdit} />
        </Stack.Navigator>
    );
};


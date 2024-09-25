import BeneficiarayScreenCreateEdit from '@/screens/beneficiary/BeneficiarayScreenCreateEdit';
import BeneficiarayScreenIndex from '@/screens/beneficiary/BeneficiarayScreenIndex';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="BeneficiaryIndex" component={BeneficiarayScreenIndex} />
            <Stack.Screen name="CreateEditBeneficiary" component={BeneficiarayScreenCreateEdit} />
        </Stack.Navigator>
    );
};


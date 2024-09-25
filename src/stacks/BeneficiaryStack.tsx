import BeneficiarayScreenCreateEdit from '@/screens/beneficiary/BeneficiarayScreenCreateEdit';
import BeneficiarayScreenIndex from '@/screens/beneficiary/BeneficiarayScreenIndex';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="BeneficiaryScreenIndex" component={BeneficiarayScreenIndex} />
            <Stack.Screen name="BeneficiaryScreenCreateEdit" component={BeneficiarayScreenCreateEdit} />
        </Stack.Navigator>
    );
};


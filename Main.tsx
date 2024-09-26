import useInitTestData from '@/hooks/useInitTestData';
import BeneficiaryStack from '@/stacks/BeneficiaryStack';
import HomeStack from '@/stacks/HomeStack';
import TransactionStack from '@/stacks/TransactionStack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createBottomTabNavigator();

export default () => {
  useInitTestData();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} >
        <Stack.Screen name="Home" component={HomeStack} />
        <Stack.Screen name="Transaction" component={TransactionStack} />
        <Stack.Screen name="Beneficiary" component={BeneficiaryStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
import HomeScreenIndex from '@/screens/home/HomeScreenIndex';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="HomeIndex" component={HomeScreenIndex} />
        </Stack.Navigator>
    );
};


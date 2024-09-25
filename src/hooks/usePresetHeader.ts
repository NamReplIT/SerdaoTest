import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationOptions } from '@react-navigation/native-stack/lib/typescript/src/types';

import { useLayoutEffect } from "react";

export default (headerOptions: NativeStackNavigationOptions) => {
    const navigation = useNavigation<any>()

    useLayoutEffect(() => {
        navigation.setOptions({
            ...headerOptions,
            headerShown: true
        });
    }, [])
}
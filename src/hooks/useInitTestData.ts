import { generateMockBeneficiaryData } from "@/_mocks/generateBeneficiaries";
import { generateMockTransactionData } from "@/_mocks/generateTransactions";
import { seedBeneficiary, seedTransaction, seedUser } from "@/stores/reducers/accountReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLayoutEffect } from "react";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";

export default () => {
    const dispatch = useDispatch();
    const STOREAGE_KEY = "IS_INITIALIZED";
    const getTestStorage = async () => await AsyncStorage.getItem(STOREAGE_KEY);
    const setTestStorage = async () => await AsyncStorage.setItem(STOREAGE_KEY, JSON.stringify({ is_initialized: true }))
    useLayoutEffect(() => {
        (async () => {
            if (!(await getTestStorage())) {
                Alert.alert(
                    `Would you like to init app with test data?`,
                    undefined,
                    [
                        {
                            text: 'No',
                            onPress: async () => {
                                dispatch(seedUser({ balance: 10000 }))
                                dispatch(seedBeneficiary({}));
                                dispatch(seedTransaction([]));
                                await setTestStorage();
                            },
                            style: 'cancel',
                        },
                        {
                            text: 'Yes',
                            onPress: async () => {
                                dispatch(seedUser({ balance: 1000000 }))
                                const beneficiaries = generateMockBeneficiaryData(10);
                                const transactions = generateMockTransactionData(beneficiaries);
                                dispatch(seedBeneficiary(beneficiaries));
                                dispatch(seedTransaction([...transactions.currentWeek, ...transactions.lastWeek]));
                                await setTestStorage();
                            },
                            style: 'destructive'
                        }
                    ],
                );
            }
        })()
    }, [])
}
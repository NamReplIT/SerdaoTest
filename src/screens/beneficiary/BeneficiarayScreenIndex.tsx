import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useTransactions } from '../../contexts/TransactionContext';

export default ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [iban, setIban] = useState('');
  const { addTransaction } = useTransactions();

  const handleTransaction = () => {
    const accountDetails = { name, iban };
    addTransaction(amount, accountDetails);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Beneficiary Index</Text>
    </View>
  );
}

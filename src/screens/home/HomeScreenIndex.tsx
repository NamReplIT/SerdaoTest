import usePresetHeader from '@/hooks/usePresetHeader';
import { Beneficiary } from '@/schemas/beneficiarySchema';
import { Transaction } from '@/schemas/transactionSchema';
import { RootStore } from '@/stores/persistStore';
import { useNavigation } from '@react-navigation/native';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

interface BeneficiaryTransactionAmount {
  beneficiary: Beneficiary,
  amount: number
}

export default () => {
  const navigation = useNavigation<any>();
  const account = useSelector((store: RootStore) => store.accountReducer.user);
  const beneficiaries = useSelector((store: RootStore) => store.accountReducer.beneficiaries);
  const transactions = useSelector((store: RootStore) => store.accountReducer.transactions);

  const totalTransactions: number = transactions.length; // Total number of transactions

  // Function to display the top 5 transactions
  const topTransactions = useMemo(() => {
    return [...transactions]
      .sort((a: Transaction, b: Transaction) => b.amount - a.amount)
      .slice(0, 5)
  }, [transactions]);

  const transactionAmountByBeneficiary = useMemo(() => {
    return Object.values(beneficiaries).reduce((acc, beneficiary) => {
      const sumAmountByBeficiary = transactions
        .filter(t => t.beneficiary_id === beneficiary.id)
        .reduce((acc, t) => acc += t.amount, 0);
      acc.push({
        beneficiary,
        amount: sumAmountByBeficiary
      });
      return acc;
    }, [] as BeneficiaryTransactionAmount[])
      .sort((a, b) => b.amount - a.amount)
  }, [transactions, beneficiaries]);

  // Render each transaction and show the associated beneficiary
  const renderBeneficiaryTransactionByAmountItem = (item: BeneficiaryTransactionAmount, index: number) => {
    const { beneficiary, amount } = item
    return (
      <View key={index} style={styles.transactionItem}>
        <Text style={styles.transactionText}>
          {beneficiary
            ? `${beneficiary.first_name} ${beneficiary.last_name}`
            : 'Unknown Beneficiary'}
        </Text>
        <Text style={styles.transactionAmount}>${amount}</Text>
      </View>
    );
  };

  const renderTopFiveTransactionItem = (item: Transaction, index: number) => {
    const beneficiary = beneficiaries[item.beneficiary_id] ?? null;
    return (
      <View key={index} style={styles.transactionItem}>
        <Text style={styles.transactionText}>
          {beneficiary
            ? `${beneficiary.first_name} ${beneficiary.last_name}`
            : 'Unknown Beneficiary'}
        </Text>
        <Text style={styles.transactionAmount}>${item.amount}</Text>
      </View>
    );
  };

  const navigateToCreateTransaction = () => {
    navigation.navigate("Transaction", {
      screen: "TransactionScreenCreateEdit",
      params: {}
    })
  }

  usePresetHeader({
    headerTitle: "Home"
  });

  return (
    <View style={styles.container}>
      <ScrollView nestedScrollEnabled={true}>
        {/* Current Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>Current Balance</Text>
          <Text style={styles.balanceAmount}>${account?.balance || 0}</Text>
        </View>

        {/* Total Transactions Card */}
        <View style={styles.transactionCountCard}>
          <Text style={styles.balanceTitle}>Total Transactions This Week</Text>
          <Text style={styles.balanceAmount}>{totalTransactions}</Text>
        </View>

        {/* Transactions by Beneficiary Card */}
        <View style={styles.transactionsContainer}>
          <Text style={styles.sectionTitle}>Transactions By Beneficiary</Text>
          {transactionAmountByBeneficiary.map((trans, index) => renderBeneficiaryTransactionByAmountItem(trans, index))}
        </View>

        {/* Top 5 Transactions */}
        <View style={styles.transactionsContainer}>
          <Text style={styles.sectionTitle}>Top 5 Highest Transactions</Text>
          {topTransactions.map((trans, index) => renderTopFiveTransactionItem(trans, index))}
        </View>
        <TouchableOpacity activeOpacity={0.9} onPress={navigateToCreateTransaction}>
          <View style={styles.balanceCard}>
            <Text style={[styles.balanceTitle, { textAlign: 'center', fontSize: 48 }]}>
              +
            </Text>
            <Text style={[styles.balanceTitle, { textAlign: 'center', fontSize: 24 }]}>
              Create a new transaction
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  balanceCard: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  transactionCountCard: {
    backgroundColor: '#2196F3',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    minHeight: 150,
  },
  balanceTitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  transactionsContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 150,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  transactionText: {
    fontSize: 16,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
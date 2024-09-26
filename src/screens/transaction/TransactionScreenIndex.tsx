import FloatButton from '@/components/FloatButton';
import usePresetHeader from '@/hooks/usePresetHeader';
import { Transaction } from '@/schemas/transactionSchema';
import { RootStore } from '@/stores/persistStore';
import { filterCurrentWeekTransactions, filterPreviousTransactions, formatTransactionCreatedDate } from '@/utils/transaction';
import { useNavigation } from '@react-navigation/native';
import { Button, SectionList, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

export default () => {
  const navigation = useNavigation<any>();
  const transactions = useSelector((store: RootStore) => store.accountReducer.transactions);
  const beneficiaries = useSelector((store: RootStore) => store.accountReducer.beneficiaries);

  usePresetHeader({
    headerTitle: 'Transactions',
  });

  const currentWeekTransactions = filterCurrentWeekTransactions(transactions);
  const previousTransactions = filterPreviousTransactions(transactions);

  const sections = [
    {
      title: "This Week's Transactions",
      data: currentWeekTransactions,
    },
    {
      title: 'Previous Transactions',
      data: previousTransactions,
    },
  ];

  const navigateToCreateEdit = (transaction?: Transaction) => {
    return navigation.navigate('TransactionScreenCreateEdit', { transaction });
  };

  // Render each transaction
  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const beneficiary = beneficiaries[item.beneficiary_id] ?? {
      first_name: 'Unknown',
      last_name: 'Person',
      iban: 'N/A',
    };

    const formattedDate = formatTransactionCreatedDate(item.created_at);

    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemLeft}>
          <Text style={styles.nameText}>
            {beneficiary.first_name} {beneficiary.last_name}
          </Text>
          <Text style={styles.ibanText}>{beneficiary.iban}</Text>
          <Text style={styles.amountText}>${item.amount}</Text>
          <Text>Created on: {formattedDate}</Text>
        </View>
        <Button
          title="Edit"
          onPress={() => navigateToCreateEdit(item)}
          color="#4CAF50"
        />
      </View>
    );
  };

  // Render section header
  const renderSectionHeader = ({ section }: { section: { title: string } }) => {
    return <Text style={styles.sectionTitle}>{section.title}</Text>;
  };

  // Render footer for empty sections
  const renderSectionFooter = ({ section }: { section: { data: Transaction[] } }) => {
    if (section.data.length === 0) {
      return (
        <View style={styles.emptySectionContainer}>
          <Text style={styles.emptySectionText}>No transactions in this section.</Text>
        </View>
      )
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <SectionList
        style={styles.sectionStyle}
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTransactionItem}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSectionFooter}
      />

      <FloatButton title="Create" onPress={() => navigateToCreateEdit()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingLeft: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemLeft: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  ibanText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  amountText: {
    fontSize: 14,
    color: '#ff0000',
    marginTop: 4,
  },
  dateText: {
    fontSize: 14,
    color: 'blue',
    marginTop: 4,
  },
  sectionStyle: {
    width: "100%",
    flexGrow: 1
  },
  emptySectionContainer: {
    width: "100%",
    flexGrow: 1,
    minHeight: 250,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptySectionText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888888',
    marginVertical: 10,
  },
});

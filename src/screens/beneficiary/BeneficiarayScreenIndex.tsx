import FloatButton from '@/components/FloatButton';
import usePresetHeader from '@/hooks/usePresetHeader';
import { Beneficiary } from '@/schemas/beneficiarySchema';
import { RootStore } from '@/stores/persistStore';
import { useNavigation } from '@react-navigation/native';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

export default () => {
  const navigation = useNavigation<any>(); // Get navigation instance to handle screen transitions
  const beneficiaries = useSelector((store: RootStore) => store.accountReducer.beneficiaries); // Fetch beneficiaries from the Redux store
  const listBeneficiaries = Object.values(beneficiaries);
  // Set up a header with a title using a custom hook
  usePresetHeader({
    headerTitle: "Beneficiaries"
  });

  /**
   * Navigates to the create/edit beneficiary screen.
   * If a beneficiary object is passed, it navigates to the edit screen, otherwise to the create screen.
   * 
   * @param beneficiary - Optional beneficiary to edit, if undefined, a new beneficiary will be created.
   */
  const navigateToCreateEdit = (beneficiary?: Beneficiary) => {
    return navigation.navigate('BeneficiaryScreenCreateEdit', { beneficiary });
  }

  /**
   * Renders each item in the FlatList. Displays the beneficiary's name, IBAN, and an "Edit" button.
   * 
   * @param item - The beneficiary object to render in the list.
   */
  const renderItem = ({ item }: { item: Beneficiary }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemLeft}>
          <Text style={styles.nameText}>{item.first_name} {item.last_name}</Text>
          <Text style={styles.ibanText}>{item.iban}</Text>
        </View>
        <Button
          title='Edit' // Button to edit the selected beneficiary
          onPress={() => navigateToCreateEdit(item)} // Navigate to the edit screen with the selected beneficiary
          color="#4CAF50" // Green color to signify the edit action
        />
      </View>
    );
  }

  const renderEmptyBeneficiary = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No beneficiary available.</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/** List beneficiaries */}
      {listBeneficiaries.length > 0
        ? <FlatList
          style={styles.flatlistStyle}
          contentContainerStyle={styles.flatlistContentContainerStyle}
          keyExtractor={item => item.id.toString()}
          data={listBeneficiaries}
          renderItem={renderItem}
        /> :
        renderEmptyBeneficiary()}
      {/** Floating button to navigate to the create beneficiary screen */}
      <FloatButton
        title='Create'
        onPress={() => navigateToCreateEdit()}
      />
    </View>
  );
}

/**
 * Styles for the component, applied to various UI elements for layout and appearance.
 */
const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemLeft: {
    flexGrow: 1,
    justifyContent: "center",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  ibanText: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
  },
  flatlistStyle: {
    width: "100%",
    flexGrow: 1,
  },
  flatlistContentContainerStyle: {
    paddingBottom: 16,
  },
  emptyContainer: {
    width: "100%",
    flexGrow: 1,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888888',
  }
});

import FloatButton from '@/components/FloatButton';
import usePresetHeader from '@/hooks/usePresetHeader';
import { Transaction } from '@/schemas/transactionSchema';
import { RootStore } from '@/stores/persistStore';
import { useNavigation } from '@react-navigation/native';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

export default () => {
  const navigation = useNavigation<any>(); // Get navigation instance to handle screen transitions
  const transactions = useSelector((store: RootStore) => store.accountReducer.transactions); // Fetch transactions from the Redux store
  const beneficiaries = useSelector((store: RootStore) => store.accountReducer.beneficiaries);
  // Set up a header with a title using a custom hook
  usePresetHeader({
    headerTitle: "Transactions"
  });

  /**
   * Navigates to the create/edit beneficiary screen.
   * If a beneficiary object is passed, it navigates to the edit screen, otherwise to the create screen.
   * 
   * @param beneficiary - Optional beneficiary to edit, if undefined, a new beneficiary will be created.
   */
  const navigateToCreateEdit = (transaction?: Transaction) => {
    return navigation.navigate('TransactionScreenCreateEdit', { transaction });
  }

  /**
   * Renders each item in the FlatList. Displays the beneficiary's name, IBAN, and an "Edit" button.
   * 
   * @param item - The beneficiary object to render in the list.
   */
  const renderItem = ({ item }: { item: Transaction }) => {
    const beneficiary = beneficiaries[item.beneficiary_id] ?? {
      first_name: "Unknown",
      last_name: "Person",
      iban: "N/A"
    }
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemLeft}>
          <Text style={styles.nameText}>{beneficiary.first_name} {beneficiary.last_name}</Text>
          <Text style={styles.ibanText}>{beneficiary.iban}</Text>
          <Text style={styles.ibanText}>-{item.amount}</Text>
        </View>
        <Button
          title='Edit' // Button to edit the selected beneficiary
          onPress={() => navigateToCreateEdit(item)} // Navigate to the edit screen with the selected beneficiary
          color="#4CAF50" // Green color to signify the edit action
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatlistStyle}
        contentContainerStyle={styles.flatlistContentContainerStyle}
        keyExtractor={item => item.id.toString()} // Use the beneficiary ID as the unique key for each item
        data={transactions} // Convert transactions object to an array for FlatList
        renderItem={renderItem} // Function to render each beneficiary
      />
      {/** Floating button to navigate to the create beneficiary screen */}
      <FloatButton
        title='Create'
        onPress={() => navigateToCreateEdit()} // Navigate to create beneficiary screen
      />
    </View>
  );
}

/**
 * Styles for the component, applied to various UI elements for layout and appearance.
 */
const styles = StyleSheet.create({
  container: {
    // Main container style, full width and flexible height
    position: "relative",
    width: "100%",
    flexGrow: 1,
    backgroundColor: "#f5f5f5", // Light background color for the screen
    padding: 16, // Padding around the container
  },
  itemContainer: {
    // Container for each beneficiary item
    flexDirection: "row", // Layout items in a horizontal row
    justifyContent: "space-between", // Space between name/IBAN and the Edit button
    alignItems: "center", // Center items vertically
    backgroundColor: "#ffffff", // White background for each item
    padding: 16, // Padding inside each item container
    marginVertical: 8, // Space between item containers
    borderRadius: 8, // Rounded corners for each item container
    shadowColor: "#000", // Shadow for depth effect
    shadowOffset: { width: 0, height: 2 }, // Offset shadow for vertical depth
    shadowOpacity: 0.1, // Light shadow opacity
    shadowRadius: 4, // Blur radius for the shadow
    elevation: 2, // Elevation for Android shadow effect
  },
  itemLeft: {
    // Container for beneficiary name and IBAN, aligned to the left
    flexGrow: 1, // Allow it to grow and take up available space
    justifyContent: "center", // Center content vertically
  },
  nameText: {
    // Style for the beneficiary name text
    fontSize: 16, // Font size for name
    fontWeight: "bold", // Bold text for emphasis
    color: "#333333", // Dark gray color
  },
  ibanText: {
    // Style for the IBAN text
    fontSize: 14, // Smaller font size for IBAN
    color: "#666666", // Light gray color for IBAN text
    marginTop: 4, // Space between name and IBAN
  },
  flatlistStyle: {
    // Style for the FlatList component
    width: "100%", // Full width
    flexGrow: 1, // Allow the list to grow and take up space
  },
  flatlistContentContainerStyle: {
    // Content container style for the FlatList
    paddingBottom: 16, // Padding at the bottom to prevent items from being cut off
  },
});

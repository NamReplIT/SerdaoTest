import { Modal } from '@/components/Modal';
import Selection from '@/components/Selection';
import extractValidationErrorHelper from '@/helpers/validation/extractValidationErrorHelper';
import usePresetHeader from '@/hooks/usePresetHeader';
import { Beneficiary } from '@/schemas/beneficiarySchema';
import { Transaction, transactionSchema } from '@/schemas/transactionSchema';
import { RootStore } from '@/stores/persistStore';
import { createBeneficiary, createTransaction, deleteBeneficiary, deleteTransaction, updateBeneficiary, updateTransaction } from '@/stores/reducers/accountReducer';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootState } from '@reduxjs/toolkit/query';
import { useRef, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ValidationError } from 'yup';

export default () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const modalRef = useRef<Modal>();
  const beneficiaries = useSelector((store: RootStore) => store.accountReducer.beneficiaries);

  // Retrieve the transaction from route params (if any), otherwise set undefined
  const { transaction } = useRoute<any>().params ?? {} as { transaction: Transaction };

  // Initialize component state with transaction and error fields
  const [state, setState] = useState<{ transaction: Transaction, errors: { [key: string]: string } }>(() => ({
    transaction: transaction ? transaction : transactionSchema.getDefault(), // Use schema default if no transaction provided
    errors: {} // Initialize empty errors object
  }));

  // Determine whether we are creating a new transaction or editing an existing one
  const isCreate = typeof transaction === 'undefined';

  const beneficiary = beneficiaries[state.transaction.beneficiary_id];

  const listBeneficiary = Object.values(beneficiaries);


  // Configure the screen header title based on create or edit mode
  usePresetHeader({
    headerTitle: isCreate ? "Create transaction" : "Edit transaction"
  });

  const handleOpenModalBeneficiary = () => {
    return modalRef.current && modalRef.current.onOpenModal();
  }

  const navigateToCreateEditBeneficiary = () => {
    navigation.navigate("Beneficiary", {
      screen: 'BeneficiaryScreenCreateEdit',
      params: {}
    })
  }

  const handleSelectBeneficiary = (beneficiary: Beneficiary) => {
    return modalRef.current && modalRef.current.onDismissModal().then(() => handleOnChangeField('beneficiary_id', beneficiary.id))

  }

  /**
   * Function to handle form submission.
   * Validates the form using the schema, dispatches the appropriate action to create or update,
   * and navigates back to the previous screen if successful.
   */
  const handleCreateEditBeneficiary = async () => {
    try {
      // Validate transaction data with the Yup schema
      await transactionSchema.validate(state.transaction, { abortEarly: false, stripUnknown: true });

      if (isCreate) {
        // Dispatch action to create a new transaction if in create mode
        dispatch(createTransaction(state.transaction as Transaction));
      } else {
        // Dispatch action to update the transaction if in edit mode
        dispatch(updateTransaction(state.transaction as Transaction));
      }

      // Navigate back after success
      navigation.goBack();
    } catch (error) {
      // Extract validation errors if validation fails
      const validatedErrors = extractValidationErrorHelper(error as ValidationError);

      // Update the state with validation errors
      setState({ ...state, errors: validatedErrors });
    }
  };

  /**
   * Function to handle text input changes.
   * Updates the corresponding field in the state and clears any validation errors for the field.
   */
  const handleOnChangeField = (field: keyof Transaction, value: any) => {
    setState((prevState) => {
      let updatedState = {
        ...prevState,
        transaction: {
          ...prevState.transaction,
          [field]: value
        }
      };
      // Remove validation error for the field after updating
      delete updatedState.errors[field];
      return updatedState;
    });
  };

  /**
   * Function to handle transaction deletion.
   * Displays a confirmation alert, and if confirmed, dispatches the delete action and navigates back.
   */
  const handerDelete = () => {
    Alert.alert(
      `Are you sure you want to delete this transaction?`,
      undefined,
      [
        {
          text: 'Cancel', // The cancel button, dismisses the alert without further action
          onPress: () => { },
          style: 'cancel', // Apply cancel style to the button
        },
        {
          text: 'Delete', // The delete button, confirms and triggers deletion
          onPress: () => {
            // Dispatch the action to delete the transaction
            dispatch(deleteTransaction(state.transaction));

            // Navigate back after deletion
            navigation.goBack();
          },
          style: 'destructive' // Use destructive style to indicate a critical action
        }
      ],
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/** First name input field */}
        <Selection
          label="Beneficiary"
          value={!beneficiary
            ? "Select a beneficiary"
            : `${beneficiary?.first_name} ${beneficiary?.last_name} - ${beneficiary?.iban}`
          }
          onPress={handleOpenModalBeneficiary}
          error={state.errors['beneficiary_id']}
        />


        <View style={styles.inputContainer}>
          <Text style={styles.label}>Transfer amount</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => handleOnChangeField('amount', text ? parseInt(text) : 0)} // Update state on text change
            value={state.transaction.amount.toString()} // Bind the input to the state
            keyboardType='numeric'
            placeholder="Enter amount" // Placeholder text
          />
          {state.errors['amount'] && (<Text style={styles.helperText}>{state.errors['amount']}</Text>)}
        </View>
      </View>

      {/** Footer section with submit and delete buttons */}
      <View style={styles.footer}>
        {/** Submit button for create or update */}
        <Button title={isCreate ? "Create" : "Update"} onPress={handleCreateEditBeneficiary} />

        {/** Delete button, only shown in edit mode */}
        {!isCreate && (
          <TouchableOpacity onPress={handerDelete} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
      <Modal ref={modalRef as any}>
        <Text>Select a beneficiary</Text>
        <ScrollView style={styles.modalScrollViewStyle}>
          {listBeneficiary.length > 0 ? (
            listBeneficiary.map((item) => (
              <View key={item.id} style={styles.itemContainer}>
                <View style={styles.itemLeft}>
                  <Text style={styles.nameText}>
                    {item.first_name} {item.last_name}
                  </Text>
                  <Text style={styles.ibanText}>{item.iban}</Text>
                </View>
                <Button
                  onPress={() => handleSelectBeneficiary(item)}
                  title={beneficiary && beneficiary.id === item.id ? "Selected" : "Select"}
                />

              </View>
            ))
          ) : (
            // If listBeneficiary is empty, show this view
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No beneficiaries available</Text>
              <Button
                title="Add Beneficiary"
                onPress={navigateToCreateEditBeneficiary} // Navigate to the add beneficiary page
                color="#4CAF50"
              />
            </View>
          )}
        </ScrollView>
      </Modal>
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    // The outermost container taking full width and height
    width: "100%",
    flexGrow: 1,
    padding: 16 // Adds padding around the whole container
  },
  content: {
    // Inner content that contains all the input fields
    width: "100%",
    flexGrow: 1,
  },
  footer: {
    // Footer section for the submit and delete buttons
    width: "100%",
    paddingVertical: 20, // Padding to separate the button from the inputs
  },
  inputContainer: {
    // Wrapper for each input field
    width: "100%",
    marginBottom: 16, // Adds space between input fields
  },
  label: {
    // Label text above each input field
    marginBottom: 8, // Space between label and input field
  },
  input: {
    // Styling for the TextInput component
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    paddingLeft: 16, // Padding inside the input for better readability
  },
  helperText: {
    // Error message styling below the input fields
    fontSize: 12,
    color: "red" // Red text to indicate an error
  },
  deleteButton: {
    // Styling for the delete button
    width: "100%",
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: "center",
  },
  deleteButtonText: {
    // Text color for the delete button
    color: "red"
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
  emptyContainer: {
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  modalScrollViewStyle: {
    width: "100%",
    maxHeight: 450
  }
});

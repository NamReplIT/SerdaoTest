import { Modal } from '@/components/Modal';
import Selection from '@/components/Selection';
import extractValidationErrorHelper from '@/helpers/validation/extractValidationErrorHelper';
import usePresetHeader from '@/hooks/usePresetHeader';
import { Beneficiary } from '@/schemas/beneficiarySchema';
import { Transaction, transactionSchema } from '@/schemas/transactionSchema';
import { RootStore } from '@/stores/persistStore';
import { createTransaction, deleteTransaction, updateTransaction } from '@/stores/reducers/accountReducer';
import { useNavigation, useRoute } from '@react-navigation/native';
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
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            dispatch(deleteTransaction(state.transaction));
            navigation.goBack();
          },
          style: 'destructive'
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
    width: "100%",
    flexGrow: 1,
    padding: 16
  },
  content: {
    width: "100%",
    flexGrow: 1,
  },
  footer: {
    width: "100%",
    paddingVertical: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    paddingLeft: 16,
  },
  helperText: {
    fontSize: 12,
    color: "red"
  },
  deleteButton: {
    width: "100%",
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "red"
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

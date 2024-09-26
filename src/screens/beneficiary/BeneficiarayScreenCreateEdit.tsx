import extractValidationErrorHelper from '@/helpers/validation/extractValidationErrorHelper';
import usePresetHeader from '@/hooks/usePresetHeader';
import { Beneficiary, beneficiarySchema } from '@/schemas/beneficiarySchema';
import { RootStore } from '@/stores/persistStore';
import { createBeneficiary, deleteBeneficiary, updateBeneficiary } from '@/stores/reducers/accountReducer';
import { validateBeneficiaryExist } from '@/utils/beneficiary';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ValidationError } from 'yup';

export default () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const beneficiaries = useSelector((store: RootStore) => store.accountReducer.beneficiaries);

  // Retrieve the beneficiary from route params (if any), otherwise set undefined
  const { beneficiary } = useRoute<any>().params ?? {} as { beneficiary: Beneficiary };

  // Determine whether we are creating a new beneficiary or editing an existing one
  const isCreate = typeof beneficiary === 'undefined';

  // Initialize component state with beneficiary and error fields
  const [state, setState] = useState<{ beneficiary: Beneficiary, errors: { [key: string]: string } }>(() => ({
    beneficiary: beneficiary ? beneficiary : beneficiarySchema.getDefault(), // Use schema default if no beneficiary provided
    errors: {} // Initialize empty errors object
  }));

  // Configure the screen header title based on create or edit mode
  usePresetHeader({
    headerTitle: isCreate ? "Create beneficiary" : "Edit beneficiary"
  });

  /**
   * Function to handle form submission.
   * Validates the form using the schema, dispatches the appropriate action to create or update,
   * and navigates back to the previous screen if successful.
   */
  const handleCreateEditBeneficiary = async () => {
    try {
      // Validate beneficiary data with the Yup schema
      await beneficiarySchema.validate(state.beneficiary, { abortEarly: false, stripUnknown: true });

      if (validateBeneficiaryExist(state.beneficiary, Object.values(beneficiaries))) {
        return Alert.alert("This benficiary is existing. Please create anther");
      } else {
        if (isCreate) {
          // Dispatch action to create a new beneficiary if in create mode
          dispatch(createBeneficiary(state.beneficiary as Beneficiary));
        } else {
          // Dispatch action to update the beneficiary if in edit mode
          dispatch(updateBeneficiary(state.beneficiary as Beneficiary));
        }

        // Navigate back after success
        navigation.goBack();
      }
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
  const handleOnChangeText = (field: keyof Beneficiary, text: string) => {
    setState((prevState) => {
      let updatedState = {
        ...prevState,
        beneficiary: {
          ...prevState.beneficiary,
          [field]: text
        }
      };
      // Remove validation error for the field after updating
      delete updatedState.errors[field];
      return updatedState;
    });
  };

  /**
   * Function to handle beneficiary deletion.
   * Displays a confirmation alert, and if confirmed, dispatches the delete action and navigates back.
   */
  const handerDeleteBeneficiary = () => {
    Alert.alert(
      `Are you sure you want to delete ${state.beneficiary.first_name} ${state.beneficiary.last_name}?`,
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
            // Dispatch the action to delete the beneficiary
            dispatch(deleteBeneficiary(state.beneficiary));

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
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First name</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => handleOnChangeText('first_name', text)} // Update state on text change
            value={state.beneficiary.first_name} // Bind the input to the state
            placeholder="Enter first name" // Placeholder text
          />
          {state.errors['first_name'] && (<Text style={styles.helperText}>{state.errors['first_name']}</Text>)}
          {/** Display validation error if it exists */}
        </View>

        {/** Last name input field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last name</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => handleOnChangeText('last_name', text)} // Update state on text change
            value={state.beneficiary.last_name} // Bind the input to the state
            placeholder="Enter last name" // Placeholder text
          />
          {state.errors['last_name'] && (<Text style={styles.helperText}>{state.errors['last_name']}</Text>)}
          {/** Display validation error if it exists */}
        </View>

        {/** IBAN input field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>IBAN</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => handleOnChangeText('iban', text)} // Update state on text change
            value={state.beneficiary.iban} // Bind the input to the state
            placeholder="Enter IBAN number" // Placeholder text
          />
          {state.errors['iban'] && (<Text style={styles.helperText}>{state.errors['iban']}</Text>)}
          {/** Display validation error if it exists */}
        </View>
      </View>

      {/** Footer section with submit and delete buttons */}
      <View style={styles.footer}>
        {/** Submit button for create or update */}
        <Button title={isCreate ? "Create" : "Update"} onPress={handleCreateEditBeneficiary} />

        {/** Delete button, only shown in edit mode */}
        {!isCreate && (
          <TouchableOpacity onPress={handerDeleteBeneficiary} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
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
  }
});

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ({ label, value, onPress, error }: any) {
    return (
        <View style={styles.inputContainer}>
            {/** Label for the selection input */}
            <Text style={styles.label}>{label}</Text>

            {/** Touchable component that acts as a disabled input */}
            <TouchableOpacity
                style={styles.selectionInput}
                onPress={onPress} // Handle the press to open selection dialog or picker
                activeOpacity={0.8} // Optional: adjust the touch opacity effect
            >
                {/** Show the selected value */}
                <Text style={styles.inputText}>{value || 'Select an option'}</Text>

                {/** Chevron-down icon on the right */}
                <Text>Select</Text>
            </TouchableOpacity>

            {/** Display validation error if it exists */}
            {error && <Text style={styles.helperText}>{error}</Text>}
        </View>
    );
}

// Sample usage of the SelectionInput component
/*
<SelectionInput 
  label="First name" 
  value={state.transaction.first_name} 
  onPress={() => { /* Handle opening the picker / dialog here *\/ }} 
  error={state.errors['first_name']} 
/>
*/

const styles = StyleSheet.create({
    inputContainer: {
        width: '100%',
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
        fontSize: 16,
        color: '#333',
    },
    selectionInput: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Align the text and icon at opposite ends
        alignItems: 'center', // Center the content vertically
        paddingHorizontal: 16,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: '#f0f0f0', // Light background to simulate disabled input
    },
    inputText: {
        fontSize: 16,
        color: '#333',
    },
    helperText: {
        fontSize: 12,
        color: 'red', // Red text to indicate an error
        marginTop: 4,
    },
});

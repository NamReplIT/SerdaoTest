import React from "react";
import {
    Modal as RNModal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";

// Define types for ModalProps
export type ModalProps = {
    containerStyle?: object;
    onDismiss?: () => void;
    children?: any;
};

// Define the Modal component as a class component
class Modal extends React.Component<ModalProps> {
    constructor(props: ModalProps) {
        super(props);
        this.state = {
            open: false, // Modal visibility state
        };
        this.onOpenModal = this.onOpenModal.bind(this);
        this.onDismissModal = this.onDismissModal.bind(this);
    }

    // Method to open the modal
    async onOpenModal() {
        this.setState(
            (prevState) => ({ ...prevState, open: true }),
            () => new Promise((resolve) => resolve({ open: true }))
        );
    }

    // Method to dismiss the modal
    async onDismissModal() {
        this.setState(
            (prevState) => ({ ...prevState, open: false }),
            () => new Promise((resolve) => resolve({ open: false }))
        );
    }

    render(): React.ReactNode {
        const { children, onDismiss, containerStyle } = this.props;
        const { open } = this.state as any;

        return (
            <RNModal
                transparent={true} // Makes the modal transparent with background dimming
                visible={open} // Modal is visible when open is true
                animationType="fade" // Slide animation for opening the modal
                onRequestClose={onDismiss ?? this.onDismissModal} // Handle the dismiss action
            >
                <View style={styles.container}>
                    <TouchableOpacity style={styles.underlayer} onPress={onDismiss ?? this.onDismissModal} />
                    <View style={[styles.modalContainer, containerStyle]}>
                        {children}
                    </View>
                </View>
            </RNModal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    underlayer: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Dimming effect on the background
    },
    modalContainer: {
        backgroundColor: "white", // Modal background color
        borderRadius: 10,
        padding: 20, // Padding inside the modal
        alignItems: "center", // Center the content inside
        width: '90%', // Default width of the modal
    },
    content: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
    },
    dismissButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#4CAF50", // Button background color
        borderRadius: 8,
    },
    dismissButtonText: {
        color: "white", // Button text color
        fontSize: 16,
    },
});

export { Modal };

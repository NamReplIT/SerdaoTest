import { StyleSheet, Text, View } from "react-native"

export default () => {
    return (<View style={styles.container}><Text>Well come to Serdao</Text></View>)
}

const styles = StyleSheet.create({
    container: { width: "100%", flex: 1, justifyContent: 'center', alignItems: 'center' }
})
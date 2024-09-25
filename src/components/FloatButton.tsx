import { Button, ButtonProps, StyleSheet, Text, View } from "react-native"


export default (props: ButtonProps) => {
    const { title, ...rest } = props;
    return (
        <View style={styles.container}>
            <Button title={props.title ?? "Create"} {...rest} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 16,
        right: 16
    }
})
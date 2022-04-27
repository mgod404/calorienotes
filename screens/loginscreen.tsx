import React, { useState } from 'react'
import { StyleSheet, TextInput, View, SafeAreaView, Text, Button } from 'react-native'


const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return(
        <View style={styles.loginWrapper}>
            <Text>{email} {password}</Text>
            <TextInput
                style={styles.input}
                onChangeText={(input) => setEmail(input)}
                value={email}
                placeholder='Email'
            />
            <TextInput
                style={styles.input}
                onChangeText={(number)=> setPassword(number)}
                value={password}
                placeholder="Password"
            />
            <View style={styles.buttons}>
                <Button 
                    onPress={() => console.log('Bttn pressed')}
                    title='Login'
                    color='darkviolet'/>
                <Button 
                    onPress={() => console.log('Bttn pressed')}
                    title='Signin'
                    color='darkviolet'/>
            </View>
        </View>
    );
};

export default LoginScreen

const styles = StyleSheet.create({
    loginWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        height: 40,
        width: 200,
        margin: 12,
        borderBottomWidth: 1,
        padding: 10,
    },
    buttons: {
        width:170,
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:20,
        paddingRight:10,
    }
})
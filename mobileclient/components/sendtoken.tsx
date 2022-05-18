import React, { useState } from 'react'
import { StyleSheet, TextInput, View, Text, Button, Alert } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { BACKEND_URL } from '../CONFIG'

interface Props {
    setTokenSent: React.Dispatch<React.SetStateAction<boolean>>
}

const SendTokenComponent: React.FC<Props>= ({setTokenSent}) => {
    const [email, setEmail] = useState('')

    const sendToken = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/resetpassword/`, {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({user: email})
            });
            if(response.status != 201){
                console.log(`Error Code: ${response.status}`)
                return
            }
            setTokenSent(true);
            return
        } catch (e){
            e instanceof Error ? alert(e.message): alert(String(e));
        }
    }

    return(
        <View style={styles.loginWrapper}>
            <Text style={{width:'80%', textAlign:'center'}}>
                Type in email that you used to set up your CNotes account.
                Next, press SEND TOKEN to receive email with special token
                to reset your password.
            </Text>
            <TextInput
                style={styles.input}
                onChangeText={(input) => setEmail(input)}
                value={email}
                placeholder='Email'
            />
            <View style={styles.buttons}>
                <Button 
                    onPress={() => sendToken()}
                    title='Send Token'
                    color='darkviolet'/>
                <Button 
                    onPress={() => setTokenSent(true)}
                    title='I already have token'
                    color='darkviolet'/>
            </View>
        </View>
    );
};

export default SendTokenComponent

const styles = StyleSheet.create({
    loginWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        height: 40,
        width: '80%',
        margin: 12,
        borderBottomWidth: 1,
        padding: 10,
    },
    buttons: {
        width:'80%',
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:20,
        paddingRight:10,
    },
    errorView: {
        backgroundColor:'rgba(255, 57, 57, 0.8)', 
        padding:5, 
        borderRadius:5
    }
})
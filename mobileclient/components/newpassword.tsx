import React, { useState } from 'react'
import { StyleSheet, TextInput, View, Text, Button, Alert } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { BACKEND_URL } from '../CONFIG'

interface Props {
    setTokenSent: React.Dispatch<React.SetStateAction<boolean>>,
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>
}

const NewPasswordComponent: React.FC<Props>= ({setTokenSent, setSuccess}) => {
    const [email, setEmail] = useState('');
    const [passToken, setPassToken] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const changePassword = async () => {
        if(!repeatPassword || !password || !passToken || !email) {
            setErrorMessage('Please fill all the fields.')
        }
        if(repeatPassword !== password) {
            setErrorMessage('Password and Repeat Password fields are different!');
            return
        };
        const response = await fetch(`${BACKEND_URL}/api/newpassword/`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({user: email, token: passToken, password:password})
        });
        if(response.status !== 200){
            const data = await response.json();
            setErrorMessage(await data.message);
            return
        }
        if(response.status === 200){
            setSuccess(true);
        }
        return
    }

    return(
        <View style={styles.loginWrapper}>

            <Text style={{width:'80%', textAlign:'center'}}>
                Please fill the fields below.
            </Text>

            <TextInput
                style={styles.input}
                onChangeText={(input) => setEmail(input)}
                value={email}
                placeholder='Email'
            />

            <TextInput
                style={styles.input}
                onChangeText={(input) => setPassToken(input)}
                value={passToken}
                placeholder='Password Reset Token'
            />

            <TextInput
                secureTextEntry={true}
                style={styles.input}
                onChangeText={(input) => setPassword(input)}
                value={password}
                placeholder='Password'
            />

            <TextInput
                secureTextEntry={true}
                style={styles.input}
                onChangeText={(input) => setRepeatPassword(input)}
                value={repeatPassword}
                placeholder='Repeat Password'
            />

            {errorMessage ?
            <View style={styles.errorView}>
            <Text style={{color:'lightgray'}}>{errorMessage}</Text>
            </View>: <></>}

            <View style={styles.buttons}>
                <Button 
                    onPress={() => setTokenSent(false)}
                    title='Back'
                    color='darkviolet'/>
                <Button 
                    onPress={() => changePassword()}
                    title='Change Password'
                    color='darkviolet'/>
            </View>

        </View>
    );
};

export default NewPasswordComponent

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
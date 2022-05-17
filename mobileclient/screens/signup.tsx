import React, { useState } from 'react'
import { StyleSheet, TextInput, View, Text, Button, Alert } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { BACKEND_URL } from '../CONFIG'

type RootStackParamList = {
    Login: undefined
};

interface NavigateProps {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

interface SignUp {
    email: string,
    password: string
}

const SignUpScreen = ({ navigation }: NavigateProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const signUp =  async () => {
        const signUpBody:SignUp = {email:email, password:password}
        try{
            const response = await fetch(`${BACKEND_URL}/api/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signUpBody)
            });
            if(response.status == 201){
                Alert.alert(
                    "Registration Successful!","You've signed up successfully! You can login now!",
                    [
                        {
                            text: "GO TO LOGIN PAGE",
                            onPress: () => navigation.navigate('Login'),
                        }
                    ],
                );
            };
            if(response.status == 400){
                const resData:SignUp = await response.json();
                if(resData.email){
                    setErrorMessage(`Email: ${resData.email}`);
                    return
                };
                if(resData.password){
                    setErrorMessage(`Password: ${resData.password}`);
                    return
                };
            }
        }
        catch(e) {
            e instanceof Error ? setErrorMessage(e.message): setErrorMessage(String(e));
        }
    }

    return(
        <View style={styles.loginWrapper}>
            <TextInput
                style={styles.input}
                onChangeText={(input) => setEmail(input)}
                value={email}
                placeholder='Email'
            />
            <TextInput
                secureTextEntry={true}
                style={styles.input}
                onChangeText={(number)=> setPassword(number)}
                value={password}
                placeholder="Password"
            />

            {errorMessage ?
            <View style={styles.errorView}>
            <Text style={{color:'lightgray'}}>{errorMessage}</Text>
            </View>: <></>}

            <View style={styles.buttons}>
                <Button 
                    onPress={() => signUp()}
                    title='Sign up'
                    color='darkviolet'/>
            </View>
        </View>
    );
};

export default SignUpScreen

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
        width:'70%',
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
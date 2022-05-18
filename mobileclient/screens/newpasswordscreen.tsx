import React, { useState } from 'react'
import { StyleSheet, TextInput, View, Text, Button, Alert } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import SendTokenComponent from '../components/sendtoken'
import NewPasswordComponent from '../components/newpassword'

import { BACKEND_URL } from '../CONFIG'

type RootStackParamList = {
    Login: undefined
};

interface NavigateProps {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

const NewPasswordScreen = ({ navigation }: NavigateProps) => {
    const [tokenSent, setTokenSent] = useState(false);
    const [success, setSuccess] = useState(false);

    return(
        <>
        {!tokenSent && <SendTokenComponent setTokenSent={setTokenSent}/>}
        {tokenSent && <NewPasswordComponent 
                            setTokenSent={setTokenSent}
                            setSuccess={setSuccess}
                            />}
        {success && 
            <View style={styles.loginWrapper}>
                <Text style={{color:'green', textAlign:'center'}}>
                    Password change was succesful!
                    You can now log in with your new password
                </Text>
                <Button 
                    onPress={() => navigation.navigate('Login')}
                    title='Back'
                    color='darkviolet'
                />
            </View>}
        </>
    );
};

export default NewPasswordScreen

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
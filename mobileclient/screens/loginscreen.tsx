import React, { useState, useContext } from 'react'
import { StyleSheet, TextInput, View, Text, Button } from 'react-native'
import { Switch } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {JwtTokenContext} from '../contexts/jwttoken'

type RootStackParamList = {
    Home: undefined
};

interface IPdpPageProps {
    navigation: NativeStackNavigationProp<RootStackParamList>
}


const LoginScreen = ({ navigation }: IPdpPageProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    const jwt = useContext(JwtTokenContext);

    if(jwt?.jwtRefreshToken && jwt?.jwtRefreshToken !== ''){
        console.log(`Jwt refresh token already found ${jwt?.jwtRefreshToken}`);
        navigation.navigate('Home');
    }

    const login = async () => {
        const response = await fetch(`http://192.168.0.242:8000/api/token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: email,
                password: password
            })
        });
        if(response.status == 200){
            const data = await response.json();
            jwt?.setJwtAccessToken(data.access);
            navigation.navigate('Home');
            if(!isSwitchOn){
                return
            }
            jwt?.setJwtRefreshToken(data.refresh);
        } else {
            setErrorMessage('Wrong email or password');
        };
    };

    return(
        <View style={styles.loginWrapper}>
            <Text>JwtAccessToken: {jwt?.jwtAccessToken}  JwtRefreshToken:{jwt?.jwtRefreshToken}</Text>
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

            <View style={{flexDirection:'row'}}>
            <Switch 
                color='darkviolet'
                value={isSwitchOn}
                onValueChange={onToggleSwitch}
                />
            <Text style={{alignSelf:'center'}}>Remember me</Text>
            </View>

            {errorMessage ?
            <View style={styles.errorView}>
            <Text style={{color:'lightgray'}}>{errorMessage}</Text>
            </View>: <></>}

            <View style={styles.buttons}>
                <Button 
                    onPress={() => login()}
                    title='Login'
                    color='darkviolet'/>
                <Button 
                    onPress={() => console.log('Bttn pressed')}
                    title='sign in'
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
        alignItems: 'center',
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
    },
    errorView: {
        backgroundColor:'rgba(255, 57, 57, 0.8)', 
        padding:5, 
        borderRadius:5
    }
})
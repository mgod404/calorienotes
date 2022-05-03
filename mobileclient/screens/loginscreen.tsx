import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, TextInput, View, Text, Button } from 'react-native'
import { Switch } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store'

import {JwtTokenContext} from '../contexts/jwttoken'

type RootStackParamList = {
    Home: undefined
};

interface NavigationProps {
    navigation: NativeStackNavigationProp<RootStackParamList>
}

interface NewAccessTokenResponse {
    access: string
}


const LoginScreen = ({ navigation }: NavigationProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    const jwt = useContext(JwtTokenContext);

    const getNewAccessToken = async () => {
        try{
            const response = await fetch(`http://192.168.0.242:8000/api/token/refresh/`,{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: `{"refresh":"${jwt?.jwtRefreshToken}"}`
            })
            if(response.status === 200){
                const data:NewAccessTokenResponse = await response.json();
                jwt?.setJwtAccessToken(data.access);
            }
        }
        catch (e){
            console.error(e);
        }
    }
    const checkForRefreshKeyInStorage = async () => {
        console.log(`checking if there is any key in storage`);
        const storageRefreshToken = await SecureStore.getItemAsync('jwt_refresh_token');
        if(storageRefreshToken){
            //REFRESH TOKEN SAVED AND FOUND, PROCEED 'REMEMBER ME' FUNC FROM HERE 
            jwt?.setJwtRefreshToken(storageRefreshToken);
            console.log(`Jwt refresh token already found ${jwt?.jwtRefreshToken}`);
            await getNewAccessToken();
            navigation.navigate('Home');
        }
    }

    useEffect(()=> {
        checkForRefreshKeyInStorage();
        getNewAccessToken();
    },[]);

    const login = async () => {
        try {
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
                if(isSwitchOn){
                    jwt?.setJwtRefreshToken(data.refresh);
                    SecureStore.setItemAsync('jwt_refresh_token', data.refresh);
                }
            } else {
                setErrorMessage('Wrong email or password');
            };
        }
        catch(e) {
            e instanceof Error ? setErrorMessage(e.message): setErrorMessage(String(e))
        }
    };

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
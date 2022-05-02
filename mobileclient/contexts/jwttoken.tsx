import React, { useState, useContext, createContext, useEffect } from 'react'
import * as SecureStore from 'expo-secure-store'

type JwtTokenContextType = {
    jwtAccessToken: string,
    jwtRefreshToken: string,
    userId: number,
    setJwtAccessToken: React.Dispatch<React.SetStateAction<string>>,
    setJwtRefreshToken: React.Dispatch<React.SetStateAction<string>>,
    setuserId: React.Dispatch<React.SetStateAction<number>>,
    getJwtRefreshTokenFromStorage: () => Promise<void>,
};
type jwtTokenContextProviderProps = {
    children: React.ReactNode
};

export const JwtTokenContext = createContext<JwtTokenContextType | null>(null);

export const JwtTokenContextProvider = ({children}:jwtTokenContextProviderProps) => {

    const [isItFirstRender, setIsItFirstRender] = useState(true)
    const getJwtRefreshTokenFromStorage = async () => {
        if(!isItFirstRender){
            return
        }
        console.log('That getter runs!');
        const token = await SecureStore.getItemAsync('jwt_refresh_token');
        setIsItFirstRender(false)
        return token ? setJwtRefreshToken(token) : setJwtAccessToken('')
    }

    const [jwtAccessToken, setJwtAccessToken] = useState('');
    const [jwtRefreshToken, setJwtRefreshToken] = useState('');
    const [userId, setuserId] = useState(0);

    useEffect(() => {
        SecureStore.setItemAsync('jwt_refresh_token', jwtRefreshToken);
        console.log(`useEffect for secureStore triggered, jwtRefreshToken here ${jwtRefreshToken}`);
    },[jwtRefreshToken]);

    return(
        <JwtTokenContext.Provider 
            value={{jwtAccessToken, jwtRefreshToken, userId, setJwtAccessToken, setJwtRefreshToken, setuserId, getJwtRefreshTokenFromStorage}}>
            {children}
        </JwtTokenContext.Provider>
    )
};

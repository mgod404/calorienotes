import React, { useState, useContext, createContext, useEffect } from 'react'


type JwtTokenContextType = {
    jwtAccessToken: string,
    jwtRefreshToken: string,
    userId: number,
    setJwtAccessToken: React.Dispatch<React.SetStateAction<string>>,
    setJwtRefreshToken: React.Dispatch<React.SetStateAction<string>>,
    setuserId: React.Dispatch<React.SetStateAction<number>>,
};
type jwtTokenContextProviderProps = {
    children: React.ReactNode
};

export const JwtTokenContext = createContext<JwtTokenContextType | null>(null);

export const JwtTokenContextProvider = ({children}:jwtTokenContextProviderProps) => {

    const [jwtAccessToken, setJwtAccessToken] = useState('');
    const [jwtRefreshToken, setJwtRefreshToken] = useState('');
    const [userId, setuserId] = useState(0);

    return(
        <JwtTokenContext.Provider 
            value={{
                jwtAccessToken, 
                jwtRefreshToken, 
                userId,
                setJwtAccessToken, 
                setJwtRefreshToken, 
                setuserId
            }}>
            {children}
        </JwtTokenContext.Provider>
    )
};

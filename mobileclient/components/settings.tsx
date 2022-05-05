import React, { useState } from 'react'
import { View, StyleSheet, Modal, Text, TextInput} from 'react-native'
import { IconButton, Button } from 'react-native-paper';

import { Meal } from '../screens/homescreen';

interface Props {
    setShowSettings: React.Dispatch<React.SetStateAction<boolean>>,
    targetCalories: number,
    setTargetCalories: React.Dispatch<React.SetStateAction<number>>,
    targetProtein: number,
    setTargetProtein: React.Dispatch<React.SetStateAction<number>>,
    logout: () => void,
    updateDiary: (passedMeals?: Meal[], passedNote?: string, passedTargetCalories?: number, passedTargetProtein?: number) => void
}

const SettingsComponent: React.FC<Props> = ({
    setShowSettings ,
    targetCalories, 
    setTargetCalories, 
    targetProtein, 
    setTargetProtein, 
    logout,
    updateDiary
    }) => {

    return(
        <Modal transparent visible={true}>
            <View style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.setting}>
                        <Text>Set calorie goal</Text>
                        <View style={styles.input}>
                            <TextInput 
                                keyboardType='numeric'
                                value={targetCalories.toString()}
                                onChangeText={(input) => {
                                    setTargetCalories(+input);
                                    updateDiary(undefined,undefined,+input);
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles.setting}>
                        <Text>Set protein goal</Text>
                        <View style={styles.input}>
                            <TextInput 
                                keyboardType='numeric'
                                value={targetProtein.toString()}
                                onChangeText={(input) => {
                                    setTargetProtein(+input);
                                    updateDiary(undefined,undefined,undefined,+input);
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles.buttons}>
                        <IconButton 
                            icon='check'
                            color='darkviolet'
                            onPress={() => setShowSettings(false)}
                        />
                        <Button
                            color='darkviolet'
                            onPress={()=> logout()}
                        >Logout</Button>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default SettingsComponent

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    card: {
        display:'flex',
        justifyContent:'center',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '80%',
        padding: 20,
        borderRadius: 5,
    },
    setting: {
        flexDirection:'row', 
        alignSelf:'stretch',
        justifyContent:'space-between'
    },
    input: {
        borderBottomColor: 'darkviolet',
        borderBottomWidth: 1,
    },
    buttons: {
        alignSelf:'stretch', 
        flexDirection:'row', 
        justifyContent:'space-between',
        marginTop: 10
    }
})
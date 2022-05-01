import React, { useState } from 'react'
import { View, StyleSheet, Modal, Text, TextInput} from 'react-native'
import { IconButton } from 'react-native-paper';

interface Props {
    setShowSettings: React.Dispatch<React.SetStateAction<boolean>>,
    targetCalories: number,
    setTargetCalories: React.Dispatch<React.SetStateAction<number>>,
    targetProtein: number,
    setTargetProtein: React.Dispatch<React.SetStateAction<number>>
}

const SettingsComponent: React.FC<Props> = ({setShowSettings ,targetCalories, setTargetCalories, targetProtein, setTargetProtein}) => {

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
                                onChangeText={(input) => setTargetCalories(Number(input))}
                            />
                        </View>
                    </View>
                    <View style={styles.setting}>
                        <Text>Set calorie goal</Text>
                        <View style={styles.input}>
                            <TextInput 
                                keyboardType='numeric'
                                value={targetProtein.toString()}
                                onChangeText={(input) => setTargetProtein(Number(input))}
                            />
                        </View>
                    </View>
                    <IconButton 
                        icon='check'
                        color='darkviolet'
                        onPress={() => setShowSettings(false)}
                    />
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
import React, { useState } from 'react'
import { View, StyleSheet, Modal, TextInput } from 'react-native'
import { IconButton } from 'react-native-paper';

import { Meal } from '../screens/homescreen';


export interface Props {
    note: string,
    setNote: React.Dispatch<React.SetStateAction<string>>,
    setShowAddNote: React.Dispatch<React.SetStateAction<boolean>>,
    updateDiary: (passedMeals?: Meal[], passedNote?: string) => void,
}

const AddNoteComponent: React.FC<Props> = (
    {
        note, 
        setNote, 
        setShowAddNote,
        updateDiary
    }) => {
    const [editedNote, setEditedNote] = useState(note);

    return (
        <Modal transparent visible={true}>
            <View style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.input}>
                        <TextInput 
                            multiline
                            placeholder="Write your note for today here."
                            value={editedNote}
                            onChangeText={setEditedNote}
                        />
                    </View>
                    <View style={styles.buttons}>
                        <IconButton 
                            icon='check'
                            color='darkviolet'
                            onPress={() => {
                                console.log(`note updated and passed to update ${editedNote}`);
                                updateDiary(undefined,editedNote);
                                setShowAddNote(false);
                            }}
                        />
                        <IconButton 
                            icon='close'
                            color='darkviolet'
                            onPress={() => {
                                setShowAddNote(false);
                            }}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}
export default AddNoteComponent;

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
        padding: 20,
        borderRadius: 5,
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
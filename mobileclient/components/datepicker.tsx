import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar  } from 'react-native'
import { Button, IconButton } from 'react-native-paper'
import DateTimePicker from '@react-native-community/datetimepicker'

interface Props {
    date: Date,
    setDate: React.Dispatch<React.SetStateAction<Date>>, 
}

const DatePickerComponent: React.FC<Props> = (props) => {
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChange = (event:any, selectedDate:Date | undefined) => {
    const currentDate = selectedDate;
    if(currentDate){
        props.setDate(currentDate);
    };
    setShow(false);
    };

    const showMode = (currentMode:string) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const changeDay = (date: Date, days: number): Date => {
        let newDate: Date = new Date(date);
        newDate.setDate(date.getDate() + days);
        return newDate;
    };

return (
    <SafeAreaView style={styles.AndroidSafeArea}>

        <IconButton 
            icon='chevron-left'
            style={styles.sideButton}
            size={40}
            color={'white'}
            onPress={() => props.setDate(changeDay(props.date, -1))}
            />
        <Button 
            style={styles.middleButton}
            mode='text' 
            onPress={showDatepicker}
            >
            <Text style={{fontSize:20}}>{props.date.toDateString()}</Text>
        </Button>
        <IconButton 
            icon='chevron-right'
            style={styles.sideButton}
            size={40}
            color={'white'}
            onPress={() => props.setDate(changeDay(props.date, +1))}
            />
        {show && (
        <DateTimePicker
            testID="dateTimePicker"
            value={props.date}
            mode={'date'}
            is24Hour={true}
            onChange={onChange}
            textColor ={'darkviolet'}
            style={{height:100}}
        />
        )}

    </SafeAreaView>
)}

const styles = StyleSheet.create({
    middleButton: {
        flex:0.6,
        display:'flex',
        justifyContent:'center',
        color:'#d5d8dc',
    },
    sideButton:{
        flex:0.2,
        display:'flex',
        justifyContent:'center',
        alignSelf:'center',
        color:'white'
    },
    buttonText: {
        display:'flex',
        justifyContent:'center',
        fontSize:50
    },
    AndroidSafeArea: {
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'darkviolet',
        height:110
    },
});

export default DatePickerComponent
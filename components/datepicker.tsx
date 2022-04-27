import React, { useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar  } from 'react-native'
import { Button } from 'react-native-paper'
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
      setShow(false);
      if(currentDate){
        props.setDate(currentDate);
      }
    };
  
    const showMode = (currentMode:string) => {
      setShow(true);
      setMode(currentMode);
    };
  
    const showDatepicker = () => {
      showMode('date');
    };
  
    const showTimepicker = () => {
      showMode('time');
    };



    const changeDay = (date: Date, days: number): Date => {
        let newDate: Date = new Date(Date.now());
        newDate.setDate(date.getDate() + days);
        return newDate;
    };

return (
    <SafeAreaView style={styles.AndroidSafeArea}>

        <Button 
            icon='chevron-left'
            style={styles.sideButton}
            labelStyle={{textAlign:'center'}}
            mode='text' 
            onPress={() => props.setDate(changeDay(props.date, -1))}
            >
        </Button>
        <Button 
            style={styles.middleButton}
            mode='text' 
            onPress={showDatepicker}
            >
            <Text>{props.date.toDateString()}</Text>
        </Button>
        <Button 
            icon='chevron-right'
            style={styles.sideButton}
            mode='text' 
            onPress={() => props.setDate(changeDay(props.date, +1))}
            >
        </Button>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={props.date}
            mode={'date'}
            is24Hour={true}
            onChange={onChange}
            textColor ={'darkviolet'}
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
        flex:0.20,
        display:'flex',
        justifyContent:'center'
    },
    buttonText: {
        display:'flex',
        justifyContent:'center'
    },
    AndroidSafeArea: {
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'darkviolet',
    },
});

export default DatePickerComponent
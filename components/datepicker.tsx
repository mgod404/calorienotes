import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import DatePicker from 'react-native-date-picker'
import { Button } from 'react-native-paper';

interface Props {
    date: Date,
    setDate: React.Dispatch<React.SetStateAction<Date>>, 
}

const DatePickerComponent: React.FC<Props> = (props) => {
    const [open, setOpen] = useState<boolean>(false);

    const changeDay = (date: Date, days: number): Date => {
        let newDate: Date = new Date(Date.now());
        newDate.setDate(date.getDate() + days);
        return newDate;
    };

return (
    <View style={styles.buttonsWrapper}>

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
            onPress={() => setOpen(true)}
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

        <DatePicker
            modal
            mode="date"
            open={open}
            date={props.date}
            onConfirm={(date) => {
                setOpen(false)
                props.setDate(date)
            }}
            onCancel={() => {
                setOpen(false)
            }}
        />

    </View>
)}

const styles = StyleSheet.create({
    buttonsWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'darkviolet',
    },
    middleButton: {
        flex:0.5,
        display:'flex',
        justifyContent:'center',
        color:'#d5d8dc',
    },
    sideButton:{
        flex:0.25,
        display:'flex',
        justifyContent:'center'
    },
    buttonText: {
        display:'flex',
        justifyContent:'center'
    }
});

export default DatePickerComponent
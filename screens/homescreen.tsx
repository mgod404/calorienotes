import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { IconButton, Text } from 'react-native-paper';

import DatePickerComponent from '../components/datepicker'
import MealListItemComponent from '../components/meallistitem'
import BottomBarComponent  from '../components/bottombar'
import AddMealComponent from '../components/addmeal';
import UpdateMealComponent from '../components/updatemeal';
import AddNoteComponent from '../components/addnote';
import SettingsComponent from '../components/settings';


export interface Meal {
    name: string,
    weight: number,
    carbs: number,
    fat: number,
    protein: number
}

const HomeScreen = () => {
    const [showAddMeal, setShowAddMeal] = useState(false);

    const [meal, setMeal] = React.useState<Meal>({
        name: '',
        weight: 0,
        carbs: 0,
        fat: 0,
        protein: 0,
    });

    const [showUpdateMeal, setShowUpdateMeal] = useState(false);
    const [updateMealIndex, setUpdateMealIndex] = useState<number>();

    const [date, setDate] = useState<Date>(new Date());
    const [meals, setMeals] = useState<Array<Meal>>([
        {
            name: 'French Fries',
            weight: 200,
            carbs: 50,
            fat: 30,
            protein: 10,
        },
        {
            name: 'Hamburger',
            weight: 500,
            carbs: 30,
            fat: 60,
            protein: 40,
        },
    ]);
    const [note, setNote] = useState('');
    const [showAddNote, setShowAddNote] = useState(false);

    const [showSettings, setShowSettings] = useState(false);

    const [targetCalories, setTargetCalories] = useState(2000);
    const [targetProtein, setTargetProtein] = useState(100);

    const [firstRender, setFirstRender] = useState(true);
    useEffect(() => {
        if(firstRender){
            setFirstRender(false);
            return
        }
        console.log('UseEffect Triggered. It would update notes for current day');
    },[meals, note]);
    useEffect(() => {console.log('UseEffect,it would retrieve data when date changed')},[date]);

    return (
        <View style={styles.container}>
            <DatePickerComponent 
                date={date} 
                setDate={setDate}
            />
            <MealListItemComponent 
                meals={meals}
                setMeals={setMeals} 
                setMeal={setMeal}
                setShowUpdateMeal={setShowUpdateMeal}
                setUpdateMealIndex={setUpdateMealIndex}
            />
            <TouchableOpacity onPress={() => setShowAddNote(true)}>
                <Text style={styles.noteTitle}>{note? 'Note' : ''}</Text>
                <Text style={{marginHorizontal:18}}>{note}</Text>
            </TouchableOpacity>
            <View style={styles.bottom}>
                <View style={styles.buttons}>
                    <IconButton 
                        onPress={() => setShowAddMeal(true)}
                        icon="plus-circle"
                        color={'darkviolet'}
                        size={60}
                        />
                    <IconButton 
                        icon="note-plus"
                        color={'darkviolet'}
                        size={60}
                        onPress={() => setShowAddNote(true)}
                        />
                </View>
                { showAddMeal && 
                    <AddMealComponent 
                        meal={meal}
                        setMeal={setMeal}
                        meals={meals}
                        setMeals={setMeals} 
                        setShowAddMeal={setShowAddMeal}
                    /> }
                { showUpdateMeal && 
                    <UpdateMealComponent 
                        setMeals={setMeals}
                        meals={meals}
                        setShowUpdateMeal={setShowUpdateMeal}
                        updateMealIndex={updateMealIndex}
                        meal={meal}
                        setMeal={setMeal}
                    /> }
                { showAddNote && 
                    <AddNoteComponent 
                        note={note}
                        setNote={setNote}
                        setShowAddNote={setShowAddNote}
                    />
                }
                { showSettings &&
                    <SettingsComponent 
                        setShowSettings={setShowSettings}
                        setTargetCalories={setTargetCalories}
                        setTargetProtein={setTargetProtein}
                        targetCalories={targetCalories}
                        targetProtein={targetProtein}
                    />
                }
                    <BottomBarComponent 
                        meals={meals}
                        setShowSettings={setShowSettings}
                        targetCalories={targetCalories}
                        targetProtein={targetProtein}
                    />
            </View>
        </View>
    );
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row-reverse',
    },
    noteTitle: {
        color:'darkviolet', 
        fontWeight:'bold', 
        textAlign:'center'
    }
});
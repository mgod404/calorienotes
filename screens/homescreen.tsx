import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Modal } from 'react-native'
import { IconButton, Text } from 'react-native-paper';

import DatePickerComponent from '../components/datepicker'
import MealListItemComponent from '../components/meallistitem'
import BottomBarComponent  from '../components/bottombar'
import AddMealComponent from '../components/addmeal';


export interface Meal {
    name: string,
    weight: number,
    carbs: number,
    fat: number,
    protein: number
}

const HomeScreen = () => {
    const [showAddMeal, setShowAddMeal] = useState(false);
    const [isNewMeal, setIsNewMeal] = useState(false);
    const [date, setDate] = useState<Date>(new Date());
    const [meal, setMeal] = React.useState<Meal>({
        name: '',
        weight: 0,
        carbs: 0,
        fat: 0,
        protein: 0,
    });
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

    return (
        <View style={styles.container}>
            <DatePickerComponent 
                date={date} 
                setDate={setDate}
            />
            <MealListItemComponent 
                setMeals={setMeals} 
                meals={meals}
                setIsNewMeal={setIsNewMeal}
                setShowAddMeal={setShowAddMeal}
            />
            <View style={styles.bottom}>
                <View style={styles.buttons}>
                    <IconButton 
                        onPress={() => {
                            setIsNewMeal(true);
                            setShowAddMeal(true);
                        }}
                        icon="plus-circle"
                        color={'darkviolet'}
                        size={60}
                        />
                    <IconButton 
                        icon="note-plus"
                        color={'darkviolet'}
                        size={60}
                        />
                </View>
                { showAddMeal && 
                    <AddMealComponent 
                        isNewMeal={isNewMeal}
                        meals={meals}
                        setMeals={setMeals} 
                        setShowAddMeal={setShowAddMeal}
                        meal={meal}
                        setMeal={setMeal}
                    />}
                <BottomBarComponent />
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
    }
});
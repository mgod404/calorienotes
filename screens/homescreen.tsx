import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Appbar, Text } from 'react-native-paper';

import DatePickerComponent from '../components/datepicker'
import MealListItemComponent from '../components/meallistitem'
import BottomBarComponent  from '../components/bottombar'

interface Meal {
    name: string,
    weight: number,
    carbs: number,
    fat: number,
    protein: number
}

const HomeScreen = () => {
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

    return (
        <View style={styles.container}>
            <DatePickerComponent date={date} setDate={setDate}/>
            <MealListItemComponent meals={meals}/>
            <BottomBarComponent />
        </View>
    );
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
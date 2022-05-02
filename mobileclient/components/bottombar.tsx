import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Appbar, Text, IconButton } from 'react-native-paper';

import { Meal } from '../screens/homescreen';
interface Props {
    meals: Meal[],
    setShowSettings: React.Dispatch<React.SetStateAction<boolean>>,
    targetCalories: Number,
    targetProtein: Number
}
const BottomBarComponent: React.FC<Props> = ({meals, setShowSettings, targetCalories, targetProtein}) => {

    const countTotalMacro = (field:string) => {
        let total = 0;
        meals && meals.forEach(element => total += (Number(element[field as keyof Meal]) * element.weight/100) );
        return Math.round(total)
    };
    const countTotalCalories = meals.reduce((total, meal) => {
            return Math.round(total + (meal.weight / 100 * (meal.carbs * 4 + meal.fat * 9 + meal.protein * 4)))
        }, 0);

    return(
        <Appbar style={styles.barView}>
            <View style={styles.totalView}>
                <IconButton 
                    icon='cog-outline'
                    color='darkviolet'
                    onPress={() => setShowSettings(true)}
                />
            </View>
            <View style={styles.totalView}>
                <Text>
                    Carbs
                </Text>
                <Text>
                    {countTotalMacro('carbs')}
                </Text>
            </View>
            <View style={styles.totalView}>
                <Text>
                    Fat
                </Text>
                <Text>
                    {countTotalMacro('fat')}
                </Text>
            </View>
            <View style={styles.totalView}>
                <Text style={Number(countTotalMacro('protein')) < targetCalories ? styles.redFont : styles.greenFont}>
                    Protein
                </Text>
                <Text style={Number(countTotalMacro('protein')) < targetCalories ? styles.redFont : styles.greenFont}>
                    {countTotalMacro('protein')} / {targetProtein}
                </Text>
            </View>
            <View style={styles.totalView}>
                <Text style={countTotalCalories > targetCalories ? styles.redFont : styles.greenFont}>
                    Total Calories
                </Text>
                <Text style={countTotalCalories > targetCalories ? styles.redFont : styles.greenFont}>
                    {countTotalCalories} / {targetCalories}
                </Text>
            </View>
        </Appbar>
    );
};

export default BottomBarComponent

const styles = StyleSheet.create({
    barView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    totalView: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    redFont: {
        color: 'red'
    },
    greenFont: {
        color: 'green'
    }
})
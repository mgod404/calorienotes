import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Appbar, Text, IconButton } from 'react-native-paper';

import { Meal } from '../screens/homescreen';
interface Props {
    meals: Meal[]
}
const BottomBarComponent: React.FC<Props> = ({meals}) => {

    const countTotalMacro = (field:string) => {
        let total = 0;
        meals && meals.forEach(element => total += (Number(element[field as keyof Meal]) * element.weight/100) );
        return total
    };
    const countTotalCalories = meals.reduce((total, meal) => {
            return total + (meal.weight / 100 * (meal.carbs * 4 + meal.fat * 9 + meal.protein * 4))
        }, 0);

    return(
        <Appbar style={styles.barView}>
            <View style={styles.totalView}>
                <IconButton 
                    icon='cog-outline'
                    color='darkviolet'
                />
            </View>
            <View style={styles.totalView}>
                <Text>
                    Carbs
                </Text>
                <Text style={styles.centerText}>
                    {countTotalMacro('carbs')}
                </Text>
            </View>
            <View style={styles.totalView}>
                <Text>
                    Fats
                </Text>
                <Text style={styles.centerText}>
                    {countTotalMacro('fat')}
                </Text>
            </View>
            <View style={styles.totalView}>
                <Text>
                    Proteins
                </Text>
                <Text style={styles.centerText}>
                    {countTotalMacro('protein')}
                </Text>
            </View>
            <View style={styles.totalView}>
                <Text>
                    Total Calories
                </Text>
                <Text style={styles.centerText}>
                    {countTotalCalories}
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
        justifyContent: 'center'
    },
    centerText: {
        textAlign: 'center'
    }
})
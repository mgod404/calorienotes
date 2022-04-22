import React, { useState } from 'react'
import { Text, View, StyleSheet, FlatList } from 'react-native'
import { useTheme, DataTable } from 'react-native-paper';


interface Meal {
    name: string,
    weight: number,
    carbs: number,
    fat: number,
    protein: number
}

interface Props {
    meals: Meal[]
}

const MealListItemComponent:React.FC<Props> = (props) => {

    const countCalories = (carbs:number, fat:number, protein:number) => {
        const calories:number = carbs * 4 + fat * 9 + protein * 4;
        return calories
    }

    return(
        <DataTable>
            <DataTable.Header>
                <DataTable.Title>Meal</DataTable.Title>
                <DataTable.Title numeric>Carbs</DataTable.Title>
                <DataTable.Title numeric>Fat</DataTable.Title>
                <DataTable.Title numeric>Protein</DataTable.Title>
                <DataTable.Title numeric>Calories</DataTable.Title>
            </DataTable.Header>

            {props.meals.map((meal, index) => (
                <DataTable.Row key={index}>
                    <DataTable.Cell>{meal.name}</DataTable.Cell>
                    <DataTable.Cell numeric>{meal.carbs}</DataTable.Cell>
                    <DataTable.Cell numeric>{meal.fat}</DataTable.Cell>
                    <DataTable.Cell numeric>{meal.protein}</DataTable.Cell>
                    <DataTable.Cell numeric>{countCalories(meal.carbs,meal.fat,meal.protein)}</DataTable.Cell>
                </DataTable.Row>
            ))}
        </DataTable>
    )
}

export default MealListItemComponent

import React, { useState } from 'react'
import { Alert, TouchableOpacity } from 'react-native'
import { IconButton, DataTable } from 'react-native-paper';

import { Meal } from '../screens/homescreen'

interface Props {
    meals: Meal[],
    setMeals: React.Dispatch<React.SetStateAction<Meal[]>>,
    setMeal: React.Dispatch<React.SetStateAction<Meal>>,
    setShowUpdateMeal:  React.Dispatch<React.SetStateAction<boolean>>,
    setUpdateMealIndex: React.Dispatch<React.SetStateAction<number | undefined>>,
}

const MealListItemComponent:React.FC<Props> = ({meals, setMeals, setMeal, setShowUpdateMeal, setUpdateMealIndex}) => {

    const countCalories = (weight:number, carbs:number, fat:number, protein:number) => {
        return (weight / 100 * (carbs * 4 + fat * 9 + protein * 4))
    }

    const removeMealAlert = (indexPassed: number, mealName: string) => {
        Alert.alert(`Delete ${mealName}`,`Are you sure you want to delete ${mealName}`,
        [
            {
                text:'Yes',
                onPress: () => removeMeal(indexPassed)
            },
            {
                text: "No",
            },
        ],
        );
    }

    const removeMeal = (indexPassed: number) => {
        let newMeals:Meal[] = meals.filter((element,index) => index != indexPassed);
        setMeals(newMeals);
    }

    return(
        <DataTable>
            <DataTable.Header>
                <DataTable.Title>Meal</DataTable.Title>
                <DataTable.Title numeric>Protein</DataTable.Title>
                <DataTable.Title numeric>Calories</DataTable.Title>
                <DataTable.Title numeric>Remove</DataTable.Title>
            </DataTable.Header>

            {meals.map((meal, index) => (
                <TouchableOpacity key={index} onPress={() => {
                    setShowUpdateMeal(true);
                    setMeal({
                        name: meal.name,
                        weight: meal.weight,
                        carbs: meal.carbs,
                        fat: meal.fat,
                        protein: meal.protein
                    });
                    setUpdateMealIndex(index);
                }}>
                    <DataTable.Row>
                        <DataTable.Cell>{meal.name}</DataTable.Cell>
                        <DataTable.Cell numeric>{meal.protein * meal.weight/100}</DataTable.Cell>
                        <DataTable.Cell numeric>{countCalories(meal.weight,meal.carbs,meal.fat,meal.protein)}</DataTable.Cell>
                        <DataTable.Cell numeric>
                            <IconButton 
                                icon='delete-outline'
                                color='darkviolet'
                                onPress={(e) => {
                                    e.stopPropagation();
                                    removeMealAlert(index,meal.name);
                                }}
                            />
                        </DataTable.Cell>
                    </DataTable.Row>
                </TouchableOpacity>
            ))}
        </DataTable>
    )
}

export default MealListItemComponent
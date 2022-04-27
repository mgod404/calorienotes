import React, { useState } from 'react'
import { Alert, TouchableOpacity } from 'react-native'
import { IconButton, DataTable } from 'react-native-paper';

import { Meal } from '../screens/homescreen'

interface Props {
    meals: Meal[],
    setMeals: React.Dispatch<React.SetStateAction<Meal[]>>,
    setShowAddMeal: React.Dispatch<React.SetStateAction<boolean>>,
    setIsNewMeal: React.Dispatch<React.SetStateAction<boolean>>
}

const MealListItemComponent:React.FC<Props> = ({meals, setMeals, setShowAddMeal, setIsNewMeal}) => {

    const countCalories = (carbs:number, fat:number, protein:number) => {
        const calories:number = carbs * 4 + fat * 9 + protein * 4;
        return calories
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
                    setIsNewMeal(false);
                    setShowAddMeal(true);
                }}>
                    <DataTable.Row>
                        <DataTable.Cell>{meal.name}</DataTable.Cell>
                        <DataTable.Cell numeric>{meal.protein * meal.weight/100}</DataTable.Cell>
                        <DataTable.Cell numeric>{countCalories(meal.carbs,meal.fat,meal.protein)}</DataTable.Cell>
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
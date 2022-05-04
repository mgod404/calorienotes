// import React in our code
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Searchbar, List } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';

import { Meal } from '../screens/homescreen';

interface Props {
    meal: Meal,
    setMeal: React.Dispatch<React.SetStateAction<Meal>>
}

const MealSearchBarComponent: React.FC<Props> = ({ meal, setMeal }) => {
    const [searchResultsVisible, setSearchResultsVisible] = useState(false);
    const [searchedMeal, setSearchedMeal] = useState('');
    const [foundMealsList, setFoundMealsList] = useState<Meal[]>();

    useEffect(()=> {
        setMeal({...meal, name: searchedMeal})
    },[searchedMeal]);
    useEffect(()=> {
        setSearchedMeal(meal.name);
    },[meal.name]);

    const searchLocalStorageForMeal = async (mealName:string) => {
        const localStorageMeals = await SecureStore.getItemAsync('meals');
        if(!localStorageMeals){
            SecureStore.setItemAsync('meals', '[]')
            return
        };
        const localStorageMealsParsed:Meal[] = JSON.parse(localStorageMeals);
        const mealsFound = localStorageMealsParsed.filter(element => element.name.toLowerCase().includes(mealName.toLowerCase()));
        return mealsFound
    };
    const search = async (mealName: string) => {
        setSearchedMeal(mealName);
        if(mealName){
            setSearchResultsVisible(true);
            setFoundMealsList(await searchLocalStorageForMeal(mealName));
            console.log(foundMealsList);
        }else{
            setSearchResultsVisible(false);
            setFoundMealsList([]);
        }
    };
    const removeMealFromStorage = async (mealName: string) => {
        const localStorage = await SecureStore.getItemAsync('meals');
        if(!localStorage){
            return
        }
        const localStorageParsed: Meal[] = await JSON.parse(localStorage);
        const newLocalStorage = localStorageParsed.filter(element => element.name !== mealName);
        SecureStore.setItemAsync('meals', JSON.stringify(newLocalStorage));
        setSearchedMeal('');
        setFoundMealsList(foundMealsList?.filter(element => element.name !== mealName));
    };
    return(
        <View style={{flex:1}}>
            <Searchbar 
            placeholder='Meal Name'
            value={searchedMeal}
            onChangeText={input => search(input)}
            />
            {searchResultsVisible && foundMealsList && foundMealsList.map((element, index) => 
                (<TouchableOpacity
                    key={index}
                    onPress={() => {
                        setMeal({
                            name: element.name,
                            weight: element.weight,
                            carbs: element.carbs,
                            fat: element.fat,
                            protein: element.protein
                        });
                        setFoundMealsList([]);
                        setSearchedMeal(element.name);
                    }}
                >
                    <List.Item
                        style={styles.searchResult}
                        title={element.name}
                        description={`Carbs: ${element.carbs} Fat:${element.fat} Protein:${element.protein}`}
                        right={props => 
                            <TouchableOpacity
                                onPress={(e) => {
                                    e.preventDefault();
                                    removeMealFromStorage(element.name);
                                }}
                            >
                                <List.Icon 
                                    {...props} 
                                    icon='window-close'
                                />
                            </TouchableOpacity>}
                    />
                </TouchableOpacity>)
            )}
        </View>
    )
}

export default MealSearchBarComponent

const styles = StyleSheet.create({
    searchResult:{
        elevation: 1
    }
})
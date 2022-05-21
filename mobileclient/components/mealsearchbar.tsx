// import React in our code
import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Searchbar, List } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';

import { JwtTokenContext } from '../contexts/jwttoken';
import { BACKEND_URL } from '../CONFIG';

import { Meal } from '../screens/homescreen';

interface Props {
    meal: Meal,
    setMeal: React.Dispatch<React.SetStateAction<Meal>>
}

const MealSearchBarComponent: React.FC<Props> = ({ meal, setMeal }) => {
    const [searchResultsVisible, setSearchResultsVisible] = useState(false);
    const [fetchedMealsList, setFetchedMealsList] =useState<Meal[]>();
    const [foundMealsList, setFoundMealsList] = useState<Meal[]>();
    const jwt = useContext(JwtTokenContext);

    useEffect(()=>{
        fetchMealsList();
    },[]);

    const fetchMealsList = async () => {
        const response = await fetch(`${BACKEND_URL}/api/mealslist/`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwt?.jwtAccessToken}`,
                'Content-Type': 'application/json'
            }
        });
        if(response.status == 200){
            const data = await response.json();
            const mealsList:Meal[] = await data.mealslist;
            setFetchedMealsList(mealsList);
        }
    }
    const searchLocalStorageForMeal = async (mealName:string) => {
            if(!fetchedMealsList){
                return
            };
            console.log(JSON.stringify(fetchedMealsList[1]));
            const mealsFound = fetchedMealsList.filter(element => element.name.toLowerCase().includes(mealName.toLowerCase()));
            if(mealsFound){
                return mealsFound
            };
    };
    const search = async (mealName: string) => {
        setMeal({...meal ,name: mealName});
        if(mealName){
            setSearchResultsVisible(true);
            setFoundMealsList(await searchLocalStorageForMeal(mealName));
        }else{
            setSearchResultsVisible(false);
            setFoundMealsList([]);
        }
    };
    const removeMealFromStorage = async (mealName: string) => {
        const response = await fetch(`${BACKEND_URL}/api/mealslist/`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwt?.jwtAccessToken}`,
                'Content-Type': 'application/json'
            }
        });
        if(response.status == 200){
            const data = await response.json();
            const mealsList:Meal[] = await data.mealslist;
            const mealsListWithItemRemoved = mealsList.filter(element => element.name !== mealName);
            const updatedMealsList = JSON.stringify(mealsListWithItemRemoved);
            const update = await fetch(`${BACKEND_URL}/api/mealslist/`,{
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${jwt?.jwtAccessToken}`,
                    'Content-Type': 'application/json'
                },
                body: `{"mealslist": ${updatedMealsList}}`
            });
            if(update.status !== 200){
                alert(`Error occured while removing meal from database. Please try again later!`);
            };
            setMeal({...meal, name:''});
            setFoundMealsList([]);
            setFetchedMealsList(mealsListWithItemRemoved);
        };
    };

    return(
        <View style={{flex:1}}>
            <Searchbar 
            placeholder='Meal Name'
            value={meal.name}
            onChangeText={input => search(input)}
            style={{elevation:0, borderBottomWidth:1.5, borderBottomColor: 'darkviolet'}}
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
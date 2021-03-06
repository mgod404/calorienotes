import React, { useState } from 'react'
import { View, StyleSheet, Modal, TextInput } from 'react-native'
import { Button, IconButton, Text } from 'react-native-paper';

import BarCodeScannerComponent from './barcodescanner';

import { Meal } from '../screens/homescreen';


interface Props {
    meals: Meal[],
    setShowUpdateMeal: React.Dispatch<React.SetStateAction<boolean>>,
    updateMealIndex: number | undefined,
    meal: Meal,
    setMeal: React.Dispatch<React.SetStateAction<Meal>>,
    updateDiary: (passedMeals?: Meal[], passedNote?: string) => void,
}

const UpdateMealComponent: React.FC<Props> = (
    { 
        meals, 
        setShowUpdateMeal, 
        updateMealIndex, 
        meal, 
        setMeal,
        updateDiary,
    }) => {

    const updateMeals = (passedIndex:number | undefined, updatedMeal:Meal) => {
        if(passedIndex === undefined){
            alert('undefined Index, cannot update meal');
            return
        }
        let newMeals = meals.filter((element,index) => index !== passedIndex);
        newMeals = [...newMeals, updatedMeal];
        updateDiary(newMeals);
    }

    const countCalories = () => {
        return (meal.weight / 100 * (meal.carbs * 4 + meal.fat * 9 + meal.protein * 4))
    }

    return(
        <Modal transparent visible={true}>
            <View style={styles.container}>
                <View style={styles.card}>
                    <IconButton 
                        style={{alignSelf:'flex-end'}}
                        icon='window-close' 
                        onPress={() => {
                            setShowUpdateMeal(false);
                            setMeal({
                                name: '',
                                weight: 0,
                                carbs: 0,
                                fat: 0,
                                protein: 0,
                            });
                        }}
                    />
                        <View style={{display:'flex', flexDirection: 'row',}}>
                            <TextInput
                                style={styles.nameInput}
                                onChangeText={(input) => setMeal({...meal, name: input})}
                                value={meal.name}
                                placeholder='Meal Name'
                            />
                        </View>
                        <View style={{alignSelf:'stretch', flexDirection: 'row',justifyContent:'space-between'}}>
                        <Text style={styles.inputDescription}>Weight(g)</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(input) => setMeal({...meal, weight: Number(input)})}
                            value={String(meal.weight)}
                            placeholder='Weight (g)'
                            keyboardType='numeric'
                        />
                        </View>
                        <View style={{alignSelf:'stretch', flexDirection: 'row',justifyContent:'space-between'}}>
                        <Text style={styles.inputDescription}>Carbs(g per 100g)</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(input) => setMeal({...meal, carbs: Number(input)})}
                            value={String(meal.carbs)}
                            placeholder='Carbs (g per 100g)'
                            keyboardType='numeric'
                        />
                        </View>
                        <View style={{alignSelf:'stretch', flexDirection: 'row',justifyContent:'space-between'}}>
                        <Text style={styles.inputDescription}>Fat(g per 100g)</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(input) => setMeal({...meal, fat: Number(input)})}
                            value={String(meal.fat)}
                            placeholder='Fat (g per 100g)'
                            keyboardType='numeric'
                        />
                        </View>
                        <View style={{alignSelf:'stretch', flexDirection: 'row',justifyContent:'space-between'}}>
                        <Text style={styles.inputDescription}>Protein(g per 100g)</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(input) => setMeal({...meal, protein: Number(input)})}
                            value={String(meal.protein)}
                            placeholder='Protein (g per 100g)'
                            keyboardType='numeric'
                        />
                        </View>

                    <View style={{ flexDirection:'row' ,justifyContent:'center', marginTop:60}}>
                        <View style={styles.calorieCount}>
                            <Text style={{ fontWeight:'bold' }}>Calories in the meal</Text>
                            <Text>{countCalories().toFixed()}</Text>
                        </View>
                        <Button 
                            style={styles.flexBttn} 
                            color='darkviolet' 
                            mode='contained'
                            onPress={() => {
                                if(meal.weight == 0){
                                    alert(`Please, set value for food weight.`);
                                    return
                                }
                                updateMeals(updateMealIndex, meal);
                                setShowUpdateMeal(false);
                            }}
                            >
                                Update Meal
                        </Button>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    card: {
        display:'flex',
        justifyContent:'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 5,
    },
    input: {
        height: 40,
        width: 50,
        margin: 12,
        borderBottomWidth: 1.3,
        borderColor:'darkviolet',
        padding: 10,
    },
    nameInput: {
        height: 40,
        width: 300,
        margin: 12,
        borderBottomWidth: 1.3,
        borderColor:'darkviolet',
        padding: 10,
    },
    inputDescription: {
        alignSelf:'flex-end',
        margin:12, 
        fontSize:23,
    },
    flexBttn: {
        marginRight: 20,
    },
    calorieCount: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal:10,
    }
})


export default UpdateMealComponent
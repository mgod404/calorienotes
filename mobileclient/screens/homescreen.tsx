import React, { useState, useEffect, useContext } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { IconButton, Text } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store'

import { JwtTokenContext } from '../contexts/jwttoken';

import DatePickerComponent from '../components/datepicker'
import MealListItemComponent from '../components/meallistitem'
import BottomBarComponent  from '../components/bottombar'
import AddMealComponent from '../components/addmeal';
import UpdateMealComponent from '../components/updatemeal';
import AddNoteComponent from '../components/addnote';
import SettingsComponent from '../components/settings';

type RootStackParamList = {
    Login: undefined
};

interface NavigateProps {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

interface NoteFetchData {
    date: string,
    meals: Meal[],
    additional_note: string
}

export interface Meal {
    name: string,
    weight: number,
    carbs: number,
    fat: number,
    protein: number
}

const HomeScreen = ({ navigation }: NavigateProps) => {
    const [showAddMeal, setShowAddMeal] = useState(false);
    const [meal, setMeal] = React.useState<Meal>({
        name: '',
        weight: 0,
        carbs: 0,
        fat: 0,
        protein: 0,
    });
    const [showUpdateMeal, setShowUpdateMeal] = useState(false);
    const [updateMealIndex, setUpdateMealIndex] = useState<number>();

    const [date, setDate] = useState<Date>(new Date());

    const [meals, setMeals] = useState<Array<Meal>>([]);
    const [note, setNote] = useState('');
    const [showAddNote, setShowAddNote] = useState(false);

    const [showSettings, setShowSettings] = useState(false);

    const [targetCalories, setTargetCalories] = useState(2000);
    const [targetProtein, setTargetProtein] = useState(100);


    const createDiary = () => {
        const [stringifyDate] = date.toISOString().split('T');
        const bodyPost:NoteFetchData = {
            date: stringifyDate,
            meals: meals,
            additional_note: note,
        };
        fetch(`http://192.168.0.242:8000/api/notes/create/`,{
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt?.jwtAccessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyPost),
        })
            .then(res => res.json())
            .catch(e => console.log(e));
    };
    const getDiary = async () => {
        try {
            const response = await fetch(`http://192.168.0.242:8000/api/notes/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,{
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwt?.jwtAccessToken}`,
                },
            });
            if(response.status == 404){
                return
            }
            if(response.status == 200){
                console.log('Meals found, no need to create')
                const data:NoteFetchData = await response.json();
                setMeals(data.meals);
                setNote(data.additional_note);
            }
        }
        catch (e){
            console.error(e);
        }
    }
    const update = async (inputMeals: Meal[], inputNote:string) => {
        const [stringifyDate] = date.toISOString().split('T');
        const bodyPost:NoteFetchData = {
            date: stringifyDate,
            meals: inputMeals,
            additional_note: inputNote,
        };
        try{
            const response = await fetch(`http://192.168.0.242:8000/api/notes/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${jwt?.jwtAccessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyPost)
            });
            if(response.status == 200){
                console.log('Everything went smoothly, it was updated');
            };
            if(response.status == 404){
                console.log('meals not found. Creating them');
                createDiary();
            }
            console.log(response.status)
        }
        catch (e){
            console.error(e);
        }
    }

    //When date changes, the content of app changes(meals, note)
    useEffect(() => {
        setMeals([]);
        setNote('');
        getDiary();
    },[date]);

    const jwt = useContext(JwtTokenContext);
    const logout = () => {
        jwt?.setJwtRefreshToken('');
        SecureStore.deleteItemAsync('jwt_refresh_token');
        navigation.navigate('Login');
    }

    const updateDiary = (passedMeals = meals, passedNote = note) => {
        setNote(passedNote);
        setMeals(passedMeals);
        update(passedMeals, passedNote);
    }


    return (
        <View style={styles.container}>
            <DatePickerComponent 
                date={date} 
                setDate={setDate}
            />
            <MealListItemComponent 
                meals={meals}
                setMeals={setMeals} 
                setMeal={setMeal}
                setShowUpdateMeal={setShowUpdateMeal}
                setUpdateMealIndex={setUpdateMealIndex}
                updateDiary={updateDiary}
            />
            <TouchableOpacity onPress={() => setShowAddNote(true)}>
                <Text style={styles.noteTitle}>{note? 'Note' : ''}</Text>
                <Text style={{marginHorizontal:18}}>{note}</Text>
            </TouchableOpacity>
            <View style={styles.bottom}>
                <View style={styles.buttons}>
                    <IconButton 
                        onPress={() => setShowAddMeal(true)}
                        icon="plus-circle"
                        color={'darkviolet'}
                        size={60}
                        />
                    <IconButton 
                        icon="note-plus"
                        color={'darkviolet'}
                        size={60}
                        onPress={() => setShowAddNote(true)}
                        />
                </View>
                { showAddMeal && 
                    <AddMealComponent 
                        meal={meal}
                        setMeal={setMeal}
                        meals={meals}
                        setMeals={setMeals} 
                        setShowAddMeal={setShowAddMeal}
                        updateDiary={updateDiary}
                    /> }
                { showUpdateMeal && 
                    <UpdateMealComponent 
                        setMeals={setMeals}
                        meals={meals}
                        setShowUpdateMeal={setShowUpdateMeal}
                        updateMealIndex={updateMealIndex}
                        meal={meal}
                        setMeal={setMeal}
                        updateDiary={updateDiary}
                    /> }
                { showAddNote && 
                    <AddNoteComponent 
                        note={note}
                        setNote={setNote}
                        setShowAddNote={setShowAddNote}
                        updateDiary={updateDiary}
                    />
                }
                { showSettings &&
                    <SettingsComponent 
                        setShowSettings={setShowSettings}
                        setTargetCalories={setTargetCalories}
                        setTargetProtein={setTargetProtein}
                        targetCalories={targetCalories}
                        targetProtein={targetProtein}
                        logout={logout}
                    />
                }
                    <BottomBarComponent 
                        meals={meals}
                        setShowSettings={setShowSettings}
                        targetCalories={targetCalories}
                        targetProtein={targetProtein}
                    />
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
    },
    noteTitle: {
        color:'darkviolet', 
        fontWeight:'bold', 
        textAlign:'center'
    }
});
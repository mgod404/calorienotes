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

export interface Meal {
    name: string,
    weight: number,
    carbs: number,
    fat: number,
    protein: number
}
interface TargetMacros {
    target_calories: number,
    target_protein: number,
}

interface DiaryFetchData {
    date: string,
    meals: Meal[],
    additional_note: string,
    target_macros: TargetMacros
}

interface DiaryGetData {
    diary: DiaryFetchData[]
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

    const [diaryData, setDiaryData] = useState<DiaryFetchData[]>();
    const setInitialDiaryData = async () => {
        try{
            const response = await fetch(`http://192.168.0.242:8000/api/diary/`,{
                method:'GET',
                headers: {
                    'Authorization': `Bearer ${jwt?.jwtAccessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            if(response.status == 200){
                const data = await response.json();
                const diary:DiaryFetchData[] = await data.diary;
                setDiaryData(diary);
                const isoDate = date.toISOString().split('T');
                const filteredDiary = diary.filter(element => element.date === isoDate[0]);
                if(filteredDiary[0]) {
                    const DiaryToday = filteredDiary[0];
                    setMeals(DiaryToday.meals);
                    setNote(DiaryToday.additional_note);
                    setTargetCalories(DiaryToday.target_macros.target_calories);
                    setTargetProtein(DiaryToday.target_macros.target_protein);
                }
                return
            }
            if(response.status == 404){
                const isoDate = date.toISOString().split('T');
                const newDayData:DiaryFetchData = {
                    date: isoDate[0],
                    meals: [],
                    additional_note: '',
                    target_macros: {
                        target_calories:targetCalories,
                        target_protein:targetProtein,
                    }
                }
                const newDayDataParsed:DiaryGetData = {diary: [newDayData]};
                const createDiary = await fetch(`http://192.168.0.242:8000/api/diary/create/`, {
                    method:'POST',
                    headers: {
                        'Authorization': `Bearer ${jwt?.jwtAccessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newDayDataParsed)
                });
                if(createDiary.status == 201) {
                    console.log('New Diary created');
                    setDiaryData([newDayData]);
                } else {
                    console.log(`Couldn't create new diary ${createDiary.status}`);
                }
                return
            } 
            console.log(`Unknown problem, code status ${response.status} accesstoken ${jwt?.jwtAccessToken}`);
        }
        catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        setInitialDiaryData();
    },[]);

    const update = async (inputMeals: Meal[], inputNote:string, inputTargetCalories: number, inputTargetProtein: number) => {
        console.log('Updating Diary');
        if(diaryData){
            const isoDate = date.toISOString().split('T');
            const diaryWithoutUpdatedDay = diaryData.filter(element => element.date !== isoDate[0]);
            const newDateData:DiaryFetchData = {
                date: isoDate[0],
                meals: inputMeals,
                additional_note: inputNote,
                target_macros: {
                    target_protein: inputTargetProtein,
                    target_calories: inputTargetCalories,
                }
            }
            setDiaryData([...diaryWithoutUpdatedDay, newDateData]);
            const updateBody = JSON.stringify({diary: diaryData});
            const updateDiary = await fetch(`http://192.168.0.242:8000/api/diary/`, {
                method:'PUT',
                headers: {
                    'Authorization': `Bearer ${jwt?.jwtAccessToken}`,
                    'Content-Type': 'application/json'
                },
                body: updateBody
            });
            console.log(updateDiary.status);
        } else {
            console.log('Diary data not found');
        }
    }

    const getDiary = async () => {
        if(diaryData){
            console.log('changin date');
            const isoDate = date.toISOString().split('T');
            const dayData = diaryData.filter(element => element.date === isoDate[0])
            if(!dayData[0]){
                return
            }
            console.log(dayData[0]);
            setNote(dayData[0].additional_note);
            setMeals(dayData[0].meals);
            if(dayData[0].target_macros.target_calories){
                setTargetCalories(dayData[0].target_macros.target_calories);
            }
            if(dayData[0].target_macros.target_protein){
                setTargetProtein(dayData[0].target_macros.target_protein);
            }
        }
    }

    //When date changes, the content of app changes(meals, note)
    useEffect(() => {
        console.log(JSON.stringify(diaryData));
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

    const updateDiary = (
        passedMeals = meals, 
        passedNote = note, 
        passedTargetCalories = targetCalories, 
        passedTargetProtein = targetProtein
    ) => {
        console.log('fn ran');
        setNote(passedNote);
        setMeals(passedMeals);
        setTargetCalories(passedTargetCalories);
        setTargetProtein(passedTargetProtein);
        update(passedMeals, passedNote, passedTargetCalories,passedTargetProtein);
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
                        updateDiary={updateDiary}
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
import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, StatusBar, Platform } from 'react-native'
import { IconButton } from 'react-native-paper';
import { Button } from 'react-native-paper'
import { BarCodeScanner } from 'expo-barcode-scanner'

import { Meal } from '../screens/homescreen';

interface Props {
    setShowBarCodeScanner: React.Dispatch<React.SetStateAction<boolean>>,
    setMeal: React.Dispatch<React.SetStateAction<Meal>>,
}

const BarCodeScannerComponent: React.FC<Props> = ({setShowBarCodeScanner, setMeal}) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
    (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
    })();
    }, []);

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    const fetchFoodData = async (barcode) => {
        try {
            const response:any = await fetch(`https://world.openfoodfacts.org/api/v0/product/${String(barcode)}.json`);
            const data = await response.json();
            if(data.status == 0) {
                alert(`Product not found. Try again or type in macronutrients manually.`);
                return
            }
            const nutrients = data.product.nutriments;
            if(data.product.product_name && nutrients.carbohydrates_100g && nutrients.fat_100g && nutrients.proteins_100g){
                setMeal({
                    name: data.product.product_name,
                    weight: 0,
                    carbs: nutrients.carbohydrates_100g,
                    fat: nutrients.fat_100g,
                    protein: nutrients.proteins_100g,
                });
            } else {
                alert(`Product has been found, but lacked macronutrient data`);
            }
        }
        catch (e) {
            e instanceof Error ? alert(e.message): alert(String(e));
        }
    }

    const handleBarCodeScanned = ({ type, data}) => {
    setScanned(true);
    fetchFoodData(data);
    setShowBarCodeScanner(false);
    };

    return (
    <View style={styles.container}>
        <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
        />
        {scanned && 
        <Button 
            style={styles.AndroidSafeArea} 
            onPress={() => setScanned(false)}>
                Tap to Scan Again
        </Button>}
        <IconButton 
            style={{alignSelf:'flex-end'}}
            icon='window-close' 
            onPress={() => {
                setShowBarCodeScanner(false);
            }}
        />
    </View>
    );
};

export default BarCodeScannerComponent;

const styles = StyleSheet.create({
    container:{
        height:'100%',
    },
    AndroidSafeArea: {
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'darkviolet',
}
})
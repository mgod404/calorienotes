import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'


const AddNewMealComponent = () => {
    const [barcodeReceived, setBarCodeReceived] = useState(false);
    const [torchMode, setTorchMode] = useState('off');
    const [cameraType, setCameraType] = useState('back');

    return(
        <View>

        </View>
    )
};

export default AddNewMealComponent;

const styles = StyleSheet.create({

});
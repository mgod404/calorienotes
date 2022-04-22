import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Appbar, Text } from 'react-native-paper';


const BottomBarComponent = () => {
    return(
        <Appbar style={styles.bottom}>
                <View style={styles.totalView}>
                    <Text>
                        Carbs
                    </Text>
                    <Text>
                        80
                    </Text>
                </View>
                <View style={styles.totalView}>
                    <Text>
                        Fats
                    </Text>
                    <Text>
                        80
                    </Text>
                </View>
                <View style={styles.totalView}>
                    <Text>
                        Proteins
                    </Text>
                    <Text style={styles.centerText}>
                        80
                    </Text>
                </View>
                <View style={styles.totalView}>
                    <Text>
                        Total Calories
                    </Text>
                    <Text style={styles.centerText}>
                        80
                    </Text>
                </View>
        </Appbar>
    );
};

export default BottomBarComponent

const styles = {
    bottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    totalView: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    centerText: {
        textAlign: 'center'
    }
}
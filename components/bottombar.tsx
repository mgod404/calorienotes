import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Appbar, Text, IconButton } from 'react-native-paper';


const BottomBarComponent = () => {
    return(
        <Appbar style={styles.barView}>
            <View style={styles.totalView}>
                <IconButton 
                    icon='cog-outline'
                    color='darkviolet'
                />
            </View>
            <View style={styles.totalView}>
                <Text>
                    Carbs
                </Text>
                <Text style={styles.centerText}>
                    80
                </Text>
            </View>
            <View style={styles.totalView}>
                <Text>
                    Fats
                </Text>
                <Text style={styles.centerText}>
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

const styles = StyleSheet.create({
    barView: {
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
})
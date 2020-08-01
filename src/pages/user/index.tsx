import React, {useState, useEffect} from 'react'
import {View, Text} from 'react-native'

import styles from './userStyles'

const User = (props: any) =>{
    const user = props.route.params.screen_name;
    console.log('chegei user', props.route.params.screen_name);
    
    return(
        <View style={styles.container}>            
            <View style={styles.headerBox}>


            </View>
            <View style={styles.galleryBox}>


            </View>
        </View>
    )
}

export default User;
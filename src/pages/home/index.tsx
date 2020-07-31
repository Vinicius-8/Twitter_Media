import React, {useState} from 'react'
import {Text, View, TouchableOpacity, TextInput} from 'react-native'

import styles from './homeStyles'

const Home = () =>{
    const [username, setUsername] = useState('')
    function logMe(){
        console.log(username);
        
    }
    return(
        <View style={styles.container}>
            <View style={styles.inputBox}>
                <Text style={styles.ibTitle}>Search for a account: </Text>
                <TextInput 
                placeholder=" username" 
                autoCapitalize = 'none'
                selectionColor={'#eee'}                 
                style={styles.ibInput}
                onChangeText={(text: string)=> setUsername(text)}
                />

                <TouchableOpacity style={styles.ibButton}
                    onPress={logMe}
                >
                    <Text style={styles.ibTextButton}>Search</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.responseBox}>

            </View>
        </View>
    );
}

export default Home;
import React, {useState, useEffect} from 'react'
import {Text, View, TouchableOpacity, TextInput} from 'react-native'

import styles from './homeStyles'
import Credentials from '../../credentials'
import { useTwitter } from "react-native-simple-twitter";


const Home = () =>{
    const [username, setUsername] = useState('')

    const { twitter } = useTwitter();


    useEffect(()=>{
        twitter.setConsumerKey(Credentials.apiKey, Credentials.apiSecretKey)
        twitter.setAccessToken(Credentials.accessToken, Credentials.accessTokenSecret)
        console.log('--paresiqifunfo->');        
    },[])
    
    function searchUsers(){
        twitter.get('https://api.twitter.com/1.1/users/show.json?screen_name=kangacero_')
        .then(resp =>{
            console.log(resp);
            
        })
    }

    return(
        <View style={styles.container}>
            <View style={styles.inputBox}>
                <Text style={styles.ibTitle}>Search for a account: </Text>
                <TextInput 
                placeholder=" username" 
                autoCapitalize = 'none'
                selectionColor={'#8888ff'}      
                placeholderTextColor={"#444"}           
                style={styles.ibInput}
                onChangeText={(text: string)=> setUsername(text)}
                />

                <TouchableOpacity style={styles.ibButton}
                    onPress={searchUsers}
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
import React, {useState, useEffect} from 'react'
import {Text, View, TouchableOpacity, TextInput, ScrollView, Image, ProgressBarAndroid, 
    Keyboard} from 'react-native'

import { useTwitter } from "react-native-simple-twitter";
import { useNavigation } from '@react-navigation/native';

import Credentials from '../../credentials'
import styles from './homeStyles'


interface User {
    id: string
    name: string
    screen_name: string
    profile_image_url: string
}


const Home = () =>{
    const [username, setUsername] = useState('')
    const [lastUsername, setLastUsername] = useState('')
    const [users, setUsers] = useState<User[]>([])    
    const [loadingUsers, setLoadingUsers] = useState(false)
    const { twitter } = useTwitter();
    const navigation = useNavigation()
    const maxResults = 20

    useEffect(()=>{
        twitter.setConsumerKey(Credentials.apiKey, Credentials.apiSecretKey)
        twitter.setAccessToken(Credentials.accessToken, Credentials.accessTokenSecret)         
    },[])
    
    function searchUsers(){
        if(username==='' || username === lastUsername){
            setLoadingUsers(false)                
            return
        }
        
        setLastUsername(username)
        Keyboard.dismiss()
        setLoadingUsers(true)        
        twitter.get('users/search.json', {q:username,  count: maxResults})
        .then(resp =>{
            setUsers(resp)   
            setLoadingUsers(false)         
        })                
    }

    function userTouched(user: User){        
        navigation.navigate('User', {user:user})
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
                <ScrollView showsVerticalScrollIndicator={false}>
                {!loadingUsers ? users.map(user =>(
                    <TouchableOpacity style={styles.rbUserBox} key={user.id}
                        onPress={()=>{
                                userTouched(user)
                            }}
                    >
                        <Image source={{uri: user.profile_image_url}}  style={styles.rbImage}/>
                       <View style={styles.rbTextBox}>
                            <Text style={styles.rbName} numberOfLines={1}>{user.name}</Text>
                            <Text style={styles.rbScreenName}>@{user.screen_name}</Text>
                       </View>
                    </TouchableOpacity>
                )): <ProgressBarAndroid 
                        styleAttr="Horizontal" 
                        style={styles.rbLoadingBar}
                        
                        />}
                </ScrollView>
            </View>
        </View>
    );
}

export default Home;
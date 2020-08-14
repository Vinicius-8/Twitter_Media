import React, {useState, useEffect} from 'react'
import {Text, View, TouchableOpacity, TextInput, ScrollView, Image, ProgressBarAndroid, 
    Keyboard, Clipboard, Modal} from 'react-native'

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
    const [loadingUser, setLoadingUser] = useState(false)
    const { twitter } = useTwitter();
    const navigation = useNavigation()
    const maxResults = 50

    useEffect(()=>{
        twitter.setConsumerKey(Credentials.apiKey, Credentials.apiSecretKey)
        twitter.setAccessToken(Credentials.accessToken, Credentials.accessTokenSecret) 
        
        loadData().then(username=>{
            
            if(username){                           
                setLoadingUser(true)
                twitter.get('users/search.json', {q:username,  count: 1})
                .then(resp =>{      
                    setLoadingUser(false)              
                    userTouched(resp[0])             
                })
            }
        })
    },[])
    
    async function readFromClipboard(){
        const clipboardContent = await Clipboard.getString();        
        return clipboardContent.toString();
    }

    function validURL(str: string) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
      }

    async function loadData(){
        let clipboardData = await readFromClipboard();        
        if(clipboardData.includes('twitter.com/') && validURL(clipboardData)){        
            let index1 = clipboardData.indexOf('twitter.com/') + 12;                
            clipboardData = clipboardData.slice(index1, clipboardData.length-1)            
            let index2 = clipboardData.indexOf('/');        
            if(index2 === -1){
                let index3 = clipboardData.indexOf('?');            
                clipboardData = clipboardData.slice(0, index3)        
            }else{
                clipboardData = clipboardData.slice(0, index2)            
            }                   
            return clipboardData    
        }
        return ''
    }


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
            <Modal 
                visible={loadingUser} transparent={true}
                animationType="fade"
                onRequestClose={()=>{1+1}}
                >
                    <View style={styles.loadingContainer}>
                        <View style={styles.loadingModal}>
                            <Text> Loading user...</Text>
                            <ProgressBarAndroid 
                                styleAttr="Small" 
                                color="black"                        
                            />
                        </View>
                    </View>

                </Modal> 
            <View style={styles.inputBox}>
                <Text style={styles.ibTitle}>Search for a account: </Text>
                <TextInput 
                placeholder=" username" 
                autoCapitalize = 'none'
                selectionColor={'#8888ff'}      
                placeholderTextColor={"#444"}           
                style={styles.ibInput}
                onChangeText={(text: string)=> setUsername(text)}                   
                onSubmitEditing={searchUsers}
                returnKeyType="search"
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
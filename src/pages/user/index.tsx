import React, {useState, useEffect} from 'react'
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native'

import { useTwitter } from "react-native-simple-twitter";
import { useNavigation } from '@react-navigation/native';
import { Fontisto } from '@expo/vector-icons'; 

import styles from './userStyles'
import Credentials from '../../credentials'

interface User {
    id: string
    name: string
    screen_name: string
    profile_image_url: string
    description: string
    followers_count: number
    friends_count: number
}

interface Tweet{
    entities: {        
        media:[Media];
    }
    extended_entities:{
        media:[Media];        
    }
}

interface Video{
    bitrate: number
    content_type: string
    url: string
}

interface Media{
    id: number 
    media_url: string
    type: string
    video_info:{
        variants: [Video]
    }    
}

const User = (props: any) =>{    
    const user:User = props.route.params.user;   
    user.profile_image_url = increaseProfilePicQuality(user.profile_image_url)       ;
    const navigation = useNavigation();
    const { twitter } = useTwitter();    
    const [medias, setMedias] = useState< Media[]> ([])
    const [exhibitionMode, setExhibitionMode] = useState('grid')
    const TWEETS_COUNT = 15
    

    navigation.setOptions({
        title: user.screen_name,
        headerTintColor: '#ddd',
        headerStyle: {
            backgroundColor: '#292929',
        }, })

    function increaseProfilePicQuality(url:string){
        let index = url.indexOf('_normal');
        if(index !== -1){
            let text = url.slice(0, index);                         
            return text+'.jpg'                   
        }       
        return url         
    }

    function filterMediaInTweets(tweets: Tweet[]){
        let medias:Media[] = [];        
        for (let index = 0; index < tweets.length; index++) {                        
            if (tweets[index].extended_entities !== undefined){                                
                for (let j = 0; j <  tweets[index].extended_entities.media.length; j++) {                                                            
                    if(tweets[index].extended_entities.media[j].type === "photo"){
                        medias.push({
                            id: tweets[index].extended_entities.media[j].id,
                            media_url: tweets[index].extended_entities.media[j].media_url,
                            type: tweets[index].extended_entities.media[j].type,
                            video_info:{
                                variants: [{   bitrate: 0, content_type: "", url: "" }]}
                            })

                    }else if(tweets[index].extended_entities.media[j].type === "video"){
                        let len = tweets[index].extended_entities.media[j].video_info.variants.length;                        
                            medias.push({
                                id: tweets[index].extended_entities.media[j].id,
                                media_url: tweets[index].extended_entities.media[j].media_url,
                                type: tweets[index].extended_entities.media[j].type,
                                video_info:{
                                    variants: [{
                                        bitrate: tweets[index].extended_entities.media[j].video_info.variants[len-1].bitrate, 
                                        content_type: tweets[index].extended_entities.media[j].video_info.variants[len-1].content_type, 
                                        url: tweets[index].extended_entities.media[j].video_info.variants[len-1].url
                                    }]
                                }
                           })                                
                        }                                                   
                    }                                     
                }                
            }                    
                
        return medias        
    }

    useEffect(()=>{    
        twitter.setConsumerKey(Credentials.apiKey, Credentials.apiSecretKey);
        twitter.setAccessToken(Credentials.accessToken, Credentials.accessTokenSecret);                    
        
        twitter.get('statuses/user_timeline.json', {screen_name: user.screen_name, count: TWEETS_COUNT,})
        .then(resp=>{                                    
            setMedias(filterMediaInTweets(resp))
        })       
    },[])    
    
    return(
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.headerBox}>
                    <View style={{flexDirection:'row'}}>
                        <Image source={{uri: user.profile_image_url}} style={styles.hbImage}/>
                        <View style={styles.numbersBox}>
                            <View>
                                <Text style={styles.nbFollowing}>{user.friends_count}</Text>
                                <Text style={styles.nbFollowing}>Following</Text>
                            </View>
                            <View>
                                <Text style={styles.nbFollowers}>{user.followers_count}</Text>
                                <Text style={styles.nbFollowers}>Followers</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.textBox}>
                        <Text style={styles.tbName}>{user.name}</Text>
                        <Text style={styles.tbScreenName}>@{user.screen_name}</Text>
                        <Text style={styles.tbDescription}>{user.description}</Text>
                    </View>
                </View>
                <View style={styles.galleryBox}>
                    <View style={styles.exhibitionType}>
                        <TouchableOpacity style={styles.exhibitionBox}
                            onPress={()=>setExhibitionMode("grid")}
                        >
                            <Fontisto name="nav-icon-grid-a" size={24} color="#ccc"/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.exhibitionBox}
                            onPress={()=>setExhibitionMode("list")}
                        >
                            <Fontisto name="fog" size={24} color="#ccc"/>
                        </TouchableOpacity>
                    
                    </View>
                    { exhibitionMode === "grid" ?
                        <View style={styles.galleryGridBox}>                        
                            {medias.map(url=>(
                                <TouchableOpacity  key={url.id}>
                                    <Image
                                    style={styles.gridItem} 
                                    source={{uri: url.media_url}} />
                                </TouchableOpacity>
                            ))}                        
                        </View> 
                    :

                        <View style={styles.galleryListBox}>
                            {medias.map(url=>(
                                 <TouchableOpacity  
                                    key={url.id}
                                    activeOpacity={1}
                                 >
                                    <Image 
                                    style={styles.listItem} 
                                    source={{uri: url.media_url}}                                 
                                    />
                                </TouchableOpacity>
                            ))}   
                        </View>
                    
                    }

                </View>
            </ScrollView>                                  
        </View>
    )
}

export default User;
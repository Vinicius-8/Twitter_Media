import React, {useState, useEffect} from 'react'
import {View, Text, Image, ScrollView, TouchableOpacity, Modal, TouchableWithoutFeedback} from 'react-native'

import { useTwitter } from "react-native-simple-twitter";
import { useNavigation } from '@react-navigation/native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Fontisto, Entypo } from '@expo/vector-icons'; 
import styles from './userStyles'
import Credentials from '../../credentials'

import { Video as VVideo } from 'expo-av'
import VideoPlayer from 'expo-video-player'



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

interface ImagesCarousel{
    url: string
}

const User = (props: any) =>{    
    const user:User = props.route.params.user;   
    user.profile_image_url = increaseProfilePicQuality(user.profile_image_url)       ;
    const navigation = useNavigation();
    const { twitter } = useTwitter();    
    const [medias, setMedias] = useState< Media[]> ([])
    const [exhibitionMode, setExhibitionMode] = useState('grid')
    const [isModalCarouselVisible, setIsModalCarouselVisible] = useState(false)
    const [isModalVideoVisible, setIsModalVideoVisible] = useState(false);
    const [currentVideo, setCurrentVideo] = useState('')
    const TWEETS_COUNT = 50    
    const [imagesCarousel, setImagesCarousel] = useState< ImagesCarousel[]>([])
    const [indexCarousel, setIndexCarousel] = useState(0)

        
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

    function touchMedia(media: Media){
        if(media.type === "photo"){
            let index = medias.indexOf(media)
            setIndexCarousel(index)
            setIsModalCarouselVisible(true)
        }else if(media.type === "video"){
            setCurrentVideo(media.video_info.variants[0].url)
            setIsModalVideoVisible(true)            
        }
    }

    useEffect(()=>{
        let r = medias.map(item =>{
            return {url:item.media_url}
        })

        setImagesCarousel(r)
        
    }, [medias])

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
            {/*<Modal
                animationType='fade' 
                transparent={true} 
                visible={isModalCarouselVisible} >
                    <TouchableWithoutFeedback
                        onPress={()=>setIsModalCarouselVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <TouchableWithoutFeedback>  
                                <View style={styles.modalBox} >

                                </View>
                            </TouchableWithoutFeedback>
                        </View>

                    </TouchableWithoutFeedback>
            </Modal>*/}
            <Modal 
                visible={isModalCarouselVisible} transparent={true}
                onRequestClose={()=>{setIsModalCarouselVisible(false)}
                }
                >                                                                   
                            <ImageViewer 
                                flipThreshold={8}
                                enableSwipeDown={true}                            
                                backgroundColor={'rgba(0,0,0, 0.7)'}                            
                                onSwipeDown={()=>setIsModalCarouselVisible(false)}  
                                index={indexCarousel}                  
                                failImageSource={{url: "https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-delete-icon.png"}}
                                renderIndicator={
                                    (currentIndex, allSize) => {
                                    return <View></View>
                                }}
                                imageUrls={imagesCarousel}
                                renderFooter={
                                    ()=> <Text style={{color: "white"}}>---</Text>
                                }
                            />                        
                        
                            </Modal>

            <Modal visible={isModalVideoVisible} transparent={true}
            onRequestClose={()=>{setIsModalVideoVisible(false)}} >

            <VideoPlayer   
                disableSlider={true}
                showFullscreenButton={false}
                videoProps={{                    
                    shouldPlay: true,
                    isLooping: true,                    
                    resizeMode: VVideo.RESIZE_MODE_CONTAIN,
                    source: {
                    uri: currentVideo,
                    },                    
                }}
                
                inFullscreen={true}
                videoBackground={"rgba(0,0,0,0.8)"}                
                />
            </Modal>                                

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
                            {medias.map(media=>(
                                <TouchableOpacity  key={media.id}                                    
                                    onPress={()=>{touchMedia(media)}}
                                >
                                    <View style={styles.gbPlayBox} >
                                        {media.type==="video" ? <Entypo name="controller-play" size={24} style={styles.gbPlay}/> : null}
                                    </View>
                                    <Image
                                    style={styles.gridItem} 
                                    source={{uri: media.media_url}}/>
                                    
                                </TouchableOpacity>
                            ))}                        
                        </View> 
                    :

                        <View style={styles.galleryListBox}>
                            {medias.map(media=>(
                                 <TouchableOpacity  
                                    key={media.id}
                                    activeOpacity={1}
                                    onPress={()=>{touchMedia(media)}}
                                 >
                                     <View style={styles.gbPlayBox} >
                                        {media.type==="video" ? <Entypo name="video-camera" size={25} style={[styles.gbPlay, {marginLeft: 10, marginTop: 8}]}/> : null}
                                    </View>
                                    <Image 
                                    style={styles.listItem} 
                                    source={{uri: media.media_url}}                                 
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
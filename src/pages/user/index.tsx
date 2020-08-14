import React, {useState, useEffect} from 'react'
import {View, Text, Image, ScrollView, TouchableOpacity, 
    Modal, Alert, ToastAndroid, ProgressBarAndroid,} from 'react-native'

import { useTwitter } from "react-native-simple-twitter";
import { useNavigation } from '@react-navigation/native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Fontisto, Entypo, AntDesign, EvilIcons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import styles from './userStyles'
import Credentials from '../../credentials'

import { Video as VVideo } from 'expo-av'
import VideoPlayer from 'expo-video-player'
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';


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
    const protectedAccount = user.protected;
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
    const [excludeReplies, setExcludeReplies] = useState(false)
    const [includeRts, setIncludeRts] = useState(true)
    const [lastTweetId, setLastTweetId] = useState(0)
    const [enableButton, setEnableButton] = useState(true)
    const [loadingMedias, setLoadingMedias] = useState(false)

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
    //////
    function filterMediaInTweets(tweets: Tweet[]){
        let medias:Media[] = [];        
        let lastId = 0
        for (let index = 0; index < tweets.length; index++) {                            
            if (tweets[index].extended_entities !== undefined){                 
                lastId = tweets[index].extended_entities.media[0].id;                                                          
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
                            let isBreaked = tweets[index].extended_entities.media[j].video_info.variants[len-1].url.indexOf('.m3u8')
                            
                            medias.push({
                                id: tweets[index].extended_entities.media[j].id,
                                media_url: tweets[index].extended_entities.media[j].media_url,
                                type: isBreaked !== -1 ? "photo" : tweets[index].extended_entities.media[j].type,
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
              setLastTweetId(lastId)  
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
    
    async function saveMediaInGallery(url: string, type: string){    
        
        const permission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (permission.status === 'granted') {
            ToastAndroid.show("Downloading...", ToastAndroid.SHORT)
            let fileName = url.slice(url.lastIndexOf('/'), url.lastIndexOf('.'))
            FileSystem.downloadAsync(
                url,
                FileSystem.cacheDirectory + fileName +"."+ type
            )
                .then(({ uri }) => {
                    console.log('Finished downloading to ', uri);
                    MediaLibrary.saveToLibraryAsync(uri);                    
                    ToastAndroid.show("Media saved to this device", ToastAndroid.SHORT)                    
                })
                .catch(error => {
                    console.error(error);   
                });      
        }else{
            Alert.alert("Fail", "Media cannot be saved")
        }      
    }

    const FetchMoreDataButton = ()=> {
        return (
            <View>
            { !loadingMedias ?
            <TouchableOpacity onPress={()=>fetchMediasFromUser()} style={styles.fetchMoreDataButton}>
                <MaterialCommunityIcons name="progress-download" size={24} color="#ddd" />
            </TouchableOpacity>
            : 
            <View style={styles.fetchMoreDataButton}>
                <ProgressBarAndroid 
                                styleAttr="Small" 
                                color="#ddd"                        
                            /> 
            </View>}
            </View>
        )
    };


    useEffect(()=>{
        let r = medias.map(item =>{
            return {url:item.media_url}
        })

        setImagesCarousel(r)
        
    }, [medias])
    
    function fetchMediasFromUser(){ 
        setLoadingMedias(true)       
        let params ={}        
        if(lastTweetId !== 0){
            params = {
                screen_name: user.screen_name, 
                count: TWEETS_COUNT, 
                exclude_replies: excludeReplies,                
                include_rts: includeRts,
                max_id: lastTweetId
            }                                                                            
        }else{
            params = {
                screen_name: user.screen_name, 
                count: TWEETS_COUNT, 
                exclude_replies: excludeReplies,                
                include_rts: includeRts,
            }
        }        
        
        twitter.get('statuses/user_timeline.json', params)
        .then(resp=>{  
            if(lastTweetId !== 0){                          
                setMedias([...medias, ...filterMediaInTweets(resp) ])
            }else{
                setMedias(filterMediaInTweets(resp))
            }
            setLoadingMedias(false)
        })
    }

    useEffect(()=>{                
        twitter.setConsumerKey(Credentials.apiKey, Credentials.apiSecretKey);
        twitter.setAccessToken(Credentials.accessToken, Credentials.accessTokenSecret);                            
        
        fetchMediasFromUser()
    },[includeRts, excludeReplies])
            
    function isCloseToBottom ({layoutMeasurement , contentOffset, contentSize}){
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    };
      

    const GalleryGridView = () =>(
        <View style={styles.galleryGridBox}>                        
            {medias.map((media, index)=>(
                <TouchableOpacity  key={index}                                    
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
    )

    const GalleryListView = () =>(        
        <View style={styles.galleryListBox}>
            {medias.map((media, index)=>(
                    <TouchableOpacity  
                    key={index}
                    activeOpacity={1}
                    onPress={()=>{touchMedia(media)}}
                    >
                        <View style={styles.gbBigPlayBox} >
                        
                        {media.type==="video" ? <Entypo name="controller-play" size={80} style={styles.gbPlay}/> : null}
                        
                    </View>
                    <Image 
                    style={styles.listItem} 
                    source={{uri: media.media_url}}                                 
                    />
                </TouchableOpacity>
            ))}               
        </View>
        
    ) 

    return(
        <View style={styles.container}>            
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
                        (currentIndex)=> <AntDesign name="download" size={24} style={styles.downloadButton} onPress={() => saveMediaInGallery(imagesCarousel[currentIndex].url, 'jpg')}/>
                    }
                    saveToLocalByLongPress={false}
                />                        
            
            </Modal>

            <Modal visible={isModalVideoVisible} transparent={true}
            onRequestClose={()=>{setIsModalVideoVisible(false)}} >            
                <View style={{position:'absolute'}}>
                    <AntDesign name="download" size={24} style={ styles.downloadButtonVideo} onPress={() => saveMediaInGallery(currentVideo, 'mp4')}/>                    
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
                    
                </View>
            </Modal>                                                
            
            <ScrollView 
                onScroll={({nativeEvent}) => {
                if (isCloseToBottom(nativeEvent)) {
                  setEnableButton(true)
                  
                }
              }}
                        
            >            

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

                    <View style={styles.filterBox}>
                        <TouchableOpacity style={styles.filterItems}
                            onPress={()=>{
                                setLastTweetId(0)
                                setExcludeReplies(!excludeReplies)                                
                            }}
                        >
                            <EvilIcons name="comment" size={32} color="#ccc" style={ !excludeReplies ? styles.filterItemsAtivated: {}}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterItems}
                            onPress={()=>{
                                setLastTweetId(0)
                                setIncludeRts(!includeRts)
                            }}
                        >
                            <EvilIcons name="retweet" size={32} color="#ccc" style={includeRts ? styles.filterItemsAtivated: {}}/>
                        </TouchableOpacity>                    
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
                        <GalleryGridView/>
                    :
                        <GalleryListView />                        
                    
                    }

                    { protectedAccount ? <Text style={{color: "#ddd", marginTop: 50, fontSize: 20}}>Private Account</Text> : null}
                </View>
                    { enableButton && !protectedAccount ? <FetchMoreDataButton />: null}                            
            </ScrollView>
            
        </View>
    )
}

export default User;
import { StyleSheet } from 'react-native'
import Constants from 'expo-constants' 


export default StyleSheet.create({
    container: {
        flex: 1,     
        backgroundColor:'#292929',             
        paddingTop: Constants.statusBarHeight + 10,              
    },

    headerBox:{                             
        width: '94%',
        minHeight: 180,        
        flexDirection: 'column',    
        alignSelf:'center'    ,
        
    },
    hbImage:{
        width: 100,
        height: 100,
        borderRadius: 50,
        margin: 20,
        
    },
    numbersBox:{
        flexDirection: 'row',        
        width: 180,
        alignItems:'center',
        justifyContent:'center'
    },
    nbFollowing:{
        marginRight: 20,
        color:"#ddd",
        fontWeight: "bold"
    },
    nbFollowers:{
        marginRight: 15,
        color:"#ddd",     
        fontWeight: "bold"   
    },


    textBox:{        
        paddingLeft: 14
    },
    tbName:{
        color:"#ddd",
        fontSize: 15      ,
        fontWeight: "bold"  
    },
    tbScreenName:{
        color:"#ddd",        
    },
    tbDescription:{
        marginTop: 10,
        color:"#ddd",
        width: '95%',
    },
    galleryBox:{

    }

})

/**
 * 
 * Object {
  "contributors_enabled": false,
  "created_at": "Mon Jul 10 15:03:19 +0000 2017",
  "default_profile": false,
  "default_profile_image": false,
  "description": "podcre só serenidade",
  "entities": Object {
    "description": Object {
      "urls": Array [],
    },
  },
  "favourites_count": 31051,
  "follow_request_sent": false,
  "followers_count": 334,
  "following": false,
  "friends_count": 817,
  "geo_enabled": false,
  "has_extended_profile": false,
  "id": 884427821866786800,
  "id_str": "884427821866786820",
  "is_translation_enabled": false,
  "is_translator": false,
  "lang": null,
  "listed_count": 0,
  "location": "Rio de Janeiro, Brasil",
  "name": "kaa",
  "notifications": false,
  "profile_background_color": "000000",
  "profile_background_image_url": "http://abs.twimg.com/images/themes/theme1/bg.png",
  "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme1/bg.png",
  "profile_background_tile": false,
  "profile_banner_url": "https://pbs.twimg.com/profile_banners/884427821866786820/1499700280",
  "profile_image_url": "http://pbs.twimg.com/profile_images/1099685249607499777/o5WsOsRY_normal.jpg",
  "profile_image_url_https": "https://pbs.twimg.com/profile_images/1099685249607499777/o5WsOsRY_normal.jpg",
  "profile_link_color": "ABB8C2",
  "profile_sidebar_border_color": "000000",
  "profile_sidebar_fill_color": "000000",
  "profile_text_color": "000000",
  "profile_use_background_image": false,
  "protected": false,
  "screen_name": "Aloha1dvai",
  "status": Object {
    "contributors": null,
    "coordinates": null,
    "created_at": "Sat Aug 01 13:29:31 +0000 2020",
    "entities": Object {
      "hashtags": Array [],
      "symbols": Array [],
      "urls": Array [],
      "user_mentions": Array [],
    },
    "favorite_count": 0,
    "favorited": false,
    "geo": null,
    "id": 1289553849305329700,
    "id_str": "1289553849305329666",
    "in_reply_to_screen_name": null,
    "in_reply_to_status_id": null,
    "in_reply_to_status_id_str": null,
    "in_reply_to_user_id": null,
    "in_reply_to_user_id_str": null,
    "is_quote_status": false,
    "lang": "pt",
    "place": null,
    "retweet_count": 1,
    "retweeted": false,
    "source": "<a href=\"http://twitter.com/download/android\" rel=\"nofollow\">Twitter for Android</a>",
    "text": "Ai gente noah urrea eh tão sem noção. Nada mais que vem desse mlk me choca, só fala merda atrás de merda.",
    "truncated": false,
  },
  "statuses_count": 10308,
  "time_zone": null,
  "translator_type": "none",
  "url": null,
  "utc_offset": null,
  "verified": false,
}
 */
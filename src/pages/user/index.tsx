import React, {useState, useEffect} from 'react'
import {View, Text, Image, ScrollView} from 'react-native'

import styles from './userStyles'

interface User {
    id: string
    name: string
    screen_name: string
    profile_image_url: string
    description: string
    followers_count: number
    friends_count: number
}

const User = (props: any) =>{    
    const user:User = props.route.params.user;    
    console.log('::',user);
    
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


                </View>
            </ScrollView>                                  
        </View>
    )
}

export default User;
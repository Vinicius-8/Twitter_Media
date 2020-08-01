import { StyleSheet } from 'react-native'
import Constants from 'expo-constants' 


export default StyleSheet.create({
    container: {
        flex: 1,        
        backgroundColor:'#191919',
        alignItems: 'center',     
        paddingTop: Constants.statusBarHeight + 10,   
    },    

    inputBox: {
        backgroundColor: "#292929",
        height: 160,
        width: 330,
        borderRadius: 3,
        marginBottom: 12
    },
    ibTitle:{
        color: "#bbb",
        fontSize: 19,
        alignSelf:'center',
        marginTop: 20
    },
    ibInput:{    
        alignSelf:'center',
        width: 300,
        marginTop: 10,
        paddingLeft: 9,
        height: 40,
        borderRadius: 3,
        fontSize: 17,
        borderBottomColor: '#8888ff',
        borderBottomWidth: 1,
        color:'#eee'
    },
    ibButton:{
        backgroundColor: "#454545",
        width: 100,
        height: 35,
        borderRadius: 3,
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'flex-end',
        marginRight: 20,
        marginTop: 15,        
        
    },
    ibTextButton:{
        color:'#ddd'
    },

    responseBox: {
        backgroundColor: "#292929",
        height: 410,
        width: 330,
        borderRadius: 3,
        justifyContent:'center',
        alignItems:'center',
        paddingTop: 5
    },

    rbUserBox:{
        backgroundColor: '#333',
        marginBottom: 5,
        width: 300,
        height: 70,        
        borderRadius: 2,
        flexDirection: 'row',
        alignItems:'center'
    },
    rbImage:{
        height: 55,
        width: 55, 
        borderRadius: 4       ,
        marginRight: 15,
        marginLeft: 10
    },
    rbTextBox:{        
        marginBottom: 15
    },
    rbName:{
        fontSize: 17,
        color:'#ccc'
    },
    rbScreenName:{
        fontSize: 14,
        color:'#ccc'
    },
    rbLoadingBar: {
        marginTop: 150,
        color:'#8888ff'
    }
    
});

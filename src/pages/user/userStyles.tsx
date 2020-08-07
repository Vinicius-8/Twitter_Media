import { StyleSheet } from 'react-native'


export default StyleSheet.create({
    container: {
        flex: 1,     
        backgroundColor:'#292929',             
        
    },

    modalContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: 'rgba(0,0,0, 0.7)',
    },
    modalBox:{
        width: 300,
        height: 180,
        borderRadius: 5,
        backgroundColor:'#6A7291',
        justifyContent:'space-around'   
    }
    ,

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

    exhibitionType:{        
        width:'100%',
        height: 44,
        flexDirection:'row',        
        alignItems:'center',
        borderBottomWidth: .2, 
        borderBottomColor: "#555",    
    },
    exhibitionBox:{
        width: 180,
        height: 44,
        justifyContent:'space-evenly',
        alignItems:'center',  
           
    },
    galleryBox:{        
        borderTopWidth: .2, 
        borderTopColor: "#555",
        marginTop: 15,
        alignItems:'center',        
    },
    downloadButton:{
        color: "snow",
        marginLeft: 15,
        marginBottom: 12
    },
    downloadButtonVideo:{
        position:'absolute',
        zIndex: 2,
        color: "snow",        
        bottom: 40,
        left: 20
    },
    galleryGridBox:{
        width: '100%',                
        flex: 1, 
        flexDirection: 'row', 
        flexWrap: 'wrap'     ,
        
    },
    gbPlayBox:{
        position:'absolute',
        zIndex: 9,        
    },
    gbPlay:{
        color: 'rgba(255,255,255,.9)',        
    },
    gridItem:{
        width: 118,
        height: 118,
        backgroundColor: 'grey',
        /*marginRight: 10      ,*/
        marginBottom: 2,
        marginHorizontal: 1         
    },
    
    galleryListBox:{
        flexDirection:'column'
    },
    listItem:{
        width: 355,
        height: 355,
        backgroundColor: 'grey',
        marginBottom: 5
    }
})

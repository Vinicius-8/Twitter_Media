import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'



import Home from './pages/home'
import User from './pages/user'

const AppStack = createStackNavigator();


const Routes = () => {
    return(        
        <NavigationContainer >
            <AppStack.Navigator 
                initialRouteName="Home"
                screenOptions={{ gestureEnabled: false }}>
                <AppStack.Screen name="Home" component={Home}  options={{ headerShown: false }}/>
                <AppStack.Screen name="User" component={User}  options={{ headerShown: false }}/>                                
            </AppStack.Navigator>
        
        </NavigationContainer>
    );
}

export default Routes;

/**<AppStack.Screen name="Detail" component={Detail} options={{ headerShown: false,
                headerStyle: {backgroundColor: '#262C38',}, title: false, headerTintColor: 'snow' }} /> */
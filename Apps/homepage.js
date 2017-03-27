import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Navigator,
  StatusBar,
  View
} from 'react-native';
import LoginScreen from './components/login.js'
import FilterScreen from './components/filter.js'
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import {reducer} from './store/reducer.js'

const store = createStore(reducer);

export default class Homepage extends Component {
  renderScene(route,  navigator){
      return <route.component navigator={navigator}/>
  }
  
  render() {
      const defaultRoure = {
          title: 'Login Screen',
          component: LoginScreen
      }
      
      return(
          <Provider store={store}>
            <Navigator initialRoute={defaultRoure}
            renderScene={this.renderScene}/> 
            </Provider>       
      )
  }
}

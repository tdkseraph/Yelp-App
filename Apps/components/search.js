import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TextInput,
    Button,
    StatusBar,
    Image,
    ListView,
    TouchableOpacity,
    RefreshControl
} from 'react-native';
import {connect} from 'react-redux'
import AppStyles from '../stylesheet/decoration.js'
import Spinner from 'react-native-loading-spinner-overlay'
import Stars from 'react-native-stars'
import FilterScreen from './filter.js'
import {Yelp} from '../api/yelpsearch.js'

import {actionCreators} from '../store/reducer.js'

class Search extends Component {
    constructor(props) {
        super(props);
        this.renderPlaceCell = this
            .renderPlaceCell
            .bind(this);
        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            token: {},
            visible: true,
            dataSource: this.ds.cloneWithRows(['']),
            isRefreshing: false,
            places: ['']
        };
    }

    fetchToken() {
        const params = {
            client_id: 'qDPlyf_EBtljgqKxPALx6Q',
            client_secret: 'RlFVBx8XonMjZcNnal3e827ooycXR7Pc4JngdpbM6UmdbW61GEfiss22OMRK0p4M', // use your own
            grant_type: 'client_credentials'
        }

        const request = new Request('https://api.yelp.com/oauth2/token', {
            method: 'POST',
            headers: new Headers({'content-type': 'application/x-www-form-urlencoded;charset=utf-8'}),
            body: `client_id=${params.client_id}&client_secret=${params.client_secret}&grant_type=${params.grant_type}`
        });

        return fetch(request).then(response => {
            return response.json()
        }).then(json => {
            console.log(json);
            this.setState({token: json})
            this.getPlaceFromAPI();
        })
    }

    componentWillMount() {
        //this.fetchToken();
        this.searchWithTerm();
    }

    async searchWithTerm(){
        let keyword = '';
       console.log('Search props : ',this.props.filterData);
        if(this.props.filterData){
            keyword = this.props.filterData.searchTerm;
             console.log(keyword);
        }

        var data;
        var count=0;
         data = await Yelp.searchWithFilter(keyword).then((item) => {
                return item;
          });

          if (data.length > 0){
              console.log(data.length);
                this.setState({
                dataSource: this.state.dataSource.cloneWithRows(data),
                isRefreshing: false,
                visible: false,
                places:data
          })

          }
          
    }

    async getPlaceFromAPI() {
        let authorization = this.state.token.token_type + ' ' + this.state.token.access_token;
        await fetch("https://api.yelp.com/v3/businesses/search?location=australia'", {
            method: "GET",
            headers: {
                'Authorization': authorization,
                'Content-Type': 'application/json'
            },
            body: ""
        }).then((response) => response.json()).then((responseData) => {
            this.setState({
                dataSource: this
                    .ds
                    .cloneWithRows(responseData.businesses),
                isRefreshing: false,
                visible: false,
                places:responseData.businesses
            });
        }).done();
    }

    // _pressRow(rowData) {
    //     console.log(this.props.userData);
    //     //    this.props.navigator.push({      title:'DetailPage',
    //     // passProps:rowData    });
    // }

    renderPlaceCell(rowData) {
        let location = {};
        if (rowData.location != null) {
            location = rowData.location;
        }
        return (

            <TouchableOpacity onPress={() => this._pressRow(rowData)}>
                <View style={AppStyles.cell_color}>
                    <View style={AppStyles.poster_margin}>
                        <Image
                            style={AppStyles.poster_height}
                            source={{
                            uri: rowData.image_url
                        }}/>
                    </View>
                    <View style={AppStyles.flex7}>
                        <Text style={AppStyles.cell_title}>
                            {rowData.name}</Text>
                        <View
                            style={{
                            flexDirection: 'row',
                            paddingBottom: 10
                        }}>
                            <Stars
                                value={rowData.rating}
                                spacing={6}
                                count={5}
                                starSize={20}
                                backingColor='white'
                                fullStar={require('../resources/starFilled.png')}
                                emptyStar={require('../resources/starEmpty.png')}
                                halfStar={require('../resources/starHalf.png')}/>

                            <Text style={{
                                paddingLeft: 10,
                                marginTop: 5
                            }}>{rowData.review_count} Reviews</Text>
                        </View>

                        <View
                            style={{
                            paddingTop: 25
                        }}>
                            <Text>Address: {location.address1}, {location.address2}</Text>
                            <Text>{location.city}
                                - {location.display_address[location.display_address.length - 1]}
                            </Text>
                        </View>
                    </View>

                </View>
            </TouchableOpacity>
        )
    }

    onRefeshListView() {
        this.setState({isRefreshing: true});
        this.getMoviesFromApiAsync();
    }

    searchPlacesList(text) {
        if (!text) {
            this.cancelSearchPlacesList();
            return;
        }

        var matchingPlaces = [];
        this
            .state
            .places
            .forEach(function (place) {
                if (place.name.toLowerCase().match(text.toLowerCase())) 
                    matchingPlaces.push(place)
            })

        this.setState({
            dataSource: this
                .state
                .dataSource
                .cloneWithRows(matchingPlaces)
        })
    }

    cancelSearchPlacesList() {
        this.setState({
            dataSource: this
                .state
                .dataSource
                .cloneWithRows(this.state.places)
        })
    }

goToFilterScreen = () => {
   //this.props.dispatch(actionCreators.storeUserInfo({username : this.state.username}))
    this.props.navigator.push({
        title:'Filter Screen',
        component:FilterScreen
    })
}
    
    render() {
        let width = Dimensions.get('window').width;
        if (this.state.visible) {
            return (
                <View
                    style={{
                    flex: 1,
                    backgroundColor: '#d11141'
                }}>
                    <Spinner
                        visible={this.state.visible}
                        textContent={"Loading..."}
                        textStyle={{
                        color: 'white'
                    }}/>
                </View>
            )
        }
        return (
            <View style={{paddingTop:15, backgroundColor:'#d11141'}}>
            <StatusBar backgroundColor='white' barStyle='light-content'/>
                <View style={{flexDirection:'row'}}>
                <View style={{flex:3,borderRadius: 7,marginLeft:8, marginBottom:8,marginTop:8,padding:1,shadowColor:'white',shadowOpacity:0.6,borderWidth: 2,borderColor:'white'}}>
                        <Button style={{ fontSize:16}} onPress={() => this.goToFilterScreen() } title='Filter' color='white'/>
                    </View>
                    <View style={{flex:7,borderRadius: 8, borderWidth: 0.5,marginLeft:8, marginRight:8,marginTop:10, marginBottom:8,
                        alignItems:'center',borderColor:'white',backgroundColor:'white'}}>
                        <TextInput
                            style={{fontSize:20,marginLeft:4,marginTop:10,height:20}}
                            onChangeText={(text) => this.searchPlacesList(text)}
                            placeholder='Restaurants'/> 
                        </View>
                </View>

                <View>
                     <ListView style={AppStyles.flex_column} 
                   refreshControl={
                    <RefreshControl refreshing={this.state.isRefreshing}
                            onRefresh={() => this.onRefeshListView.bind(this)}/>} 
                            dataSource={this.state.dataSource} renderRow={this.renderPlaceCell
                }/> 
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        filterData: state.params,
    }
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        width: 120,
        justifyContent: 'center',
        alignItems: 'center'
    },

    searchBar: {
        borderWidth: 0.5,
        backgroundColor: 'white',
        borderColor: 'white',
        borderRadius: 7,
        height: 40
    }
});

export default connect(mapStateToProps)(Search);
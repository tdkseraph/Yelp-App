import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TextInput,
    Button,
    Platform,
    Switch,
    StatusBar,
    Spinner,
    Image,
    TouchableHighlight,
    ListView,
    TouchableOpacity
} from 'react-native';
import {connect} from 'react-redux'
import AppStyles from '../stylesheet/decoration.js'
import SearchScreen from './search.js'
import ModalDropDown from 'react-native-modal-dropdown'
import {Yelp} from '../api/yelpsearch.js'
import {actionCreators} from '../store/reducer.js'

class CustomSwitch extends Component{   
    constructor(props){
        super(props);
      
        this.state = {
            switchValue:false,
        }
    }

    render(){
        return(
            <View style={{flexDirection:'row', justifyContent:'space-between', paddingTop:8,paddingBottom:8,
            backgroundColor:'white',borderRadius: 5, borderWidth: 1,borderColor:'silver',
             marginTop:2, marginLeft:8, marginRight:8}}>
                <Text style={{marginLeft: 8,fontSize:22, fontWeight:'500'}}>{this.props.text}</Text>
                <Switch onTintColor='#d11141' value={this.props.switchOn}/>
            </View>
        )
    }
}

class Filter extends Component {
   
    constructor(props) {
        super(props);
           this.renderCategoryCell = this.renderCategoryCell
            .bind(this);

        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.state= {
            dropdown_icon_heart: true,
            visible:true,
            offerSetting:false,
            selectedDistance:{
                index:0,
                text:'Auto'},
            selectedSortBy:{
                index: 0,
                text:'Best Match'},
            categories:[{}],
            currentCategories:[{}],
            dataSource: this.ds.cloneWithRows([]),
            selectedCategories:[],
            searchTerm:''
        } 
    }

  _dropdown_renderRow(rowData, rowID, highlighted) {
    let icon = highlighted ? require('../resources/heart.png') : require('../resources/uncheck.png');
    return (
      <TouchableHighlight underlayColor='white'>
        <View style={[styles.dropdown_row, {backgroundColor:'white'}]}>
          <Text style={[styles.dropdown_row_text, highlighted && {color: 'mediumaquamarine'}]}>
            {`${rowData}`}
          </Text>
          <Image style={styles.dropdown_image}
                 mode='stretch'
                 source={icon}
          />
          
        </View>
      </TouchableHighlight>
    );
  }

   componentWillMount() {
         this.searchNewSetting();  
    }

    joinSearchTerm(){
        let term = '';
        if(this.state.selectedDistance.text !== 'Auto'){
            term += '&radius=' + this.state.selectedDistance.text.substr(0, this.state.selectedDistance.text.indexOf(' '));
        }

            let str = this.state.selectedSortBy.text.split(" ").join('_');
            term += '&sort_by='+ str.toLowerCase();


        if(this.state.selectedCategories.length > 0){
            term += '&categories=' + this.state.selectedCategories.join(',');
        }

        this.setState({searchTerm: term});
        this.props.dispatch(actionCreators.storeFilterSettings({
            offerSetting:this.state.offerSetting,
            selectedDistance: this.state.selectedDistance,
            selectedSortBy: this.state.selectedSortBy,
            categories: this.state.currentCategories,
            searchTerm : term
        }))

          this.props.navigator.push({
        title:'Search Screen',
        component:SearchScreen
    })
    }

addValueToCategory(alias, rowID){
    let tmpCategory = this.state.currentCategories;
    var index = this.state.selectedCategories.indexOf(alias);
    if (index != -1){
        this.state.selectedCategories.splice(index,1);
        tmpCategory[rowID].check = false;
    } else {
        this.state.selectedCategories.push(alias);
        tmpCategory[rowID].check = true;
    }

    this.setState({categories: tmpCategory,
            dataSource: this
                .ds
                .cloneWithRows(tmpCategory)})
    console.log(this.state.categories[rowID]);
}

renderCategoryCell(rowData, rowID) { 
        return (
               <View style={{flexDirection:'row', justifyContent:'space-between', paddingTop:8,paddingBottom:8,
            borderRadius: 5, borderWidth: 1,borderColor:'silver',marginTop:2, marginLeft:8, marginRight:8}}>
                <Text style={{marginLeft: 8,fontSize:22, fontWeight:'500'}}>{rowData.title}</Text>
                <Switch onValueChange={() => this.addValueToCategory(rowData.alias, rowID)} onTintColor='#d11141' value={this.state.categories[rowID].check}/>
            </View>
        )
    }

  async searchNewSetting(){
        console.log('Start getting data from category api');
        //let category = await Yelp.getCategories();

    let category = await Yelp.getCategories().then((item) => {
                //console.log(item);
                return item;
          });;
    console.log(category.length);
    if (category.length > 0){
         this.setState({
            categories:category,
            currentCategories: category.slice(0,3),
            visible:false,
             dataSource: this.ds
                .cloneWithRows(category.slice(0,3))
        })
    }      
  }

  expandListView()
  {
      let tmpCategory = this.state.categories;
        for(var i =0; i< 3;i++){
            tmpCategory[i].check = this.state.currentCategories[i].check;
        }
        this.setState({
            currentCategories: tmpCategory,
            categories: tmpCategory,
        })

       this.setState({
             dataSource: this
                .ds
                .cloneWithRows(tmpCategory)
        })
  }

returnSearchScreen(){
    this.props.navigator.push({
        title:'Search Screen',
        component:SearchScreen
    })
}
    render(){
        let dropdown_icon = this.state.dropdown_icon_heart ? require('../resources/heart.png') : require('../resources/uncheck.png');
       const distanceOptions = ['Auto','3 miles','1 miles','5 miles','20 miles'];
        const matchOptions = ['Best Match','Review Count','Rating'];

           if (this.state.categories.length === 0) {
            return (
                
                    <View style={{flex:1, justifyContent:'center',backgroundColor:'#d11141'}}>
                        <StatusBar barStyle='dark-content'/>
                        <Text style={{textAlign:'center', fontSize:25, fontWeight:'bold'}}> Loading ...</Text>
                     </View>
            )
            }

        return(
            <View style={{backgroundColor:'#d11141'}}>
            <StatusBar barStyle='light-content'/>
            <View style={{flexDirection:'row',justifyContent:'space-between',
            backgroundColor:'#d11141',paddingTop:30, paddingBottom:10,marginLeft: 8, marginRight:8}}>
                <Text style={{fontSize: 20,color:'white',fontWeight:'bold'}} onPress={() => this.returnSearchScreen()}>Cancel</Text>
                <Text style={{fontSize: 18,color:'white', fontWeight:'bold'}}>Filter</Text>
                <Text style={{fontSize: 20,color:'white',fontWeight:'bold'}} onPress={() => this.joinSearchTerm()}>Search</Text>
            </View>

            <View style={{backgroundColor:'white', height:'95%', paddingTop:10}}>
                <CustomSwitch switchOn={true} text='Offering a Deal'/>
                <Text style={{paddingLeft: 8, fontSize:20,paddingTop:10, paddingBottom:10}}>Distance</Text>
                <ModalDropDown style={styles.dropdown}
                style={{paddingTop:6,paddingBottom:6, 
            backgroundColor:'white',borderRadius: 5, borderWidth: 1,borderColor:'silver',
             marginTop:2, marginLeft:8, marginRight:8}}
                           textStyle={styles.dropdown_text}
                           defaultIndex={this.state.selectedDistance.index}
                           dropdownStyle={styles.dropdown_dropdown}
                           options={distanceOptions} onSelect={(index,value) => this.setState({selectedDistance:
                               { index: index, text:value}
                           })}
                           renderRow={this._dropdown_renderRow.bind(this)}>
                           <Text style={{fontSize:22, paddingTop:4, paddingBottom:4,marginLeft:8, fontWeight:'500'}}>{this.state.selectedDistance.text}</Text>              
                </ModalDropDown>

                <Text style={{paddingLeft: 8, fontSize:20,paddingTop:10, paddingBottom:10}}>Sort By</Text>    
                  <ModalDropDown style={styles.dropdown}
                style={{paddingTop:6,paddingBottom:6,
            backgroundColor:'white',borderRadius: 5, borderWidth: 1,borderColor:'silver',
             marginTop:2, marginLeft:8, marginRight:8}}
                           textStyle={styles.dropdown_text}
                           defaultIndex={this.state.selectedSortBy.index}
                           dropdownStyle={styles.dropdown_dropdown}
                           options={matchOptions} onSelect={(index,value) => this.setState({
                               selectedSortBy:
                               { index: index, text:value}
                           })}
                           renderRow={this._dropdown_renderRow.bind(this)}>
                           <Text style={{fontSize:22, paddingTop:4, paddingBottom:4,marginLeft:8, fontWeight:'500'}}>{this.state.selectedSortBy.text}</Text>              
                </ModalDropDown>

                <Text style={{paddingLeft: 8, fontSize:20,paddingTop:10, paddingBottom:10}}>Category</Text>
                <View>
                 <ListView style={{flexDirection:'column'}}
                        dataSource={this.state.dataSource} renderRow={(rowData, sectionID,rowID) =>this.renderCategoryCell(rowData, rowID)
                }/> 
                <Text onPress={() => this.expandListView()} style={{fontSize:22, textAlign:'center',paddingTop:4, 
                marginLeft:8, fontWeight:'400'}}>See all ...</Text>
            </View>
            </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dropdown: {
    alignSelf: 'center',
    top: 32,
    right: 8,
    justifyContent:'space-between',
    backgroundColor: 'cornflowerblue',
  },
  dropdown_text: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
  },
  dropdown_dropdown: {
    marginTop:10,
    height: 253,

  },
  dropdown_row: {
       borderTopColor: 'white',
       width:'95%',
    flexDirection: 'row',
    height: 50,
    justifyContent:'space-between',
    alignItems: 'center',
  },
  dropdown_image: {
    width: 30,
    height: 30,
  },
  dropdown_row_text: {
    marginHorizontal: 14,
    fontSize: 22,
    color: 'navy',
    textAlignVertical: 'center',
  },
})

const mapStateToProps = (state) => {
    return {filterData: state.params}
}

export default connect(mapStateToProps)(Filter);
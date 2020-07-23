import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from '@material-ui/core/Slider';
import axios from 'axios';
import constants from "../../constant";
const checkboxes = [
    {
      name: 'binary search',
      key: 'binary search',
      label: 'binary search',
    },
    {
      name: 'check-box-2',
      key: 'checkBox2',
      label: 'Check Box 2',
    },
    {
      name: 'check-box-3',
      key: 'checkBox3',
      label: 'Check Box 3',
    },
    {
      name: 'check-box-4',
      key: 'checkBox4',
      label: 'Check Box 4',
    },
  ];
 

  const Checkbox = ({ type = 'checkbox', name, checked = false, onChange }) => (
      
          <input type={type} name={name} checked={checked} onChange={onChange} />
    
  );
  
  Checkbox.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
  }  
  function valuetext(value) {
    return `${value}°C`;
  }

  
  const sliderMin=800,sliderMax=3000;
export default class CreateLadder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checkedItems: new Map(),

            ratingMin:800,
            ratingMax:3000,
            no_question:10,
            name:""
          }
      
        this.handleChange = this.handleChange.bind(this);
        this.handleSliderChange = this.handleSliderChange.bind(this);
        this.onChangequestionNum=this.onChangequestionNum.bind(this);
        this.onSubmit=this.onSubmit.bind(this);
        this.onChangeName=this.onChangeName.bind(this);
        this.prepareLadder=this.prepareLadder.bind(this);

    }
    onChangeName(e){
        this.setState({name:e.target.value});
    }
    onChangequestionNum(e){
        this.setState({no_question:e.target.value});
    }
    
    handleChange(e) {
        const item = e.target.name;
        const isChecked = e.target.checked;
        this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
      }
    
    handleSliderChange(e,new_value){
        if(new_value[1]>new_value[0]){
            this.setState(prevState=>({ratingMax:new_value[1],ratingMin:new_value[0]}));
        }
       
        
    }
    prepareLadder(problems_,name_,rating_,num_,tags_){
        let min=rating_[0],max=rating_[1];
        let questionList=[];
        for(var key in problems_){
            if(problems_[key]['rating']>=min&&problems_[key]['rating']<=max){
                questionList.push([problems_[key]['contestId']+" "+problems_[key]['index'],problems_[key]['rating']]);
            }
        }
        console.log(questionList.length);
        const shuffled = questionList.sort(() => 0.5 - Math.random());
        let selected = shuffled.slice(0, num_);
        selected=selected.sort(function(a, b){return a[1]-b[1]});
        let selectedMap=new Map();
        for(var key in selected){
            
            selectedMap[selected[key][0]+" "+ selected[key][1].toString()]=false;
        }
        console.log(constants.user);
        const newLadder = {
            userId:constants.user.id,
            name: name_,
            tags: tags_,
            rating: rating_,
            problems: selectedMap
        };  
        console.log(newLadder);
        axios.post('/app/ladders/add',newLadder)
        .then(alert('created successfully'));
        this.setState(
            {
                checkedItems: new Map(),

                ratingMin:800,
                ratingMax:3000,
                no_question:10,
                name:""
            }
        )
        this.props.history.push('/dashboard');
    
      }

    onSubmit(e) {
        e.preventDefault();
        let tags="";
        let rating=[this.state.ratingMin,this.state.ratingMax];
        let num=this.state.no_question;
        let name=this.state.name;
        
        for (let [key, value] of this.state.checkedItems) {
            if(value){
                tags=tags+key+";";
            }
        }
     
        console.log(tags);
        axios.get('/api/problemset.problems?tags='+tags)
                .then(response => {
                    alert("Deleted Successfully!");
                    this.prepareLadder(response.data['result']['problems'],name,rating,num,tags);
                    
                })
                .catch(function (error){
                    console.log(error);
                })
        
    }

    render() {
        return (
            <div style={{marginTop: 10}}>
                <h3>Create New Ladder</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="input-field col s12">
                            <input 
                                    type="text" 
                                    
                                    value={this.state.name}
                                    id="name"
                                    onChange={this.onChangeName}
                                    />
                                <label htmlFor="name">Name</label>
                    </div>
                    <div className="input-field col s12">
                            <span>Number of Questions :&nbsp;&nbsp;</span>
                            <div className="form-check form-check-inline">
                            <input  className="with-gap" 
                                    type="radio" 
                                    name="numberOptions" 
                                    id="number5" 
                                    value="5"
                                    checked={this.state.no_question===5} 
                                    onChange={this.onChangequestionNum}
                                    />
                            <span>5</span>
                        </div>
                        <div className="form-check form-check-inline">
                            <input  className="with-gap" 
                                    type="radio" 
                                    name="numberOptions" 
                                    id="number10" 
                                    value="10"
                                    checked={this.state.no_question===10} 
                                    onChange={this.onChangequestionNum}
                                    />
                            <span>10</span>
                        </div>
                        <div className="form-check form-check-inline">
                            <input  className="with-gap" 
                                    type="radio" 
                                    name="numberOptions" 
                                    id="number15" 
                                    value="15"
                                    checked={this.state.no_question===15} 
                                    onChange={this.onChangequestionNum}
                                    />
                            <span>15</span>
                        </div>
                    </div>
                    <div className="input-field col s12"> 
                        <span>Select Tags :&nbsp;&nbsp; </span>
                        <div className="form-check form-check-inline">
                            {
                            checkboxes.map(item => (
                                <label>
                                
                                <Checkbox id={item.name} name={item.name} checked={this.state.checkedItems.get(item.name)} onChange={this.handleChange} />
                                &nbsp;&nbsp;
                            <span>{item.name}</span>
                                </label>
                            ))
                            }
                        </div>
                    </div>
                    
                    <div className="input-field col s12">
                      Select Rating range <br/>
                     <span>Min : {this.state.ratingMin}</span>   
                    <Slider
                        value={[this.state.ratingMin,this.state.ratingMax]}
                        onChange={this.handleSliderChange}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        step={10}
                        min={sliderMin}
                        max={sliderMax}
                        valueLabelDisplay="off"
                        getAriaValueText={valuetext}
                    />
                     <span>Max : {this.state.ratingMax}</span>   
                    </div>
                    <div className="input-field col s12">
                        <input type="submit" value="Create Ladder" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}
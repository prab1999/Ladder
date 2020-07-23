import React, { Component } from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import constants from "../../constant";
import axios from 'axios';

function openQuestion(problemCode){
    
        window.open('https://codeforces.com/problemset/problem/'+problemCode);
    
}
function unlockQuestion(mode,userHandle="",problemCode="",context=null){
    if(mode===0){
        NotificationManager.info("Already unlocked!");
    }
    else if(mode==1){
        console.log(userHandle);
        let contestId=problemCode.split(" ")[0];
        let index=problemCode.split(" ")[1];
        axios.get("api/user.status?handle="+userHandle).then(response=>{
            let results=response.data['result'];
            let obj;
            for(var i=0;i<results.length;i++){
                obj=results[i];
                if(!(obj['problem']['contestId']==contestId&&obj['problem']["index"]==index)){
                    if(true||(obj['verdict']==="OK")){
                        context.props.location.data.problems[problemCode]="true";
                        axios.post('app/ladders/update/'+context.props.location.data._id,
                        {"problems":context.props.location.data.problems}).then(res=>{
                            NotificationManager.info("Updated");
                        }).catch(err=>{
                            console.log(err);
                        })

                        context.componentDidMount();
                        break;
                    }
                }
            }
        }).catch(err=>{

        })
    }
    else{
        NotificationManager.info("First unlock the previous question!");
    }
}

function LockIcon(props){
   
    if(props.index<=props.lastIndex+1){
        
        return(<i onClick={()=>unlockQuestion(0)} className="material-icons">lock_open</i>)
    }
    else{
        if(props.index<=props.lastIndex+2){
            let problemCode=props.context.state.problems[props.lastIndex+1]["Code"];
            let rating=props.context.state.problems[props.lastIndex+1]["Rating"];
            return(<i onClick={()=>unlockQuestion(1,props.userHandle,problemCode+" "+rating,props.context)} className="material-icons clickableIcon">lock</i>)
        }
        else{
            return(<i onClick={()=>unlockQuestion(2)}className="material-icons nonClickableIcon">lock</i>)
        }
       
    }
}
function ViewIcon(props){
    if(props.index<=props.lastIndex+1){
        
        return(<i  onClick={()=>openQuestion(props.problemCode)} className="material-icons clickableIcon">launch</i>)
    }
    else{
        return(null)
    }
}
const Problem = props => (
    <tr >
    <td > {props.problem.Code}</td>
    <td > {props.problem.Rating}</td>
    <td > {props.problem.Solved}</td>
    <td>
        <LockIcon index={props.index} lastIndex={props.solvedIndex}
         problemCode={props.problem.Code.split(" ")[0]+"/"+props.problem.Code.split(" ")[1]}
         userHandle={props.userHandle}
         context={props.context}
        />
        <ViewIcon index={props.index} lastIndex={props.solvedIndex} 
        problemCode={props.problem.Code.split(" ")[0]+"/"+props.problem.Code.split(" ")[1]}/>
    
    </td>
    </tr>
    

)

export default class LadderView extends Component {
    constructor(props) {
        super(props);
        this.state={
            problems:[],
            lastSolved:-1,
        };
        
    }
    componentDidMount() {
                var problemMap=this.props.location.data.problems;
        
                var questions=[];
                var cnt=0;
                for(var key in problemMap){
                    var p=key.split(" ");
                    var data={"Code":p[0]+" "+p[1],"Rating":p[2],"Solved":problemMap[key]};
                    if(problemMap[key]==='true')cnt++;
                    questions.push(data);
                }
                this.setState({problems:questions,lastSolved:this.state.lastSolved+cnt});

    
    }
    problemList() {
        var self=this;
        return this.state.problems.map(function(currentProblem, i){
            console.log(i);
            return <Problem problem={currentProblem}  key={i} index={i} 
            userHandle={constants.user.handle} solvedIndex={self.state.lastSolved}
            context={self}
            />;
        })
    }
    render(){
        
        return(
            <div>
            <h3>Question List</h3>
            <table className="table table-striped" style={{ marginTop: 20 }} >
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Rating</th>
                        <th>Completed</th>
                        
                    </tr>
                </thead>
                <tbody>
                    { this.problemList() }
                </tbody>
            </table>
            <NotificationContainer/>
        </div>
        );
    }


}
const mapStateToProps = state => ({
    auth: state.auth
  });

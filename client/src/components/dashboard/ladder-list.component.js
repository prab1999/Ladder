import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from "react-bootstrap/Button";
import constants from "../../constant";
//import { Button} from 'react-bootstrap/lib/Button';

// const [show, setShow] = useState(false);

// 


const Ladder = props => (
        <tr onClick={props.onClick}>
        <td > {props.ladder.name}</td>
        <td >{props.ladder.rating}</td>
        <td >{props.ladder.tags}</td>
        </tr>
        
    
)

export default class LadderList extends Component {

    constructor(props) {
        super(props);
        window.c=this;
        this.state = {ladders: []};
    }
    
    componentDidMount() {
        axios.get('app/ladders/'+constants.user.id)
            .then(response => {
                this.setState({ ladders: response.data });
            })
            .catch(function (error){
                console.log(error);
            })
    }
    ladderList() {
        var self=this;
        return this.state.ladders.map(function(currentLadder, i){
            return <Ladder ladder={currentLadder}  key={i} onClick={()=>self.props.history.push({
                pathname: '/view',
                data: currentLadder // your data array of objects
              })} />;
        })
    }
    render() {
        return (
            
             <div>
                <h3>Ladders List</h3>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Rating</th>
                            <th>Tags</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.ladderList() }
                    </tbody>
                </table>
            </div>
        )
    }
}
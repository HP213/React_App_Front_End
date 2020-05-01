import React from 'react';
import axios from 'axios';
import ServerDetails from './componenets/ServerDetails.js';
import ServerDetailsTemp from './componenets/serverDetailsTemp.js';
import Header from './componenets/Header.js';
import CurrenTemperature from './componenets/CurrentTemperature.js';
import DashBoard from "./componenets/Dashboard";
import './style.css';

class App extends React.Component{
  constructor(){
    super()
    this.v = 0;
    this.state = {
      servers : [],
      labels : [0],
      average : [1.3],
      const : [1.3],
      total : 0,
      total_used : 0,
      total_saving : 0,
      AddUpdatePanel : false,
      CPU_TOTAL : 0,
      memory_used : 0,
      temp : 0,
      CoolerTemperature : "OFF"
    }

    this.handleAddUpdate = this.handleAddUpdate.bind(this)
    this.onAdditionOfData = this.onAdditionOfData.bind(this)
    this.addToStateArray = this.addToStateArray.bind(this)
    this.onDeleteButton = this.onDeleteButton.bind(this)
    this.onChangeUpdate = this.onChangeUpdate.bind(this)
  }

  handleAddUpdate(){
    this.setState(prevState =>{
      return{
        AddUpdatePanel : !prevState.AddUpdatePanel
      }
    })
  }

  onAdditionOfData(event){
    this.setState({
      [event.target.name] : event.target.value
    })
  }

  newtonLaw(t0, ts) {
    return ts-(0.4*(t0-ts));
  }

  calculateReduce(temp){
    if(temp-18 <= 0){
      return 1.3;
    }else{
      let differecne = temp-18;
      differecne = differecne*3.5;
      differecne = differecne/100;
      return 1.3*(1- differecne);
    }
  }

  calculateSavings(ACtemperature){
    let currentTotal = this.state.total + 1.3;
    let currentTotalUsed = this.state.total_used + ACtemperature;
    return ((currentTotal-currentTotalUsed)/currentTotal)*100;
  }

  addToStateArray(event){
      let addValue = {CPU_total : this.state.CPU_TOTAL, temp : this.state.temp, memory_used : this.state.memory_used}

      axios.post("predict",addValue).then((res)=>{
        const temp = res.data;
        addValue['current_temp'] = temp;
        addValue['acTemp'] = this.newtonLaw(temp, this.state.temp);
        let ACTemperature = this.calculateReduce(addValue['acTemp']);
        let size = this.state.labels.length;
        let calSavings = this.calculateSavings(ACTemperature);
        this.setState(({
          servers : [...this.state.servers, addValue],
          labels : [...this.state.labels, size],
          const : [...this.state.const, 1.3],
          average : [...this.state.average, ACTemperature],
          total : this.state.total + 1.3,
          total_used : this.state.total_used + ACTemperature,
          total_saving : calSavings
        }))
      }).catch((err)=>{
        console.log(err.response);
      })
    event.preventDefault();
  }

  onDeleteButton(id){
    let filterdArray = this.state.servers;
    filterdArray.splice(id,1);
    this.setState({
      servers : filterdArray,
      CoolerTemperature : filterdArray.length > 0 ? this.state.CoolerTemperature : "OFF"
    });
  }

  onChangeUpdate(value){
    let updatedList = this.state.servers;
    updatedList[value.id] = value;
    let ACTemperature;
    let size;
    let calSavings;
    axios.post("multiple",updatedList).then((res) => {
      res.data.forEach((item, i) => {
        updatedList[i].current_temp = item;
        updatedList[i].acTemp = this.newtonLaw(item, value.temp);
        ACTemperature = this.calculateReduce(updatedList[i].acTemp);
        size = this.state.labels.length;
        calSavings = this.calculateSavings(ACTemperature);
      });
      this.setState({
        servers: updatedList,
        labels : [...this.state.labels, size],
        const : [...this.state.const, 1.3],
        average : [...this.state.average, ACTemperature],
        total : this.state.total + 1.3,
        total_used : this.state.total_used + ACTemperature,
        total_saving : calSavings
      })
    }).catch((err)=>{
      console.log(err);
    })
  }

  render(){
    console.log(this.state.servers);
      const CurrenTServerDetails = {
        display : "none"
      }

      const buttonStyle = {
        marginTop : "20px"
      }

      const buttonText = this.state.AddUpdatePanel ? "Return Back" : "Update/Add"

      let allServers = [];
      this.state.servers.forEach((server, index)=>{
      allServers.push(<ServerDetails key = {this.v} id={index} server = {server} onDeleteButton={(index) => this.onDeleteButton(index)} onChangeUpdate={(value) => this.onChangeUpdate(value)}/>);
        this.v+=1;
      });
      return(
        <div>
          <Header />
          <div style = {this.state.AddUpdatePanel ?  CurrenTServerDetails : null}>
          <DashBoard key={this.v} savings = {this.state.total_saving} days = {this.state.labels.length - 1} count = {this.state.servers.length} labels = {this.state.labels} const = {this.state.const} average = {this.state.average}/>
          </div>
          <div style = {!this.state.AddUpdatePanel ?  CurrenTServerDetails : null} className = "server-list">
            <div>
              <form onSubmit = {this.addToStateArray}>
                <input type="number" required step="0.01" min="0.01"  name="CPU_TOTAL" placeholder = "CPU_TOTAL" onChange={this.onAdditionOfData}/>
                <input type="number" required step="0.01" min="0.01"  name="memory_used" placeholder = "Memory Used" onChange={this.onAdditionOfData}/>
                <input type="number" required step="0.01" min="0"  name="temp" placeholder = "Add Tempeature in °C" onChange={this.onAdditionOfData}/>
                <input type="submit" value="Add"/>
              </form>
            </div>
            {allServers}
          </div>
          <div style = {this.state.AddUpdatePanel ? buttonStyle : null} className = "button-style">
            <button onClick={this.handleAddUpdate}>{buttonText}</button>
          </div>
        </div>
      )
  }
}

export default App

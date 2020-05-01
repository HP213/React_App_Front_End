import React from 'react';
import axios from 'axios';
import ServerDetails from './componenets/ServerDetails.js';
import Header from './componenets/Header.js';
import CurrenTemperature from './componenets/CurrentTemperature.js'
import './style.css';

class App extends React.Component{
  constructor(){
    super()
    this.v = 0;
    this.state = {
      servers : [],
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

  // componentDidMount() {
  //   axios.get("/test?format=json").then((res)=>{
  //     console.log(res.data);
  //   }).catch((err)=>{
  //     console.log(err.response);
  //   })
  // }

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

  addToStateArray(event){
      let addValue = {CPU_total : this.state.CPU_TOTAL, temp : this.state.temp, memory_used : this.state.memory_used}

      axios.post("predict",addValue).then((res)=>{
        const temp = res.data;
        addValue['current_temp'] = temp;
        addValue['acTemp'] = this.newtonLaw(temp, this.state.temp);
        this.setState(({
          servers : [...this.state.servers, addValue],
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
    axios.post("multiple",updatedList).then((res) => {
      res.data.forEach((item, i) => {
        updatedList[i].current_temp = item;
        updatedList[i].acTemp = this.newtonLaw(item, value.temp);
      });
      this.setState({
        servers: updatedList
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
            <CurrenTemperature temperature = {this.state.CoolerTemperature} count = {this.state.servers.length}/>
          </div>
          <div style = {!this.state.AddUpdatePanel ?  CurrenTServerDetails : null} className = "server-list">
            <div>
              <form onSubmit = {this.addToStateArray}>
                <input type="number" step="0.01" min="0" name="CPU_TOTAL" placeholder = "CPU_TOTAL" onChange={this.onAdditionOfData}/>
                <input type="number" step="0.01" min="0" name="memory_used" placeholder = "Memory Used" onChange={this.onAdditionOfData}/>
                <input type="number" step="0.01" min="0" name="temp" placeholder = "Add Tempeature in °C" onChange={this.onAdditionOfData}/>
                <input type="submit" value="Add"/>
              </form>
            </div>
            {allServers}
          </div>
          <div className = "button-style">
            <button onClick={this.handleAddUpdate}>{buttonText}</button>
          </div>
        </div>
      )
  }
}

export default App

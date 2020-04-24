import React from 'react';
import axios from 'axios';
import ServerDetails from './componenets/ServerDetails.js';
import Header from './componenets/Header.js';
import CurrenTemperature from './componenets/CurrentTemperature.js'
import './style.css';

class App extends React.Component{
  constructor(){
    super()
    this.state = {
      servers : [],
      AddUpdatePanel : false,
      CurrentClient : 0,
      CurrenTemperature : 0,
      CoolerTemperature : "OFF"
    }

    this.handleAddUpdate = this.handleAddUpdate.bind(this)
    this.onAdditionOfData = this.onAdditionOfData.bind(this)
    this.addToStateArray = this.addToStateArray.bind(this)
    this.onDeleteButton = this.onDeleteButton.bind(this)
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
    // console.log([event.target.name]);
  }

  addToStateArray(event){
    if(this.state.CurrentClient > 0 && this.state.CurrentTemperature > 0){
      let temp = Date.now()
      let addValue = {id : temp, client : this.state.CurrentClient, temperature : this.state.CurrentTemperature}
      console.log(addValue);
      console.log("Servers : ", this.state.servers);
      this.setState({
        servers : [...this.state.servers, addValue],
        CurrentTemperature : 0,
        CurrentClient : 0,
        CoolerTemperature : "Calculating..."
      }, ()=>{
        axios({
          method : 'post',
          url : 'http://192.168.43.214:3000/getData',
          data : this.state.servers,
        }).then(res =>{
          console.log(res);
          console.log(res.data);
          this.setState({
            CoolerTemperature : res.data
          })
        })
      })
      event.value = 0
    }
    event.preventDefault();
  }

  onDeleteButton(id){
    let filterdArray = this.state.servers.filter(server => server.id != id)
    // console.log(filterdArray);
    this.setState({
      servers : filterdArray,
      CoolerTemperature : filterdArray.length > 0 ? this.state.CoolerTemperature : "OFF"
    }, ()=>{
      axios({
        method : 'post',
        url : 'http://192.168.43.214:3000/getData',
        data : this.state.servers,
      }).then(res =>{
        console.log(res);
        console.log(res.data);
        this.setState({
          CoolerTemperature : res.data === 0 ? "OFF" : res.data
        })
      })
    })
    // console.log(id);
  }

  render(){
      const CurrenTemperatureStyle = {
        display : "null"
      }

      const CurrenTServerDetails = {
        display : "none"
      }

      const buttonText = this.state.AddUpdatePanel ? "Return Back" : "Update/Add"

      const allServers = this.state.servers.map(server => <ServerDetails key = {server.id} server = {server} onDeleteButton={this.onDeleteButton}/>)

      return(
        <div>
          <Header />
          <div style = {this.state.AddUpdatePanel ?  CurrenTServerDetails : null}>
            <CurrenTemperature temperature = {this.state.CoolerTemperature} count = {this.state.servers.length}/>
          </div>
          <div style = {!this.state.AddUpdatePanel ?  CurrenTServerDetails : null} className = "server-list">
            <div>
              <form onSubmit = {this.addToStateArray}>
                <input type="number" name="CurrentClient" placeholder = "Add Number of clients" onChange={this.onAdditionOfData}/>
                <input type="number" name="CurrentTemperature" placeholder = "Add Tempeature in °C" onChange={this.onAdditionOfData}/>
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

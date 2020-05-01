import React from 'react';

class ServerDetails extends React.Component{
  constructor(props){
    super();
    this.state = {
      CPU_total : props.server.CPU_total,
      temp: props.server.temp,
      memory_used : props.server.memory_used,
      id : props.id,
      curTemp: props.server.current_temp,
      acTemp: props.server.acTemp,
      disabled : true
    }
    this.onChangeInputValue = this.onChangeInputValue.bind(this)
    this.HandleOnUpdate = this.HandleOnUpdate.bind(this)
  }

  componentDidMount() {
    console.log(this.state.curTemp);
    const interval = setInterval(() => {
      if(this.state.curTemp > this.state.acTemp) {
        this.setState({
          curTemp: this.state.curTemp-1
        })
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  onChangeInputValue(event){
    this.setState({
      [event.target.name] : event.target.value,
      disabled : false
    })
  }

  HandleOnUpdate(){
    this.setState({
      disabled : true
    }, ()=>{
      let temp = {id : this.state.id , CPU_total : this.state.CPU_total, temp : this.state.temp, memory_used : this.state.memory_used}
      this.props.onChangeUpdate(temp)
    })
  }

  render(){
    return(
      <div className="server-item">
        <input type="button" value="Delete" onClick = {() => this.props.onDeleteButton(this.state.id)}/>
        <p className="serverPabove">ID:</p>
        <p className="serverP">{this.props.id}</p>
        <input type="text" step="0.01" min="0" name="CPU_total" value={this.state.CPU_total} onChange={e => this.onChangeInputValue(e)}/>
        <input type="text" step="0.01" min="0" name="memory_used" value={this.state.memory_used} onChange={e => this.onChangeInputValue(e)}/>
        <input type="text" step="0.01" min="0" name="temp" value={this.state.temp} onChange={e => this.onChangeInputValue(e)}/>
        <input type="text" readOnly  name="curTemp" value={this.state.curTemp}/>
        <input type="text" readOnly name="acTemp" value={this.state.acTemp}/>
        <input type="button" disabled={this.state.disabled} value="Update" onClick={this.HandleOnUpdate}/>
      </div>
    )
  }
}

export default ServerDetails

import React from 'react';


class ServerDetails extends React.Component{
  render(){
    let client = this.props.server.client;
    let temperature = this.props.server.temperature;
    return(
      <div className="server-item">
        <input type="button" value="Delete" onClick = {() => this.props.onDeleteButton(this.props.server.id)}/>
        <p className="serverPabove">ID:</p>
        <p className="serverP">{this.props.server.id}</p>
        <input type="text" name="newClientNumber" value={client}/>
        <input type="text" name="newTemperature" value={temperature}/>
      </div>
    )
  }
}

export default ServerDetails

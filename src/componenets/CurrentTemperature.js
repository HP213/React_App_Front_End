import React from "react";

class CurrenTemperature extends React.Component{
  constructor(){
    super()
  }

  render(){
    return(
      <div className="temperature-page">
        <h1>Current Tempeature is : {this.props.temperature}</h1>
        <h3>Count of Servers Connected : {this.props.count}</h3> 
      </div>
    )
  }
}

export default CurrenTemperature;

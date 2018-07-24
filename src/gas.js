import React, { Component } from 'react'
import axios from "axios"
import deepmerge from 'deepmerge';
const GASBOOSTPRICE = 0.21 //gwei

let pollInterval
let pollTime = 39007

let defaultConfig = {}
defaultConfig.DEBUG = false;
defaultConfig.hardcodedGwei = false
defaultConfig.hide = true;

class Gas extends Component {
  constructor(props) {
    super(props);
    let config = defaultConfig
    if(props.config) {
      config = deepmerge(config, props.config)
    }
    this.state = {
      gwei: 21,
      config: config,
    }
  }
  componentDidMount(){
    pollInterval = setInterval(this.checkOnGasPrices.bind(this),pollTime)
    this.checkOnGasPrices()
  }
  componentWillUnmount(){
    clearInterval(pollInterval)
  }
  checkOnGasPrices(){
    if(!this.state.config.hardcodedGwei){
      axios.get("https://ethgasstation.info/json/ethgasAPI.json", { crossdomain: true })
      .then((response)=>{
        if(response.data.average>0&&response.data.average<200){
          response.data.average=response.data.average+(GASBOOSTPRICE*10)
          let setMainGasTo = Math.round(response.data.average*100)/1000
          if(this.state.gwei!=setMainGasTo){
            let update = {gwei:setMainGasTo}
            this.setState(update)
            this.props.onUpdate(update)
          }
        }
      })
    }else{
      let update = {gwei:this.state.config.hardcodedGwei}
      this.setState(update)
      this.props.onUpdate(update)
    }

  }
  render() {
    if(this.state.config.hide){
      return false
    } else {
      return (
        <div style={{padding:10}}>
          <b>Gas</b>
          <div><i>{this.state.gwei} wei</i></div>
        </div>
      );
    }
  }
}

export default Gas;

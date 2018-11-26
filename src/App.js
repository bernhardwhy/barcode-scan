import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import QrReader from "react-qr-reader";

import Quagga from 'quagga';

class App extends Component {

  state = {
    showQrReader: false,
  }

  componentDidMount() {
    console.log('did mount');
  }

  initQuagga = () => {
    let constraints = {};
    constraints.height = window.innerHeight;
    constraints.width = window.innerWidth;

    console.log('BEFORE INJECTION', constraints);
    this.setState({showCamera: true}, () => {
        console.log('init quagga', Quagga);
        Quagga.init({
            inputStream : {
                name : 'Live',
                type : 'LiveStream',
                target: document.querySelector('.target'), // Or '#yourElement' (optional)
                constraints,
            },
            decoder : {
                readers : ['code_128_reader'],
            },
        }, (err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('Initialization finished. Ready to start');
            Quagga.start();
        });

        Quagga.onDetected((result) => {
            let code = result.codeResult.code;
            console.log('DETECTED: ', code);
            this.stopQuagga();
        });
    });

}

stopQuagga = () => {
    console.log('Stop Quagga');
    Quagga.stop();
    this.setState({showCamera: false});
    Quagga.offDetected(this._onDetected);
}

handleScan = (data) => {
  if (data) {
    console.log(data);
    this.setState({
      result: data,
      showQrReader: false,
    });
  }
}
handleError = (err) => {
  console.error(err);
}

handleBCScan(data){
  this.setState({
    result: data,
  })
}
handleBCError(err){
  console.error(err)
}

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div onClick={this.stopQuagga} className='target'></div>
          <video className='video'></video>
          <div className='preview'></div>
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          {this.state.showQrReader && 
          <QrReader
          delay={300}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: "100%" }}
        />
          }
          <p
            className="App-link"
            onClick={this.initQuagga}
          >
            init quagga
          </p>
          <p
            className="App-link"
            onClick={() => this.setState({showQrReader: true})}
          >
            init qr reader
          </p>
        </header>
      </div>
    );
  }
}

export default App;

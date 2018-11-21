// -- practice exercise on sockets --//

// import React, {Component} from 'react';
// import socketIOClient from 'socket.io-client';

// class Socket extends Component {
//   constructor() {
//     super();
//     this.state = {
//       endpoint: 'http://127.0.0.1:3000/', //local endpt
//       color: 'white',
//       pcolor: ''
//     };
//   }

//   //callback
//   send = () => {
//     const socket = socketIOClient(this.state.endpoint);
//     socket.emit('change color', this.state.color); //emits event to socket - server
//   };

//   setColor = (color) => {
//     this.setState({color});
//   };

//   render() {
//     // check for sockets inside the render or componentdidmount/willmount
//     const socket = socketIOClient(this.state.endpoint);

//     socket.on('change color', (color) => {
//       this.setState({pcolor: color});
//     });

//     return (
//       <div>
//         <p style={{color: this.state.pcolor}}>testing sockets only</p>
//         <button onClick={this.send}>Change color of p tag</button>
//         <button id="blue" onClick={() => this.setColor('blue')}>
//           Blue
//         </button>
//         <button id="red" onClick={() => this.setColor('red')}>
//           Red
//         </button>
//       </div>
//     );
//   }
// }

// export default Socket;

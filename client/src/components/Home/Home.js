import React, { Component } from 'react'
import io from 'socket.io-client'
import { withRouter } from 'react-router-dom'

import './Home.css'

export const socket = io.connect('https://react-poker-chips.herokuapp.com')

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roomName: '',
      userName: '',
      chip: 500
    }
  }

  componentDidMount() {
    socket.on('usernameTaken', msg => alert(msg))
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onSubmit = () => {
    const { roomName, userName, chip } = this.state

    socket.emit('join', this.state)
    socket.on('joined-to-room', () => {
      this.props.history.push({
        pathname: `/table/${this.state.roomName}`,
        state: {
          roomName,
          userName,
          chip
        }
      })
    })
  }

  render() {
    const { roomName, userName, chip } = this.state
    const disabled = userName === '' || roomName === '' ? true : false

    return (
      <div className="container">
        <div>
          <div className="content">
            <h1>React Poker Chips</h1>
            <h2>Virtual poker chips</h2>
            <p>
              Add your name. Create a new room. Invite friends. Start playing.
            </p>
          </div>
        </div>

        <div className="room-input">
          <p style={{ color: 'white', fontSize: '1.5rem' }}>Add room name</p>
          <input
            type="text"
            name="roomName"
            value={roomName}
            onChange={this.handleChange}
            placeholder="type room name here"
            style={{
              width: '500px',
              height: '30px',
              backgroundColor: '#eee',
              color: 'black',
              fontSize: '1rem',
              outlineWidth: '0',
              border: '1px solid grey',
              padding: '10px',
              opacity: '0.8'
            }}
          />
          <p style={{ color: 'white', fontSize: '1.5rem' }}>Add your name</p>
          <input
            type="text"
            name="userName"
            value={userName}
            onChange={this.handleChange}
            placeholder="nickname"
            style={{
              width: '500px',
              height: '30px',
              backgroundColor: '#eee',
              color: 'black',
              fontSize: '1rem',
              outlineWidth: '0',
              border: '1px solid grey',
              padding: '10px',
              opacity: '0.8'
            }}
          />

          <p style={{ color: 'white', fontSize: '1.5rem' }}>Starting chips</p>
          <input
            type="number"
            name="chip"
            value={chip}
            onChange={this.handleChange}
            placeholder="Starting chips"
            style={{
              width: '500px',
              height: '30px',
              backgroundColor: '#eee',
              color: 'black',
              fontSize: '1rem',
              outlineWidth: '0',
              border: '1px solid grey',
              padding: '10px',
              opacity: '0.8'
            }}
          />

          <button
            className="submit-btn"
            disabled={disabled}
            onClick={this.onSubmit}
          >
            Join
          </button>
        </div>
        <div className="chips">
          <div className="pokerchip iso">100</div>
          <div className="pokerchip iso red">200</div>
          <div className="pokerchip iso blue">500</div>
        </div>
      </div>
    )
  }
}

export default withRouter(Home)

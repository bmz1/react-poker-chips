import React, { Component } from 'react'
import io from 'socket.io-client'
import Switch from '@material-ui/core/Switch'
import { withRouter } from 'react-router-dom'

import './Home.css'

const socketURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000'
    : 'https://react-poker-chips.herokuapp.com'
export const socket = io.connect(socketURL)

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roomName: '',
      userName: '',
      chip: 500,
      join: false
    }
  }

  componentDidMount() {
    socket.on('usernameTaken', msg => alert(msg))

    this.setState({
      roomName: '',
      userName: '',
      chip: 500
    })

    if (this.props.location.search) {
      const roomName = this.props.location.search.slice(10)

      this.setState({roomName, join: true})
    }
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

  handleSwitch = name => event => {
    this.setState({ [name]: event.target.checked })
  }

  handleSwitchChange = (e) => {
    this.setState({ join: !this.state.join })
  }

  render() {
    const { roomName, userName, chip, join } = this.state
    const disabled = (userName === '' && typeof username !== 'string') || (roomName === '' && typeof roomName !== 'string') ? true : false
    
    return (
      <div className="container">
        <div>
          <div className="header-logo">
            <h2>Virtual poker chips</h2>
            <p>
              Add your name. Create a new room. Invite friends. Start playing.
            </p>
          </div>
        </div>

        <div className="room-input">
          <div className="switch">
            <p className={join ? null : 'switch-active'} onClick={this.handleSwitchChange} style={{cursor: 'pointer'}}>Create room</p>
            <Switch
              checked={join}
              onChange={this.handleSwitch('join')}
              value="join"
              style={{}}
            />
            <p className={join ? 'switch-active' : null} onClick={this.handleSwitchChange} style={{cursor: 'pointer'}}>Join existing room</p>
          </div>
          <p style={{ color: 'white', fontSize: '1.5rem' }}>Add room name</p>
          <input
            type="text"
            name="roomName"
            value={roomName}
            onChange={this.handleChange}
            placeholder="type room name here"
            className="input-box"
          />
          <p style={{ color: 'white', fontSize: '1.5rem' }}>Add your name</p>
          <input
            type="text"
            name="userName"
            value={userName}
            onChange={this.handleChange}
            placeholder="nickname"
            className="input-box"
          />

          {!join ? (
            <div>
              <p style={{ color: 'white', fontSize: '1.5rem' }}>
                Starting chips
              </p>
              <input
                type="number"
                name="chip"
                value={chip}
                onChange={this.handleChange}
                placeholder="Starting chips"
                className="input-box"
              />
            </div>
          ) : null}

          <button
            className="submit-btn"
            disabled={disabled}
            onClick={this.onSubmit}
          >
            Join
          </button>
        </div>
        {/* <div className="chips">
          <div className="pokerchip iso">100</div>
          <div className="pokerchip iso red">200</div>
          <div className="pokerchip iso blue">500</div>
        </div> */}
      </div>
    )
  }
}

export default withRouter(Home)

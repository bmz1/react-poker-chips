import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { socket } from '../Home/Home'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TabContainer from '../TabContainer/TabContainer'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Slider from '@material-ui/lab/Slider'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import CallIcon from '@material-ui/icons/CallMade'
import CheckIcon from '@material-ui/icons/Check'
import FoldIcon from '@material-ui/icons/Close'
import AllInIcon from '@material-ui/icons/AttachMoney'
import './Table.css'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  appbar: {
    backgroundColor: '#f8f8ff',
    color: 'black',
    width: '70%',
    margin: '0 auto',
    textAlign: 'center'
  },
  tab: {
    fontFamily: "'Open Sans', sans-serif"
  },
  button: {
    margin: theme.spacing.unit,
    backgroundColor: 'black',
    margin: '5px auto',
    padding: '10px',
    color: 'white'
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  }
})

class Table extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabValue: 'actions',
      socket: '',
      textArea: [],
      slider: 0,
      user: this.props.location.state,
      scores: [],
      pot: 0,
      table: {
        users: [],
        chip: 0,
        pot: 0
      }
    }
    this.scrollDiv = React.createRef()
  }

  componentDidMount() {
    if (!this.state.user) this.props.history.push('/')
    
    //socket.emit('join', this.props.location.pathname)
    socket.on('connected', msg => {
      socket.emit('join', this.state.user)
      
      const newEntry = this.state.textArea.slice()
      newEntry.push(msg)
      this.setState({ textArea: newEntry })
    })

    socket.on('history', (history) => {
      const newEntry = this.state.textArea.slice()
      history.map(h => 
        newEntry.push(h)
      )
      this.setState({ textArea: newEntry })
    })
    //this.setState({ user: this.props.location.state })

    socket.on('joined', msg => {
      const newEntry = this.state.textArea.slice()
      newEntry.push(msg.action)

      this.setState({ textArea: newEntry, table: msg.table })
    })

    socket.on('score', score => {
      this.setState({ scores: score })
    })

    socket.on('take', msg => {
      const newEntry = this.state.textArea.slice()
      newEntry.push(msg.action)

      this.setState({ textArea: newEntry, table: msg.table })
    })
  }

  componentDidUpdate() {
    this.scrollToBottom()
  }

  handleChangeTab = (event, value) => {
    this.setState({ tabValue: value })
  }

  handleChangeSlider = (event, value) => {
    this.setState({ slider: value })
  }

  handleChangeInput = e => {
    this.setState({ slider: e.target.value })
  }

  handleBet = () => {
    if (this.state.slider === 0) return
    const obj = Object.assign(this.state.user, {
      bet: parseInt(this.state.slider, 10)
    })
    socket.emit('bet', obj)
  }

  handleCall = () => {
    socket.emit('call', this.state.user)
  }

  handleCheck = () => {
    socket.emit('check', this.state.user)
  }

  handleFold = () => {
    socket.emit('fold', this.state.user)
  }

  handleAllIn = () => {
    socket.emit('all-in', this.state.user)
  }

  handleScoreBoard = () => {
    socket.emit('scoreboard', this.state.user)
  }

  handleTake = () => {
    socket.emit('take', this.state.user)
  }

  scrollToBottom = () => {
    if (!this.scrollDiv.current) return
    const children = this.scrollDiv.current.children
    this.scrollDiv.current.children[children.length - 1].scrollIntoView(false, {
      behavior: 'smooth'
    })
  }

  render() {
    const { pathname } = this.props.location
    const pathName = pathname.slice(7)
    const { tabValue, textArea, slider, table } = this.state
    const { classes } = this.props

    const listMessages = textArea.map((text, i) => (
      <li key={i} className="show">
        {text}
      </li>
    ))

    const user = table.users.find(
      u => u.name === this.props.location.state.userName
    )

    return (
      <div className="table">
        <div className="header">Table ID: {pathName}</div>
        <div className={classes.root}>
          <AppBar position="static" className={classes.appbar}>
            <Tabs value={tabValue} onChange={this.handleChangeTab} centered>
              <Tab value="actions" label="Table" className={classes.tab} />
              <Tab
                value="scoreboard"
                label="Scoreboard"
                onClick={this.handleScoreBoard}
                className={classes.tab}
              />
            </Tabs>
          </AppBar>
          {tabValue === 'actions' && (
            <TabContainer>
              <div>
                <ul ref={this.scrollDiv} className="text-area">
                  <p>
                    DEALER: Welcome to the Table! Players can join to the table
                    by scanning the QR Code on the top. You can find the hands
                    strengths on the top navbar if something is not clear.
                  </p>
                  {listMessages}
                </ul>
              </div>
              <div className="chip-status">
                <p className="pot">POT: {this.state.table.pot}</p>
                <p className="your-chips">Your chips: {user && user.chip}</p>
              </div>
              <div className="action-buttons">
                <input
                  type="number"
                  value={slider === '' ? 0 : slider}
                  style={{
                    display: 'block',
                    width: '100px',
                    margin: '0 auto',
                    border: '1px solid grey',
                    marginTop: '10px',
                    textAlign: 'center'
                  }}
                  onChange={this.handleChangeInput}
                />

                <Slider
                  value={slider === '' ? 0 : slider}
                  step={10}
                  max={parseInt(this.state.table.chip, 10)}
                  aria-labelledby="slider"
                  onChange={this.handleChangeSlider}
                  style={{ display: 'block', width: '250px', margin: '0 auto' }}
                />
              </div>
              <div className="action-btn">
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={this.handleBet}
                >
                  Bet
                  <AddCircleIcon className={classes.rightIcon} />
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={this.handleCall}
                >
                  Call
                  <CallIcon className={classes.rightIcon} />
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={this.handleCheck}
                >
                  Check
                  <CheckIcon className={classes.rightIcon} />
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={this.handleFold}
                >
                  Fold
                  <FoldIcon className={classes.rightIcon} />
                </Button>

                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  onClick={this.handleAllIn}
                >
                  All-in
                  <AllInIcon className={classes.rightIcon} />
                </Button>

                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  onClick={this.handleTake}
                >
                  Take
                  <AllInIcon className={classes.rightIcon} />
                </Button>
              </div>
            </TabContainer>
          )}
          {tabValue === 'scoreboard' && (
            <TabContainer>
              <div className="scoreboard">
                <ol>
                  {this.state.scores.map((el, i) => (
                    <li key={i}>
                      {el.name} - {el.chip}
                    </li>
                  ))}
                </ol>
              </div>
            </TabContainer>
          )}
        </div>
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(Table))

import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { view } from 'react-easy-state'

import store from '../../store/store'
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

socket.on('connected', msg => {
  socket.emit('join', store.user)
  store.addMessage(msg)
})

socket.on('joined', msg => {
  store.addMessage(msg.action)
  store.set('table', msg.table)
})

socket.on('history', history => {
  history.map(h => store.addMessage(h))
})

socket.on('message', msg => {
  store.addMessage(msg.action)
  store.set('table', msg.table)
})

socket.on('score', score => {
  store.set('scores', score)
})

socket.on('take', msg => {
  store.addMessage(msg.action)
  store.set('table', msg.table)
})

socket.on('info', msg => {
  store.addMessage(msg.action)
  store.set('table', msg.table)
})

socket.on('disconnect', () => {
  store.reset()
})

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

    this.scrollDiv = React.createRef()
  }

  componentDidMount() {
    if (this.props.location.state) store.set('user', this.props.location.state)
    if (!Object.keys(store.user).length) this.props.history.push('/')
    console.log(store.user)
  }

  componentDidUpdate(prevProps) {
    this.scrollToBottom()

    if (this.props.location.state !== prevProps.location.state) {
      store.set('user', this.props.location.state)
    }
  }

  handleChangeTab = (event, value) => {
    store.set('tabValue', value)
  }

  handleChangeSlider = (event, value) => {
    store.set('slider', value)
  }

  handleChangeInput = e => {
    store.set('slider', e.target.value)
  }

  handleBet = () => {
    if (store.slider === 0) return
    const obj = Object.assign(store.user, {
      bet: parseInt(store.slider, 10)
    })
    socket.emit('bet', obj)
  }

  handleCall = () => {
    socket.emit('call', store.user)
  }

  handleCheck = () => {
    socket.emit('check', store.user)
  }

  handleFold = () => {
    socket.emit('fold', store.user)
  }

  handleAllIn = () => {
    socket.emit('all-in', store.user)
  }

  handleScoreBoard = () => {
    socket.emit('scoreboard', store.user)
  }

  handleTake = () => {
    socket.emit('take', store.user)
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
    const { classes } = this.props

    const listMessages = store.textArea.map((text, i) => (
      <li key={i} className="show">
        {text}
      </li>
    ))

    const user = store.table.users.find(u => u.name === store.user.userName)
    return (
      <div className="table">
        <div className="header">Table ID: {pathName}</div>
        <div className={classes.root}>
          <AppBar position="static" className={classes.appbar}>
            <Tabs
              value={store.tabValue}
              onChange={this.handleChangeTab}
              centered
            >
              <Tab value="actions" label="Table" className={classes.tab} />
              <Tab
                value="scoreboard"
                label="Scoreboard"
                onClick={this.handleScoreBoard}
                className={classes.tab}
              />
            </Tabs>
          </AppBar>
          {store.tabValue === 'actions' && (
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
                <p className="pot">POT: {store.table.pot}</p>
                <p className="your-chips">Your chips: {user && user.chip}</p>
              </div>
              <div className="action-buttons">
                <input
                  type="number"
                  value={store.slider === '' ? 0 : store.slider}
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
                  value={store.slider === '' ? 0 : store.slider}
                  step={10}
                  max={parseInt(store.table.chip, 10)}
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
          {store.tabValue === 'scoreboard' && (
            <TabContainer>
              <div className="scoreboard">
                <ol>
                  {store.scores.map((el, i) => (
                    <li key={i}>
                      {el.name} - {el.chip} chips
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

export default withRouter(withStyles(styles)(view(Table)))

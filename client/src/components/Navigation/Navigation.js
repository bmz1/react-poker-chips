import React, { Component } from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import QRCode from 'qrcode.react'

import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import './Navigation.css'

class Navigation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      qr: `http://localhost${this.props.location.pathname}`,
      open: false
    }
  }
  handleClickOpen = () => this.setState({ open: true })
  handleClose = () => this.setState({ open: false })

  render() {
    const { pathname } = this.props.location
    return (
      <div>
        <div className="topnav">
          <NavLink to="/" exact activeClassName="selected">
            Home
          </NavLink>
          <NavLink to="/hands" activeClassName="selected">
            Hands strength
          </NavLink>

          <NavLink to="/howto" activeClassName="selected">
            How to
          </NavLink>

          {pathname.startsWith('/table') ? (
            <span onClick={this.handleClickOpen} style={{ float: 'right' }}>
              QR
            </span>
          ) : null}
        </div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="qr code"
        >
          <DialogTitle id="qr title">Scan QR code to join</DialogTitle>
          <div className="qrcode">
            <QRCode value={this.state.qr} />
          </div>
        </Dialog>
      </div>
    )
  }
}

export default withRouter(Navigation)

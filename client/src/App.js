import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Navigation from './components/Navigation/Navigation'
import Home from './components/Home/Home'
import Table from './components/Table/Table'
import Ranking from './components/Ranking/Ranking'
import NotFound from './components/NotFound/NotFound'
import './App.css'

const App = () => (
  <Router>
    <div>
      <Navigation />

      <div className="wrapper">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/table/:id" component={Table} />
          <Route exact path="/hands" component={Ranking} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  </Router>
)
export default App

import React, { Component } from 'react'
import { connect } from "react-redux"
import './App.css'
import ClownMap from "./Map"

const App = ({clowns}) => (
  <div className="App">
    <ClownMap clowns={clowns}/>
  </div>
)

const select = ({clowns}) => ({
  clowns
})
export default connect(select)(App);

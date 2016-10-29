import React from "react"
import { Map, Marker, TileLayer, Circle } from 'react-leaflet'
import L from "leaflet"  
import "leaflet/dist/leaflet.css"

const accessToken = "pk.eyJ1IjoiZXZvcGFyayIsImEiOiJjaXU0a3doZjgwMDJjMnltcG04MXI0Z3UzIn0.dAozPiu26HLD8q1yoBCDyQ"
const format = "png32"
const id = "mapbox.streets"

const clownIcons = [
  require("./images/clown01.png"),
  require("./images/clown02.png"),
  require("./images/clown03.png"),
  require("./images/clown04.png"),
  require("./images/clown05.png"),
]

const randomItem = items => items[Math.floor(Math.random() * items.length)]

const getIcon = (clown, index) => (
  L.icon({
    iconUrl: clownIcons[index],
    iconSize: [64, 64],
    iconAnchor: [32, 64],
  })
)  

class ClownMap extends React.Component {
  render() {
    const { clowns } = this.props
    const markers = clowns.map((clown, index) => <Marker key={index} position={clown.position} icon={getIcon(clown, index)} />) 
    return <Map center={[50.941301, 6.958106]} zoom={15}>
      <TileLayer
        url={`https://api.tiles.mapbox.com/v4/${id}/{z}/{x}/{y}{r}.${format}?access_token=${accessToken}`}
      />
      { markers }
      <Circle center={[50.941301, 6.958106]} radius={500} color="red"/>
    </Map>
  }
}
export default ClownMap
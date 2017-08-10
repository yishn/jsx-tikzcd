import {h, render} from 'preact'
import {Diagram, Node, Edge} from './diagram'
import App from './components/App'

window.diagram = {Diagram, Node, Edge}

render(<App/>, document.body)

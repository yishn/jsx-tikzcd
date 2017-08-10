import {h, Component} from 'preact'
import {Diagram, Node, Edge, render as renderTeX} from '../tikzcd'

export default class App extends Component {
    render() {
        return <pre>{renderTeX(
            <Diagram>
                <Node key="a" position={[1, 0]} value="X" />
                <Node key="b" position={[0, 1]} value="Y" />
                <Node key="base" position={[1, 1]} value="Z" />
                <Node key="test" position={[0, 0]} value="T" />
                <Node key="product" position={[-1, -1]} value="X\times_Z Y" />

                <Edge from="a" to="base" />
                <Edge from="b" to="base" />
                <Edge from="test" to="a" value="f" />
                <Edge from="test" to="b" value="g" alt />
                <Edge from="product" to="test" value="\phi" />
                <Edge from="product" to="a" value="p_X" />
                <Edge from="product" to="b" value="p_Y" alt />
            </Diagram>
        )}</pre>
    }
}

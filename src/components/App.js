import {h, Component} from 'preact'
import {Diagram, render as renderTeX} from '../tikzcd'

class Square extends Component {
    render() {
        let width = this.props.width || 1
        let height = this.props.height || 1
        let positions = [[0, 0], [width, 0], [width, height], [0, height]]

        let nodes = this.props.children.filter(v => v.nodeName === 'node').map((v, i) => ({
            ...v,
            attributes: {
                ...v.attributes,
                position: positions[i].map((x, j) => x + this.props.position[j])
            }
        }))

        return <Diagram>
            {nodes}
            {this.props.children.filter(v => v.nodeName === 'edge')}
        </Diagram>
    }
}

export default class App extends Component {
    render() {
        return <pre>{renderTeX(
            <Diagram>
                <Square position={[0, 0]}>
                    <node key="test" value="T" />
                    <node key="a" value="X" />
                    <node key="base" value="Z" />
                    <node key="b" value="Y" />

                    <edge from="a" to="base" />
                    <edge from="b" to="base" />
                    <edge from="test" to="a" value="f" />
                    <edge from="test" to="b" value="g" alt />
                </Square>

                <node key="product" position={[-1, -1]} value="X\times_Z Y" />

                <edge from="product" to="test" value="\phi" />
                <edge from="product" to="a" value="p_X" />
                <edge from="product" to="b" value="p_Y" alt />
            </Diagram>
        )}</pre>
    }
}

import test from 'ava'
import {h, render, Component, Diagram} from '../dist/react-tikzcd'

class Square extends Component {
    render() {
        let width = this.props.width || 1
        let height = this.props.height || 1
        let positions = [[0, 0], [width, 0], [width, height], [0, height]]

        let childProps = this.props.children
            .filter(v => v && v.nodeName === 'node')
            .map(v => v.attributes)

        return h(Diagram, {},
            positions.map((position, i) =>
                h('node', Object.assign({}, childProps[i], {
                    position: position.map((x, j) => x + this.props.position[j])
                }))
            ),

            this.props.children.filter(v => v && v.nodeName === 'edge')
        )
    }
}

test('fiber product', t => {
    t.is(render(
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
    ), [
        '\\begin{tikzcd}',
        'X\\times_Z Y \\arrow[rd, "\\phi"] \\arrow[rrd, "p_X"] \\arrow[rdd, "p_Y"\'] &  &  \\\\',
        ' & T \\arrow[r, "f"] \\arrow[d, "g"\'] & X \\arrow[d] \\\\',
        ' & Y \\arrow[r] & Z',
        '\\end{tikzcd}'
    ].join('\n'))
})

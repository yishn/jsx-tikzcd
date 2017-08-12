import test from 'ava'
import {h, render, Diagram, Node, Edge} from '../dist/jsx-tikzcd'

const Square = props => {
    let width = props.width || 1
    let height = props.height || 1
    let positions = [[0, 0], [width, 0], [width, height], [0, height]]

    let childProps = props.children
        .filter(v => v && v.nodeName === Node)
        .map(v => v.attributes)

    return <Diagram>
        {positions.map((position, i) =>
            <Node {...childProps[i]} position={position.map((x, j) => x + props.position[j])} />
        )}

        {props.children.filter(v => v && v.nodeName === Edge)}
    </Diagram>
}

test('fiber product', t => {
    t.is(render(
        <Diagram>
            <Square position={[0, 0]}>
                <Node key="test" value="T" />
                <Node key="a" value="X" />
                <Node key="base" value="Z" />
                <Node key="b" value="Y" />

                <Edge from="a" to="base" />
                <Edge from="b" to="base" />
                <Edge from="test" to="a" value="f" />
                <Edge from="test" to="b" value="g" alt />
            </Square>

            <Node key="product" position={[-1, -1]} value="X\times_Z Y" />

            <Edge from="product" to="test" value="\phi" />
            <Edge from="product" to="a" value="p_X" />
            <Edge from="product" to="b" value="p_Y" alt />
        </Diagram>
    ), [
        '\\begin{tikzcd}',
        'X\\times_Z Y \\arrow[rd, "\\phi"] \\arrow[rrd, "p_X"] \\arrow[rdd, "p_Y"\'] &  &  \\\\',
        ' & T \\arrow[r, "f"] \\arrow[d, "g"\'] & X \\arrow[d] \\\\',
        ' & Y \\arrow[r] & Z',
        '\\end{tikzcd}'
    ].join('\n'))
})

import test from 'ava'
import {h, render, Component, Diagram, Node, Edge} from '../dist/jsx-tikzcd'

const Square = ({width = 1, height = 1, children, position = [0, 0]}) => {
    let diffs = [[0, 0], [width, 0], [width, height], [0, height]]

    let childProps = children
        .filter(v => v && v.type === Node)
        .map(v => v.props)

    return <Diagram>
        {diffs.map((diff, i) =>
            <Node {...childProps[i]} position={position.map((x, j) => x + diff[j])} />
        )}

        {children.filter(v => v && v.type === Edge)}
    </Diagram>
}

const Arrow = ({children, position = [0, 0], direction = [1, 0], ...edgeProps}) => {
    if (children.length < 2) return

    let [x, y] = position || [0, 0]
    let [dx, dy] = direction || [1, 0]
    let [a, b, ] = children

    return <Diagram>
        <Node {...a.props} position={[x, y]} />
        <Node {...b.props} position={[x + dx, y + dy]} />

        <Edge {...edgeProps} from={a.key} to={b.key} />
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

test('merging nodes', t => {
    t.is(render(
        <Diagram>
            <Arrow value="f">
                <Node key="x" value="X" />
                <Node key="y" value="Y" />
            </Arrow>

            <Arrow position={[1, 0]} value="g">
                <Node key="y" />
                <Node key="z" value="Z" />
            </Arrow>
        </Diagram>
    ), [
        '\\begin{tikzcd}',
        'X \\arrow[r, "f"] & Y \\arrow[r, "g"] & Z',
        '\\end{tikzcd}'
    ].join('\n'))
})

test('duality', t => {
    t.is(render(
        <Diagram co>
            <Arrow value="f">
                <Node key="x" value="X" />
                <Node key="y" value="Y" />
            </Arrow>

            <Arrow position={[1, 0]} value="g">
                <Node key="y" />
                <Node key="z" value="Z" />
            </Arrow>
        </Diagram>
    ), [
        '\\begin{tikzcd}',
        'X & Y \\arrow[l, "f"\'] & Z \\arrow[l, "g"\']',
        '\\end{tikzcd}'
    ].join('\n'))
})

test('special characters in arrow labels', t => {
    t.is(render(
        <Diagram>
            <Node key="a" value="A" position={[0, 1]} />
            <Node key="b" value="B" position={[0, 2]} />
            <Edge from="a" to="b" value="(f,g)" />
            <Edge from="a" to="b" value="g[x]" alt />
        </Diagram>
    ), [
        '\\begin{tikzcd}',
        'A \\arrow[d, "{(f,g)}"] \\arrow[d, "{g[x]}"\'] \\\\',
        'B',
        '\\end{tikzcd}'
    ].join('\n'))
})

test('special characters in node values', t => {
    t.is(render(
        <Diagram>
            <Node key="a" value="[A]" position={[0, 1]} />
            <Node key="b" value="(B,C)" position={[0, 2]} />
            <Edge from="a" to="b" value="(f,g)" />
            <Edge from="a" to="b" value="\xi" alt />
        </Diagram>
    ), [
        '\\begin{tikzcd}',
        '{[A]} \\arrow[d, "{(f,g)}"] \\arrow[d, "\\xi"\'] \\\\',
        '{(B,C)}',
        '\\end{tikzcd}'
    ].join('\n'))

    t.is(render(
        <Diagram>
            <Node key="a" value="" position={[0, 0]} />
            <Node key="b" position={[0, 2]} />
            <Edge from="a" to="b" value="\xi" alt />
        </Diagram>
    ), [
        '\\begin{tikzcd}',
        '{} \\arrow[dd, "\\xi"\'] \\\\',
        ' \\\\',
        '{}',
        '\\end{tikzcd}'
    ].join('\n'))
})

test('inside arrow label position', t => {
    t.is(render(
        <Diagram>
            <Node key="a" value="A" position={[0, 1]} />
            <Node key="b" value="B" position={[0, 2]} />
            <Edge from="a" to="b" value="(f,g)" labelPosition="inside" alt />
        </Diagram>
    ), [
        '\\begin{tikzcd}',
        'A \\arrow[d, "{(f,g)}" description] \\\\',
        'B',
        '\\end{tikzcd}'
    ].join('\n'))
})

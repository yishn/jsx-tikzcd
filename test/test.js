const {h, render, Component, Diagram} = require('../dist/react-tikzcd')

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

console.log(render(
    h(Diagram, {},
        h(Square, {position: [0, 0]},
            h('node', {key: "test", value: "T"}),
            h('node', {key: "a", value: "X"}),
            h('node', {key: "base", value: "Z"}),
            h('node', {key: "b", value: "Y"}),

            h('edge', {from: "a", to: "base"}),
            h('edge', {from: "b", to: "base"}),
            h('edge', {from: "test", to: "a", value: "f"}),
            h('edge', {from: "test", to: "b", value: "g", alt: true})
        ),

        h('node', {key: "product", position: [-1, -1], value: "X\\times_Z Y"}),

        h('edge', {from: "product", to: "test", value: "\\phi"}),
        h('edge', {from: "product", to: "a", value: "p_X"}),
        h('edge', {from: "product", to: "b", value: "p_Y", alt: true})
    )
))

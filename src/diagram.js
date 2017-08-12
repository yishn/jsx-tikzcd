import Component from './component'

function getDirection([x1, y1], [x2, y2]) {
    let [dx, dy] = [x2 - x1, y2 - y1]
    let signs = [dx, dy].map(Math.sign)
    let directions = [['l', '', 'r'], ['u', '', 'd']]

    return [dx, dy].map((d, i) => directions[i][signs[i] + 1].repeat(Math.abs(d))).join('')
}

function renderEdge(vnode, co = false) {
    if (vnode.attributes.direction == null) return ''

    let p = !co === !!vnode.attributes.alt ? "'" : ''
    let value = vnode.attributes.value != null ? `, "${vnode.attributes.value}"${p}` : ''
    let args = ['', ...(vnode.attributes.args || [])].join(', ')

    return `\\arrow[${vnode.attributes.direction}${value}${args}]`
}

export default class Diagram extends Component {
    constructor(props) {
        super(props)

        let getChildren = vnode => vnode.children.reduce((acc, v) => {
            if (['node', 'edge'].includes(v.nodeName)) {
                acc.push(v)
            } else {
                acc.push(...getChildren(v))
            }

            return acc
        }, [])

        let children = getChildren(this.props)

        this.nodes = children.reduce((acc, v) => {
            if (v.nodeName !== 'node') return acc

            if (!(v.key in acc)) acc[v.key] = v
            else acc[v.key] = {
                ...acc[v.key],
                attributes: {
                    ...acc[v.key].attributes,
                    ...v.attributes
                }
            }

            return acc
        }, {})

        this.edges = children.reduce((acc, v) => {
            if (v.nodeName !== 'edge') return acc

            let [from, to] = !props.co ? ['from', 'to'] : ['to', 'from']

            if (!(v.attributes[from] in acc)) acc[v.attributes[from]] = []

            acc[v.attributes[from]].push({
                ...v,
                attributes: {
                    ...v.attributes,
                    direction: getDirection(
                        this.nodes[v.attributes[from]].attributes.position,
                        this.nodes[v.attributes[to]].attributes.position
                    )
                }
            })

            return acc
        }, {})
    }

    getBounds() {
        return Object.values(this.nodes)
            .reduce(([minX, maxX, minY, maxY], {attributes: {position: [x, y]}}) => [
                Math.min(minX, x), Math.max(maxX, x),
                Math.min(minY, y), Math.max(maxY, y)
            ], [Infinity, -Infinity, Infinity, -Infinity])
    }

    toArray() {
        let [minX, maxX, minY, maxY] = this.getBounds()
        if (minX > maxX || minY > maxY) return []

        let diagram = Array(maxY - minY + 1).fill().map(_ => Array(maxX - minX + 1).fill(null))

        for (let node of Object.values(this.nodes)) {
            let [x, y] = node.attributes.position

            diagram[y - minY][x - minX] = {
                node,
                edges: this.edges[node.key] || []
            }
        }

        return diagram
    }

    render() {
        let options = this.props.options == null ? '' : `[${this.props.options}]`

        return [
            `\\begin{tikzcd}${options}`,

            this.toArray().map(entries => entries.map(entry =>
                entry == null ? ''
                : [
                    entry.node.attributes.value,
                    ...entry.edges.map(e => renderEdge(e, this.props.co))
                ].join(' ')
            ).join(' & ')).join(' \\\\\n'),

            '\\end{tikzcd}'
        ].join('\n')
    }
}

function getDirection([x1, y1], [x2, y2]) {
    let [dx, dy] = [x2 - x1, y2 - y1]
    let signs = [dx, dy].map(Math.sign)
    let directions = [['l', '', 'r'], ['u', '', 'd']]

    return [dx, dy].map((d, i) => directions[i][signs[i] + 1].repeat(Math.abs(d))).join('')
}

function renderEdge(vnode, co = false) {
    if (vnode.attributes.direction == null) return ''

    let needWrapChars = ['"', ',', ']']
    let labelPosition = vnode.attributes.labelPosition || 'left'

    if (co === !vnode.attributes.alt && labelPosition !== 'inside')
        labelPosition = labelPosition === 'left' ? 'right' : 'left'

    let p = ({left: '', right: "'", inside: ' description'})[labelPosition]
    let [w1, w2] = vnode.attributes.value != null
        && needWrapChars.some(c => vnode.attributes.value.includes(c))
        ? ['{', '}'] : ['', '']
    let valueArg = vnode.attributes.value != null ? `"${w1}${vnode.attributes.value}${w2}"${p}` : null
    let args = ['', valueArg, ...(vnode.attributes.args || [])].filter(x => x != null).join(', ')

    return `\\arrow[${vnode.attributes.direction}${args}]`
}

export const Node = () => {}
export const Edge = () => {}

export class Component {
    constructor(props) {
        this.props = props
    }

    render() {}
}

export class Diagram extends Component {
    constructor(props) {
        super(props)

        let getChildren = vnode => vnode.children.reduce((acc, v) => {
            if (v == null) return acc

            if ([Node, Edge].includes(v.nodeName)) {
                acc.push(v)
            } else {
                acc.push(...getChildren(v))
            }

            return acc
        }, [])

        let children = getChildren(this.props)

        this.nodes = children.reduce((acc, v) => {
            if (v.nodeName !== Node || !v.key || !v.attributes.position)
                return acc

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
            if (v.nodeName !== Edge || !v.attributes.from || !v.attributes.to)
                return acc

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
        return Object.keys(this.nodes)
            .map(key => this.nodes[key].attributes.position)
            .reduce(([minX, maxX, minY, maxY], [x, y]) => [
                Math.min(minX, x), Math.max(maxX, x),
                Math.min(minY, y), Math.max(maxY, y)
            ], [Infinity, -Infinity, Infinity, -Infinity])
    }

    toArray() {
        let [minX, maxX, minY, maxY] = this.getBounds()
        if (minX > maxX || minY > maxY) return []

        let diagram = Array(maxY - minY + 1).fill().map(_ => Array(maxX - minX + 1).fill(null))

        for (let key of Object.keys(this.nodes)) {
            let [x, y] = this.nodes[key].attributes.position

            diagram[y - minY][x - minX] = {
                node: this.nodes[key],
                edges: this.edges[key] || []
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
                    entry.node.attributes.value || '{}',
                    ...entry.edges.map(e => renderEdge(e, this.props.co))
                ].join(' ')
            ).join(' & ')).join(' \\\\\n'),

            '\\end{tikzcd}'
        ].join('\n')
    }
}

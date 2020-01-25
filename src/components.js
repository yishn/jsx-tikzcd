const needWrapChars = ['"', ',', ']']

function getDirection([x1, y1], [x2, y2]) {
    let [dx, dy] = [x2 - x1, y2 - y1]
    let signs = [dx, dy].map(Math.sign)
    let directions = [['l', '', 'r'], ['u', '', 'd']]

    return [dx, dy].map((d, i) => directions[i][signs[i] + 1].repeat(Math.abs(d))).join('')
}

function renderEdge(vnode, co = false) {
    let {direction, alt, value} = vnode.props;
    if (direction == null) return ''

    let labelPosition = vnode.props.labelPosition || 'left'

    if (co === !alt && labelPosition !== 'inside')
        labelPosition = labelPosition === 'left' ? 'right' : 'left'

    let p = ({left: '', right: "'", inside: ' description'})[labelPosition]
    let [w1, w2] = value != null
        && needWrapChars.some(c => value.includes(c))
        ? ['{', '}'] : ['', '']
    let valueArg = value != null ? `"${w1}${value}${w2}"${p}` : null
    let args = [direction ? '' : null, valueArg, ...(vnode.props.args || [])].filter(x => x != null).join(', ')

    return `\\arrow[${direction}${args}]`
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

            if ([Node, Edge].includes(v.type)) {
                acc.push(v)
            } else {
                acc.push(...getChildren(v))
            }

            return acc
        }, [])

        let children = getChildren(this.props)

        this.nodes = children.reduce((acc, v) => {
            if (v.type !== Node || !v.key || !v.props.position)
                return acc

            if (!(v.key in acc)) acc[v.key] = v
            else acc[v.key] = {
                ...acc[v.key],
                props: {
                    ...acc[v.key].props,
                    ...v.props
                }
            }

            return acc
        }, {})

        this.edges = children.reduce((acc, v) => {
            if (v.type !== Edge || !v.props.from || !v.props.to)
                return acc

            let [from, to] = !props.co ? ['from', 'to'] : ['to', 'from']

            if (!(v.props[from] in acc)) acc[v.props[from]] = []

            acc[v.props[from]].push({
                ...v,
                props: {
                    ...v.props,
                    direction: getDirection(
                        this.nodes[v.props[from]].props.position,
                        this.nodes[v.props[to]].props.position
                    )
                }
            })

            return acc
        }, {})
    }

    getBounds() {
        return Object.keys(this.nodes)
            .map(key => this.nodes[key].props.position)
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
            let [x, y] = this.nodes[key].props.position

            diagram[y - minY][x - minX] = {
                node: this.nodes[key],
                edges: this.edges[key] || []
            }
        }

        return diagram
    }

    render() {
        let options = this.props.options == null ? '' : `[${this.props.options}]`

        let cells = this.toArray().map(entries => entries.map(entry =>
            entry == null ? ''
            : [
                (() => {
                    let value = entry.node.props.value || ''
                    let [w1, w2] = value.trim() === ''
                        || needWrapChars.some(c => value.includes(c))
                        ? ['{', '}'] : ['', '']

                    return `${w1}${value}${w2}`
                })(),
                ...entry.edges.map(e => renderEdge(e, this.props.co))
            ].join(' ')
        ))

        if ([].concat(...cells).every(x => x === '')) {
            cells = cells.map(row => row.map(_ => '{}'))
        }

        if (this.props.align && cells.length > 0) {
            for (let j = 0; j < cells[0].length; j++) {
                let maxLength = Math.max(...cells.map(entries => entries[j].length))
                for (let i = 0; i < cells.length; i++) {
                    cells[i][j] = cells[i][j].padEnd(maxLength, ' ')
                }
            }
        }

        return [
            `\\begin{tikzcd}${options}`,

            cells.map(entries => entries.join(' & ')).join(' \\\\\n'),

            '\\end{tikzcd}'
        ].join('\n')
    }
}

export function getDirection([x1, y1], [x2, y2]) {
    let [dx, dy] = [x2 - x1, y2 - y1]
    let signs = [dx, dy].map(Math.sign)
    let directions = [['l', '', 'r'], ['u', '', 'd']]

    return [dx, dy].map((d, i) => directions[i][signs[i] + 1].repeat(d)).join('')
}

export class Node {
    constructor(props) {
        this.props = props
    }

    render() {
        return this.props.value || ''
    }
}

export class Edge {
    constructor(props) {
        this.props = props
    }

    render() {
        if (this.props.direction == null) return ''

        let p = this.props.alt ? "'" : ''
        let value = this.props.value != null ? `, "${this.props.value}"${p}` : ''
        let args = ['', ...(this.props.args || [])].join(', ')

        return `\\arrow[${this.props.direction}${value}${args}]`
    }
}

export class Diagram {
    constructor(props) {
        this.props = props
        this.vnodes = props.children.filter(n => n.nodeName === Node)
        this.vedges = props.children.filter(n => n.nodeName === Edge)
    }

    getNode(key) {
        let v = this.vnodes.find(n => n.key === key)
        return v == null ? null : new Node(v.attributes)
    }

    getEdgesFrom(key) {
        let fromPosition = this.getNode(key).props.position

        return this.vedges.filter(v => v.attributes.from === key).map(v => {
            let toNode = this.getNode(v.attributes.to)
            let direction = getDirection(fromPosition, toNode.props.position)

            return new Edge({...v.attributes, direction})
        })
    }

    getBounds() {
        return this.vnodes.reduce(([minX, maxX, minY, maxY], {attributes: {position: [x, y]}}) => [
            Math.min(minX, x), Math.max(maxX, x),
            Math.min(minY, y), Math.max(maxY, y)
        ], [Infinity, -Infinity, Infinity, -Infinity])
    }

    toArray() {
        let [minX, maxX, minY, maxY] = this.getBounds()
        if (minX > maxX || minY > maxY) return []

        let diagram = Array(maxY - minY + 1).fill().map(_ => Array(maxX - minX + 1).fill(null))

        for (let vnode of this.vnodes) {
            let [x, y] = vnode.attributes.position

            diagram[y - minY][x - minX] = {
                node: new Node(vnode.attributes),
                edges: this.getEdgesFrom(vnode.key)
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
                : entry.node.render() + ' ' + entry.edges.map(edge => edge.render()).join(' ')
            ).join(' & ')).join(' \\\\\n'),

            '\\end{tikzcd}'
        ].join('\n')
    }
}

export function render(vnode) {
    return new vnode.nodeName({...vnode.attributes, children: vnode.children}).render()
}

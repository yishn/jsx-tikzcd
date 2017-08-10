import * as helper from './helper'

export class Node {
    constructor({position: [x, y], value}) {
        this.id = helper.getId()
        this.position = [x, y]
        this.value = value
    }

    toTeX() {
        return this.value
    }
}

export class Edge {
    constructor({from, to, value, alt = false, args = []}) {
        this.id = helper.getId()
        this.from = from
        this.to = to
        this.value = value

        this.alt = alt
        this.args = args
    }

    toTeX(direction) {
        let p = this.alt ? "'" : ''
        let args = this.args.length > 0 ? ', ' + this.args.join(', ') : ''

        return `\\arrow[${direction}, "${this.value}"${p}${args}]`
    }
}

export class Diagram {
    constructor() {
        this.nodes = []
        this.edges = []
    }

    getNode(id) {
        return this.nodes.find(node => node.id === id)
    }

    getEdge(id) {
        return this.edges.find(edge => edge.id === id)
    }

    getEdgesFrom(id) {
        return this.edges.filter(edge => edge.from === id)
    }

    getBounds() {
        return this.nodes.reduce(([minX, maxX, minY, maxY], {position: [x, y]}) => [
            Math.min(minX, x), Math.max(maxX, x),
            Math.min(minY, y), Math.max(maxY, y)
        ], [Infinity, -Infinity, Infinity, -Infinity])
    }

    toArray() {
        let [minX, maxX, minY, maxY] = this.getBounds()
        if (minX > maxX || minY > maxY) return []

        let diagram = Array(maxY - minY + 1).fill().map(_ => Array(maxX - minX + 1).fill(null))

        for (let node of this.nodes) {
            let [x, y] = node.position

            diagram[y - minY][x - minX] = {
                node,
                edges: this.getEdgesFrom(node.id)
            }
        }

        return diagram
    }

    toTeX() {
        return [
            '\\begin{tikzcd}',

            this.toArray().map(entries => entries.map(entry =>
                entry == null
                ? ''
                : entry.node.toTeX() + ' ' + entry.edges.map(edge =>
                    edge.toTeX(helper.getDirection(entry.node.position, this.getNode(edge.to).position))
                ).join(' ')
            ).join(' & ')).join(' \\\\\n'),

            '\\end{tikzcd}'
        ].join('\n')
    }
}

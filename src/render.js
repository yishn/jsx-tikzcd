import {Diagram, Node, Edge} from './components'

function resolveComponents(vnode) {
    if (vnode == null) return null

    if (![Diagram, Node, Edge].includes(vnode.type)) {
        let props = {...vnode.props, children: vnode.children}

        if ('render' in vnode.type.prototype) {
            return resolveComponents(new vnode.type(props).render())
        } else {
            return resolveComponents(vnode.type(props))
        }
    }

    return {
        ...vnode,
        children: vnode.children.map(x => resolveComponents(x))
    }
}

export function renderToDiagram(vnode, co = false) {
    let diagramNode = resolveComponents(vnode)

    if (diagramNode == null || diagramNode.type !== Diagram)
        return null

    return new Diagram({
        ...diagramNode.props,
        co: co !== !!diagramNode.props.co,
        children: diagramNode.children
    })
}

export function render(vnode, co = false) {
    return renderToDiagram(vnode, co).render()
}

export function corender(vnode) {
    return render(vnode, true)
}

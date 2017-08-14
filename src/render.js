import {Diagram, Node, Edge} from './components'

function resolveComponents(vnode) {
    if (vnode == null) return null

    if (![Diagram, Node, Edge].includes(vnode.nodeName)) {
        let props = {...vnode.attributes, children: vnode.children}

        if ('render' in vnode.nodeName.prototype) {
            return resolveComponents(new vnode.nodeName(props).render())
        } else {
            return resolveComponents(vnode.nodeName(props))
        }
    }

    return {
        ...vnode,
        children: vnode.children.map(x => resolveComponents(x))
    }
}

export function render(vnode, co = false) {
    let diagramNode = resolveComponents(vnode)

    if (diagramNode == null || diagramNode.nodeName !== Diagram)
        return null

    return new Diagram({
        ...diagramNode.attributes,
        co: co !== !!diagramNode.attributes.co,
        children: diagramNode.children
    }).render()
}

export function corender(vnode) {
    return render(vnode, true)
}

import {Diagram, Node, Edge} from './components'

function resolveVNode(vnode) {
    if (vnode == null) return null

    if (![Diagram, Node, Edge].includes(vnode.nodeName)) {
        let props = {...vnode.attributes, children: vnode.children}

        if ('render' in vnode.nodeName.prototype) {
            return resolveVNode(new vnode.nodeName(props).render())
        } else {
            return resolveVNode(vnode.nodeName(props))
        }
    }

    return {
        ...vnode,
        children: vnode.children.map(x => resolveVNode(x)).filter(x => x != null)
    }
}

export function render(vnode, co = false) {
    let diagramNode = resolveVNode(vnode)

    return new Diagram({
        ...diagramNode.attributes,
        co: co !== !!diagramNode.attributes.co,
        children: diagramNode.children
    }).render()
}

export function corender(vnode) {
    return render(vnode, true)
}

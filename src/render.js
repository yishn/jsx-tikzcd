import Diagram from './diagram'

function resolveVNode(vnode) {
    if (![Diagram, 'node', 'edge'].includes(vnode.nodeName)) {
        return resolveVNode(new vnode.nodeName({...vnode.attributes, children: vnode.children}).render())
    }

    return {
        ...vnode,
        children: vnode.children.map(x => resolveVNode(x))
    }
}

export function render(vnode, co = false) {
    let diagramNode = resolveVNode(vnode)

    return new Diagram({
        ...diagramNode.attributes,
        co,
        children: diagramNode.children
    }).render()
}

export function corender(vnode) {
    return render(vnode, true)
}

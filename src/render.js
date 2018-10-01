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

export function renderToDiagram(vnode, options = {}, co = false) {
    let diagramNode = resolveComponents(vnode)

    if (diagramNode == null || diagramNode.type !== Diagram)
        return null

    return new Diagram({
        ...diagramNode.props,
        co: co !== !!diagramNode.props.co,
        align: options.align ? options.align : false,
        children: diagramNode.children
    })
}

export function render(vnode, options = {}, co = false) {
    return renderToDiagram(vnode, options, co).render()
}

export function corender(vnode, options = {}) {
    return render(vnode, options, true)
}

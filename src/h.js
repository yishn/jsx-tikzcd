export default function h(nodeName, attributes, ...children) {
    let getChildren = children => children.reduce((acc, child) => {
        if (child instanceof Array) {
            acc.push(...getChildren(child))
        } else {
            acc.push(child)
        }

        return acc
    }, [])

    return {
        nodeName,
        attributes: attributes || {},
        key: attributes && attributes.key,
        children: getChildren(children)
    }
}

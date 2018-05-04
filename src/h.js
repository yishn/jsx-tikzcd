export default function h(type, props, ...children) {
    let getChildren = children => children.reduce((acc, child) => {
        if (child instanceof Array) {
            acc.push(...getChildren(child))
        } else {
            acc.push(child)
        }

        return acc
    }, [])

    return {
        type,
        props: props || {},
        key: props && props.key,
        children: getChildren(children)
    }
}

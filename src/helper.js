let id = 0

export function getId() {
    return id++
}

export function getDirection([x1, y1], [x2, y2]) {
    let [dx, dy] = [x2 - x1, y2 - y1]
    let signs = [dx, dy].map(Math.sign)
    let directions = [['l', '', 'r'], ['u', '', 'd']]

    return [dx, dy].map((d, i) => directions[i][signs[i] + 1].repeat(d)).join('')
}

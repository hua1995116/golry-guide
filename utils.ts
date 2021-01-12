export function wrapPx(length: number) {
    return `${length}px`
}

export function createDom(type: string, className: string) {
    const el = document.createElement(type)
    el.className = className
    return el
}

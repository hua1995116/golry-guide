import { wrapPx, createDom } from './utils'

const GLOBAL_BORDER = 3

interface Popover {
    title: string
    description: string
    position: 'bottom' | 'top' | 'left' | 'right'
}

interface Steps {
    element: string,
    popover: Popover
}

interface Tootip {
    root: HTMLElement
    title: HTMLElement
    content: HTMLElement
    prev: HTMLElement
    next: HTMLElement
    done: HTMLElement
}

interface Rect {
    left: number
    top: number
    width: number
    height: number
}

interface Options {
    nextText?: string
    prevText?: string
    doneText?: string
}

class GolryGuide {
    public steps: Steps[]
    public currentCount: number
    public nextText: string
    public prevText: string
    public doneText: string
    public layer: HTMLElement | null
    public tooltip: Tootip | null
    constructor(steps: Steps[], option?: Options) {
        this.steps = steps
        this.layer = null
        this.tooltip = null
        this.currentCount = 0
        this.nextText = option?.nextText || 'next'
        this.prevText = option?.prevText || 'prev'
        this.doneText = option?.doneText || 'done'
    }
    start() {
        const lo = this.getStep()
    }
    genTooltip(curStep: Steps, rect: DOMRect | Rect) {
        if (!this.tooltip) {
            const root = createDom('div', 'tooltip-box')
            const title = createDom('div', 'tooltip-title')
            const content = createDom('div', 'tooltip-content')
            const bottom = createDom('div', 'tooltip-bottom')
            const prev = createDom('button', 'tooltip-btn')
            const next = createDom('button', 'tooltip-btn')
            const done = createDom('button', 'tooltip-btn')
            bottom.appendChild(prev)
            bottom.appendChild(next)
            bottom.appendChild(done)
            root.appendChild(title)
            root.appendChild(content)
            root.appendChild(bottom)
            this.tooltip = {
                root,
                title,
                content,
                prev,
                next,
                done
            }
            this.bindEvents()
            this.layer?.appendChild(root)
        }
        this.tooltip.root.style.top = wrapPx(rect.height + GLOBAL_BORDER * 2 + 15)
        this.tooltip.title.innerText = curStep.popover.title
        this.tooltip.content.innerText = curStep.popover.description
        this.tooltip.prev.innerText = this.prevText
        this.tooltip.next.innerText = this.nextText
        this.tooltip.done.innerText = this.doneText
        // const bindDone = this.bindEvents()
        this.tooltip.prev.removeAttribute('disabled')
        this.tooltip.prev.classList.remove('tooltip-disbaled')
        this.tooltip.next.removeAttribute('disabled')
        this.tooltip.next.classList.remove('tooltip-disbaled')

        if (this.currentCount === 0) {
            this.tooltip.prev.setAttribute('disabled', 'true')
            this.tooltip.prev.classList.add('tooltip-disbaled')
        }
        if (this.currentCount === this.steps.length - 1) {
            this.tooltip.next.setAttribute('disabled', 'true')
            this.tooltip.next.classList.add('tooltip-disbaled')
        }
    }
    bindEvents() {
        const prevEvent = (e: MouseEvent) => {
            e.stopPropagation()
            this.currentCount--
            this.getStep()
            return false
        }
        const nextEvent = (e: MouseEvent) => {
            e.stopPropagation()
            this.currentCount++
            this.getStep()
            return false
        }
        const doneEvent = (e: MouseEvent) => {
            e.stopPropagation()
            this.currentCount = 0
            if (this.layer) {
                document.body.removeChild(this.layer)
            }
            return false
        }
        this.tooltip?.prev.addEventListener('click', prevEvent, false)
        this.tooltip?.next.addEventListener('click', nextEvent, false)
        this.tooltip?.done.addEventListener('click', doneEvent, false)
    }
    getStep() {
        if (!this.layer) {
            this.layer = createDom('div', 'guide-helper-layer')
            document.body.appendChild(this.layer)
        }
        const curStep = this.steps[this.currentCount]
        const curDom = document.querySelector(curStep.element)
        const rect = curDom?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 }
        const { left, top, width, height } = rect
        if (this.layer) {
            this.layer.style.left = wrapPx(left - GLOBAL_BORDER)
            this.layer.style.top = wrapPx(top - GLOBAL_BORDER)
            this.layer.style.width = wrapPx(width + GLOBAL_BORDER * 2)
            this.layer.style.height = wrapPx(height + GLOBAL_BORDER * 2)
        }
        this.genTooltip(curStep, rect)
    }
}

export default GolryGuide

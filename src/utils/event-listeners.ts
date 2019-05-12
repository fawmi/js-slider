export function addMultiListener({el, events, fn}: { el: HTMLElement, events: Array<string>, fn: EventListenerObject }): void {
    events.forEach(e => el.addEventListener(e, fn, false));
}

export function removeMultiListener({el, events, fn}: { el: HTMLElement, events: Array<string>, fn: EventListenerObject }): void {
    events.forEach(e => el.removeEventListener(e, fn, false));
}

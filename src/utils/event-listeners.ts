export function addMultiListener({el, events, callback}: { el: HTMLElement, events: Array<string>, callback: any }): void {
    events.forEach(e => el.addEventListener(e, callback, false));
}

export function removeMultiListener({el, events, callback}: { el: HTMLElement, events: Array<string>, callback: any }): void {
    events.forEach(e => el.removeEventListener(e, callback, false));
}


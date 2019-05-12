export function addMultiListener(el:HTMLElement, events:string[], fn:any): void {
    events.forEach(e => el.addEventListener(e, fn, false));
}

export function removeMultiListener(el, events, fn): void {
    events.forEach(e => el.removeEventListener(e, fn, false));
}

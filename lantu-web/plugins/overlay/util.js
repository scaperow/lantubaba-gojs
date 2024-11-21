
export function destroyVueElement(vm) {
    if (vm && !vm._isDestroyed && (typeof vm.$destroy === 'function')) {
        vm.$destroy()
    }
}

export function findContainer(container) {
    let found
    if (typeof container === 'string') {
        found = document.querySelector(container)
    } else {
        found = container
    }
    if (!found) {
        found = document.body
    }
    return found
}
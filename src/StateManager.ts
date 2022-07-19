import { useEffect, useReducer } from "react"

// Simple state manager (replaces e.g. Redux, Mobx)
class StateManager {
    // Listeners (for reactivity)
    private listeners: (() => void)[] = []

    public subscribe(listener: () => void) {
        this.listeners.push(listener)
        listener()
    }

    // Simple counter
    private _counter = 0

    public get count() {
        return this._counter
    }

    public set count(val: number) {
        this._counter = val
        this.listeners.forEach(l => l())
    }
}

export const state = new StateManager()

// Hook to trigger an update whenever a state property changes
export const useUpdateOnStateChange = () => {
    const [_, forceUpdate] = useReducer(x => x + 1, 0)
    useEffect(() => state.subscribe(() => forceUpdate()), [])
}

import { track } from 'lwc';
export function useState(genericConstructor, states) {
  const r = Object.entries(states).find(([k,v]) => v && [k,v] )
  const [k] = r ? r : [undefined]
  const clazz = class {
    @track STATE = k;
  } 
  Object.defineProperties(clazz.prototype, Object.fromEntries(Object.keys(states).map(state => [
    state, {
      get() { return this.STATE === state; },
      set(toBeSet) { this.STATE = toBeSet ? state : undefined; }
    }
  ])))
  return clazz
}

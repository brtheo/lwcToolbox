import { track } from 'lwc';
export function useState(genericConstructor, states) {
  const clazz = class {
    @track STATE = undefined;
  } 
  Object.defineProperties(clazz.prototype, Object.fromEntries(states.map(state => [
    state, {
      get() { return this.STATE === state; },
      set(toBeSet) { this.STATE = toBeSet ? state : undefined; }
    }
  ])))
  return clazz
}

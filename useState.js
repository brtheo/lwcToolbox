import {track} from 'lwc';
function findInitialState(states) {
  const r = Object.entries(states).find(([k,v]) => v && [k,v] )
  const [k] = r ? r : [undefined]
  if(!k) throw new Error('Must provide an initial state');
  return k;
}
function getInitialState(states) {
  if(states instanceof Array) {
    return Object.fromEntries(states.map(state => {
      const [stateName, states_] = Object.entries(state)[0]
      return Object.fromEntries([[stateName, findInitialState(states_)]])
    }).reduce((entries,state) =>  entries.concat(Object.entries(state))
    ,[]))
  } else {
    return findInitialState(states)
  }
}

export function useState(genericConstructor, states) {
  
  const clazz = class extends genericConstructor {
    @track STATE = getInitialState(states)
  } 

  if(states instanceof Array) {
    states.forEach(state_ => {
      const [stateName, states] = Object.entries(state_).at(0)
      Object.defineProperties(clazz.prototype, Object.fromEntries(
        Object.keys(states).map(state => [
          state, {
            get() { return this.STATE[stateName] === state; },
            set(toBeSet) { this.STATE[stateName] = toBeSet ? state : undefined; }
          }
        ])
      ))
    })  
  } else {
    Object.defineProperties(clazz.prototype, Object.fromEntries(Object.keys(states).map(state => [
      state, {
        get() { return this.STATE === state; },
        set(toBeSet) { this.STATE = toBeSet ? state : undefined; }
      }
    ])))
  }
  return clazz
}

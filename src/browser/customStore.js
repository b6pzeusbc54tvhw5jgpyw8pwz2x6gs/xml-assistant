import storejs from 'store'
import storejsLocalStorage from 'store/storages/localStorage'

const PREFIX = 'xml-assistant'
const customStorage = {
  ...storejsLocalStorage,
  read: key => storejsLocalStorage.read(`${PREFIX}:${key}`),
  write: (key,data) => storejsLocalStorage.write(`${PREFIX}:${key}`, data),
  remove: key => storejsLocalStorage.remove(`${PREFIX}:${key}`),
  each: fn => {
    storejsLocalStorage.each( (data,key) => {
      new RegExp(`/^${PREFIX}:/`).test(key) && fn(data,key)
    })
  },
}

const store = storejs.createStore([customStorage])

export default store

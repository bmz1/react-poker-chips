import { store } from 'react-easy-state'

const tableStore = store({
  tabValue: 'actions',
  textArea: [],
  slider: 0,
  user: {},
  scores: [],
  pot: 0,
  table: {
    users: [],
    chip: 0,
    pot: 0
  },

  addMessage(msg) {
    tableStore.textArea.push(msg)
  },
  set(name, value) {
    tableStore[name] = value
  }
})

export default tableStore

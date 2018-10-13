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
  confirmTake: false,

  addMessage(msg) {
    tableStore.textArea.push(msg)
  },
  set(name, value) {
    tableStore[name] = value
  },
  reset() {
    tableStore.textArea = []
    tableStore.slider = 0
    tableStore.user = {}
    tableStore.scores = []
    tableStore.pot = 0
    tableStore.table = {
      users: [],
      chip: 0,
      pot: 0
    }
  },
  resetSlider() {
    tableStore.confirmTake = false
    tableStore.slider = 0
  },
  take() {
    tableStore.slider = tableStore.table.pot
  }
})

export default tableStore

import config from '@config/index'
const name = `${config.VUE_APP_NAME}-${config.VUE_APP_ENV}-`

function LgetItem(key) {
  const value = localStorage.getItem(name + key)
  return JSON.parse(value)
}

function LsetItem(key, value) {
  localStorage.setItem(name + key, JSON.stringify(value))
}

function LreItem(key) {
  localStorage.removeItem(name + key)
}

function SgetItem(key) {
  const value = sessionStorage.getItem(name + key)
  return JSON.parse(value)
}

function SsetItem(key, value) {
  sessionStorage.setItem(name + key, JSON.stringify(value))
}

function SreItem(key) {
  sessionStorage.removeItem(name + key)
}

export {
  LgetItem,
  LsetItem,
  LreItem,
  SgetItem,
  SsetItem,
  SreItem
}

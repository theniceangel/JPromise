const callbacks = []
let pending = false

const flushCallbacks = function () {
  pending = false
  const copy = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copy.length; i++) {
    copy[i]()
  }
}

let macroTimerFunc = function () {
  setTimeout(flushCallbacks, 0)
}
module.exports = function nextTick (fn) {
  callbacks.push(function () {
    try {
      fn.call()
    } catch (error) {
      console.error(error)
    }
  })

  if (pending === false) {
    pending = true
    macroTimerFunc()
  }
}
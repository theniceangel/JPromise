const nextTick = require('./next-tick')

const PENDING = 0
const RESOLVED = 1
const REJECTED = 2
// simple promise implements
function JPromise (executor) {
  this.value = undefined
  this.state = PENDING
  this.deferred = []

  let promise = this

  try {
    executor(function resolve(x) {
      promise.resolve(x)
    }, function reject(reason) {
      promise.resolve(reason)
    })
  } catch (e) {
    promise.reject(e)
  }
}

JPromise.prototype.resolve = function (x) {
  const promise = this
  if (this.state === PENDING) {
    // 防止多次调用
    var magic = false
    // 如果 resolve 的参数也是一个 thenable 对象，直接复用他的所有状态
    try {
      var then = x && x['then']
      if (x != null && typeof x === 'object' && typeof then === 'function') {
        then.call(x, function (x) {
          if (!magic) {
            promise.resolve(x)
            magic = true
          }
        }, function (r) {
          if (!magic) {
            promise.reject(r)
            magic = true
          }
        })
        return
      }
    } catch (error) {
      promise.reject(error)
    }

    this.value = x
    this.state = RESOLVED
    this.notify()
  }
}

JPromise.prototype.reject = function (x) {
  if (this.state === PENDING) {
    this.value = x
    this.state = REJECTED
    this.notify()
  }
}

JPromise.prototype.then = function (onResolved, onRejected) {
  const promise = this
  return new JPromise(function(resolve, reject) {
    promise.deferred.push([onResolved, onRejected, resolve, reject])
    // 异步执行
    promise.notify()
  })
}

JPromise.prototype.notify = function () {
  const promise = this
  nextTick(() => {
    if (promise.state !== PENDING) {
      while (promise.deferred.length) {
        const [onResolved, onRejected, resolve, reject] = promise.deferred.shift()
        try {
          if (promise.state === RESOLVED) {
            if (typeof onResolved === 'function') {
              resolve(onResolved(promise.value))
            } else {
              resolve(promise.value)
            }
          } else if(promise.state === REJECTED) {
            if (typeof onRejected === 'function') {
              resolve(onRejected(promise.value))
            } else {
              reject(promise.value)
            }
          }
        } catch (error) {
          reject(error)
        }
      }
    }
  })
}

JPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}

module.exports = JPromise
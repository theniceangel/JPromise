const JPromise = require('./lib')

const pResolve = new JPromise((resolve) => {
  resolve(1)
})

console.log(pResolve)

const pReject = new JPromise((resolve, reject) => {
  reject(2)
})

console.log(pReject)

const pThen = new JPromise((resolve) => {
  resolve(3)
}).then((x) => {
  console.log(x)
})

const pDelayedResolve = new JPromise((resolve) => {
  setTimeout(() => {
    resolve(3)
  }, 3000)
}).then((x) => {
  console.log(x)
})

const pResovePromise = new JPromise((resolve) => {
  resolve(new JPromise((resolve) => {
    resolve(2)
  }))
})
setTimeout(() => {
  console.log(pResovePromise)
}, 1000)

const pAllPromise = [new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  }, 1000)
}), new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(2)
  }, 5000)
})]

JPromise.all(pAllPromise).then((res) => {
  console.log(res)
})

const pRacePromise = [new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  }, 10000)
}), new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(2)
  }, 5000)
})]

JPromise.race(pRacePromise).then((res) => {
  console.log(res)
})

console.log('test')
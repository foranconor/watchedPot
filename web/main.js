
let time = document.getElementById("time")
let pic = document.getElementById("pic")
let counter = 0
let showing = new Date()
const refresh = 60 * 1000
let timeout
let f = 60

function getFilename() {
  console.log("getting filename")
  return showing.getTime()
}

function ticker() {
  const maybeTime = structuredClone(showing)
  maybeTime.setTime(maybeTime.getTime() + f * 1000)
  if (maybeTime.getTime() < Date.now()) {
    showing = maybeTime
  } else {
  }
}

setInterval(ticker, f * 1000)

function shiftTime(amount) {
  const maybeTime = structuredClone(showing)
  console.log(maybeTime)
  console.log(showing)
  maybeTime.setTime(maybeTime.getTime() + amount * 1000)
  if (maybeTime.getTime() > Date.now()) {
    // showing.setTime(new Date().getTime())
  } else {
    showing = maybeTime
  }
  console.log(maybeTime)
  console.log(showing)
}

updateImage()

function updateImage() {
  clearTimeout(timeout)
  console.log("updating")
  fetchImage()
  // time.innerHTML = `<p>${getFilename()}</p>`
  timeout = setTimeout(updateImage, refresh)
}

async function fetchImage() {
  try {
    const res = await fetch(`pics/${getFilename()}`)
    if (res.status === 200) {
      console.log("got 200")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      pic.src = url
    } else {
      throw new Error("Not 200")
    }
  } catch (e) {
    console.log(e)
  }

}

window.addEventListener("click", function(e) {
  if (e.target.id === "rewind1") {
    shiftTime(-60)
  } else if (e.target.id === "rewind10") {
    shiftTime(-600)
  } else if (e.target.id === "rewind100") {
    shiftTime(-6000)
  } else if (e.target.id === "forward1") {
    shiftTime(60)
  } else if (e.target.id === "forward10") {
    shiftTime(600)
  } else if (e.target.id === "forward100") {
    shiftTime(6000)
  }
  updateImage()
})
async function hashSecret(secret) {
  let salted = secret
  for (let i = 0; i < secret.length % 7; i++) {
    salted = salted + SALT
  }
  const encoder = new TextEncoder()
  const hash = await crypto.subtle.digest("SHA-512", encoder.encode(salted))
  return hash
}

function arrayBufferToBase64(digest) {
  const hashArray = new Uint8Array(digest)
  const hashBytes = Array.from(hashArray).map(byte => String.fromCharCode(byte)).join('')
  const hashBase64 = btoa(hashBytes)
  return hashBase64
}

function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}


async function doAuth() {
  let res = await fetch(`${API}/nonce`, {
    method: "POST",
    body: JSON.stringify(msg)
  })
  if (!res.ok) {
    return Promise.reject(err)
  }
  const body = await res.json()
  const nonce = base64ToArrayBuffer(body.nonce)

  // salt our secret
  let secret = document.getElementById("secret").value
  const salted = new Uint8Array(secret.byteLength + nonce.byteLength * 2)
  salted.set(new Uint8Array(nonce), 0)
  salted.set(new Uint8Array(secret), nonce.byteLength)
  salted.set(new Uint8Array(nonce), nonce.byteLength + secret.byteLength)

  // hash this thing
  const hash = await crypto.subtle.digest("SHA-512", salted)
}

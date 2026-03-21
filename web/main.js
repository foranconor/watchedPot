
let time = document.getElementById("time")
let pic = document.getElementById("pic")
let counter = 0
let showing = new Date()
const refresh = 1000
let speed = 1
let timeout
let f = 1
let lastTime = 0

function getFilename() {
  return showing.getTime()
}

function toLocalTime() {
  date = new Date(showing.getTime())
  const pad = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function ticker() {
  const maybeTime = structuredClone(showing)
  maybeTime.setTime(maybeTime.getTime() + 1000 * speed)
  if (maybeTime.getTime() < Date.now()) {
    showing = maybeTime
  } else {
  }
}

function updateTime() {
  document.getElementById("time").innerHTML = `${toLocalTime()}`
}

setInterval(ticker, 1000)

function shiftTime(amount) {
  const maybeTime = structuredClone(showing)
  maybeTime.setTime(maybeTime.getTime() + amount * 1000)
  if (maybeTime.getTime() > Date.now()) {
    // showing.setTime(new Date().getTime())
  } else {
    showing = maybeTime
  }
}

function setSpeed(id, newSpeed) {
  // clear all buttons
  document.getElementsByName("speedBtn").forEach(btn => {
    btn.classList.remove("active")
  })
  document.getElementById(id).classList.add("active")
  speed = newSpeed

}

updateImage()

function updateImage() {
  clearTimeout(timeout)
  // do we need to fetch a new image?
  if (showing.getTime() !== lastTime) {
    fetchImage()
    lastTime = showing.getTime()
    updateTime()
  }
  // time.innerHTML = `<p>${getFilename()}</p>`
  timeout = setTimeout(updateImage, refresh)
}

async function fetchImage() {
  try {
    const res = await fetch(`pics/${getFilename()}`)
    if (res.status === 200) {
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      pic.src = url

    } else {
      throw new Error(res.status)
    }
  } catch (e) {
    console.log(e)
  }
}

window.addEventListener("click", function(e) {
  switch (e.target.id) {
    case "rewind1":
      shiftTime(-60)
      break
    case "rewind10":
      shiftTime(-600)
      break
    case "rewind100":
      shiftTime(-6000)
      break
    case "forward1":
      shiftTime(60)
      break
    case "forward10":
      shiftTime(600)
      break
    case "forward100":
      shiftTime(6000)
      break
    case "x1":
      setSpeed("x1", 1)
      break
    case "x10":
      setSpeed("x10", 10)
      break
    case "x100":
      setSpeed("x100", 100)
      break
    default:
      return
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

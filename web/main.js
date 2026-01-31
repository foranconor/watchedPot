
let time = document.getElementById("time")
let pic = document.getElementById("pic")
let counter = 0
let showing = new Date()
const refresh = 2000
let timeout
let f = 1

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

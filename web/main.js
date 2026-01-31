
let app = document.getElementById("app")
console.log(app)
let counter = 0
const showing = new Date()

function getFilename() {
  return showing.getFullYear() + "-" + showing.getMonth() + "-" + showing.getDate() + "T" + showing.getHours() + ":" + showing.getMinutes()
}

function shiftTime(amount) {
  const maybeTime = showing
  maybeTime.setTime(maybeTime.getTime() + amount * 1000)
  if (maybeTime.getTime() < Date.now()) {
    maybeTime.setTime(Date.now())
  } else {
    showing.setTime(new Date().getTime())
  }
}

updateImage()

function updateImage() {
  app.innerHTML = `<p>${getFilename()}</p>`
  setTimeout(updateImage, timer)
}

function fetchImage() {

}

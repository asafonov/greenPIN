class QRCodeGeneratorView {

  constructor (scale = 0.6) {
    this.qrCodeElement = this.createQRCodeElement(scale)
    this.qrCode = this.createQRCode(scale)
  }

  createQRCode (scale) {
    const size = Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight) * 0.8 * scale
    return new QRCode(this.qrCodeElement.querySelector('div'), {width: size, height: size})
  }

  createQRCodeElement (scale) {
    const div = document.createElement('div')
    div.className = 'qrContainer'
    const w = document.documentElement.clientWidth
    const h = document.documentElement.clientHeight
    const size = Math.min(w, h) * scale
    div.style.position = 'fixed'
    div.style.top = '0px'
    div.style.left = '0px'
    div.style.width = `${w}px`
    div.style.height = `${h}px`
    div.style.display = 'none'
    div.style.zIndex = 999
    div.style.justifyContent = 'center'
    div.style.alignItems = 'center'
    div.style.flexDirection = 'column'
    document.body.appendChild(div)

    const qrDiv = document.createElement('div')
    qrDiv.style.width = `${size}px`
    qrDiv.style.height = `${size}px`
    qrDiv.style.justifyContent = 'center'
    qrDiv.style.alignItems = 'center'
    qrDiv.style.display = 'flex'
    qrDiv.style.backgroundColor = '#ffffff'
    div.appendChild(qrDiv)

    const message = document.createElement('div')
    message.className = 'message'
    message.style.marginTop = '20px'
    div.appendChild(message)

    const button = document.createElement('div')
    button.innerHTML = 'Close'
    button.style.marginTop = '20px'
    button.addEventListener('click', () => {
      div.style.display = 'none'
    })

    div.appendChild(button)
    return div
  }

  addMessage (msg) {
    this.qrCodeElement.querySelector('.message').innerHTML = msg
  }

  run (data, msg) {
    this.qrCodeElement.style.display = 'flex'
    this.addMessage(msg)
    this.qrCode.makeCode(data)
  }

  destroy() {
    this.qrCode = null
    this.qrCodeElement = null
  }
}

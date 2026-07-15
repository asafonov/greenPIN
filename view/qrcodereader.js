class QRCodeReaderView {

  constructor() {
    this.scannerElement = this.createScannerElement()
    this.stream = null
    this.scanning = false
    this.rafId = null
    this.scanLoopProxy = this.scanLoop.bind(this)
  }

  createScannerElement() {
    const div = document.createElement('div')
    const w = document.documentElement.clientWidth
    const h = document.documentElement.clientHeight
    div.style.position = 'fixed'
    div.style.top = '0px'
    div.style.left = '0px'
    div.style.width = `${w}px`
    div.style.height = `${h}px`
    div.style.display = 'none'
    div.style.zIndex = '999'
    div.className = 'back_color'
    div.style.justifyContent = 'center'
    div.style.alignItems = 'center'
    div.style.flexDirection = 'column'

    const video = document.createElement('video')
    video.setAttribute('autoplay', true)
    video.setAttribute('playsinline', true)
    div.appendChild(video)

    const canvas = document.createElement('canvas')
    canvas.setAttribute('hidden', true)
    div.appendChild(canvas)

    document.body.appendChild(div)
    return div
  }

  async startCamera (callbackFn) {
    try {
      const video = this.scannerElement.querySelector('video')
      this.stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}})
      video.srcObject = this.stream
      this.scanning = true
      this.scanLoop(callbackFn)
    } catch (e) {
      alert(e.message)
    }
  }

  stopCamera() {
    this.scanning = false
    const video = this.scannerElement.querySelector('video')

    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }

    if (this.stream) {
      video.srcObject = null
      this.stream.getTracks().forEach(track => track.stop())
      this.stream = null
    }

    video.pause()
  }

  scanLoop (callbackFn) {
    if (! this.scanning) return

    const video = this.scannerElement.querySelector('video')
    const canvas = this.scannerElement.querySelector('canvas')
    const ctx = canvas.getContext('2d')

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)

      if (code) {
        this.stopCamera()
        this.scannerElement.style.display = 'none'
        callbackFn && callbackFn(code)
        return
      }
    }

    this.rafId = requestAnimationFrame(this.scanLoopProxy)
  }

  scan (callbackFn) {
    this.scannerElement.style.display = 'flex'
    this.startCamera(callbackFn)
  }

}

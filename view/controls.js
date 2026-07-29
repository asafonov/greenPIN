class ControlsView {
  constructor() {
    this.plusButton = document.querySelector('.plus')
    this.onPlusProxy = this.onPlus.bind(this)
    this.qrCodeReader = new QRCodeReaderView(this.onQRCodeScan)
    this.addEventListeners()
  }

  onQRCodeScan (data) {
    const url = data.data.replace(/[^A-z0-9\/\:\?\&=@\.]/g, '')
    const parsedData = asafonov.totp.parseUrl(url)
    asafonov.messageBus.send(asafonov.events.ITEM_ADDED, parsedData)
  }

  onPlus() {
    this.qrCodeReader.scan()
  }

  addEventListeners() {
    this.plusButton.addEventListener('click', this.onPlusProxy)
  }

  removeEventListeners() {
    this.plusButton.removeEventListener('click', this.onPlusProxy)
  }

  destroy() {
    this.removeEventListeners()
    this.qrCodeReader.destroy()
    this.qrCodeReader = null
    this.plusButton = null
  }
}

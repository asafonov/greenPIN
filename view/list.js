class ListView {
  constructor() {
    this.model = new List()
    this.container = document.querySelector('.content')
    asafonov.messageBus.subscribe(asafonov.events.LIST_UPDATED, this, 'onListUpdate')
    this.onItemClickProxy = this.onItemClick.bind(this)
    this.onListUpdate()
    this.qrCodeGenerator = new QRCodeGeneratorView()
  }

  async onItemClick (e) {
    e.preventDefault()
    e.stopPropagation()
    const li = e.target
    const item = this.model.item(li.innerHTML)
    const otp = await asafonov.totp.generateTOTP(item.secret)
    asafonov.clipboard.copy(otp)
    const url = this.model.itemUrl(li.innerHTML)
    const otpDiv = document.createElement('div')
    otpDiv.innerHTML = otp
    const deleteButton = document.createElement('div')
    deleteButton.className = 'delete'
    deleteButton.innerHTML = 'Delete'
    deleteButton.addEventListener('click', () => asafonov.messageBus.send(asafonov.events.ITEM_DELETED, item))
    this.qrCodeGenerator.run(url, [otpDiv, deleteButton])
  }

  onListUpdate () {
    this.container.innerHTML = ''
    const ul = document.createElement('ul')
    this.container.appendChild(ul)
    const data = this.model.get()

    for (let i in data) {
      const li = document.createElement('li')
      li.innerHTML = i
      li.addEventListener('click', this.onItemClickProxy)
      ul.appendChild(li)
    }
  }

  destroy() {
    this.model.destroy()
    this.model = null
    this.container = null
    this.qrCodeGenerator.destroy()
    this.qrCodeGenerator = null
    asafonov.messageBus.unsubscribe(asafonov.events.LIST_UPDATED, this, 'onListUpdate')
  }
}

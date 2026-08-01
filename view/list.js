class ListView {
  constructor() {
    this.model = new List()
    this.container = document.querySelector('.content')
    asafonov.messageBus.subscribe(asafonov.events.LIST_UPDATED, this, 'onListUpdate')
    this.onItemClickProxy = this.onItemClick.bind(this)
    this.onDeleteClickProxy = this.onDeleteClick.bind(this)
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
    deleteButton.setAttribute('data-item', JSON.stringify(item))
    deleteButton.addEventListener('click', this.onDeleteClickProxy)
    this.qrCodeGenerator.run(url, [otpDiv, deleteButton])
  }

  onDeleteClick (e) {
    e.preventDefault()
    e.stopPropagation()
    if (confirm("Are you sure you want to delete the item?")) {
      const button = e.target
      const item = JSON.parse(button.getAttribute('data-item'))
      asafonov.messageBus.send(asafonov.events.ITEM_DELETED, item)
      this.qrCodeGenerator.close()
    }
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

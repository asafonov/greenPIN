class ListView {
  constructor() {
    this.model = new List()
    this.container = document.querySelector('.content')
    asafonov.messageBus.subscribe(asafonov.events.LIST_UPDATED, this, 'onListUpdate')
    this.onItemClickProxy = this.onItemClick.bind(this)
    this.onListUpdate()
  }

  async onItemClick (e) {
    e.preventDefault()
    e.stopPropagation()
    const li = e.target
    const item = this.model.item(li.innerHTML)
    alert(await asafonov.totp.generateTOTP(item.secret))
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
    asafonov.messageBus.unsubscribe(asafonov.events.LIST_UPDATED, this, 'onListUpdate')
  }
}

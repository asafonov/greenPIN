class ListView {
  constructor() {
    this.model = new List()
    this.container = document.querySelector('.content')
    asafonov.messageBus.subscribe(asafonov.events.LIST_UPDATED, this, 'onListUpdate')
    this.onListUpdate()
  }

  onListUpdate () {
    this.container.innerHTML = ''
    const ul = document.createElement('ul')
    this.container.appendChild(ul)
    const data = this.model.get()

    for (let i in data) {
      const li = document.createElement('li')
      li.innerHTML = data[i].provider
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

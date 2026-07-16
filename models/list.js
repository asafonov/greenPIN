class List {
  constructor (name = 'list') {
    this.name = name
    this.list = JSON.parse(window.localStorage.getItem(name)) || {}
    asafonov.messageBus.subscribe(asafonov.events.ITEM_ADDED, this, 'onItemAdd')
    asafonov.messageBus.subscribe(asafonov.events.ITEM_DELETED, this, 'onItemDelete')
  }

  get() {
    return this.list
  }

  item (key) {
    return this.list[key]
  }

  onItemAdd (data) {
    this.list[data.provider] = data
    this.save()
    asafonov.messageBus.send(asafonov.events.LIST_UPDATED)
  }

  onItemDelete (data) {
    delete this.list[data.provider]
    this.save()
    asafonov.messageBus.send(asafonov.events.LIST_UPDATED)
  }

  asString() {
    return JSON.stringify(this.list)
  }

  save() {
    window.localStorage.setItem(this.name, this.asString())
  }

  destroy() {
    asafonov.messageBus.unsubscribe(asafonov.events.ITEM_ADDED, this, 'onItemAdd')
    asafonov.messageBus.unsubscribe(asafonov.events.ITEM_DELETED, this, 'onItemDelete')
  }
}

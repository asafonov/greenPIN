class List {
  constructor (name = 'list') {
    this.name = name
    this.list = JSON.parse(window.localStorage.getItem(name)) || {}
    asafonov.messageBus.subscribe(asafonov.events.ITEM_ADDED, this, 'onItemAdd')
    asafonov.messageBus.subscribe(asafonov.events.ITEM_DELETED, this, 'onItemDelete')
    asafonov.messageBus.subscribe(asafonov.events.ITEM_RENAMED, this, 'onItemRename')
  }

  get() {
    return this.list
  }

  item (key) {
    return this.list[key]
  }

  itemUrl (key) {
    const item = this.item(key)
    return `otpauth://totp/${item.provider}${! item.username ? '' : ':' + item.username}?secret=${item.secret}&issuer=${item.issuer}`
  } 

  getKey (provider) {
    let i = ''

    while (this.list[provider + i] !== null && this.list[provider + i] !== undefined) {
      i = ! i ? 1 : i + 1
    }

    return provider + i
  }

  onItemAdd (data) {
    if (!data.provider) return

    this.list[this.getKey(data.provider)] = data
    this.save()
    asafonov.messageBus.send(asafonov.events.LIST_UPDATED)
  }

  onItemDelete (data) {
    delete this.list[data.key]
    this.save()
    asafonov.messageBus.send(asafonov.events.LIST_UPDATED)
  }

  onItemRename({oldName, newName}) {
    this.list[newName] = {...this.list[oldName]}
    delete this.list[oldName]
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
    asafonov.messageBus.unsubscribe(asafonov.events.ITEM_RENAMED, this, 'onItemRename')
  }
}

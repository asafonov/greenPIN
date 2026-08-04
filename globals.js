window.asafonov = {}
window.asafonov.messageBus = new MessageBus()
window.asafonov.totp = new TOTP()
window.asafonov.clipboard = new Clipboard()
window.asafonov.version = '0.7'
window.asafonov.app = 'greenPIN.apk'
window.asafonov.events = {
  ITEM_ADDED: 'ITEM_ADDED',
  ITEM_DELETED: 'ITEM_DELETED',
  LIST_UPDATED: 'LIST_UPDATED'
}
window.asafonov.settings = {
}
window.onerror = (msg, url, line) => {
  alert(`${msg} on line ${line}`)
}

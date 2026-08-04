document.addEventListener("DOMContentLoaded", function(event) {
  const listView = new ListView()
  const controlsView = new ControlsView()
  const updaterView = new UpdaterView()
  updaterView.showUpdateDialogIfNeeded()
})

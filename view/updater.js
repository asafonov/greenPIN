class UpdaterView {

  constructor() {
    const upstreamVersionUrl = `https://raw.githubusercontent.com/asafonov/${window.asafonov.app}/master/VERSION.txt`
    this.model = new Updater(upstreamVersionUrl)
    this.updateUrl = `https://github.com/asafonov/${window.asafonov.app}/releases/download/{VERSION}/app-release.apk`
  }

  showUpdateDialogIfNeeded() {
    this.model.isUpdateNeeded()
      .then(isUpdateNeeded => {
        if (isUpdateNeeded) this.showUpdateDialog()
      })
  }

  showUpdateDialog() {
    if (confirm('New version available. Do you want to update the App?')) location.href = this.model.getUpdateUrl(this.updateUrl)
  }
}

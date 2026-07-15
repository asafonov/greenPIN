document.addEventListener("DOMContentLoaded", function(event) {
  qrCodeReader = new QRCodeReaderView()
  qrCodeReader.scan(v => alert(JSON.stringify(v.data)))
});

document.addEventListener("DOMContentLoaded", function(event) {
  const test = v => {
    const totp = new TOTP()
    const url = v.data
    alert(`url ${url}`)
    const parsedData = totp.parseData(url)
    alert(`data ${JSON.stringify(parsedData)}`)
    totp.generateTOTP(parsedData.secret).then(otp => alert(`otp ${otp}`)).catch(e => alert(JSON.stringify(e)))
  }

  qrCodeReader = new QRCodeReaderView(test)
  qrCodeReader.scan()
});

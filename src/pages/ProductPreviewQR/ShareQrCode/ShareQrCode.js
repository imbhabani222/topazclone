import React, { Component } from "react"
import { WhatsappShareButton, WhatsappIcon } from "react-share"
import { useLocation } from "react-router-dom"
import "../product_previewqr.css"

function ShareQrCode() {
  const title = "Hey Check This Product"
  const location = useLocation()
  const { pathname } = location
  const productId = pathname.split("/")[2]
  return (
    <div className="share__container">
      <div className="share__network">
        <WhatsappShareButton
          url={`https://topaz.hutechweb.com/product-preview-qr/${productId}`}
          title={title}
          separator=""
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>
    </div>
  )
}

export default ShareQrCode

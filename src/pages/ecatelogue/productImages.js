import { Image } from "antd"

const ProductImages = ({ product }) => {
    return (
        <>
            {
                product.productimage.map((img) =>
                    <Image
                        key={img.imageId+Math.random()}
                        width={30}
                        height={30}
                        src={img.url}
                    />
                )
            }
        </>
    )
}

export default ProductImages
import Image from "react-bootstrap/Image";

const ImageThumbnail = ({
    src,
    alt = "",
    size = 60,
}) => {
    return (
        <Image
            src={
                src ||
                "https://via.placeholder.com/60x60?text=No+Image"
            }
            alt={alt}
            rounded
            width={size}
            height={size}
            style={{
                objectFit: "cover",
            }}
        />
    );
};

export default ImageThumbnail;
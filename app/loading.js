import Image from "next/image";

export default function Loading() {
  let LOADING_IMAGE_URL =
    "https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif";
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="relative w-[150px] h-[150px]">
        <Image
          className="text-center object-cover"
          src={LOADING_IMAGE_URL}
          fill
          alt="loading"
        />
      </div>
    </div>
  );
}

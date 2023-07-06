export default function Loading() {
  let LOADING_IMAGE_URL =
    "https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif";
  return (
    <div className="w-full h-screen flex items-center justify-center ">
      <h1 className="text-[3rem] text-center">{LOADING_IMAGE_URL}</h1>
    </div>
  );
}

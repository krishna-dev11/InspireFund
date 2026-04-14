import { Toaster } from "react-hot-toast";

function ToastContainer() {
  return (
    <Toaster
      position="bottom-right"
      containerStyle={{ bottom: 24, right: 24 }}
      containerClassName="z-[100] flex flex-col gap-2 pointer-events-none"
    />
  );
}

export default ToastContainer;

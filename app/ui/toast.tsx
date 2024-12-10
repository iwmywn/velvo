import { ToastContainer } from "react-toastify";
import { createPortal } from "react-dom";

export default function Toast() {
  return createPortal(
    <ToastContainer
      closeButton={false}
      icon={false}
      hideProgressBar
      closeOnClick
      pauseOnFocusLoss
    />,
    document.getElementById("popups")!,
  );
}

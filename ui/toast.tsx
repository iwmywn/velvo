import { PiWarningCircleBold } from "react-icons/pi";
import { CiCircleCheck } from "react-icons/ci";
import { toast } from "react-toastify";
import { JSX } from "react";

type ToastType = "warning" | "success";

export default function showToast(message: string, type: ToastType) {
  const icons: Record<ToastType, JSX.Element> = {
    warning: <PiWarningCircleBold size={14} />,
    success: <CiCircleCheck size={14} />,
  };

  toast(message, { icon: icons[type] });
}

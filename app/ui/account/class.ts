const boxClass =
  "relative mb-12 w-full after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-stone-200 after:transition-all after:duration-300 hover:after:bg-black";
const inputClass =
  "peer w-full border-gray-300 bg-transparent py-[6px] text-black placeholder-transparent outline-none";
const labelClass =
  "pointer-events-none absolute left-0 top-[50%] translate-y-[-50%] transition-all duration-300 peer-focus:top-[-50%] peer-focus:translate-y-0 peer-focus:text-xs peer-[&:not(:placeholder-shown)]:top-[-50%] peer-[&:not(:placeholder-shown)]:translate-y-0 peer-[&:not(:placeholder-shown)]:text-xs";
const buttonClass = "group bg-black py-4 text-xs font-medium text-white";

export { boxClass, inputClass, labelClass, buttonClass };

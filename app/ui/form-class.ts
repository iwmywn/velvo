const formClass = "flex w-full flex-col gap-1 text-black/65";
const boxClass =
  "relative mb-10 w-full after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-stone-200 after:transition-all after:duration-300 hover:after:bg-black";
const inputClass =
  "peer w-full bg-transparent py-[6px] text-black placeholder-transparent outline-none";
const labelClass =
  "pointer-events-none absolute left-0 top-[50%] translate-y-[-50%] transition-all duration-300 peer-focus:top-[-50%] peer-focus:translate-y-0 peer-focus:text-xs peer-[&:not(:placeholder-shown)]:top-[-50%] peer-[&:not(:placeholder-shown)]:translate-y-0 peer-[&:not(:placeholder-shown)]:text-xs";
const errorClass = "absolute top-[105%] text-red-500 text-xs";
const linkClass =
  "relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:origin-center after:scale-x-0 after:bg-black after:transition-all after:duration-500 hover:after:scale-x-100";

export { formClass, boxClass, inputClass, labelClass, errorClass, linkClass };

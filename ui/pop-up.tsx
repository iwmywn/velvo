"use client";

import Link from "next/link";
import { useEffect, Fragment } from "react";
import { FaGithub } from "react-icons/fa";
import Backdrop from "@ui/overlay/backdrop";
import { linkClass } from "@ui/form-class";
import { useAnimation } from "@ui/hooks";
import { useUIStateContext } from "@ui/contexts";

const contact = [
  {
    name: "Ngô Nguyễn Việt Anh",
    mssv: "215052056",
    email: "anhnnv21@uef.edu.vn",
    github: "Lovesnm1",
  },
  {
    name: "Hoàng Anh Tuấn",
    mssv: "215052152",
    email: "tuanha321@uef.edu.vn",
    github: "iwmywn",
  },
];

export default function PopUp() {
  const { state, setState } = useUIStateContext();
  const { isAnimating, triggerAnimation } = useAnimation();

  useEffect(() => {
    if (!(sessionStorage.getItem("popup") === "true")) {
      setState("isPopupOpen", true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("popup", "true");
    triggerAnimation(() => setState("isPopupOpen", false));
  };

  return (
    state.isPopupOpen && (
      <Backdrop isAnimating={isAnimating} onMouseDown={handleClose}>
        <div
          className={`relative rounded-2xl bg-white px-8 py-6 text-black ${isAnimating ? "animate-popUpOut" : "animate-popUpIn"}`}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center justify-center gap-2 text-sm">
            <h3 className="font-semibold">ĐỒ ÁN 2024</h3>
            {contact.map(({ name, mssv, email, github }) => (
              <Fragment key={name}>
                <span>
                  {name} - {mssv}{" "}
                </span>
                <span className="flex items-center gap-3">
                  <Link
                    className={linkClass}
                    href={`mailto:${email}`}
                    rel="noopener"
                  >
                    {email}
                  </Link>
                  <Link
                    href={`https://github.com/${github}`}
                    target="_blank"
                    rel="noopener"
                  >
                    <FaGithub
                      className="transition-all duration-300 hover:scale-110"
                      fontSize={22}
                    />
                  </Link>
                </span>
              </Fragment>
            ))}
          </div>
        </div>
      </Backdrop>
    )
  );
}

import Link from "next/link";

export default function AccountMenu() {
  return (
    <div className="absolute left-1/2 top-full z-10 mt-2 w-32 -translate-x-1/2 text-sm">
      <div className="absolute -top-2 left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-b-8 border-x-transparent"></div>
      <div className="rounded-md border bg-white">
        <div className="flex flex-col">
          <Link href="/user/account" className="px-4 py-2 hover:bg-gray-100">
            My Account
          </Link>
          <Link href="/user/purchase" className="px-4 py-2 hover:bg-gray-100">
            My Purchase
          </Link>
          <button
            // onClick={() => {
            //   console.log("Signed out");
            // }}
            className="px-4 py-2 text-left hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

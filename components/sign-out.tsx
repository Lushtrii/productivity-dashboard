import { signOut } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function SignoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        const cookieStore = await cookies();
        cookieStore.delete("demo_mode");
        await signOut();
        redirect("/");
      }}
    >
      <button
        type="submit"
        className="border-2 border-white pt-1 pb-1 pl-2 pr-2 bg-white text-black rounded-lg hover:cursor-pointer hover:text-white hover:bg-black"
      >
        Sign out
      </button>
    </form>
  );
}

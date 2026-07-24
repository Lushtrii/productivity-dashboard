import { signOut } from "@/auth";

export async function SignoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
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

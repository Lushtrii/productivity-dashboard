import { signIn, startGuestSession } from "@/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function SignIn() {
  return (
    <div className="mt-16 flex flex-col gap-4">
      <form
        action={async () => {
          "use server";
          await signIn("github", { redirectTo: "/dashboard" });
        }}
      >
        <button
          type="submit"
          className="w-80 flex items-center justify-center gap-4 border-3 border-white rounded-sm p-2 text-black bg-white font-semibold hover:cursor-pointer hover:text-white hover:bg-black"
        >
          <i className="h-8 w-8">
            <FontAwesomeIcon icon={faGithub} />
          </i>
          Login with Github
        </button>
      </form>
      <form
        action={async () => {
          "use server";
          await startGuestSession();
        }}
      >
        <button className="w-80 border-2 flex items-center justify-center p-2 rounded-sm hover:cursor-pointer hover:text-black hover:bg-white font-semibold">
          Try the demo
        </button>
      </form>
    </div>
  );
}

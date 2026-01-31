import { Button } from "@/components/ui/button";
import { signupWithGoogle } from "../actions/signup-with-google";

export const GoogleSignup = () => {
  return (
    <form className="w-full" action={signupWithGoogle}>
      <Button className="w-full" variant="outline" type="submit">
        Continue with Google
      </Button>
    </form>
  );
};

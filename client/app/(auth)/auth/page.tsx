import AuthForm from "@/components/form/AuthForm";
import Image from "next/image";

export default function AuthPage() {
  return (
    <div className="w-full max-w-5xl bg-card rounded-2xl p-3 shadow-xl">
      <div className="grid  lg:grid-cols-2">
        <AuthForm />

        {/* Image section */}
        <div className="relative hidden lg:block">
          <Image
            src="https://cdn.dribbble.com/userupload/14898990/file/original-ba68e98ea10e1867e831884c3b153387.png?resize=1504x1128&vertical=center"
            alt="auth-banner"
            width={1000}
            height={1980}
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
}

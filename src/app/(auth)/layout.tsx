type Props = {
  children: React.ReactNode;
};
export default function AuthLayout({ children }: Props) {
  return (
    <div className="flex flex-center min-h-screen w-full inset-0 z-0 bg-gradient-dark">
      {children}
    </div>
  );
}

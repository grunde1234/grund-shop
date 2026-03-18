import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/shared/header/menu";
import logo from '../../../public/logo.png'
import MainNav from "./main-nav";

type Props = {
  children: React.ReactNode;
};
export default function UserLayout({ children }: Props) {
  return (
    <>
    <div className="flex flex-col">
        <div className="border-b container mx-auto">
            <div className="flex item-center h-16 px-4">
                <Link href='/' className="my-auto">
                <Image className='rounded-md p-0' src={logo} alt={APP_NAME} height={54} width={54} priority={true}/>
                </Link>
                {/* Main nav */}
                <MainNav className="mx-6"/>
                <div className="ml-auto items-center flex space-x-4">
                    <Menu />
                </div>
            </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
            {children}
        </div>
    </div>
    </>
  );
}

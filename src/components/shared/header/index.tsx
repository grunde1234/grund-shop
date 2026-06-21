import Image from 'next/image'
import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'
import Menu from '@/components/shared/header/menu'
import logo from '../../../../public/logo.png'
import CategoryDrawer from './category-drawer'
import Search from './search'

const Header = () => {
  return (
    <header className='w-full border-b'>
        <div className='wrapper flex-between'>
            <div className='flex-start'>
              <CategoryDrawer />
                <Link href="/" className='flex-start ml-4'>
                <Image className='rounded-md' src={logo} alt={APP_NAME} height={54} width={54} priority={true}/>
                <span className='hidden lg:block font-bold text-2xl ml-3'>{APP_NAME}</span>
                </Link>
            </div>
            <div className='hidden md:block'>
              <Search />
            </div>
            <Menu />
        </div>
    </header>
  )
}

export default Header
import Image from 'next/image'
import loader from '@/assets/loader.gif'


const Loading = () => {
  return (
    <div className='flex-center h-screen w-full'>
        <Image src={loader} height={150} width={150} alt="Loading..."  />
    </div>
  )
}

export default Loading
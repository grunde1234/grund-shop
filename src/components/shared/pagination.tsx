'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '../ui/button'
import { buildUrlQuery } from '@/lib/utils'
import { Param } from '@prisma/client/runtime/library'

type PaginationProps = {
    page: number | string;
    totalPages: number;
    urlParamName?: string;
}

const Pagination = ({page, totalPages, urlParamName}: PaginationProps) => {
    const router = useRouter();//?UN
    const searchParams = useSearchParams();//* ??
    const first = Number(page) <= 1 ? true : false;//?UN
    const last = Number(page) >= totalPages;//?UN

    const handleClick = (btnType: string)=>{
        //*Number i want to go to next 
        const pageValue = btnType === 'next' ? Number(page) + 1 : Number(page) - 1 //?UN
        const newUrl = buildUrlQuery({params: searchParams.toString(), key: urlParamName || 'page', value: pageValue.toString()});//?UN

        router.push(newUrl)
    }


  return (
    <div className='flex gap-2'>
        <Button size="lg" variant="outline" className='w-28' disabled={first} onClick={()=> handleClick('prev')}>
        Previous
        </Button>
        <Button size="lg" variant="outline" className='w-28' disabled={last} onClick={()=> handleClick('next')}>
        Next
        </Button>
    </div>
  )
}

export default Pagination
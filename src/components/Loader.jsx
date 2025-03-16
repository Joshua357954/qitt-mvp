import React from 'react'
import Image from 'next/image'

export default function Loader({open}) {
    if (!open)
        return <p></p>

    return (
        <div className='fixed z-10 top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,.3)] flex justify-center items-center'>
            <div className='flex justify-center items-center w-78 h-68 bg-white rounded-lg px-10 py-8'>
                <Image width={25} height={35} src={'/assets/images/Loading (1).gif'} unoptimized className='w-36 h-32' alt={'loader gif'}/>
            </div>
          
        </div>
    )
}

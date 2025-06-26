import React from 'react'
import { assets } from '../assets/assets'
import { Camera, Upload} from 'lucide-react'

const Header = () => {
  return (
    

        <div className='flex flex-col min-h-[75vh] md:flex-row flex-wrap bg-gradient-to-b from-[#0D7377] to-[#14A085] z-0 rounded-2xl px-4 md:px-8 lg:px-18'>
            <div className='w-full text-center md:text-left mb-8 '>
                <h1 className='text-4xl font-bold flex items-center justify-center  gap-2 '>
                <span className='text-9xl text-white'>PHAR</span>
                <img src={assets.logo2} alt="icon" className="w-34 h-34" />
                <span className='text-9xl text-white'>MACY</span>
                </h1>
                
            </div>

            <div className='flex items-center justify-between mx-auto'>
                <div className=" flex flex-col justify-center my-6 gap-8">
                    <p className="text-2xl">All your Medicine <br/> needs in one place</p>
                    <ul className="text-base space-y-2 text-white">
                    <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-pButtonH rounded-full"></span>
                        Take a Picture of your Prescription
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-pButtonH rounded-full"></span>
                        Upload the Prescription
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-pButtonH rounded-full"></span>
                        Select Pharmacies to Order
                    </li>
                    </ul>

                </div>

                <div className="flex-1 flex justify-center">
                    <img
                    src={assets.header_img}
                    alt="delivery person"
                    className="object-contain h-110 mx-3"
                    />

                </div>

                <div>
                    
                    <div className="flex flex-col items-center justify-center mb-6 h-50 w-80 bg-upload-bg rounded-xl gap-3 hover:translate-y-[-5px] transition-all duration-200">
                        <div className='bg-upload-bg-hover p-2 flex flex-col justify-center items-center'>
                            <p className="mb-4 text-sm text-pButton">Take a picture of your doctor prescription</p>
                        <Camera className="w-10 h-10 text-pButtonH animate-pulse" />
                        </div>
                        <button className="px-3 my-2 bg-pButton text-white py-2 rounded-full hover:bg-pButtonH transition-all">
                            <div className='flex gap-2'><Upload size={20}/><span>Upload prescription</span></div>
                        </button>
                    </div>
                    

                </div>
            </div>
            
            
        </div>
   

  )
}

export default Header


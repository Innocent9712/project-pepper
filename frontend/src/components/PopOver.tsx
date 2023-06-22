import React, {useState} from 'react';

const BubbleContainer = ({ render, display }: any) => {
    const [show, setShow] = useState(display)
  return (
    <div className={`${!show && "hidden"} absolute min-w-[180px] top-14`}>
        <div className="bg-white rounded-lg p-4 shadow-lg">
            {render()}
        </div>
      <div className="absolute w-2 h-2 bg-white transform rotate-45 -translate-x-1/2 -top-1 left-[50%]" />
    </div>
  );
};


export default BubbleContainer;


export function PopOverOne({ action, value, onChange, display }: any)  {
  return (
    <BubbleContainer display={display} render={() => (
        <>
            <input
            type="number"
            value={value}
            onChange={onChange}
            className="border border-gray-300 rounded px-3 py-2 mr-2  bg-white text-black block w-full"
            />
            <div className='flex justify-center gap-3'>
                <button className='bg-transparent'>
                    <i className="ri-close-fill text-red-500 cursor-pointer text-xl inline-block"></i>
                </button>
                <button className='bg-transparent'>
                    <i className="ri-check-fill text-green-500 cursor-pointer ml-2 text-xl inline-block"></i>
                </button>
            </div>
        </>
    )
    } />
  )
}

export function PopOverTwo({ action}: any) {
    return (
        <BubbleContainer render={()=> (
            <>
                <p className='text-black text-center'>Are you sure?</p>
                <button className='bg-transparent'>
                <i className="ri-close-fill text-red-500 cursor-pointer text-xl inline-block"></i>
                </button>
                <button className='bg-transparent'>
                    <i className="ri-check-fill text-green-500 cursor-pointer ml-2 text-xl inline-block"></i>
                </button>
            </>
        )} />
        
    )
}



import React from 'react'

const AllPosts = () => {
    const items = ["Action","Science","Technology","Comedy","Joy","Mathematics","Medical","Engineering","Cartoon","Ui/Ux"]
   // console.log("i am arrived-3")
  return (
    <div className=' h-screen w-3/4 border-r-1 border-gray-300 flex flex-col  items-center '>

      {/**genre */}
      <div className='min-h-[6vh] w-3/4  overflow-x-auto flex gap-10 justify-center items-center border-b-2 border-gray-300'>
       {items.map( (item,index)=>
        {
        return(
            
            <p key={index}>
                {item}
            </p>
            
        )
         })}
      </div>


      {/**posts */}
      <div className='w-3/4 h-full bg-red-400'>

      </div>

    </div>
  )
}

export default AllPosts

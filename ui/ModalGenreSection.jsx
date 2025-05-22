import React from 'react'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { GrClose } from "react-icons/gr";

const ModalGenreSection = ({genreElements,setGenreElements}) => {

 
    const [text,setText] = useState('')
  const noSpace = (originalText)=>
  {
  const spaceFreeText = originalText.replace(/\s+/g, '');
  return originalText == spaceFreeText
  }
  
      const Perform = (e)=>{
          if(e.key === 'Enter')
          {
            if(text.trim().length>0 && noSpace(text))
            {
               const isNoDuplicancy = genreElements.every( (item)=> item.trim().toLowerCase() != text.trim().toLowerCase() )
               if(isNoDuplicancy)
               {
                setGenreElements((prev)=>[...prev,text])
               }
            }
            setText('')
          }
        }
        const deleteGenre = (item,index)=>
          { 
           const updatedArr = genreElements.filter( (i)=> i != item )
           setGenreElements(updatedArr)
          }
          

  return (
    <>
        <Input placeholder="Add the genre : Ex:Action" className='w-full' value={text} onChange={(e)=>setText(e.target.value)} onKeyDown={Perform} />
        {genreElements.length > 0 && (
  <div className="w-full h-auto  p-2 flex flex-wrap gap-2">
    {genreElements.map((item, index) => (
      <div
        key={index}
        className="bg-gray-500 text-white border border-white px-4 py-1 rounded flex items-center gap-2"
      >
        <button>{item}</button>
        <GrClose className="cursor-pointer" onClick={()=>deleteGenre(item,index)} />
      </div>
    ))}
  </div>
)}
    </>
  )
}

export default ModalGenreSection

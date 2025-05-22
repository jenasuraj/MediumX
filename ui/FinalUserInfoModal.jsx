import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { format } from 'date-fns';
import axios from 'axios'
import ModalGenreSection from './ModalGenreSection'




const FinalUserInfoModal = ({heading,bio,editor,u_id,setUpdate,update}) => {

     const [genreElements,setGenreElements] = useState([])
     const [wordCountValue,setWordCountValue] = useState(60)
     const [text,setText]=useState('')
     const [isDisabled,setIsDisabled]=useState(false)
     const [wordRangeAlert,setWordRangeAlert]=useState(false)


      const finalPostSubmit = async () => {
        if (!editor) {
          console.error('Editor is not initialized yet.');
          return;
        }
      
        const headingValue = heading.current?.value;
        const bioValue = bio.current?.value;
        const content = editor.getHTML();
        const now = new Date();
        const formattedDate = format(now, 'yyyy-MM-dd');

    
      
        if (u_id && content && headingValue && bioValue) {
          
      
          try {
            await axios.post("/api/post", {
              u_id,
              content,
              heading: headingValue,
              bio: bioValue,
              date:formattedDate,
              genre:genreElements,
            });
            console.log('Post submitted successfully!');
          } catch (error) {
            console.error('Error submitting post:', error);
          }
        } else {
          console.error('Missing fields: Cannot submit post.');
        }
    
        alert("Post uploaded")
      };

const WordCount = (e) => {
  const input = e.target.value;
  const words = input.trim().split(/\s+/);
  
  if (words.filter(word => word !== '').length <= 60) {
    setText(input); 
    setWordRangeAlert(false);
    setWordCountValue(60 - words.length);
  } else {
    setWordRangeAlert(true);
    setWordCountValue(0);
  }
};

  return (
    <>
    
<Dialog >
    <DialogTrigger asChild>
      <Button variant="outline"
      className="inline-block px-16 bg-black text-white mt-10 py-2 mb-5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={!editor}>
      {update ? 'Update Blog' : 'Post Blog'}
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[700px] w-full">

      <DialogHeader>
        <DialogTitle>
        Hold on what about all these ?
        </DialogTitle>
        <DialogDescription>
         There we are, few extra things to make the post better🔥
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
           Heading
          </Label>
          <Input id="name" placeholder="EX: Revolution of Ai" ref = {heading}  className="col-span-3" />
        </div>
    
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Short Bio
          </Label>  
        </div>
        <Textarea placeholder="Write a short bio that describes your post better"
         ref = {bio} value={text} onChange={WordCount}  className='w-full' disabled={isDisabled}/>
    <p className={`${wordRangeAlert ? "text-red-600" : " text-sm text-gray-500"}`}>Write the above bio in about {wordCountValue} words</p>
    <ModalGenreSection genreElements={genreElements} setGenreElements={setGenreElements}/>

      </div>
      <DialogFooter>
        <Button className="cursor-pointer hover:bg-white hover:text-black hover:border hover:border-black hover:transition-all" type="submit" 
        onClick={finalPostSubmit}>Upload your blog</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
    </>
  )
}

export default FinalUserInfoModal

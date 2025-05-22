"use client";
import React, { useState,useRef } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { HiH1, HiH2, HiH3 } from "react-icons/hi2";
import { CgCodeSlash } from "react-icons/cg";
import { LuBold } from "react-icons/lu";
import { GoItalic } from "react-icons/go";
import { AiOutlineRobot } from "react-icons/ai";
import { LuList } from "react-icons/lu";
import { RiImageCircleAiLine } from "react-icons/ri";
import { TbTable } from "react-icons/tb";
import { CldUploadWidget } from "next-cloudinary";
import axios from "axios";
import "../app/globals.css";
import { PiEmptyThin } from "react-icons/pi";
import { GiEmptyChessboard } from "react-icons/gi";
import { FaYoutube } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { VscRobot } from "react-icons/vsc";
import { Textarea } from "@/components/ui/textarea"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"





const MenuBar = ({
  editor,
  setShowModal, 
  setAiResponse,
  valueData,
  setHistoryPage,
  setHistory,
  setPublicId,
  setPendingImageUrl,
}) => {
  if (!editor) return null;
  const aiQuery = useRef(null)
  const [isHeadingOpen, setIsHeadingOpen] = useState(false);
  const [height, setHeight] = useState(480)
  const [width, setWidth] = useState(640)
  const inputRef = useRef(null);
  const [aiGeneratedEssay,setAiGeneratedEssay] =useState('')
  const triggerAI = async () => {
    console.log("AI button clicked");
    console.log("valueData type:", typeof valueData, "value:", valueData);
    setShowModal(true);
    try {
      console.log("Sending data to FastAPI:", valueData);
      const response = await axios.post("http://127.0.0.1:8000/api/receive", { value: valueData });
      const aiGeneratedText = response.data.message;
      console.log("AI response:", aiGeneratedText);
      setAiResponse(aiGeneratedText);
      if (aiGeneratedText) {
        setHistoryPage(true);
        setHistory({ valueData, aiGeneratedText });
      }
      if (editor) {
        editor.chain().focus().deleteSelection().insertContent(aiGeneratedText).run();
        setShowModal(false);
      }
    } catch (error) {
      console.error("Axios error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      });
      setShowModal(false);
    }
  };



   const triggerAgent = async () => {
    console.log("Agent button clicked");
    console.log("valueData type:", aiQuery.current.value);
    try {
      console.log("Sending data to FastAPI:", aiQuery.current.value);
      const response = await axios.post("http://127.0.0.1:8000/api/command", { value: aiQuery.current.value });
      const aiGeneratedText = response.data.message;
      console.log("AI agent response:", aiGeneratedText);
      if (aiGeneratedText) {
        setHistoryPage(true);
        setHistory({ valueData, aiGeneratedText });
      }
      if (editor) {
        editor.chain().focus().deleteSelection().insertContent(aiGeneratedText).run();
        setShowModal(false);
      }
    }
    catch (error) {
      console.error("Axios error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      });
    }
  };




const putUrl = () => {
  if (inputRef.current) {
    const url = inputRef.current.value.trim();
    if (!url) {
      alert("Please enter a valid YouTube URL.");
      return;
    }

    const widthVal = Math.max(320, parseInt(width, 10)) || 640;
    const heightVal = Math.max(180, parseInt(height, 10)) || 480;

    // Insert YouTube video into editor
    editor.commands.setYoutubeVideo({
      src: url,
      width: widthVal,
      height: heightVal,
    });

    inputRef.current.value = ""; // optional: clear after insert
  } else {
    console.warn("Input ref not available");
  }
};



  const handleBulletList = () => {
    console.log("Bullet list button clicked");
    console.log("Editor active bulletList:", editor.isActive("bulletList"));
    editor.chain().focus().toggleBulletList().run();
    console.log("After toggle, bulletList active:", editor.isActive("bulletList"));
  };

  return (
    <div className="control-group">
      <div className="button-group mb-2">
        <ToggleGroup type="single">
          {/* AI Button */}
          <ToggleGroupItem value="ai" onClick={triggerAI}>
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="inline-flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-100 p-2 rounded">
                  <BsStars/>
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">AI</h4>
                  <p className="text-sm">Redefine your sentence with AI assistance.</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </ToggleGroupItem>





       <div className="inline-flex items-center justify-center">
  <HoverCard>
    <HoverCardTrigger asChild>
      <Dialog>
        <DialogTrigger asChild>
          <button className="inline-flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-100 p-2 rounded">
            <VscRobot size={20}/>
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='mb-5' >AI Agent</DialogTitle>
            <DialogDescription>
              <Textarea className='mt-5' ref={aiQuery} placeholder="Type your message here." />
              <Button className='mt-10'  onClick={triggerAgent}>Click for help</Button>
            </DialogDescription>
          </DialogHeader>
          {/* Add your form content here */}
        </DialogContent>
      </Dialog>
    </HoverCardTrigger>
    <HoverCardContent className="w-80">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold">Agent</h4>
        <p className="text-sm">An AI agent that performs your task</p>
      </div>
    </HoverCardContent>
  </HoverCard>
</div>

          {/* Image Upload Button */}
          <ToggleGroupItem value="image">
            <CldUploadWidget
              uploadPreset="jensen"
              onSuccess={(result) => {
                if (result.event === "success") {
                  console.log("Image uploaded successfully");
                  const url = `https://res.cloudinary.com/dfxzsq5zj/image/upload/${result.info.public_id}.jpg`;
                  setPublicId(result.info.public_id);
                  if (editor) {
                    console.log("Editor is ready, inserting image...");
                    editor.chain().focus().setImage({ src: url }).run();
                  } else {
                    console.log("Editor not ready, queuing image...");
                    setPendingImageUrl(url);
                  }
                } else {
                  console.warn("Upload failed or result.event is not 'success'.");
                }
              }}
            >
              {({ open }) => (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <span
                      onClick={() => open()}
                      className="inline-flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-100 p-2 rounded"
                    >
                      <RiImageCircleAiLine size={25} />
                    </span>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">Upload Image</h4>
                      <p className="text-sm">Upload an image to insert into the editor.</p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}
            </CldUploadWidget>
          </ToggleGroupItem>




          {/* Code Block */}
          <ToggleGroupItem
            value="code"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive("codeBlock") ? "is-active" : ""}
          >
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="inline-flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-100 p-2 rounded">
                  <CgCodeSlash size={25} />
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Code</h4>
                  <p className="text-sm">Format text as a code block.</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </ToggleGroupItem>




          {/**yt */}
     <ToggleGroupItem value="code" asChild>
  <HoverCard>
    <HoverCardTrigger asChild>
      <div className="inline-flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-100 p-2 rounded">
       <Dialog>
    <DialogTrigger asChild>
      <span>
        <FaYoutube size={20} />
      </span>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Put that YouTube URL</DialogTitle>
        <DialogDescription>
          Upload the URL below to put the YouTube video on our platform
        </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="url" className="text-right">
          URL
        </Label>
        <Input id="url" className="col-span-3" ref={inputRef} />
      </div>
      <DialogFooter>
        <Button type="submit" onClick={putUrl}>Put the URL</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
      </div>
    </HoverCardTrigger>
    <HoverCardContent className="w-80">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold">YouTube</h4>
        <p className="text-sm">Put URL to access YouTube video</p>
      </div>
    </HoverCardContent>
  </HoverCard>
</ToggleGroupItem>






          {/* Table */}
          <ToggleGroupItem
            value="table"
           onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
            }
            className={editor.isActive("table") ? "is-active" : ""}
          >
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="inline-flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-100 p-2 rounded">
                  <TbTable size={25} />
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Table</h4>
                  <p className="text-sm">Insert a table into the editor.</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </ToggleGroupItem>
                 


             <ToggleGroupItem
            value="table"
          onClick={() => editor.chain().focus().deleteTable().run()}
            className={editor.isActive("table") ? "is-active" : ""}
          >
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="inline-flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-100 p-2 rounded">
                  <PiEmptyThin size={25} />
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Table</h4>
                  <p className="text-sm">Insert a table into the editor.</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </ToggleGroupItem>


             <ToggleGroupItem
            value="table"
             
 onClick={() => editor.chain().focus().addColumnAfter().run()}
          >
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="inline-flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-100 p-2 rounded">
                  <GiEmptyChessboard size={25} />
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Table</h4>
                  <p className="text-sm">Insert a table into the editor.</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </ToggleGroupItem>



          {/* Bullet List */}
          <ToggleGroupItem
            value="bulletList"
            onClick={handleBulletList}
            className={editor.isActive("bulletList") ? "is-active" : ""}
          >
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="inline-flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-100 p-2 rounded">
                  <LuList size={25} />
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Bullet List</h4>
                  <p className="text-sm">Format text as a bullet list.</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </ToggleGroupItem>

<Select
  onValueChange={(value) => {
    const level = parseInt(value);
    editor.chain().focus().toggleHeading({ level }).run();
  }}
>
  <SelectTrigger className="w-[120px]">
    <SelectValue placeholder="Headings" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">
      <div className="flex items-center gap-2">
        <HiH1 size={20} />
        Heading 1
      </div>
    </SelectItem>
    <SelectItem value="2">
      <div className="flex items-center gap-2">
        <HiH2 size={20} />
        Heading 2
      </div>
    </SelectItem>
    <SelectItem value="3">
      <div className="flex items-center gap-2">
        <HiH3 size={20} />
        Heading 3
      </div>
    </SelectItem>
  </SelectContent>
</Select>
          {/* Italic */}
          <ToggleGroupItem
            value="italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
          >
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="inline-flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-100 p-2 rounded">
                  <GoItalic />
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Italic</h4>
                  <p className="text-sm">Make your text italic.</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default MenuBar;




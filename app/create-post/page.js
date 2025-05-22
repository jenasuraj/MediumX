"use client";
import { useMemo, useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import { all } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { useSession } from "next-auth/react";
import axios from "axios";
import Navbar from "@/ui/Navbar";
import MenuBar from "@/ui/MenuBar";
import CloudImgUpload from "@/ui/CloudImgUpload";
import FinalUserInfoModal from "@/ui/FinalUserInfoModal";
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import "../globals.css";
import Youtube from '@tiptap/extension-youtube'
import { useSearchParams } from "next/navigation";



const Tiptap = () => {
  const lowlight = useMemo(() => {
    const instance = createLowlight(all);
    instance.register("html", html);
    instance.register("css", css);
    instance.register("js", js);
    instance.register("ts", ts);
    return instance;
  }, []);

  const [publicId, setPublicId] = useState("");
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, visible: false });
  const [iconPosition, setIconPosition] = useState({ top: 0, left: 0, visible: false });
  const [showModal, setShowModal] = useState(false);
  const [valueData, setValueData] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [history, setHistory] = useState({});
  const [historyPage, setHistoryPage] = useState(false);
  const [pendingImageUrl, setPendingImageUrl] = useState(null);
  const [u_id, setU_id] = useState("");
  const heading = useRef(null);
  const bio = useRef(null);
  const [update,setUpdate] =useState(false)
  const { data: session } = useSession();

  const searchParams = useSearchParams();


  const content = searchParams.get("content");
  


  console.log("in destination the content is",content)


  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/profile?email=${session.user.email}`);
        setU_id(response.data[0]?.user_id || "");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, [session?.user?.email]);






  const editor = useEditor({
    extensions: [
      Youtube.configure({
  inline: false,
  width: 480,
  height: 320,
   controls: false,
   nocookie: true,
   allowFullscreen: false,
   autoplay: true,
    ccLanguage: 'es',
      ccLoadPolicy: true,
       disableKBcontrols: true,
        enableIFrameApi: true,
         origin: 'yourdomain.com',
         endTime: '15',
          interfaceLanguage: 'fr',
            ivLoadPolicy: '3',
            loop: true,
              playlist: 'VIDEO_ID_1,VIDEO_ID_2,VIDEO_ID_3,...,VIDEO_ID_N',
                modestBranding: true,
                 progressBarColor: 'white',
}),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'my-table-class',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-6",
          },
        },
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: "heading",
          },
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: { class: "my-custom-class" },
        languageClassPrefix: "language-js",
        defaultLanguage: "js",
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "my-img-class",
          style:
            "width: 80%; height: auto; display: block; object-fit: contain; margin-left: auto; margin-right: auto;",
        },
      }),
    ],
   
    editorProps: {
      attributes: {
        class:
          "w-1/2 min-h-[70vh] border rounded-md bg-slate-50 py-2 px-2 relative mr-10 focus:outline-none text-gray-800",
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      console.log("Editor content:", editor.getHTML());
      console.log("Is bulletList active:", editor.isActive("bulletList"));
      console.log("Is heading active:", editor.isActive("heading"));
      console.log("Is table active:", editor.isActive("table"));
    },
  });





  
useEffect(() => {
  if (editor && content) {
    editor.commands.setContent(content);
    setUpdate(true)
  }
}, [editor, content]);



  useEffect(() => {
    if (editor && pendingImageUrl) {
      editor.chain().focus().setImage({ src: pendingImageUrl }).run();
      setPendingImageUrl(null);
    }
  }, [editor, pendingImageUrl]);



  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = ({ editor }) => {
      const { from } = editor.state.selection;
      const resolvedPos = editor.state.doc.resolve(from);
      const currentNode = resolvedPos.parent;
      const isEmptyParagraph = currentNode.type.name === "paragraph" && currentNode.content.size === 0;

      if (isEmptyParagraph) {
        const domNode = editor.view.domAtPos(from).node;
        let targetNode = domNode;

        if (domNode.nodeType !== Node.ELEMENT_NODE || domNode.tagName !== "P") {
          targetNode = domNode.closest("p");
        }

        if (targetNode) {
          const rect = targetNode.getBoundingClientRect();
          setIconPosition({
            top: rect.top + window.scrollY - 5,
            left: rect.left + window.scrollX,
            visible: true,
          });
        }
      } else {
        setIconPosition({ top: 0, left: 0, visible: false });
      }
    };

    editor.on("selectionUpdate", handleSelectionUpdate);
    editor.on("update", handleSelectionUpdate);

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
      editor.off("update", handleSelectionUpdate);
    };
  }, [editor]);



  useEffect(() => {
    const handleSelection = (event) => {
      if (event.target.closest(".control-group")) {
        return;
      }

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const selectedText = selection.toString().trim();
        if (selectedText.length > 0) {
          setValueData(selectedText);
          setMenuPosition({
            top: rect.top + window.scrollY - 50,
            left: rect.left + window.scrollX,
            visible: true,
          });
        } else {
          setMenuPosition({ top: 0, left: 0, visible: false });
        }
      }
    };

    document.addEventListener("mouseup", handleSelection);
    return () => document.removeEventListener("mouseup", handleSelection);
  }, []);

  const handleShowMenuBar = (top, left) => {
    setMenuPosition({ top, left, visible: true });
  };




  

  return (
    <>
      <style jsx global>{`
        .list-disc {
          list-style-type: disc !important;
        }
        .pl-6 {
          padding-left: 1.5rem !important;
        }
        .prose ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
        }
        .heading {
          margin: 0.5rem 0;
        }
      `}</style>
      <Navbar />
      <div className="min-h-screen w-full flex items-center justify-center px-4 mt-10 relative flex-col">
        {menuPosition.visible && (
          <div
            className="absolute bg-white shadow-lg rounded-md p-2 z-50"
            style={{ position: "absolute", top: menuPosition.top, left: menuPosition.left }}
          >
            <MenuBar
              editor={editor}
              setShowModal={setShowModal}
              setAiResponse={setAiResponse}
              valueData={valueData}
              setHistoryPage={setHistoryPage}
              setHistory={setHistory}
              setPublicId={setPublicId}
              setPendingImageUrl={setPendingImageUrl}
            />
          </div>
        )}

        <CloudImgUpload
          editor={editor}
          iconPosition={iconPosition}
          onShowMenuBar={handleShowMenuBar}
        />

        {editor ? (
          <EditorContent
            editor={editor}
            className="h-auto flex justify-center items-center w-full relative z-10"
          />
        ) : (
          <div className="w-1/2 min-h-[90vh] border rounded-md bg-slate-50 py-2 px-2 relative mr-10 flex items-center justify-center">
            <div className="animate-pulse">Loading editor...</div>
          </div>
        )}

        <FinalUserInfoModal heading={heading} bio={bio} editor={editor} u_id={u_id} setUpdate={setUpdate} update={update}/>
      </div>
    </>
  );
};

export default Tiptap;
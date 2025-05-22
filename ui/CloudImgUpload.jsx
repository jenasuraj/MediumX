import React from "react";
import { RiImageCircleAiLine } from "react-icons/ri";

const CloudImgUpload = ({ editor, iconPosition, onShowMenuBar }) => {
  const handleShowMenuBar = (e) => {
    const rect = e.target.getBoundingClientRect();
    const top = rect.top + window.scrollY - 50; // Position MenuBar above the icon
    const left = rect.left + window.scrollX;
    onShowMenuBar(top, left);
    if (editor) {
      editor.chain().focus().run();
    }
  };

  return (
    <>
      {iconPosition.visible && editor && (
        <div
          className="absolute z-50"
          style={{ position: "absolute", top: iconPosition.top - 110, left: iconPosition.left }}
        >
          <span className="text-gray-600 text-lg cursor-pointer opacity-40 flex">
            <RiImageCircleAiLine size={25} />
            <p className="text-black" onClick={handleShowMenuBar}>
              Click to get extra help
            </p>
          </span>
        </div>
      )}
    </>
  );
};

export default CloudImgUpload;
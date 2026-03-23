
import { PROGRESS_INCREMENT, PROGRESS_INTERVAL_MS, REDIRECT_DELAY_MS } from 'lib/constants';
import { CheckCircle2, ImageIcon, UploadIcon } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useOutletContext } from 'react-router';
import type { AuthContext } from 'type';

interface UploadProps{
    onComplete?: (base64Data: string) =>void
}
const Upload =  ({onComplete} : UploadProps) =>{
    const [file, setFile]= useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    // check if login or not
    const  {isSignedIn} = useOutletContext< AuthContext >();
    useEffect(()=>{
        return ()=>{
            if(intervalRef.current){
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
             if(timeoutRef.current){
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null
        }
        }
       

    }, []);
    
    const processFile = useCallback((file: File) => {
        if (!isSignedIn) return;

        setFile(file);
        setProgress(0);

        const reader = new FileReader();
        reader.onerror =()=>{
            setFile(null);
            setProgress(0)
        }
        reader.onloadend = () =>{
            const base64Data = reader.result as string

            intervalRef.current = setInterval(()=>{
                setProgress((prev) =>{
                    const next = prev + PROGRESS_INCREMENT;
                    if(next>= 100){
                        if(intervalRef.current){
                            clearInterval(intervalRef.current);
                            intervalRef.current = null;
                        }
                        timeoutRef.current = setTimeout(()=>{
                            onComplete?.(base64Data);
                            timeoutRef.current = null;
                        }, REDIRECT_DELAY_MS);
                        return 100;
                    } 
                    return next;
                })
            }, PROGRESS_INTERVAL_MS);
        }
        reader.readAsDataURL(file);
    }, [isSignedIn, onComplete]);

    const handleDragOver = (e: React.DragEvent)=>{
        e.preventDefault();
        if (!isSignedIn)return;
        setIsDragging(true);
    };
    const handleDragLeave = () =>{
        setIsDragging(false)
    };
    const handleDrop = (e: React.DragEvent) =>{
        e.preventDefault();
        setIsDragging(false);

        if (!isSignedIn) return;

        const droppedFile = e.dataTransfer.files[0];
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if(droppedFile && allowedTypes.includes(droppedFile.type)){
            processFile(droppedFile);
        }
    };
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        if (!isSignedIn) return;

        const selectedFile = e.target.files?.[0];
        if (selectedFile){
            processFile(selectedFile);
        }
    };

  return (
    <div className='upload'>
        {!file ? (
            <div className={`dropzone ${isDragging ? 'is-Dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            >
                <input type="file" className='drop-input' accept='.jpg, .jpeg, .png'
                disabled = {!isSignedIn}   onChange={handleChange}/>
                <div className='drop-content'> 
                    <div className='drop-icon'>
                        <UploadIcon size={20}/>
                    </div>
                    <p>
                        {isSignedIn ? (
                            "Cick to upload or just drag"
                        ): ("Sign up with puter to upload")}
                    </p>
                    <p className='help'>Maximun file size 10MB</p>
                </div>
            </div>
        ) :(
            <div className='upload-status'>
                <div className='status-content'>
                    <div className='status-icon'>
                        {progress === 100 ? (
                            <CheckCircle2 className='check'/>
                        ): 
                        (
                        <ImageIcon className='image'/>
                        )}

                    </div>
                        <h3>{file .name}</h3>
                        <div className='progress'>
                            <div className='bar' style={{width: `${progress}%`}}/>

                            <p className='status-text'>
                                {progress < 100? 'Analyxing floor plan' : 'Redirecting...'}
                            </p>
                            

                        </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default Upload
























// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { useOutletContext } from "react-router";
// import { CheckCircle2, ImageIcon, UploadIcon } from "lucide-react";

// import {
//   PROGRESS_INCREMENT,
//   PROGRESS_INTERVAL_MS,
//   REDIRECT_DELAY_MS,
// } from "lib/constants";

// import type { AuthContext } from "type";

// interface UploadProps {
//   onComplete?: (base64Data: string) => void;
// }

// const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// const Upload = ({ onComplete }: UploadProps) => {
//   const [file, setFile] = useState<File | null>(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [progress, setProgress] = useState(0);

//   // ✅ Browser-safe timer types
//   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const { isSignedIn } = useOutletContext<AuthContext>();

//   /* ---------------- CLEANUP ---------------- */
//   useEffect(() => {
//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//       if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     };
//   }, []);

//   /* ---------------- FILE PROCESS ---------------- */
//   const processFile = useCallback(
//     (selectedFile: File) => {
//       if (!isSignedIn) return;

//       // ✅ file type validation
//       const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
//       if (!allowedTypes.includes(selectedFile.type)) return;

//       // ✅ file size validation
//       if (selectedFile.size > MAX_FILE_SIZE) {
//         alert("File size must be under 10MB");
//         return;
//       }

//       // ✅ clear old timers
//       if (intervalRef.current) clearInterval(intervalRef.current);
//       if (timeoutRef.current) clearTimeout(timeoutRef.current);

//       setFile(selectedFile);
//       setProgress(0);

//       const reader = new FileReader();

//       reader.onerror = () => {
//         setFile(null);
//         setProgress(0);
//       };

//       reader.onloadend = () => {
//         const base64Data = reader.result as string;

//         intervalRef.current = setInterval(() => {
//           setProgress((prev) => {
//             const next = prev + PROGRESS_INCREMENT;

//             if (next >= 100) {
//               if (intervalRef.current) {
//                 clearInterval(intervalRef.current);
//                 intervalRef.current = null;
//               }

//               timeoutRef.current = setTimeout(() => {
//                 onComplete?.(base64Data);
//               }, REDIRECT_DELAY_MS);

//               return 100;
//             }

//             return next;
//           });
//         }, PROGRESS_INTERVAL_MS);
//       };

//       reader.readAsDataURL(selectedFile);
//     },
//     [isSignedIn, onComplete]
//   );

//   /* ---------------- DRAG EVENTS ---------------- */
//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     if (!isSignedIn) return;
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);

//     if (!isSignedIn) return;

//     const droppedFile = e.dataTransfer.files[0];
//     if (droppedFile) processFile(droppedFile);
//   };

//   /* ---------------- INPUT CHANGE ---------------- */
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!isSignedIn) return;

//     const selectedFile = e.target.files?.[0];
//     if (selectedFile) processFile(selectedFile);
//   };

//   /* ---------------- UI ---------------- */
//   return (
//     <div className="upload">
//       {!file ? (
//         <div
//           className={`dropzone ${isDragging ? "is-dragging" : ""}`}
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onDrop={handleDrop}
//         >
//           <input
//             type="file"
//             className="drop-input"
//             accept=".jpg,.jpeg,.png"
//             disabled={!isSignedIn}
//             onChange={handleChange}
//           />

//           <div className="drop-content">
//             <div className="drop-icon">
//               <UploadIcon size={20} />
//             </div>

//             <p>
//               {isSignedIn
//                 ? "Click to upload or drag an image"
//                 : "Sign in to upload"}
//             </p>

//             <p className="help">Maximum file size 10MB</p>
//           </div>
//         </div>
//       ) : (
//         <div className="upload-status">
//           <div className="status-content">
//             <div className="status-icon">
//               {progress === 100 ? (
//                 <CheckCircle2 className="check" />
//               ) : (
//                 <ImageIcon className="image" />
//               )}
//             </div>

//             <h3>{file.name}</h3>

//             <div className="progress">
//               <div
//                 className="bar"
//                 style={{ width: `${progress}%` }}
//               />

//               <p className="status-text">
//                 {progress < 100
//                   ? "Analyzing floor plan..."
//                   : "Redirecting..."}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Upload;
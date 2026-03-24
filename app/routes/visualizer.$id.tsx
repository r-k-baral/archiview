import { generate3DView } from "lib/ai.action";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router"
import { House,X, Download, Share2, RefreshCcw} from 'lucide-react';
import Button from "components/ui/Button";

const visualizerId = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { initialImage, initialRender, name} = location.state || {};
  const hasInitialGenerated = useRef(false)
  const [isProccesing, setisProccesing ] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null >(initialRender || null)
  const handleback = () => navigate('/')
  const runGeneration = async () =>{
    if(!initialImage) return;
    try{
      setisProccesing(true);
      const  result = await generate3DView({sourceImage: initialImage})
      if(result.renderedImage){
        setCurrentImage(result.renderedImage);
        // update image in db 
      }
    } catch(error){
      console.error('Generation failed' , error)
    } finally {
      setisProccesing(false);
    }
  }

  useEffect(()=>{
    if(!initialImage || hasInitialGenerated.current) return
    if(initialRender){
      setCurrentImage(initialImage);
      hasInitialGenerated.current = true;
      return;
    }
    hasInitialGenerated.current = true;
    runGeneration();
  },[initialImage, initialRender])
  return (
   


    // 2:03;42 ya fir sa banaam ha
      <div className="visualizer">
        <nav className="topbar">
        <div className="brand">
          <House className='logo'/>
              <span className='name'>
                Archiview
              </span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleback} className="exit">
          <X className="icon"/> Exit Editor
        </Button>
        </nav>
       
   
        <section className="content">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-meta">
                <p>Project</p>
                <h2>{'Untitled'}</h2>
                  <p className="note">Created by You</p>
              </div>
                <div className="panel-actions">
                  <Button
                  size="sm"
                  onClick={()=>{}}
                  className="export"
                  disabled={!currentImage}
                  >
                    <Download className="w-4 h-4 mr-2"/> Export
                  </Button>
                   <Button
                  size="sm"
                  onClick={()=>{}}
                  className="share"
                  disabled={!currentImage}
                  >
                    <Share2 className="w-4 h-4 mr-2"/> share 
                  </Button>

                </div>
            </div>
            <div className={`render-area  ${isProccesing ? 'is-processing': '' }`} >
              {currentImage ? (
                <img src={currentImage} alt= "AI Render" className="render-img"/>
              ):(
                <div className="render-placeholder">
                  {initialImage && (
                    <img src = {initialImage} alt='Original' className="render-fallback" />
                  )}
                </div>
              )}

              {isProccesing && (
                <div className="render-overlay">

                  <div className="rendering-card">
                    <RefreshCcw className="spinner" />
                    <span className="title">Rendering...</span>
                    <span className="subtitle">Generating Your plan...</span>
                  </div>

                </div>
              )}
            </div>

          </div>

        </section>

    
     
      </div>
  
  )
}

export default visualizerId

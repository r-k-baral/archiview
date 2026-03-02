import Navbar from "components/Navbar";
import type { Route } from "./+types/home";
import { ArrowRight, ArrowUpFromLine, ArrowUpRight, Clock, Layers } from "lucide-react";
import  Button  from "../../components/ui/Button";
import Upload from "../../components/Upload";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const handleUploadComplete = async (base64Image: string)=>{
    const newID =Date.now().toString()

    navigate(`/visualizer/${newID}`)
    return true;

  }


  
  return (
  <div className="home">
    <Navbar/>
  <section className="hero">
    <div className="announce">
      <div className="dot">
        <div className="pulse"></div>

      </div>
    <p>Intrudecing archiview</p>      
    </div>
    <h1>Built that Moves at the Speed of Vision Beautiful Spaces. Intelligent Design. </h1>
    <p className="subtitle">The Future of Architecture is IntelligentCreating Living Spaces Powered by AI Architecture Reimagined Through AI Innovation</p>

    <div className="actions">
    <a href="#upload" className="cta">
      start building <ArrowRight className="icon" />
    </a>
    
    <Button variant="outline" size="lg" className="demo">
    Watch Demo
    </Button>
    </div>
    <div id="upload" className="upload-shell">
      <div className="grid-overlay"/>

      <div className="upload-card">
        <div className="upload-head">
            <div className="upload-icon">
              <ArrowUpFromLine className="icon" />

            </div>
            <h3>Upload your plan</h3>
            <p>Support JGP, PNG,  formats up to 10MB </p>
        </div>
        <Upload onComplete={handleUploadComplete}/>
      </div>
    </div>
  </section>

  <section  className="projects">
    <div className="section-inner">
      <div className="section-head">
        <div className="copy">
          <h2>Project</h2>
          <p>your latest work shared of pepole</p>
        </div>

      </div>
      <div className="projects-grid">
        <div className="project-card group">
          <div className="preview">
            <img src="https://wpmedia.roomsketcher.com/content/uploads/2021/12/24152947/cutecore-apartment-2d-and-3d-floor-plan.jpg" alt="project" />
            <div className="badge">
              <span>Community</span>
            </div>

          </div>
        <div className="card-body">
          <div>
            <h3>Project Home</h3>
            <div className="meta">
              <Clock size={12}/>
              <span>{new Date('01.15.2026').toLocaleDateString()}</span>
              <span>By gopi</span>
            </div>
          </div>
          <div className="arrow">
            <ArrowUpRight size={18}/>
          </div>
        </div>
        </div>
      </div>


    </div>

  </section>
    </div>
  )
}

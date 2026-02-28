import { House } from 'lucide-react';
import React, { cache } from 'react'
import Button  from "./ui/Button"
import { useOutletContext } from 'react-router';

const Navbar = () =>{
    const {isSignedIn, userName, signIn, signOut}= useOutletContext<AuthContext>()
    const handleAuthClick = async () =>{
        if(isSignedIn){
            try{
                await signOut();
            }
            catch(e){
                console.error(`puter sign out failed: ${e}`);
            }
            return;
        }
        try{
            await signIn();
        }
        catch(e){
            console.error(`puter sign out fail ${e}`)
        }
    }; // for auth
return(
    <div>
        <header className='navbar'>
            <nav className='inner'>
                <div className='left'>
                    <div className='brand'>
                        <House className='logo'/>
                        <span className='name'>
                            archiview
                        </span>
                    </div>
                    <ul className='links'>
                        <a href="#">Product</a>
                        <a href="#">Prceing</a>
                        <a href="#">comunity</a>
                        <a href="#">enterprise</a>
                    </ul>
                </div>
                <div className='actions'>
                    {isSignedIn ? (
                        <> 
                        <span className='greeting'>
                            {userName ? `Hi, ${userName}`: 'gopi'}

                        </span>
                        
                        <Button  onClick={handleAuthClick}  className='btn' > 
                            log out
                        </Button>
                         </>
                    ):(
                        <>
                         <Button  onClick={handleAuthClick} size='sm' variant="ghost"> 
                          Log In
                         </Button>
                    <a href="#" className='cta'> Get Started</a>

                    </>
                    )}
                   
                    

                </div>
            </nav>
        </header>
    </div>
)
}

export default Navbar

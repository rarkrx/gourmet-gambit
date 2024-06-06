import React, { useEffect,useState } from "react";
import { Button, Container} from "react-bootstrap";
import {useNavigate} from "react-router-dom"
import { auth, db } from "../firebase";
import Navigation  from "../components/Navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs } from "firebase/firestore";

export default function RandomizePage() {

  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState("");
  const navigate = useNavigate();
  const [user,loading ]= useAuthState(auth)

  

  useEffect(() => {
    setTitle("Click the button below to pick a random restaurant!")
  }, []);
  useEffect(() => {
    
  }, [title]);

  var bottom = {
    postion:"fixed",
    bottom:"0",
    right:"0"
  }
  async function getData(){
    var adata = [];
    var id = []
    const querySnapshot = await getDocs(collection(db, "restaurants"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      //console.log(doc.id, " => ", doc.data());
      adata.push(doc.data())
      id.push(doc.id)
    });
    return {adata,id}
  }

  const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

 async function roll(){
  const {adata,id} = await getData();
  console.log(adata)
  var chosen 
  for(let i = 15;i>0;i--){
    chosen = Math.floor(Math.random() * adata.length);
    setTitle(adata[chosen].name)
    if (i>5){
      await delay(100)
    }
    
    else{
      await delay(200)
    }
    if(i===1){
      await delay(1000)
      await navigate(`posts/${id[chosen]}`)
    }
  console.log(id[chosen])
  
}
}
  if (!user){
    return(
      <>
        <Navigation/>
        <Container className ="h-100 d-flex align-items-center justify-content-center flex-column">
          <h1 className="my-3 text-center">{title}</h1>
          <Container className="d-flex align-items-center justify-content-center flex-row">
            <Button className="m-5"
              onClick={()=>{roll()}}
              >Click me!</Button>
            <Button className="m-5" href="add"
            >Have a restuarnt to recommend?</Button>
          </Container>
          <p>{error}</p>
          
      </Container>
      </>
    )
  }else{
    return(
      <>
        <Navigation/>
        <Container className ="h-100 d-flex align-items-center justify-content-center flex-column">
          <h1 className="my-3 text-center">{title}</h1>
          <Container className="d-flex align-items-center justify-content-center flex-row">
          <Button className="m-5"
              onClick={()=>{roll()}}
              >Click me!</Button>
            <Button className="m-5" href="add"
            >Have a restaurant to recommend?</Button>
          </Container>
          <Button className="m-5" href="allrest"
            >View all restaurants</Button>
          <p>{error}</p>
          
      </Container>
      <Button style={bottom}
          >helol</Button>
      </>
    )
  }

}
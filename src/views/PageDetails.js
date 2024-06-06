import React, { useEffect, useState } from "react";
import { Card, Col, Container, Image, Row,Button } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase";

import { deleteDoc, doc, getDoc,addDoc,collection,setDoc } from "firebase/firestore"; 
import Navigation from "../components/Navigation";

export default function PageDetails() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("")
  const params = useParams();
  const id = params.id;
  const [user,loading ]= useAuthState(auth)
  const navigate = useNavigate()

  const [favourites,setFavourites] = useState("")

  async function getFavs() {
    const postDocument = await getDoc(doc(db,"userfav",user.uid));
    const post = postDocument.data()
    return post.restid
  }
  async function setFavs(favs){
    await setDoc(doc(db,"userfav", user.uid), {restid:favs})
  }

  async function favButton() {
    if (favourites==="Add to Favourites"){
      setFavourites("Remove from Favourites")
      var favs = await getFavs()
      console.log(favs)
      favs.push(id) 
      console.log(favs)
      setFavs(favs)
    }
    else {
      setFavourites("Add to Favourites")
      var favs = await getFavs()
      const index = favs.indexOf(id);
      if (index > -1) { // only splice array when item is found
        favs.splice(index, 1); // 2nd parameter means remove one item only
      }
      setFavs(favs)
    }
  }

  async function deletePost(id) {
    await deleteDoc(doc(db,"restaurants",id));
    navigate("/")
  }

  async function getPost(id) {
    const postDocument = await getDoc(doc(db,"restaurants",id));
    const post = postDocument.data()
    setName(post.name);
    setImage(post.image);
    setDescription(post.description)
    if (user){
      var favs = await getFavs()
      const index = favs.indexOf(id);
      if (index > -1) { 
        setFavourites("Remove from Favourites")
      }
      else{
        setFavourites("Add to Favourites")
      }
    }
  }

  useEffect(() => {
    if (loading) return;  
    getPost(id)
  }, [id,loading]);

  return (
    <>
      <Navigation/>
      <Container>
        <Row style={{ marginTop: "2rem" }}>
          <Col md="6">
            <Image src={image} style={{ width: "100%" }} />
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <h1><Card.Text>{name}</Card.Text></h1>
                <Card.Text>{description}</Card.Text>
                <Card.Link href={`/update/${id}`}
                onClick={() => getPost()}
                >Edit</Card.Link>
                <Card.Link
                  onClick={() => deletePost(id)}
                  style={{ cursor: "pointer" }}
                >
                  Delete
                </Card.Link>
              </Card.Body>
              <Button onClick={() => {favButton()}}>{favourites}</Button>
            </Card>
          </Col>
          
        </Row>
        
      </Container>
    </>
  );
}

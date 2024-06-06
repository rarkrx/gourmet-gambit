import { useEffect, useState } from "react";
import { Container, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import {collection, getDocs,doc} from "firebase/firestore"
import { auth, db } from"../firebase"
import Navigation from "../components/Navigation";
import { useAuthState } from "react-firebase-hooks/auth";

export default function PageAllRest() {
  const [posts, setPosts] = useState([]);
  const [user,loading ]= useAuthState(auth)

  async function getAllPosts(){
    const query = await getDocs(collection(db,"restaurants"));
    const posts = query.docs.map((doc)=> {
      return {id: doc.id, ...doc.data()}
    });
    console.log(posts)
    setPosts(posts);
  }


  useEffect(() => {
    if (loading) return; 
    getAllPosts();
  }, [loading]);

  const ImagesRow = () => {
    //console.log(posts)
    return posts.map((post, index) => <ImageSquare key={index} post={post} />);
  
    //
  };

  return (
    <>
      <Navigation/>
      <Container>
        <Row>
          <ImagesRow />
        </Row>
      </Container>
    </>
  );
}

function ImageSquare({ post }) {
  const { image, id } = post;
  //console.log(image)
  return (
    <Link
      to={`../posts/${id}`}
      style={{
        width: "18rem",
        marginLeft: "1rem",
        marginTop: "2rem",
      }}
    >
      <Image
        src={image}
        style={{
          objectFit: "cover",
          width: "18rem",
          height: "18rem",
        }}
      />
    </Link>
  );
}

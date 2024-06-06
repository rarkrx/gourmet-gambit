import { Container,Nav,Navbar } from "react-bootstrap";
import {auth} from "../firebase"
import {signOut} from "firebase/auth"
import { useAuthState } from "react-firebase-hooks/auth";
import {useEffect} from "react"
import { useNavigate } from "react-router-dom";

export default function Navigation(){

    const [user,loading ]= useAuthState(auth)
    const navigate = useNavigate()


    if (!user){
        return (
            <>
                <Navbar variant="light" bg="light">
                <Container>
                <Navbar.Brand href="/">Gourmet Gambit</Navbar.Brand>
                <Nav>
                    <Nav.Link href="/login">Login</Nav.Link>
                </Nav>
                </Container>
                </Navbar>
            </>
        )
    }
    else {
        return (
            <>
                <Navbar variant="light" bg="light">
                <Container>
                <Navbar.Brand href="/">Gourmet Gambit</Navbar.Brand>
                <Nav>
                    <Nav.Link href="/favs">Manage Favourites</Nav.Link>
                    <Nav.Link href="/"
                    onClick={
                    (e) => signOut(auth)
                    }
                    >🚪</Nav.Link>
                </Nav>
                </Container>
                </Navbar>
            </>
        )
    }

}


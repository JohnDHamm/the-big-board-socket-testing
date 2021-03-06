import React from "react"
import logo from "./logo.svg"
import "./App.css"
import socketIOClient from "socket.io-client"
import axios from "axios"

const ROOT_URL = "http://localhost:4001"
const socket = socketIOClient(ROOT_URL)

const users = [
  {
    user: "User 1",
    league_id: "NashvilleVolleyball-1",
  },
  {
    user: "User 2",
    league_id: "NashvilleVolleyball-1",
  },
  {
    user: "User 3",
    league_id: "AnotherLeague",
  },
]

const SocketListener = ({children}) => {
  React.useEffect(() => {
    socket.on("JoinRoomWelcome", (msg) => console.log("msg", msg))
    socket.on("UpdateConnected", (data) =>
      console.log("update connected", data)
    )
    socket.on("PickMade", (pick) => console.log("pick made", pick))
    return () => socket.disconnect()
  }, [])

  return <div>{children}</div>
}

function App() {
  const [room, setRoom] = React.useState("")
  const joinRoom = (user) => {
    setRoom(user.league_id)
    socket.emit("JoinRoom", user.league_id)

    socket.on("StartCheckConnected", () =>
      socket.emit("ConfirmConnected", {
        user: user.user,
        socketRoom: user.league_id,
      })
    )
  }

  const testApi = (pick) => {
    console.log("testApi")
    axios
      .post(`${ROOT_URL}/API/make_pick`, {pick: pick, socketRoom: room})
      .then((res) => console.log("pick confirmation:", res.data))
  }

  return (
    <SocketListener>
      <div className="App">
        <header className="App-header">
          <button onClick={() => joinRoom(users[0])}>{users[0].user}</button>
          <button onClick={() => joinRoom(users[1])}>{users[1].user}</button>
          <button onClick={() => joinRoom(users[2])}>{users[2].user}</button>
          <img src={logo} className="App-logo" alt="logo" />
          <button onClick={() => testApi("JuJu")}>JuJu</button>
          <button onClick={() => testApi("A.J.")}>A.J.</button>
        </header>
      </div>
    </SocketListener>
  )
}

export default App

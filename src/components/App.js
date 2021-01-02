import Peer from 'peerjs'
import { useState, useCallback, useEffect } from 'react'
import nameGenerator from 'project-name-generator'
import Message from './Message'

let con

function App() {
  const [peer, setPeer] = useState()
  const [connected, setConnected] = useState(false)
  const [id, setId] = useState('')
  const [me, setMe] = useState('')
  const [body, setBody] = useState('')
  const [messages, setMessages] = useState([])
  useEffect(() => {
    const myId = nameGenerator({ words: 3, number: true}).dashed
    const peer = new Peer(myId)
    setPeer(peer)
    peer.on('connection', (conn) => {
      setId(conn.peer)
      conn.on('data', (body) => {
        const msg = {
          sender: conn.peer,
          body,
        }
        setMessages((msgs) => [...msgs, msg])
      })
      con = conn
      setConnected(true)
    })
    peer.on('open', () => {
      setMe(peer.id)
    })
  }, [])
  const handleChange = useCallback((event) => {
    const { value, name } = event.target
    if (name === 'id') {
      setId(value)
    } else if (name === 'msg') {
      setBody(value)
    }
  }, [])
  const handleKeyPress = useCallback((event) => {
    if (event.charCode === 13) {
      if (event.target.name === 'id') {
        con = peer.connect(id)
        con.on('data', (body) => {
          const msg = {
            sender: id,
            body,
          }
          setMessages((msgs) => [...msgs, msg])
        })
        setConnected(true)
      } else {
        con.send(body)
        setBody('')
        const msg = {
          sender: 'me',
          body,
        }
        setMessages((msgs) => [...msgs, msg])
      }
    }
  }, [id, peer, body, setBody])
  return (
    <div className="App">
      {connected
        ? (
          <h4>Connected!</h4>
        )
        : (
          <div className="connection">
            <h2>Me</h2>
            {me}
            <h2>Connection</h2>
            <input
              type="text"
              placeholder="Peer ID"
              name="id" 
              value={id} 
              onKeyPress={handleKeyPress} 
              onChange={handleChange} 
            />
          </div>
        )
      }
      <div className="messages">
        <h2>Messages</h2>
        {messages.map((msg, index) => 
          <Message key={index} {...msg} />
        )}
      </div>
      <input
        placeholder="Message"
        name="msg" type="text"
        value={body}
        onKeyPress={handleKeyPress}
        onChange={handleChange}
      />
    </div>
  )
}

export default App

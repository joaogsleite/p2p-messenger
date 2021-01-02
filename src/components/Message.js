export default function Message({ sender, body }) {
  return (
    <div className="message">
      <div className="sender">
        {sender}
      </div>
      <div className="body">
        {body}
      </div>
    </div>
  )
}
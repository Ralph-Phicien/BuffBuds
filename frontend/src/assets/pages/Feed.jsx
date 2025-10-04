import Header from "../components/Header";

const Feed = ({ username, setIsAuthed, setUsername }) => {
  return (
    <div>
      <Header
        username={username}
        setIsAuthed={setIsAuthed}
        setUsername={setUsername}
      />
      <h1 className="flex items-center justify-center">Feed Page</h1>
    </div>
  );
};

export default Feed;

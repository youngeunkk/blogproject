import { useState } from 'react';
import './App.css';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import CreateIcon from '@mui/icons-material/Create';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import {IconButton} from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function Navbar(props) {

  return (
    <div className="Navbar">
      <button type="button" id="blogtitle" onClick={(event) => {
        event.preventDefault();
        props.onChangeHomeMode();
      }}>Youngeun's Story</button>
    </div>
  )
}
function Header(props) {

  return (
    <div className="header">
      <IconButton onClick={(event) => {
        event.preventDefault();
        props.onChangeHomeMode();
      }}>
        <HomeIcon fontSize="large" sx={{ color: "white" }} />
      </IconButton>&nbsp;&nbsp;
      <IconButton onClick={(event) => {
        event.preventDefault();
        props.onChangeCreateMode();
      }}>
        <CreateIcon fontSize="large" sx={{ color: "white" }} />
      </IconButton>&nbsp;&nbsp;
      <IconButton onClick={(event) => {
        event.preventDefault();
        props.onChangeReadMode();
      }}>
        <MenuIcon fontSize="large" sx={{ color: "white" }} />
      </IconButton>
    </div>
  );
}

function Article(props) {

  return (
    props.lists === false ? <div className="listnull"><h1>글이 존재하지 않습니다❕</h1></div> :
      <div className='posts'>
        <div className='titlearea'>
          <h2>{props.title}</h2>
        </div>
          <p>{props.body}</p>
      </div>
  );
}

function Read(props) {

  const lis = [];
  for (let i = 0; i < props.topics.length; i++) {
    let t = props.topics[i];
    lis.push(
      <li key={t.id}>
        <a
          id={t.id}
          href={'/read/' + t.id}
          onClick={(event) => {
            event.preventDefault();
            props.onChangeReadMode(Number(event.target.id));
          }}
        >
          {t.title}<br></br>
        </a>
      </li>
    );
  }
  return (
    props.lists === false ? <></> :
    <div className='read'>
      <h2>목록</h2>
      <ol>{lis}</ol>
    </div>
  );
}
function Create(props) {

  return (
    <div className="create">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const title = event.target.title.value;
          const body = event.target.body.value;
          props.onCreate(title, body);
          alert('저장되었습니다');
        }}
      >
        <p><input type="text" id="title" name="title" placeholder="제목을 작성해주세요!" maxLength="12"/></p>
        <p><textarea name="body" id="body" placeholder="내용을 입력해주세요!" rows="20" cols="60" ></textarea></p>
        <button type='submit' id="button">CREATE</button>
      </form>
    </div>
  );
}
function Update(props) {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return (
    <div className="update">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const title = event.target.title.value;
          const body = event.target.body.value;
          props.onUpdate(title, body);
          alert('수정되었습니다!');
        }}
      >
        <p>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="제목을 입력해주세요!"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </p>
        <p>
          <textarea
            name="body"
            id="body"
            placeholder="내용을 입력해주세요!" rows="20" cols="60"
            value={body}
            onChange={(event) => {
              setBody(event.target.value);
            }}
          ></textarea>
        </p>
        <button type='submit'id="button">UPDATE</button>
      </form>
    </div>
  );
}

function MiniRoom() {

  const [value, onChange] = useState(new Date());

  return (
    <div className='miniroom'>
      <Calendar onChange={onChange} value={value} />
    </div>
  );
}

function Background() {
  return (
    <>
      <div className="bg">
      </div>
    </>
  )
}


function App() {

  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(1);
  const [topics, setTopics] = useState([]);
  const [lists, setLists] = useState(false);


  let bg = null;
  let content = null;
  let readLists = null;
  let contextControl = null;
  if (mode === 'WELCOME') {
    content = <MiniRoom />;
    bg = <Background />;
  } else if (mode === 'READ') {
    let title, body = null;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article lists={lists} id={id} title={title} body={body} />;
    readLists = <Read lists={lists} topics={topics} onChangeReadMode={(_id) => {
      setMode('READ');
      setId(_id);
    }}/>;

    contextControl = (
      <div className="contextControl" >
        <Button href={'/update' + id}
          sx={{ color: "white" , bgcolor : 'black'}}
          onClick={(event) => {
            event.preventDefault();
            setMode('UPDATE');
          }} startIcon={<CreateIcon/>}>
            UPDATE
        </Button>
        <Button type="button"
          value="Delete"
          sx={{ color: "white" , bgcolor : 'black'}}
          onClick={() => {
            const newTopics = [];
            for (let i = 0; i < topics.length; i++) {
              if (topics[i].id !== id) {
                newTopics.push(topics[i]);
              }
            }
            setTopics(newTopics);
          }} startIcon={<DeleteIcon/>}>
            DELETE
        </Button>
      </div>
    );
  } else if (mode === 'CREATE') {
    content = (
      <Create
        onCreate={(_title, _body) => {
          const newTopic = { id: nextId, title: _title, body: _body };
          const newTopics = [...topics];
          newTopics.push(newTopic);
          setTopics(newTopics);
          setMode('READ');
          setId(nextId);
          setNextId(nextId + 1);
          setLists(true);
        }}
      ></Create>
    );
  } else if (mode === 'UPDATE') {
    let title,
      body = null;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = (
      <Update
        title={title}
        body={body}
        onUpdate={(title, body) => {
          console.log(title, body);
          const newTopics = [...topics];
          const updatedTopic = { id: id, title: title, body: body };
          for (let i = 0; i < newTopics.length; i++) {
            if (newTopics[i].id === id) {
              newTopics[i] = updatedTopic;
              break;
            }
          }
          setTopics(newTopics);
          setMode('READ');
        }} />
    );
  }
  return (

    <div className="App">
      <Navbar onChangeHomeMode={() => {
          setMode('WELCOME');
        }}/>
      <Header
        onChangeHomeMode={() => {
          setMode('WELCOME');
        }}
        onChangeCreateMode={() => {
          setMode('CREATE');
        }}
        onChangeReadMode={(_id) => {
          setMode('READ');
          setId(_id);
        }} />
      <div className="wrap">
        {readLists}
        {content}
        {bg}
        {lists === false ? <></> : contextControl}
      </div>
    </div>
  );
}

export default App;

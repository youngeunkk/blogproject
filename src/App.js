import { useState } from 'react';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import CreateIcon from '@mui/icons-material/Create';
import MenuIcon from '@mui/icons-material/Menu';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { CardContent, Typography, IconButton, Card } from '@mui/material';

function Navbar() {

  return (
    <div className="Navbar">
      <h3>Youngeun's Story</h3>
    </div>
  )
}
function MiniRoom() {

  return (
    <miniroom>

    </miniroom>

  )
} // 나중에 작업하기

function Header({onChangeHomeMode, onChangeCreateMode, onChangeReadMode}) {

  let navigate = useNavigate();

  return (
    <header>
        <p>
          <IconButton onClick={(event) => {
            navigate('/');
            event.preventDefault();
            onChangeHomeMode();
          }}>
            <HomeIcon fontSize="large"/>
          </IconButton>
        </p>
        <p>
          <IconButton onClick={(event) => {
            navigate('/create');
            event.preventDefault();
            onChangeCreateMode();
          }}>
            <CreateIcon fontSize="large"/>
          </IconButton>
        </p>
        <p>
          <IconButton onClick={(event)=> {
            navigate('/read');
            event.preventDefault();
            onChangeReadMode();
          }}>
            <MenuIcon fontSize="large"/>
          </IconButton>
        </p>
    </header>
  );
}

function Article(props) {   // 약간 상세보기 같은 거?
  return (
    props.lists === false ? <div className="listnull"><h2>텅 비어있음</h2></div> :
    <div className='posts'>
      <Card sx={{ width: 250, height : 180 }}>
      <CardContent>
      <Typography variant="h5">
        {props.title}
        </Typography>
        <p>
        <Typography variant="body3">
        {props.body}
        </Typography>
        </p>
      </CardContent>
    </Card>
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
    <div className='read'>
      <ol>{lis}</ol>
    </div>
  );
}


function Create(props) {

  let navigate = useNavigate();

  return (
    <div className="create">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const title = event.target.title.value;
          const body = event.target.body.value;
          props.onCreate(title, body);
          alert('저장되었습니다');
          navigate('/read');
        }}
      >      
          <p><input type="text" id="title" name="title" placeholder="제목을 입력해주세요!" maxlength="10"/></p>
          <textarea name="body" id="body" placeholder="내용을 입력해주세요!" rows="20" cols="80" maxlength="300"></textarea>
          <IconButton type="submit">
            <SaveIcon/>
          </IconButton>
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
            placeholder="내용을 입력해주세요!" rows="20" cols="80"
            value={body}
            onChange={(event) => {
              setBody(event.target.value);
            }}
          ></textarea>
        </p>
        <p>
          <input type="submit" value="Update"></input>
        </p>
      </form>
    </div>
  );
}



function App() {

  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(1);
  const [topics, setTopics] = useState([]);
  const [lists, setLists] = useState(false);



  let content = null;
  let contextControl = null;
  if (mode === 'WELCOME') {
    content = <MiniRoom/>; // 여기에 이제 미니홈피 들어설 예정 
  } else if (mode === 'READ') {
    let title,
      body = null;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article lists={lists} id={id} title={title} body={body}/>;

    contextControl = (
      <div className="contextControl" >
          <IconButton href={'/update' + id}
          onClick={(event) => {
            event.preventDefault();
            setMode('UPDATE');
          }}>
            <CreateIcon fontSize='large'/>
          </IconButton> 
          <IconButton type="button"
            value="Delete"
            onClick={() => {
              const newTopics = [];
              for (let i = 0; i < topics.length; i++) {
                if (topics[i].id !== id) {
                  newTopics.push(topics[i]);
                }
              }
              setTopics(newTopics);
              setMode('WELCOME');
            }}>
            <DeleteIcon fontSize="large"/>
          </IconButton>
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
        }}/>
    );
  }
  return (

    <div className="App">
      <Navbar/>
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
        }}/>
      <Routes>
        <Route path="/read" element={
          <Read
          topics={topics}
          onChangeReadMode={(_id) => {
            setMode('READ');
            setId(_id);
          }}/>
        } />
      </Routes>
      <div className="wrap">
        {content}
        {lists === false ? <div></div> : contextControl}
     </div>
    </div>
  );
}

export default App;

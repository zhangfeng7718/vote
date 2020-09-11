import React from 'react';
import './App.css';
import LoginPage from './hooks/login'
import RegisterPage from './hooks/register'
import CreateVote from './hooks/createVote'
import VoteView from './hooks/voteView'
import Main from './hooks/main'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Forgot from './hooks/forgot';
import ChangePassword from './hooks/changepassword'
import 'antd/dist/antd.css';

function App() {
  return (
    <Router>
      <div className='App'>
          {/* <Link to="/vote-view/:id">vote-view</Link> */}

          <Switch>
            <Route path="/register" exact>
              <RegisterPage />
            </Route>
            <Route path="/login" exact>
              <LoginPage />
            </Route>
            <Route path="/" exact>
              <Main />
            </Route>
            <Route path="/create-vote" exact>
              <CreateVote />
            </Route>
            <Route path="/vote-view/:id" exact>
              <VoteView />
            </Route>
            <Route path="/forgot" exact>
              <Forgot />
            </Route>
            <Route path="/change-password/:token" exact>
              <ChangePassword />
            </Route>
          </Switch>
      </div>
    </Router>
  );
}

export default App;

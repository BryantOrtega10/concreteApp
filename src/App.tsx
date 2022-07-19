import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import CreateTicket from './pages/Tickets/CreateTicket/CreateTicket';
import PaymentsDetail from './pages/Payments/PaymentsDetail/PaymentsDetail';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import TicketsDetail from './pages/Tickets/TicketsDetail/TicketsDetail';

setupIonicReact();

const App: React.FC = () => {
  const renderRedirect = () => {
    console.log(localStorage.getItem('showPageView'));
    console.log(localStorage.getItem("api_token"));
    
    if(localStorage.getItem('showPageView') === 'NO'){
      if(localStorage.getItem("api_token") === null){
        return <Redirect to="/login" />
      }
      else{
        return <Redirect to="/dashboard" />
      }
    }
    else{
      return <Redirect to="/home" />
    }
  }


  return <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/dashboard">
          <Dashboard />
        </Route>
        <Route exact path="/create-ticket">
          <CreateTicket />
        </Route>
        <Route exact path={`/payments-detail/:id`} component={PaymentsDetail} />
        <Route exact path={`/tickets-detail/:id`} component={TicketsDetail} />

        <Route exact path="/">
          {renderRedirect()}
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
};

export default App;

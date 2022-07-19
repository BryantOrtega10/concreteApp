import { IonContent, IonFab, IonFabButton, IonIcon, IonPage } from '@ionic/react';
import { useState } from 'react';
import MyTabItem from '../../components/MyTabController/MyTabItem';
import Tickets from '../Tickets/Tickets';
import Profile from '../Profile/Profile';
import Payments from '../Payments/Payments';
import './Dashboard.css'
import {add} from 'ionicons/icons';
import Deductions from '../Deductions/Deductions';

const Dashboard: React.FC = () => {

  const [activeProfile, setActiveProfile] = useState(false);
  const [activeTickets, setActiveTickets] = useState(true);
  const [activePayments, setActivePayments] = useState(false);
  const [activeDeductions, setActiveDeductions] = useState(false);

  
  const clickProfile = () => {
    setActiveProfile(true);
    setActiveTickets(false);
    setActivePayments(false);
    setActiveDeductions(false);

  }
  const clickTickets = () => {
    setActiveProfile(false);
    setActiveTickets(true);
    setActivePayments(false);
    setActiveDeductions(false);
  }
  const clickPayments = () => {
    setActiveProfile(false);
    setActiveTickets(false);
    setActivePayments(true);
    setActiveDeductions(false);
  }
  const clickDeductions = () => {
    setActiveProfile(false);
    setActiveTickets(false);
    setActivePayments(false);
    setActiveDeductions(true);
  }

  const renderPage = () => {
    if(activeTickets){
      return (
        <div className='container-main-obj'>
          <Tickets />          
        </div>
      );
    }
    if(activeProfile){
      return (
        <div className='container-main-obj'>
          <Profile />          
        </div>
      );
    }
    if(activePayments){
      return (
        <div className='container-main-obj'>
          <Payments />          
        </div>
      );
    }
    if(activeDeductions){
      return (
        <div className='container-main-obj'>
          <Deductions />          
        </div>
      );
    }
  }

  const renderFabs = () => {
    if(activeTickets){
      return (
        <IonFab vertical="bottom" style={{bottom:"100px"}} edge={false} horizontal="end" slot="fixed">
          <IonFabButton routerLink='/create-ticket'>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      );
    }
  }

  return (
    <IonPage>
      <IonContent >
        {renderPage()}  
        {renderFabs()}
          
    
        
        <div className='container-tabs'>
          <MyTabItem title='Profile' image='tab-profile.png' active={activeProfile} onClick={clickProfile} />
          <MyTabItem title='Tickets' image='tab-tickets.png' active={activeTickets} onClick={clickTickets} />
          <MyTabItem title='Payments' image='tab-payments.png' active={activePayments} onClick={clickPayments} />
          <MyTabItem title='Deductions' image='tab-deductions.png' active={activeDeductions} onClick={clickDeductions} />
        </div>
      </IonContent>
    </IonPage>
  );
}

export default Dashboard;
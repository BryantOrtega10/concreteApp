import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonAlert, useIonLoading, useIonViewDidEnter } from '@ionic/react';
import { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { API_TICKETS, SERVER } from '../../../models/Constantes';
import './TicketsDetail.css'

interface TicketsDetailPageProps
  extends RouteComponentProps<{
    id: string;
  }> {}


const TicketsDetail: React.FC<TicketsDetailPageProps> = ({ match }) => {

  const [returnMessage, setReturnMessage] = useState<string>("");
  const [stateText, setStateText] = useState<string>("");
  const [stateImage, setStateImage] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [ticket, setTicket] = useState<string>("");
  const [truckId, setTruckId] = useState<string>("");
  const [pickup, setPickup] = useState<string>("");
  const [deliver, setDeliver] = useState<string>("");
  const [tonage, setTonage] = useState<string>("");
  const [rate, setRate] = useState<string>("");
  const [total, setTotal] = useState<string>("");
  const [image, setImage] = useState<string>("");
  

  const [presentLoading, dismissLoading] = useIonLoading();
  const [presentAlert] = useIonAlert();

  useIonViewDidEnter(() => {
    presentLoading();
    fetch(API_TICKETS + "/" + match.params.id, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('api_token')}` 
      }
    }).then(response => response.json())
    .then(result => {      
      dismissLoading();
      if(result.success){

        let image :string = result.ticket.file;
        image.replace("public/","storage/");

        setStateText(result.ticket.state);
        setStateImage(result.ticket.fk_ticket_state);
        setDate(result.ticket.date_gen_f);
        setTicket(result.ticket.number);
        setTruckId(result.ticket.unit_number);
        setPickup(result.ticket.pickup);
        setDeliver(result.ticket.deliver ?? "NO DATA");
        setTonage(result.ticket.tonage);
        setRate(result.ticket.rate);
        setTotal(result.ticket.total);
        setReturnMessage(result.ticket.return_message);
        setImage(SERVER + "/" + image);
      }
     
      
    }).catch(result => {
      dismissLoading();
      presentAlert({
        header: 'Error',
        message: 'Unknown error',
        buttons: [
          'Ok'
        ]
      });
      console.log("error",result);
    });
  });

  const isLoadState = () => {
    if(stateImage === ""){
      return <div className='container-state'></div>
    }
    else{
      return <div className='container-state'>
        <img src={require(`./../../../assets/imgs/state-${stateImage}.png`)} />
        <span>{stateText}</span>
      </div>
    }
  }

  const reject = () => {
    if(parseInt(stateImage) === 2){
      return <div className='container-rejection'>
          <b>Reason for rejection</b>
          <p>{returnMessage}</p>
      </div>
    }
     
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton defaultHref="/dashboard" color='primary' />
          </IonButtons>
          <IonTitle color='primary'>
            Tickets Detail 
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className='tickets-detail-container'>
          {reject()}
          <div className='tickets-detail-container-int'>
            <b className='tickets-detail-state'>State</b>
            <div className='tickets-detail-description'>
              {isLoadState()}
            </div>
            <b>Date</b>
            <div className='tickets-detail-description'>{date}</div>
            <b>Ticket</b>
            <div className='tickets-detail-description'>{ticket}</div>
            <b>Truck ID</b>
            <div className='tickets-detail-description'>{truckId}</div>
            <b>Pickup</b>
            <div className='tickets-detail-description'>{pickup}</div>
            <b>Deliver</b>
            <div className='tickets-detail-description'>{deliver}</div>
            <b>Tonage</b>
            <div className='tickets-detail-description'>{tonage}</div>
            <b>Rate</b>
            <div className='tickets-detail-description'>{rate}</div>
            <b>Total</b>
            <div className='tickets-detail-description'>{total}</div>
            <div className='image-cont'>
              <img src={image} alt="ticket" />
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TicketsDetail;
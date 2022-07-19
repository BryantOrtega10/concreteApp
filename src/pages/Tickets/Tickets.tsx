import { IonButton, IonHeader, IonInfiniteScroll, IonInfiniteScrollContent, IonInput, IonItem, IonLabel, IonList, IonTitle, IonToolbar, useIonAlert, useIonLoading } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { Keyboard } from '@capacitor/keyboard';
import './Tickets.css'
import TicketListItemModel from '../../models/TicketListItem.model';
import TicketListItem from '../../components/TicketListItem/TicketListItem';
import { API_TICKETS } from '../../models/Constantes';
import { useHistory } from 'react-router';



const Tickets: React.FC = () => {
  /*Init vars*/
  const [presentAlert] = useIonAlert();
  const [page, setPage] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [ticketNumber, setTicketNumber] = useState<string>("");
  const ionTxtTicketNumber = useRef<HTMLIonInputElement>(null);
  const [data, setData] = useState<TicketListItemModel[]>([]);
  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);
  const [presentLoading, dismissLoading] = useIonLoading();
  const history = useHistory()
  /* Methods */
  const onKeyUpTicketNumber = (e: any) => {
    if (e.keyCode === 13) {
      Keyboard.hide();
      ionTxtTicketNumber.current?.setBlur();
    }
  }
  
  const onClickSearch = () => {
    setInfiniteDisabled(false);
    setPage(0);
    const temp = [...data];
    temp.splice(0, temp.length);
    setData(temp);
    pushData(0);    
  }

  
  /*Services*/
  const pushData = (page:number, ev?: any) => {
    if(page == 0) presentLoading();    
    const myParams = { ticket_number: ticketNumber, start_date: startDate, end_date: endDate, page: page.toString() };
    console.log(myParams);
    const myParamsUrl = new URLSearchParams(myParams).toString();
    fetch(API_TICKETS + "?" + myParamsUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('api_token')}` 
      }
    }).then(response => response.json())
    .then(result => {      
      if(page == 0) dismissLoading();
        
      
      setPage(page+1);
      console.log(result, page);
      const tickets = result.data.tickets;
      if(tickets.length > 0){
        const newData :TicketListItemModel[] = [];
        for (let i = 0; i < tickets.length; i++) {
          newData.push({
            id: tickets[i].id,
            date: tickets[i].date_gen_f,
            ticket: tickets[i].number,
            status: tickets[i].fk_ticket_state,
            onClick: null
          });
        }
        

        setData([
          ...data,
          ...newData
        ]);
      }
      else{
        setInfiniteDisabled(true);
      }

      if (typeof ev !== 'undefined') {
        ev.target.complete();
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
  }

  const loadData = (ev: any) => {
    pushData(page,ev);
  }

  useEffect(() => {
    pushData(0);
  }, []);




  return (
    <div className='container-tickets'>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <div className='container-tickets-header'><img src={require(`./../../assets/imgs/logoHeader.png`)} alt="Concrete Redi" /></div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <div className='container-filter-tickets'>
        <h3>Search</h3>
        <div className='row-tickets'>
          <div className='col-tickets col-6-tickets'>
            <IonList>
              <IonItem>
                <IonLabel position="floating"><label className='label-tickets'>Start date</label></IonLabel>
                <IonInput type='date' value={startDate} onIonInput={(e: any) => setStartDate(e.target.value)}></IonInput>
              </IonItem>
            </IonList>
          </div>
          <div className='col-tickets col-6-tickets'>
            <IonList>
              <IonItem>
                <IonLabel position="floating"><label className='label-tickets'>End date</label></IonLabel>
                <IonInput type='date' value={endDate} onIonInput={(e: any) => setEndDate(e.target.value)}></IonInput>
              </IonItem>
            </IonList>
          </div>
        </div>
        <div className='row-tickets'>
          <div className='col-tickets col-12-tickets'>
            <IonList>
              <IonItem>
                <IonLabel position="floating"><label className='label-tickets'>Ticket Number</label></IonLabel>
                <IonInput type='text' ref={ionTxtTicketNumber} onKeyUp={onKeyUpTicketNumber} value={ticketNumber} onIonInput={(e: any) => setTicketNumber(e.target.value)}></IonInput>
              </IonItem>
            </IonList>
          </div>
        </div>
        <IonButton expand="block" onClick={onClickSearch}>
          <div className='searchBtn'>Search</div>
          <img src={require('./../../assets/imgs/search.png')} alt="search" />
        </IonButton>

      </div>
      <div className='container-list-tickets'>
        <h1>Tickets</h1>
        <IonList>
          <div className='list-tickets'>
            {data.map((item, index) => {
              return (
                <TicketListItem
                  key={`ticket_list_${index}`}
                  id={item.id}
                  date={item.date}
                  ticket={item.ticket}
                  status={item.status}
                  onClick={() => {history.push(`/tickets-detail/${item.id}`);}} />
              );
            })}
          </div>
        </IonList>
      </div>
      <IonInfiniteScroll
        onIonInfinite={loadData}
        threshold="100px"
        disabled={isInfiniteDisabled}
      >
        <IonInfiniteScrollContent
          loadingSpinner="bubbles"
          loadingText="Loading more data..."
        ></IonInfiniteScrollContent>
      </IonInfiniteScroll>


    </div>
  );
}

export default Tickets;
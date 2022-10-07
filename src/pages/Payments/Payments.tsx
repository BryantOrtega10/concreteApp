import { IonButton, IonHeader, IonInfiniteScroll, IonInfiniteScrollContent, IonInput, IonItem, IonLabel, IonList, IonTitle, IonToolbar, useIonAlert, useIonLoading } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import PaymentListItem from '../../components/PaymentListItem/PaymentListItem';
import { API_PAYMENTS, SERVER } from '../../models/Constantes';
import PaymentItemModel from '../../models/PaymentItem.model';
import './Payments.css';
import { Browser } from '@capacitor/browser';


const Payments: React.FC = () => {

  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const firstDayStr = firstDay.getFullYear() + '-' + String(firstDay.getMonth() + 1).padStart(2, '0') + '-' + String(firstDay.getDate()).padStart(2, '0');
  const lastDayStr = lastDay.getFullYear() + '-' + String(lastDay.getMonth() + 1).padStart(2, '0') + '-' + String(lastDay.getDate()).padStart(2, '0');
  const [startDate, setStartDate] = useState<string>(firstDayStr);
  const [endDate, setEndDate] = useState<string>(lastDayStr);
  const history = useHistory();
  const [presentLoading, dismissLoading] = useIonLoading();
  const [page, setPage] = useState<number>(0);
  const [presentAlert] = useIonAlert();
  const [reloadData, setRealoadData] = useState(false);

  const [data, setData] = useState<PaymentItemModel[]>([]);
  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);

  const onClickSearch = () => {
    setInfiniteDisabled(false);
    setPage(0);
    setData(prev => prev.filter(element => false))    
    setRealoadData(true);
  }

  useEffect(() => {
    if(data.length == 0 && reloadData){
      pushData(0);
      setRealoadData(false);
    }
  }, [data, reloadData]);

  /*Services*/
  const pushData = (page:number, ev?: any) => {
    if(page == 0) presentLoading();    
    const myParams = { start_date: startDate, end_date: endDate, page: page.toString() };
    const myParamsUrl = new URLSearchParams(myParams).toString();
    fetch(API_PAYMENTS + "?" + myParamsUrl, {
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
      const settlements = result.data.settlements;
      if(settlements.length > 0){
        const newData :PaymentItemModel[] = [];
        for (let i = 0; i < settlements.length; i++) {
          
          const date_pay = new Date(settlements[i].payment.date_pay);
          const date_pay_str = + String(date_pay.getMonth() + 1).padStart(2, '0')+ '/' + String(date_pay.getDate()).padStart(2, '0') + '/' + date_pay.getFullYear();
          
          newData.push({
            id: settlements[i].id,
            date: date_pay_str,
            total: settlements[i].total,
            pdf: settlements[i].urlPDF,
            status: settlements[i].fk_settlement_state
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
    <div className='container-profile'>
      <IonHeader>
        <IonToolbar>
          <IonTitle color='primary'>
            <div className='payments-title'>Payments</div>
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
        <IonButton expand="block" onClick={onClickSearch}>
          <div className='searchBtn'>Search</div>
          <img src={require('./../../assets/imgs/search.png')} alt="search" />
        </IonButton>
      </div>
      <div className='container-list-tickets'>
        <IonList>
        <div className='list-tickets'>
          {data.map((item, index) => {
            return (
              <PaymentListItem
                key={`ticket_list_${index}`}
                id={item.id}
                date={item.date}
                total={item.total}
                pdf={item.pdf}
                status={item.status}
                onClick={() => {Browser.open({ url: SERVER + item.pdf })}} />
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
};

export default Payments;
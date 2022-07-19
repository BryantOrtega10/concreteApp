import { IonButton, IonHeader, IonInfiniteScroll, IonInfiniteScrollContent, IonInput, IonItem, IonLabel, IonList, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonAlert, useIonLoading } from '@ionic/react';
import { useEffect, useState } from 'react';
import DeductionListItem from '../../components/DeductionListItem/DeductionListItem';
import { API_DEDUCTIONS, API_DEDUCTIONS_TYPES } from '../../models/Constantes';
import DeductionItemModel from '../../models/DeductionItem.model';
import DeductionTypesModel from '../../models/DeductionTypes.model';
import './Deductions.css'

const Deductions: React.FC = () => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [deductionType, setDeductionType] = useState<string>("");

  const [presentLoading, dismissLoading] = useIonLoading();
  const [page, setPage] = useState<number>(0);
  const [presentAlert] = useIonAlert();


  const [deductionTypes, setDeductionTypes] = useState<DeductionTypesModel[]>([]);


  const [data, setData] = useState<DeductionItemModel[]>([]);
  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);

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
    const myParams = {deductionType: deductionType, start_date: startDate, end_date: endDate, page: page.toString() };
    const myParamsUrl = new URLSearchParams(myParams).toString();
    console.log(myParams);

    fetch(API_DEDUCTIONS + "?" + myParamsUrl, {
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
      const deductions = result.data.deductions;
      if(deductions.length > 0){
        const newData :DeductionItemModel[] = [];
        for (let i = 0; i < deductions.length; i++) {
          
          const date_pay = new Date(deductions[i].date_pay);
          const date_pay_str = + String(date_pay.getMonth() + 1).padStart(2, '0')+ '/' + String(date_pay.getDate()).padStart(2, '0') + '/' + date_pay.getFullYear();
          
          newData.push({
            id: deductions[i].id,
            date: date_pay_str,
            deduction_type: deductions[i].deduction_type,
            value: deductions[i].total_value,
            status: deductions[i].deduction_state
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



  const loadDeductionTypes = () => {
    fetch(API_DEDUCTIONS_TYPES, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('api_token')}` 
      }
    }).then(response => response.json())
    .then(result => {      
      const deduction_types = result.data.deduction_types;
      if(deduction_types.length > 0){
        
        const newData :DeductionTypesModel[] = [];
        for (let i = 0; i < deduction_types.length; i++) {
          newData.push({
            id: deduction_types[i].id,
            name: deduction_types[i].name
          });
        }
        

        setDeductionTypes([
          ...deductionTypes,
          ...newData
        ]);
      }
      else{
        setInfiniteDisabled(true);
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
    setPage(0);
    const temp = [...data];
    temp.splice(0, temp.length);
    setData(temp);
    
    setDeductionTypes(deductionTypes.splice(0, deductionTypes.length));
    loadDeductionTypes();
    pushData(0);
  }, []);






  return (
    <div className='container-deductions'>
      <IonHeader>
        <IonToolbar>
          <IonTitle color='primary'>
            <div className='payments-title'>Deductions</div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <div className='container-filter-tickets'>
        <div className='row-tickets'>
            <div className='col-tickets col-12-tickets'>
              <IonList>
                <IonItem>
                  <IonLabel position="floating"><label className='label-create-ticket'>Decuction type</label></IonLabel>
                  <IonSelect value={deductionType} placeholder="Select One" interface="popover" onIonChange={e => setDeductionType(e.detail.value)}>
                      {deductionTypes.map((item, index) => {
                      return (
                        <IonSelectOption key={`deduction_type_${index}`} value={item.id}>{item.name}</IonSelectOption>
                      );
                    })}
                  </IonSelect>
                </IonItem>
              </IonList>
            </div>
          </div>
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
      <div className='container-list-deductions'>
        <IonList>
          <div className='list-tickets'>
            {data.map((item, index) => {
              return (
                <DeductionListItem
                  key={`deduction_list_${index}`}
                  id={item.id}
                  date={item.date}
                  deduction_type={item.deduction_type}
                  status={item.status}
                  value={item.value}                  
                  onClick={() => {console.log(`${item.id}`);}} />
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

export default Deductions;
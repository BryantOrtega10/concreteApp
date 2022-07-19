import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonAlert, useIonLoading, useIonViewDidEnter } from '@ionic/react';
import './CreateTicket.css';
import { useState } from 'react';


import { Camera, CameraResultType } from '@capacitor/camera';
import { API_CREATE_TICKET, API_DELIVERS, API_FSC_BY_DELIVER_DATE, API_MATERIALS, API_PICKUPS, API_RATE_BY_PICKUP_DELIVER, API_VEHICLES_BY_CONTRACTOR } from '../../../models/Constantes';
import MaterialsModel from '../../../models/Materials.model';
import PickupDeliverModel from '../../../models/PickupDeliver.model';
import { useHistory } from 'react-router';
import VehiclesModel from '../../../models/Vehicles.model';


const CreateTicket: React.FC = () => {



  const takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64
    });
    setImage(image.base64String ?? "");
  };

  const onClickSelectFile = () => {
    takePicture();
  }

  const parseLocaleNumber = (stringNumber: string) => {
    var thousandSeparator = Intl.NumberFormat().format(11111).replace(/\p{Number}/gu, '');
    var decimalSeparator = Intl.NumberFormat().format(1.1).replace(/\p{Number}/gu, '');

    return parseFloat(stringNumber
      .replace(new RegExp('\\$', 'g'), '')
      .replace(new RegExp('\\' + thousandSeparator, 'g'), '')
      .replace(new RegExp('\\' + decimalSeparator), '.')
    );
  }


  const [materials, setMaterials] = useState<MaterialsModel[]>([]);
  const [pickups, setPickups] = useState<PickupDeliverModel[]>([]);
  const [delivers, setDelivers] = useState<PickupDeliverModel[]>([]);

  const [vehicles, setVehicles] = useState<VehiclesModel[]>([]);

  const history = useHistory();
  const [presentAlert] = useIonAlert();

  const [presentLoading, dismissLoading] = useIonLoading();
  const dateToday = new Date();
  const formattedDate = dateToday.toISOString().substr(0,10);

  const [image, setImage] = useState<string>("");
  const [date, setDate] = useState<string>(formattedDate);
  const [ticketNumber, setTicketNumber] = useState<string>();
  const [unit, setUnit] = useState<string>();
  const [material, setMaterial] = useState<string>();
  const [tonage, setTonage] = useState<string>("");
  const [rate, setRate] = useState<string>("");
  const [total, setTotal] = useState<string>();
  const [fsc, setFsc] = useState<string>("");
  const [pickup, setPickup] = useState<string>("");
  const [deliver, setDeliver] = useState<string>("");


  const onChangePickup = (e:any) => {
    setPickup(e.detail.value);
    if(e.detail.value !== "" && deliver !== ""){
      
      loadRate(e.detail.value, deliver);
      
    }

  }

  const onChangeDeliver = (e:any) => {
    setDeliver(e.detail.value);
    if(pickup !== "" && e.detail.value !== ""){
      loadRate(pickup,e.detail.value);      
    }

  }

  const uploadFileRender = () => {
    if (image === "") {
      return (<div className='upload-file'>
        <img src={require('../../../assets/imgs/upload-image.png')} alt="upload" />
        <div className='btn-upload'>
          <IonButton color="tertiary" onClick={onClickSelectFile}>
            <img src={require('../../../assets/imgs/ico-upload.png')} className='ico-upload' alt="upload ico" />
            <span className='upload-text'>Upload image</span>
          </IonButton>
        </div>
      </div>);
    }
    else {
      return (<div className='upload-file'>
        <img src={"data:image/jpeg;base64, " + image} className='preview-image' alt="preview " />
        <div className='remove-image' onClick={onClickRemove}>
          <img src={require('../../../assets/imgs/remove-image.png')} alt="remove "/>
        </div>
      </div>);
    }
  }
  const onClickRemove = () => {
    setImage("");
  }

  const onIonBlurTonage = (e: any) => {
    if (e.target.value !== "" && !isNaN(e.target.value) && rate !== "") {
      const rateNum = parseLocaleNumber(rate!);
      const tonageNum = parseFloat(tonage!);
      console.log(rateNum, tonageNum);
      const totalNumber = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rateNum*tonageNum);
      setTotal(totalNumber);
      loadFsc(deliver, date, totalNumber);

    }
    else {
      setTotal("");
    }
  }

  const onIonFocusRate = (e: any) => {
    if (e.target.value !== "") {
      const number = parseLocaleNumber(e.target.value);
   
      setRate(number.toString());
    }
  }


  const onIonBlurTotal = (e: any) => {
    if (e.target.value !== "" && !isNaN(e.target.value)) {
      const number = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(e.target.value);
      console.log(number);
      setTotal(number);
    }
    else {
      setTotal("");
    }
  }

  const onIonFocusTotal = (e: any) => {
    if (e.target.value !== "") {
      const number = parseLocaleNumber(e.target.value);
      console.log(number);
      setTotal(number.toString());
    }
  }

  const loadRate = (pickup:string, deliver:string) => {
    fetch(API_RATE_BY_PICKUP_DELIVER + "/" + pickup + "/" + deliver, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('api_token')}` 
      }
    }).then(response => response.json())
    .then(result => {      
      const dataPO = result.data.po;
      if(dataPO){
        const number = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(dataPO.rate);
        console.log(number);
        setRate(number);
        if(tonage !== ""){
          const rateNum = parseLocaleNumber(number!);
          const tonageNum = parseFloat(tonage!);
          console.log(rateNum, tonageNum);
          const totalNumber = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rateNum*tonageNum);
          setTotal(totalNumber);
          loadFsc(deliver, date,totalNumber);
        }
        
      }
      else{
        setRate("");
        presentAlert({
          header: 'Error',
          message: 'No rate was found for that pickup and delivery',
          buttons: [
            'Ok'
          ]
        });
      }
    }).catch(result => {
      
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

  const loadFsc = (deliver:string, date:string, total = "") => {
    fetch(API_FSC_BY_DELIVER_DATE + "/" + deliver + "/" + date, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('api_token')}` 
      }
    }).then(response => response.json())
    .then(result => {      
      const dataFSC = result.data.fsc;
      if(dataFSC){

        let value = 0;
        if(total != "") {
          value = parseLocaleNumber(total!)*(dataFSC.percentaje/100);
          
          const number = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
          setFsc(number);
        }

        
      }
      else{
        setFsc("");
      }
    }).catch(result => {
      
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
  

  const loadVehicles = () => {
    fetch(API_VEHICLES_BY_CONTRACTOR, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('api_token')}` 
      }
    }).then(response => response.json())
    .then(result => {      
      const vehiclesData = result.data.vehicles;
      console.log(vehiclesData);
      if(vehiclesData.length > 0){
        
        const newData :VehiclesModel[] = [];
        for (let i = 0; i < vehiclesData.length; i++) {
          newData.push({
            name: vehiclesData[i].unit_number
          });
        }
        setVehicles([
          ...vehicles,
          ...newData
        ]);
      }
    }).catch(result => {
      
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


  const loadPickups = () => {
    fetch(API_PICKUPS, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('api_token')}` 
      }
    }).then(response => response.json())
    .then(result => {      
      const pickup_deliver = result.data.pickup_deliver;
      console.log(pickup_deliver);
      if(pickup_deliver.length > 0){
        
        const newData :PickupDeliverModel[] = [];
        for (let i = 0; i < pickup_deliver.length; i++) {
          newData.push({
            name: pickup_deliver[i].place
          });
        }
        setPickups([
          ...pickups,
          ...newData
        ]);
      }
    }).catch(result => {
      
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

  const loadDelivers = () => {
    fetch(API_DELIVERS, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('api_token')}` 
      }
    }).then(response => response.json())
    .then(result => {      
      const pickup_deliver = result.data.pickup_deliver;
      console.log(pickup_deliver);
      if(pickup_deliver.length > 0){
        
        const newData :PickupDeliverModel[] = [];
        for (let i = 0; i < pickup_deliver.length; i++) {
          newData.push({
            name: pickup_deliver[i].place
          });
        }
        setDelivers([
          ...delivers,
          ...newData
        ]);
      }
    }).catch(result => {
      
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

  const loadMaterials = () => {
    
    fetch(API_MATERIALS, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('api_token')}` 
      }
    }).then(response => response.json())
    .then(result => {      
      const materials_data = result.data.materials;
      console.log(materials_data);
      if(materials_data.length > 0){
        
        const newData :MaterialsModel[] = [];
        for (let i = 0; i < materials_data.length; i++) {
          newData.push({
            id: materials_data[i].id,
            name: materials_data[i].name
          });
        }
        setMaterials([
          ...materials,
          ...newData
        ]);
      }
    }).catch(result => {
      
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
 
  useIonViewDidEnter(() => {

    const tempMaterials = [...materials];
    tempMaterials.splice(0, tempMaterials.length);
    setMaterials(tempMaterials);

    const tempPickup = [...pickups];
    tempPickup.splice(0, tempPickup.length);
    setPickups(tempPickup);

    const tempDeliver = [...delivers];
    tempDeliver.splice(0, tempDeliver.length);
    setDelivers(tempDeliver);

    const tempVehicles = [...vehicles];
    tempVehicles.splice(0, tempVehicles.length);
    setVehicles(tempVehicles);


    loadMaterials();
    loadDelivers();
    loadPickups();
    loadVehicles();
    
  })

  const onClickCreateTicket = () => {
    if(ticketNumber === ""){
      presentAlert({
        header: 'Fields required',
        message: 'Ticket number is required',
        buttons: [
          'Ok'
        ]
      });
      return;
    }
    if(unit === ""){
      presentAlert({
        header: 'Fields required',
        message: 'Unit is required',
        buttons: [
          'Ok'
        ]
      });
      return;
    }
    
   
    if(tonage === ""){
      presentAlert({
        header: 'Fields required',
        message: 'Tonage is required',
        buttons: [
          'Ok'
        ]
      });
      return;
    }

    if(rate === ""){
      presentAlert({
        header: 'Fields required',
        message: 'Rate is required',
        buttons: [
          'Ok'
        ]
      });
      return;
    }
    if(total === ""){
      presentAlert({
        header: 'Fields required',
        message: 'Total is required',
        buttons: [
          'Ok'
        ]
      });
      return;
    }
    presentLoading();
    const send_data = JSON.stringify({
      number: ticketNumber,
      date_gen: date,
      vehicle: unit,
      material: material,
      pickup: pickup,
      deliver: deliver,
      tonage: parseLocaleNumber(tonage!).toString(),
      rate: parseLocaleNumber(rate!).toString(),
      total: parseLocaleNumber(total!).toString(),
      photo_box_data: image,
      photo_box_name: new Date().getTime() + '.jpeg'
    });

    fetch(API_CREATE_TICKET, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('api_token')}`
      },
      body: send_data
    }).then(response => response.json())
    .then(result => {      
      dismissLoading();
      if(result.success){
        presentAlert({
          header: 'Ticket created',
          message: 'Ticket created',
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                history.goBack();
              }
            }
          ]
        });
      }
      else{
        presentAlert({
          header: 'Error',
          message: result.error,
          buttons: [
            {
              text: 'Ok'
            }
          ]
        });
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton defaultHref="/dashboard" color='primary' />
          </IonButtons>
          <IonTitle color='primary'>Create</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen >
        <div className='create-tickets-container'>
          <IonList>
            <IonItem>
              <IonLabel position="floating"><label className='label-create-ticket'>Date</label></IonLabel>
              <IonInput type='date' value={date} onIonInput={(e: any) => setDate(e.target.value)} />
            </IonItem>
            <IonItem>
              <IonLabel position="floating"><label className='label-create-ticket'>Ticket number</label></IonLabel>
              <IonInput type='text' value={ticketNumber} onIonInput={(e: any) => setTicketNumber(e.target.value)} />
            </IonItem>
            <IonItem>
              <IonLabel position="floating"><label className='label-create-ticket'>Unit (truck number or id)</label></IonLabel>
              <IonSelect value={unit} placeholder="Select One" interface="popover" onIonChange={e => setUnit(e.detail.value)}>
                {vehicles.map((vehicle, index) => {
                  return (<IonSelectOption value={vehicle.name} key={`vehicle_${index}`}>{vehicle.name}</IonSelectOption>);
                })}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="floating"><label className='label-create-ticket'>Material</label></IonLabel>
              <IonSelect value={material} placeholder="Select One" interface="popover" onIonChange={e => setMaterial(e.detail.value)}>
                {materials.map((material, index) => {
                  return (<IonSelectOption value={material.id} key={`material_${index}`}>{material.name}</IonSelectOption>);
                })}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="floating"><label className='label-create-ticket'>Pickup</label></IonLabel>
              <IonSelect value={pickup} placeholder="Select One" interface="popover" onIonChange={onChangePickup}>
                {pickups.map((pickup_item, index) => {
                  return <IonSelectOption value={pickup_item.name} key={`pickup_item_${index}`}>{pickup_item.name}</IonSelectOption>
                })}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="floating"><label className='label-create-ticket'>Delivery</label></IonLabel>
              <IonSelect value={deliver} placeholder="Select One" interface="popover" onIonChange={onChangeDeliver}>
                {delivers.map((deliver_item, index) => {
                  return <IonSelectOption value={deliver_item.name} key={`deliver_item_${index}`}>{deliver_item.name}</IonSelectOption>
                })}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="floating"><label className='label-create-ticket'>Tonage</label></IonLabel>
              <IonInput type='number' value={tonage} onIonInput={(e: any) => setTonage(e.target.value)} onIonBlur={onIonBlurTonage} />
            </IonItem>
            <IonItem>
              <IonLabel position="floating"><label className='label-create-ticket'>Rate</label></IonLabel>
              <IonInput type='text' inputMode='decimal' value={rate} readonly />
            </IonItem>
            <IonItem>
              <IonLabel position="floating"><label className='label-create-ticket'>Total</label></IonLabel>
              <IonInput type='text' inputMode='decimal' value={total} readonly   />
            </IonItem>
            <IonItem>
              <IonLabel position="floating"><label className='label-create-ticket'>FSC</label></IonLabel>
              <IonInput type='text' inputMode='decimal' value={fsc} readonly   />
            </IonItem>
            
          </IonList>

          <div className='container-upload-file'>
            {uploadFileRender()}
          </div>


          <div className='create-ticket-button'>
            <IonButton expand="block" onClick={onClickCreateTicket}>Create ticket</IonButton>
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default CreateTicket;
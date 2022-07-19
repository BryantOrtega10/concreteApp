import { IonButton,  IonHeader, IonInput, IonItem, IonLabel, IonList, IonTitle, IonToolbar, useIonAlert, useIonLoading } from '@ionic/react';
import { useState, useRef, useEffect } from 'react';
import { Keyboard } from '@capacitor/keyboard';
import './Profile.css'
import { API_GET_CONTRACTOR, API_LOGOUT, API_UPDATE_CONTRACTOR } from '../../models/Constantes';
import { useHistory } from 'react-router';


const Profile: React.FC = () => {
  
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");

  const ionInputName = useRef<HTMLIonInputElement>(null);
  const ionInputEmail = useRef<HTMLIonInputElement>(null);
  const ionInputPassword = useRef<HTMLIonInputElement>(null);
  const ionInputRepeatPassword = useRef<HTMLIonInputElement>(null);

  const [presentLoading, dismissLoading] = useIonLoading();
  const [presentAlert] = useIonAlert();
 
  const history = useHistory();

  const onKeyUpName = (e: any) => {
    if(e.keyCode === 13){
      ionInputEmail.current?.setFocus();
    }
  }

  const onKeyUpEmail = (e: any) => {
    if(e.keyCode === 13){
      Keyboard.hide();
      ionInputEmail.current?.setBlur();
    }
  }

  const onKeyUpPassword = (e: any) => {
    if(e.keyCode === 13){
      ionInputRepeatPassword.current?.setFocus();
    }
  }

  const onKeyUpRepeatPassword = (e: any) => {
    if(e.keyCode === 13){
      Keyboard.hide();
      ionInputRepeatPassword.current?.setBlur();
    }
  }

  const onClickLogOut = () => {
    presentLoading();
    fetch(API_LOGOUT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('api_token')}` 
      }
    }).then(response => response.json())
    .then(result => {      
      dismissLoading();
      localStorage.removeItem('api_token');
      history.replace("/login");
    }).catch(result => {
      
      dismissLoading();
      localStorage.removeItem('api_token');
      history.replace("/login");
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


  const onClickUpdate = () => {
    if(name === ""){
      presentAlert({
        header: 'Fields required',
        message: 'Name is required',
        buttons: [
          'Ok'
        ]
      });
      return;
    }
    if(email === ""){
      presentAlert({
        header: 'Fields required',
        message: 'Email is required',
        buttons: [
          'Ok'
        ]
      });
      return;
    }
    if(password !== repeatPassword){
      presentAlert({
        header: 'Passwords are not same',
        message: 'Passwords are not same',
        buttons: [
          'Ok'
        ]
      });
      return;
    }


    presentLoading();
    const send_data = JSON.stringify({name: name, email: email, password: password ,repeat_password: repeatPassword});

    fetch(API_UPDATE_CONTRACTOR, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('api_token')}`
      },
      body: send_data
    }).then(response => response.json())
    .then(result => {      
      dismissLoading();
      presentAlert({
        header: 'User updated',
        message: 'User updated',
        buttons: [
          'Ok'
        ]
      });

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


  useEffect(() => {
    
    presentLoading();
    fetch(API_GET_CONTRACTOR, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('api_token')}` 
      }
    }).then(response => response.json())
    .then(result => {      
      dismissLoading();
      console.log(result);
      setName(result.user.name);
      setEmail(result.user.email);
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

  }, []);

  return (
    <div className='container-profile'>
      <IonHeader>
        <IonToolbar>
          <IonTitle color='primary'><div className='profile-title'>Profile</div></IonTitle>
        </IonToolbar>
      </IonHeader>
      <div className='profile-inputs-container'>
        <IonList>
          <IonItem>
            <IonLabel position="floating"><label className='label-profile'>Name</label></IonLabel>
            <IonInput type='text' value={name} onIonInput={(e: any) => setName(e.target.value)} ref={ionInputName} onKeyUp={onKeyUpName}/>
          </IonItem>
          <IonItem>
            <IonLabel position="floating"><label className='label-profile'>Email</label></IonLabel>
            <IonInput type='email' value={email} onIonInput={(e: any) => setEmail(e.target.value)} ref={ionInputEmail} onKeyUp={onKeyUpEmail}/>
          </IonItem>
        </IonList>
        <strong className='profile-note'>Do not enter the password if no changes</strong>
        <IonList>
          <IonItem>
            <IonLabel position="floating"><label className='label-profile'>Password</label></IonLabel>
            <IonInput type='password' value={password} onIonInput={(e: any) => setPassword(e.target.value)} ref={ionInputPassword} onKeyUp={onKeyUpPassword}/>
          </IonItem>
          <IonItem>
            <IonLabel position="floating"><label className='label-profile'>Confirm Password</label></IonLabel>
            <IonInput type='password' value={repeatPassword} onIonInput={(e: any) => setRepeatPassword(e.target.value)} ref={ionInputRepeatPassword} onKeyUp={onKeyUpRepeatPassword}/>
          </IonItem>
        </IonList>
        <div className='profile-button-container'><IonButton expand='full' onClick={onClickUpdate}>Save Changes</IonButton></div>
        <div className='profile-button-container sign-out'><IonButton expand='full' color='medium' onClick={onClickLogOut}>Sign Out</IonButton></div>
      </div>
   
    </div>
  );
}

export default Profile;
import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonList,IonPage, IonRouterLink, useIonAlert, useIonLoading } from '@ionic/react';
import { useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { Keyboard } from '@capacitor/keyboard';
import { API_LOGIN } from '../../models/Constantes';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const ionTxtPassword = useRef<HTMLIonInputElement>(null);
  const history = useHistory();

  const onKeyUpEmail = (e: any) => {
    if(e.keyCode === 13){
      ionTxtPassword.current?.setFocus();
    }
  }
  const onKeyUpPassword = (e: any) => {
    if(e.keyCode === 13){
      Keyboard.hide();
      ionTxtPassword.current?.setBlur();
    }
  }
  const [presentLoading, dismissLoading] = useIonLoading();
  const [presentAlert] = useIonAlert();
  const onClickLogin = () => {
    const send_data = JSON.stringify({user: email, pass: password});
    presentLoading();
    fetch(API_LOGIN, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: send_data
    }).then(response => response.json())
    .then(data => {
      dismissLoading();
      
      if(data.success){
        localStorage.setItem('api_token', data.data.token);
        history.replace('/dashboard');
      }
      else{
        presentAlert({
          header: 'Error',
          message: data.error ?? 'Unknown error',
          buttons: [
            'Ok'
          ]
        });
      }      
    }).catch(data => {
      dismissLoading();
      presentAlert({
        header: 'Error',
        message: data.error ?? 'Unknown error',
        buttons: [
          'Ok'
        ]
      });
    });
  }

  return (
    <IonPage>
      <IonContent fullscreen scrollY={false}>
        <div className='container-login'>
          <div className='container-login-image'>
            <img src={require('./../../assets/imgs/logo.png')} alt="Concrete Redi" />
          </div>
          <div className='container-login-form'>
            <IonList>
              <IonItem>
                <IonLabel position="floating"><label className='login-label'>E-mail</label></IonLabel>
                <IonInput type='email' onKeyUp={onKeyUpEmail} value={email} onIonInput={(e: any) => setEmail(e.target.value)}></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="floating"><label className='login-label'>Password</label></IonLabel>
                <IonInput type='password' ref={ionTxtPassword} value={password} onKeyUp={onKeyUpPassword} onIonInput={(e: any) => setPassword(e.target.value)}></IonInput>
              </IonItem>              
            </IonList>
            <IonButton expand="block" onClick={onClickLogin}>Login</IonButton>
            <div className='container-forgot'>
              Forgot <IonRouterLink> password?</IonRouterLink>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
};

export default Login;
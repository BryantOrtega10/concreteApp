import './DeductionListItem.css';
import { IonCol, IonGrid, IonImg, IonRow } from '@ionic/react';
import DeductionItem from '../../models/DeductionItem.model';

const DeductionListItem: React.FC<DeductionItem> = ({ id, date, deduction_type, value, status, onClick }) => {
  return (
    <div className='deduction-general-container'>
      <IonGrid>
        <IonRow className="ion-align-items-end">
          <IonCol size='7'></IonCol>
          <IonCol size='5'>
            <div className='deduction-item-value'>
              <div className='deduction-item-value-label'>Value</div>
              <b className='deduction-item-b-value'>{value}</b>
            </div>            
          </IonCol>
        </IonRow>
        <div className='deduction-item-container'>
          <IonRow>
            <IonCol size='3.2'>
              <div className='deduction-item-label'>Date</div>
              <b className='deduction-item-b'>{date}</b>
            </IonCol>
            <IonCol size='3'>
              <div className='deduction-item-label color-verde'>Deduction</div>
              <b className='deduction-item-b'>{deduction_type}</b>
            </IonCol>
            <IonCol>
              <div className='deduction-item-status deduction-item-label '>Status</div>
              <b className='deduction-item-b b-status'>{status}</b>
            </IonCol>
            {/* <IonCol onClick={onClick} size='1'>
              <div className='deduction-item-container-img'>
                <IonImg src={require(`./../../assets/imgs/green_eye.png`)} />
              </div>
            </IonCol> */}
          </IonRow>
        </div>
      </IonGrid>
    </div>
    
      

    
  );
};

export default DeductionListItem;
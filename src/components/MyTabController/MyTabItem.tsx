import './MyTabItem.css';
import MyTabItemModel from '../../models/MyTabItem.model';

const MyTabItem: React.FC<MyTabItemModel> = ({title, image, active, onClick}) => {
    return (
        <div className={`container-tab-item ${active ? 'active' : ''}`} onClick={onClick}>
            <div className='container-tab-item-image'><img src={require(`./../../assets/imgs/${image}`)} alt={title} className='tab-item-image' /></div>
            <span className='tab-item-title'>{title}</span>
        </div>
    );
};

export default MyTabItem;
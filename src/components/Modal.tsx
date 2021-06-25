import closeImg from '../assets/images/close.svg'

import '../styles/modal.scss'

type ModalProps = {
    isVisible: boolean,
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
    handleDelete: (value: string) => void,
    deleteId: string,
    title: string,
    text: string,
    
}

export function Modal(props: ModalProps){
    return(
        <div className={`modal-overlay ${props.isVisible? 'visible': 'hidden'}`}>
            <div className="content">
                <img src={closeImg} alt="Icone de aviso de exclusão" />
                <h2>{props.title}</h2>
                <span>{props.text}</span>
                <div className="confirmation-buttons">
                    <button onClick={()=> props.setModalVisible(false)} className="cancel">Cancelar</button>
                    <button onClick={()=>props.handleDelete(props.deleteId)}>Sim, excluir</button>
                </div>
            </div>
        </div>
    )
}
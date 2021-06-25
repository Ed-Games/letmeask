import {useHistory, useParams} from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import {Button} from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import {Question} from '../components/Question'

import '../styles/room.scss'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'
import { useState } from 'react'
import {Modal} from '../components/Modal'

type RoomParams = {
    id: string,
}

export function AdminRoom(){
    const params = useParams<RoomParams>()
    const roomId = params.id
    const {questions, title} = useRoom(roomId)
    const history = useHistory()
    const [modalVisible, setModalVisible,] = useState(false)
    const [selectedQuestionId, setSelectedQuestionId] = useState('')
    const [selectedRoomId, setSelectedRoomId] = useState('')

    function handleAskToDeleteRoom(){
        setModalVisible(true)
        setSelectedRoomId(roomId)
        
    }

    async function handleEndRoom(){
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push('/')
    }

    function handleselectQuestionToDelete(questionId: string){
        setModalVisible(true)
        setSelectedQuestionId(questionId)
        
    }

    async function handleDeleteQuestion(questionId: string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        setSelectedQuestionId('')
        setModalVisible(false)
    }

    async function handlesetQuestionAsAnswered(questionId: string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnsewered: true
        })
    }

    async function handleHighlightQuestion(questionId: string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHightLighted: true
        })
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId}/>
                        <Button 
                        isOutlined={true} 
                        onClick={handleAskToDeleteRoom}
                        >
                            Encerrar sala
                        </Button>
                    </div>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span> {questions.length} Pergunta(s)</span>}
                </div>

                    <div className="question-list">
                        {questions.map(question => {
                            return(
                                <Question
                                    key={question.id} 
                                    content={question.content} 
                                    author={question.author}
                                    isAnsewered={question.isAnsewered}
                                    isHightLighted={question.isHightLighted} 
                                >
                                    {!question.isAnsewered && (
                                        <>
                                            <button 
                                            type="button"
                                            onClick={()=> handlesetQuestionAsAnswered(question.id)} 
                                            >
                                                <img src={checkImg} alt="Marcar pergunta como respondida" />
                                            </button>
        
                                            <button 
                                            type="button"
                                            onClick={()=> handleHighlightQuestion(question.id)} 
                                            >
                                                <img src={answerImg} alt="Dar destaque a pergunta" />
                                            </button>
                                        </>
                                    )}

                                    <button 
                                    type="button"
                                    onClick={()=> handleselectQuestionToDelete(question.id)} 
                                    >
                                        <img src={deleteImg} alt="Remover pergunta" />
                                    </button>
                                </Question>
                            )
                        })} 
                    </div>
            </main>
            {selectedQuestionId? (
                <Modal
                isVisible={modalVisible}
                setModalVisible={setModalVisible}
                title="Excluir pergunta"
                text="QUer mesmo excluir essa pergunta?"
                handleDelete={handleDeleteQuestion}
                deleteId={selectedQuestionId}
                />
            ): (
                <Modal
                isVisible={modalVisible}
                setModalVisible={setModalVisible}
                title="Encerrar sala"
                text="QUer mesmo encerrar esta sala?"
                handleDelete={handleEndRoom}
                deleteId={roomId}
            />
            )}
        </div>
    )
}
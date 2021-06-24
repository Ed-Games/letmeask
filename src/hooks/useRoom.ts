import { useEffect, useState } from "react"
import { database } from "../services/firebase"
import { useAuth } from "./useAuth"

type QuestionType = {
    id: string,
    author: {
        name: string,
        avatar: string,
    },
    content: string,
    isHightLighted:boolean,
    isAnsewered: boolean,
    likeCount:number,
    hasLiked:boolean,
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string,
        avatar: string,
    },
    content: string,
    isHightLighted:boolean,
    isAnsewered: boolean,
    likes: Record<string, {
        authorId: string,
    }>,
}>

export function useRoom(roomId: string){
    const {user} = useAuth()
    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [title, setTitle] = useState<string>()

    useEffect(()=>{
        const roomRef = database.ref(`rooms/${roomId}`)

        roomRef.on('value', room => {
            const databaseRoom = room.val()
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHightLighted: value.isHightLighted,
                    isAnsewered: value.isAnsewered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    hasLiked: Object.values(value.likes ?? {}).some(like => like.authorId === user?.id),
                }
            })

            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions)

        })

        return () => {
            roomRef.off('value')
        }

    },[roomId, user?.id])

    return {questions, title}
}
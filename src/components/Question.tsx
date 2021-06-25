import { ReactNode } from 'react'
import '../styles/question.scss'
import cx from 'classnames'

type QuestionProps = {
    content:string,
    author:{
        name:string,
        avatar:string,
    },
    children?: ReactNode,
    isAnsewered?: boolean,
    isHightLighted?: boolean, 
}

export function Question({
    content, 
    author, 
    children,
    isAnsewered = false,
    isHightLighted = false,
    }:QuestionProps){
    return(
        <div 
        className={cx(
            'question',
            {answered: isAnsewered},
            {highlighted: isHightLighted && !isAnsewered,}
        )}>
            <p>{content}</p>

            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div>
                    {children}
                </div>
            </footer>
        </div>
    )
}
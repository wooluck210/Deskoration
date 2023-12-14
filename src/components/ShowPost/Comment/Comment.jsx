import React from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useDispatch } from 'react-redux';
import { openAlertModal } from '../../../features/modal/alertModalSlice';

import {
    postCommentApi,
    deleteCommentApi,
    reportCommentApi,
} from '../../../service/comment_service';

import * as S from './Comment.styled';

const Comment = props => {
    const {
        commentData,
        postDataID,
        token,
        id,
        register,
        handleSubmit,
        resetField,
    } = props;
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const myId = sessionStorage.getItem('Id');

    const submitMutation = useMutation({
        mutationFn: commentData =>
            postCommentApi(id, commentData.comment, token),
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ['getAllComment', id, token],
            });
        },
        onError() {
            dispatch(openAlertModal('잠시 후 다시 시도해주세요.'));
        },
    });

    const deleteMutation = useMutation({
        mutationFn: commentID => deleteCommentApi(postDataID, commentID, token),
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ['getAllComment', postDataID, token],
            });
        },
        onError() {
            dispatch(openAlertModal('잠시 후 다시 시도해주세요.'));
        },
    });

    const reporteMutation = useMutation({
        mutationFn: commentID => reportCommentApi(postDataID, commentID, token),
        onSuccess() {
            dispatch(openAlertModal('댓글이 신고되었습니다.'));
        },
        onError() {
            dispatch(openAlertModal('잠시 후 다시 시도해주세요.'));
        },
    });

    const handleCommentSubmit = commentData => {
        submitMutation.mutate(commentData);
        resetField('comment');
    };

    const deleteComment = commentID => {
        if (window.confirm('이 댓글을 삭제하시겠습니까?')) {
            deleteMutation.mutate(commentID);
        }
    };

    // 컨펌 모달 사용
    const reportComment = (e, commentID) => {
        e.stopPropagation();
        if (window.confirm('이 댓글을 신고하시겠습니까?')) {
            reporteMutation.mutate(commentID);
        }
    };

    return (
        <>
            <S.CommentSection>
                <S.CommentCounter>
                    총 {commentData.length}개의 댓글
                </S.CommentCounter>
                {commentData.map((comment, index) => (
                    <S.CommentItem key={index}>
                        <S.CommentInfo>
                            <S.ProfileImg
                                src={comment.author.image}
                                alt="사용자 이미지"
                            />
                            <div>
                                <span>{comment.author.username}</span>
                                <p>{comment.content}</p>
                            </div>
                        </S.CommentInfo>
                        {comment.author._id === myId ? (
                            <button onClick={() => deleteComment(comment.id)}>
                                삭제
                            </button>
                        ) : (
                            <button onClick={e => reportComment(e, comment.id)}>
                                신고
                            </button>
                        )}
                    </S.CommentItem>
                ))}
            </S.CommentSection>
            <S.CommentInputForm onSubmit={handleSubmit(handleCommentSubmit)}>
                <S.CommentInputBox>
                    <input
                        type="text"
                        placeholder="메시지를 입력하세요"
                        className="input-text"
                        {...register('comment')}
                    />
                    <S.CommentButton>등록</S.CommentButton>
                </S.CommentInputBox>
            </S.CommentInputForm>
        </>
    );
};

export default Comment;

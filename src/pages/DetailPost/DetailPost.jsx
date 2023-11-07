import React, { useEffect, useState } from 'react';
import * as S from './DetailPost.styled';
import { deletePostAPI, detialPostApi } from '../../service/post_service';
import {
    getCommentApi,
    postCommentApi,
    deleteCommentApi,
} from '../../service/comment_service';
import { useNavigate, useParams } from 'react-router-dom';
import { Marker } from '../../components/Marker/Marker';

import BottomSheet from '../../components/BottomSheet/BottomSheet';

import usePageHandler from '../../hooks/usePageHandler';

const DetailPost = () => {
    const [postData, setPostData] = useState(null);
    const [postContent, setPostContent] = useState('');
    const [commentData, setCommentData] = useState(null);
    const [newComment, setNewComment] = useState(''); // 새로운 댓글을 저장할 상태 추가

    const token = sessionStorage.getItem('Token');
    const myId = sessionStorage.getItem('Id');
    const { id } = useParams(); //선택한 게시물 아이디 값
    const navigate = useNavigate();

    useEffect(() => {
        detialPostApi(id, token)
            .then(postResult => {
                setPostContent(JSON.parse(postResult.post.content));
                setPostData(postResult.post);
            })
            .catch(error => {
                console.error('error');
            });
        getCommentApi(id, token)
            .then(commentResult => {
                setCommentData(commentResult.comments.reverse());
            })
            .catch(error => {
                console.error('error');
            });
    }, [id, token]);

    const handleCommentSubmit = () => {
        // 새로운 댓글을 서버로 전송
        postCommentApi(id, newComment, token) // postComment 함수는 새 댓글을 작성하기 위한 API 요청을 보내야 합니다
            .then(response => {
                // 새 댓글이 성공적으로 작성되면, commentData를 업데이트하거나 다시 불러오도록 구현
                getCommentApi(id, token)
                    .then(data => {
                        setCommentData(data.comments.reverse());
                    })
                    .catch(error => {
                        console.error('API 요청 중 오류 발생: ', error);
                    });
                // 새로운 댓글 상태 초기화
                setNewComment('');
            })
            .catch(error => {
                console.error('댓글 작성 중 오류 발생:', error);
            });
    };

    // bottomsheet
    const [commentID, setCommentID] = useState();
    const [isPostBottomSheet, setIsPostBottomSheet] = useState(false);
    const handlePostBottomSheet = () => {
        setIsPostBottomSheet(!isPostBottomSheet);
    };
    const [isCommentBottomSheet, setIsCommentBottomSheet] = useState(false);

    const handleCommentBottomSheet = comment_id => {
        setCommentID(comment_id);
        setIsCommentBottomSheet(!isCommentBottomSheet);
    };

    usePageHandler(
        'user',
        postData?.author.image,
        postData?.author.username,
        postData?.author.accountname,
    );

    const editPost = e => {
        e.stopPropagation();
        console.log('edit post');
    };
    const editComment = e => {
        e.stopPropagation();
        console.log('edit comment');
    };

    const deletePost = e => {
        e.stopPropagation();
        if (window.confirm('삭제하시겠습니까?')) {
            deletePostAPI(postData.id, token);
        }
        navigate(-1);
    };
    const deleteComment = e => {
        e.stopPropagation();
        if (window.confirm('삭제하시겠습니까?')) {
            deleteCommentApi(postData.id, commentID, token) //
                .then(() =>
                    getCommentApi(id, token)
                        .then(data => {
                            setCommentData(data.comments.reverse());
                        })
                        .catch(error => {
                            console.error('API 요청 중 오류 발생: ', error);
                        }),
                );
            handleCommentBottomSheet();
        }
    };
    return (
        <>
            <S.DetailPostCotainer>
                <S.DetailPostMain $isBottomSheet={isPostBottomSheet}>
                    {postData && ( // null이 아닌 경우에만 렌더링
                        <>
                            <S.ContentSection>
                                <div
                                    className="post"
                                    style={{ position: 'relative' }}
                                >
                                    <img
                                        src={postData?.image}
                                        alt="데스크 셋업 이미지"
                                    />
                                    {postContent?.deskoration.productItems?.map(
                                        (item, index) => (
                                            <Marker
                                                key={index}
                                                itemCount={index}
                                                markerLocation={{
                                                    left: item.marker.x,
                                                    top: item.marker.y,
                                                }}
                                                productItem={item}
                                                isDetail={true}
                                            />
                                        ),
                                    )}
                                </div>

                                <S.ContentButtonBox>
                                    <div>
                                        <button>
                                            <S.LikeIcon />
                                        </button>
                                        <button>
                                            <S.CommentIcon />
                                        </button>
                                    </div>
                                    <button onClick={handlePostBottomSheet}>
                                        {postData.author._id === myId && ( // post.author._id와 myId가 동일한 경우에만 보이게 함
                                            <S.Dots_verticalIcon />
                                        )}
                                    </button>
                                </S.ContentButtonBox>
                                <div className="user-name">
                                    {postData.author.username}
                                </div>
                                <p>{postContent?.deskoration.message}</p>
                            </S.ContentSection>

                            <S.CommentSection>
                                <S.CommentCounter>
                                    총 {commentData?.length}개의 댓글
                                </S.CommentCounter>
                                {commentData?.map((comment, index) => (
                                    <S.CommentItem key={index}>
                                        <S.ProfileImg
                                            src={comment.author.image}
                                            alt="사용자 이미지"
                                        />
                                        <div>
                                            <div>{comment.author.username}</div>
                                            <p>{comment.content}</p>
                                        </div>
                                        {comment.author._id === myId && (
                                            <button
                                                onClick={() =>
                                                    handleCommentBottomSheet(
                                                        comment.id,
                                                    )
                                                }
                                            >
                                                <S.Dots_verticalIcon />
                                            </button>
                                        )}
                                    </S.CommentItem>
                                ))}
                            </S.CommentSection>
                        </>
                    )}
                </S.DetailPostMain>
                <S.CommentInputContainer>
                    <S.CommentInputBox>
                        <input
                            type="text"
                            placeholder="메시지를 입력하세요"
                            className="input-text"
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                        />
                        <button onClick={handleCommentSubmit}>
                            <p>등록</p>
                        </button>
                    </S.CommentInputBox>
                </S.CommentInputContainer>

                <BottomSheet
                    isBottomSheet={isPostBottomSheet}
                    hadleBottomSheet={handlePostBottomSheet}
                    editFn={e => editPost(e)}
                    deleteFn={e => deletePost(e)}
                />
                <BottomSheet
                    isBottomSheet={isCommentBottomSheet}
                    hadleBottomSheet={handleCommentBottomSheet}
                    editFn={e => editComment(e)}
                    deleteFn={e => deleteComment(e)}
                />
            </S.DetailPostCotainer>
        </>
    );
};

export default DetailPost;

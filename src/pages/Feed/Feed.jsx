import React, { useEffect, useState } from 'react';
import * as S from './Feed.styled';
import usePageHandler from '../../hooks/usePageHandler';
import { getFeedApi, reportPostAPI } from '../../service/post_service';
import { postLikeApi, deleteLikeApi } from '../../service/like_service';
import { Link } from 'react-router-dom';
import SocialButton from '../../components/SocialButton/SocialButton';
import BottomSheet from '../../components/BottomSheet/BottomSheet';
import { useDispatch, useSelector } from 'react-redux';
import { openAlertModal } from '../../features/modal/alertModalSlice';
import AlertModal from '../../components/AlertModal/AlertModal';
import Loader from '../../components/Loading/Loader';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Feed = () => {
    const dispatch = useDispatch();
    const token = sessionStorage.getItem('Token');
    const queryClient = useQueryClient();

    // // 신고후에 보여줄 alertModal message
    // const [reportMessage, setReportMessage] = useState('');
    // const { isOpen } = useSelector(store => store.alertModal);

    // 신고하기를 위한 postId
    const [postId, setPostId] = useState();

    // // 신고하기 bootomsheet
    // const [isReportBottomSheet, setIsReportBottomSheet] = useState(false);
    // const handleReportBottomSheet = itemId => {
    //     setPostId(itemId);
    //     setIsReportBottomSheet(!isReportBottomSheet);
    // };

    // // 신고하기
    // const reportPost = e => {
    //     e.stopPropagation();
    //     reportPostAPI(postId, token) //
    //         .then(result => {
    //             if (result.message === '존재하지 않는 게시글입니다.') {
    //                 setReportMessage('게시글을 찾을 수 없습니다.');
    //                 dispatch(openAlertModal());
    //             } else {
    //                 setReportMessage('신고가 완료되었습니다.');
    //                 dispatch(openAlertModal());
    //             }
    //         })
    //         .catch(error => {
    //             console.error(error);
    //         });
    //     handleReportBottomSheet();
    // };

    usePageHandler('text', '팔로잉 피드');

    const {
        data: feedData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['getFeedApi', token],
        queryFn: () => getFeedApi(token),
        select: responseData =>
            responseData.posts.map(post => {
                const content = JSON.parse(post.content);
                const createdAt = {
                    year: new Date(post.createdAt).getFullYear(),
                    month: new Date(post.createdAt).getMonth() + 1,
                    date: new Date(post.createdAt).getDate(),
                };
                return { ...post, content: content, createdAt: createdAt };
            }),
    });

    const likeMutation = useMutation({
        mutationFn: ({ id, token }) => postLikeApi(id, token),
        onMutate: async ({ id }) => {
            await queryClient.cancelQueries({
                queryKey: ['getFeedApi', token],
            });
            const previousFeedData = queryClient.getQueryData([
                'getFeedApi',
                token,
            ]);

            queryClient.setQueryData(['getFeedApi', token], oldData => {
                return {
                    ...oldData,
                    posts: oldData.posts.map(post => {
                        if (post.id === id) {
                            return {
                                ...post,
                                hearted: true,
                                heartCount: post.heartCount + 1,
                            };
                        }
                        return post;
                    }),
                };
            });
            return { previousFeedData };
        },
        onError: (error, variables, context) => {
            queryClient.setQueryData(
                ['getFeedApi', token],
                context.previousFeedData,
            );
        },
        onSuccess: (data, { id }) => {
            console.log(data);
            queryClient.setQueryData(['getFeedApi', token], oldData => {
                return {
                    ...oldData,
                    posts: oldData.posts.map(post => {
                        if (post.id === id) {
                            return {
                                ...post,
                                hearted: data.post.hearted,
                                heartCount: data.post.heartCount,
                            };
                        }
                        return post;
                    }),
                };
            });
        },
    });

    const unLikeMutation = useMutation({
        mutationFn: ({ id, token }) => deleteLikeApi(id, token),
        onMutate: async ({ id }) => {
            await queryClient.cancelQueries({
                queryKey: ['getFeedApi', token],
            });
            const previousFeedData = queryClient.getQueryData([
                'getFeedApi',
                token,
            ]);

            queryClient.setQueryData(['getFeedApi', token], oldData => {
                return {
                    ...oldData,
                    posts: oldData.posts.map(post => {
                        if (post.id === id) {
                            return {
                                ...post,
                                hearted: false,
                                heartCount: post.heartCount - 1,
                            };
                        }
                        return post;
                    }),
                };
            });
            return { previousFeedData };
        },
        onError: (error, variables, context) => {
            queryClient.setQueryData(
                ['getFeedApi', token],
                context.previousFeedData,
            );
        },
        onSuccess: (data, { id }) => {
            queryClient.setQueryData(['getFeedApi', token], oldData => {
                return {
                    ...oldData,
                    posts: oldData.posts.map(post => {
                        if (post.id === id) {
                            return {
                                ...post,
                                hearted: data.post.hearted,
                                heartCount: data.post.heartCount,
                            };
                        }
                        return post;
                    }),
                };
            });
        },
    });

    const handleLike = (id, token, index) => {
        if (!feedData[index].hearted) {
            likeMutation.mutate({ id: id, token: token });
        } else {
            unLikeMutation.mutate({ id: id, token: token });
        }
    };

    if (isError) {
        console.error(error);
    }

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            {feedData.map((post, index) => {
                return (
                    <S.FeedContainer key={post.id}>
                        <S.FeedItemHeader>
                            <Link to={`/profile/${post.author.accountname}`}>
                                <S.UserInfoBox>
                                    <img
                                        src={post.author.image}
                                        alt="이미지"
                                        className="profile-img"
                                    />
                                    <div>
                                        <h4>{post.author.username}</h4>
                                        <p>{post.author.accountname}</p>
                                    </div>
                                </S.UserInfoBox>
                            </Link>
                            <button
                            // onClick={() => handleReportBottomSheet(post.id)}
                            >
                                <S.MoreIcon />
                            </button>
                        </S.FeedItemHeader>

                        <S.FeedDetailBox>
                            <Link to={`/detailpost/${post.id}`}>
                                <S.DetailImgBox>
                                    <img src={post.image} alt="게시글 이미지" />
                                </S.DetailImgBox>
                                <S.DetailMsg>
                                    {post.content.deskoration.message}
                                </S.DetailMsg>
                            </Link>
                            <div>
                                <SocialButton
                                    type={'like'}
                                    onClick={() =>
                                        handleLike(post.id, token, index)
                                    }
                                    isLike={post.hearted}
                                    likeCount={post.heartCount}
                                />
                                <Link to={`/detailpost/${post.id}`}>
                                    <SocialButton
                                        type={'comment'}
                                        commentCount={post.commentCount}
                                    />
                                </Link>
                            </div>
                            <S.FeedDate>
                                {`${post.createdAt.year}년 ${post.createdAt.month}월 ${post.createdAt.date}일`}
                            </S.FeedDate>
                        </S.FeedDetailBox>
                    </S.FeedContainer>
                );
            })}
            {/* <BottomSheet
                isBottomSheet={isReportBottomSheet}
                hadleBottomSheet={handleReportBottomSheet}
                oneButton
                children={'신고하기'}
                deleteFn={e => reportPost(e)}
            />
            {isOpen && <AlertModal alert={reportMessage} />} */}
        </>
    );
};

export default Feed;

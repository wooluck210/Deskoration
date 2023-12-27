import React, { useEffect, useState } from 'react';
import * as S from './UserProfile.styled';
import GradientButton from '../../components/GradientButton/GradientButton';
import { getUserProfileApi } from '../../service/profile_service';
import { getMyPostApi } from '../../service/post_service';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Loader from '../../components/Loading/Loader';
import usePageHandler from '../../hooks/usePageHandler';
import { postFollowApi, deleteFollowApi } from '../../service/follow_service';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useQuery, useMutation } from '@tanstack/react-query';

const UserProfile = () => {
    // const [isLoading, setIsLoading] = useState(false);
    // const [userPost, setUserPost] = useState(null);
    const [expandedContent, setExpandedContent] = useState(false);
    const { username } = useParams(); //선택한 게시물 아이디 값
    const token = sessionStorage.getItem('Token');
    const myAccountName = sessionStorage.getItem('AccountName');

    const navigate = useNavigate();

    const { data: profileData } = useQuery({
        staleTime: 5000,
        // refetchInterval: 5000,
        // refetchIntervalInBackground: true,
        queryKey: ['getUserProfileApi', username, token],
        queryFn: () =>
            getUserProfileApi(username, token).then(data => data.profile),
    });

    console.log(profileData);

    const { data: userPost } = useQuery({
        staleTime: 5000,
        // refetchInterval: 5000,
        // refetchIntervalInBackground: true,
        queryKey: ['getMyPostApi', profileData?.accountname, token],
        queryFn: () => {
            if (profileData) {
                return getMyPostApi(profileData.accountname, token).then(data =>
                    data.filter(item => item.content.includes('"deskoration')),
                );
            }
            return [];
        },
        enabled: !!profileData?.accountname,
    });

    usePageHandler('text', profileData?.username);

    if (profileData === null || userPost === null) {
        return <Loader />;
    }

    const toggleExpandedContent = () => {
        setExpandedContent(!expandedContent);
    };

    const userFollowToggle = async accountname => {
        try {
            let updatedFollow;
            if (profileData?.isfollow) {
                const response = await deleteFollowApi(token, accountname);
                updatedFollow = response.profile?.isfollow;
            } else {
                const response = await postFollowApi(token, accountname);
                updatedFollow = response.profile?.isfollow;
            }

            const updatedFollowerData = {
                ...profileData,
                isfollow: updatedFollow,
            };

            // setProfileData(updatedFollowerData);
        } catch (error) {
            console.error('API 요청 중 오류 발생:', error);
        }
    };

    const fetchRoomId = async () => {
        try {
            let chatRoomId = '';
            const roomRef = collection(db, 'rooms');
            const roomSnapshot = await getDocs(
                query(
                    roomRef,
                    where('participants', 'array-contains', myAccountName),
                ),
            );

            for (let room of roomSnapshot.docs) {
                const data = room.data();
                let result = data.participants.includes(
                    profileData.accountname,
                );
                if (result) {
                    chatRoomId = data.roomId;
                    break;
                }
            }

            if (chatRoomId) {
                navigate(`/chat/${chatRoomId}`, {
                    state: {
                        roomId: chatRoomId,
                        user: {
                            accountname: profileData.accountname,
                            username: profileData.username,
                            image: profileData.image,
                        },
                    },
                });
            } else {
                navigate(`/chat/${profileData.accountname}`, {
                    state: {
                        user: {
                            accountname: profileData.accountname,
                            username: profileData.username,
                            image: profileData.image,
                        },
                    },
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <S.ProfileContainer>
                <S.UserInfo>
                    <img
                        src={profileData?.image}
                        alt="userImage"
                        className="user-img"
                    />

                    <div className="user-introduce">
                        <p className="user-name">{profileData?.username}</p>
                        <p className="user-info">
                            {expandedContent
                                ? profileData?.intro
                                : profileData?.intro?.slice(0, 53)}
                            {profileData?.intro?.length > 30 && (
                                <S.ToggleButton
                                    type="button"
                                    onClick={toggleExpandedContent}
                                >
                                    {expandedContent ? '접기' : '...더보기'}
                                </S.ToggleButton>
                            )}
                        </p>
                    </div>
                </S.UserInfo>

                <S.UserDataList>
                    <p>
                        <span>{userPost?.length}</span>
                        <span>게시물</span>
                    </p>

                    <Link to={`/followerList`}>
                        <p>
                            <span>{profileData?.followerCount}</span>
                            <span>팔로워</span>
                        </p>
                    </Link>
                    <Link to="/followingList">
                        <p>
                            <span>{profileData?.followingCount}</span>
                            <span>팔로잉</span>
                        </p>
                    </Link>
                </S.UserDataList>
                <div className="gradient_btn">
                    <GradientButton
                        type={'button'}
                        // gra={'true'}
                        gra={!profileData?.isfollow ? true : false}
                        width={'100%'}
                        padding={'10px'}
                        onClick={() =>
                            userFollowToggle(profileData?.accountname)
                        }
                    >
                        {/* 팔로우 */}
                        {!profileData?.isfollow ? '팔로우' : '팔로잉'}
                    </GradientButton>
                    <GradientButton
                        type={'button'}
                        gra={''}
                        width={'100%'}
                        padding={'10px'}
                        onClick={fetchRoomId}
                    >
                        메시지 보내기
                    </GradientButton>
                </div>
                <S.UserPostings>
                    {userPost?.map((post, index) => (
                        <Link key={post.id} to={`/detailPost/${post.id}`}>
                            <img src={post.image} alt="게시물 목록" />
                        </Link>
                    ))}
                </S.UserPostings>
            </S.ProfileContainer>
            <S.MoreButton>
                <S.MoreIcon />
            </S.MoreButton>
        </>
    );
};

export default UserProfile;

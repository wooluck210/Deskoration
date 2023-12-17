import React, { useState, useEffect } from 'react';
import * as S from './ProfileUpload.styled';
import basicImg from '../../assets/images/basicImg.png';
import { Input } from '../../components/Input/Input';
import { uploadImgApi } from '../../service/img_service';
import {
    authLoginApi,
    authSignUpApi,
    validAccountNameApi,
} from '../../service/auth_service';
import {
    updateProfileApi,
    getMyProfileApi,
} from '../../service/profile_service';
import GradientButton from '../../components/GradientButton/GradientButton';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import imageCompression from 'browser-image-compression';
import usePageHandler from '../../hooks/usePageHandler';
import { useQuery, useMutation } from '@tanstack/react-query';

export const ProfileUpload = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = sessionStorage.getItem('Token');
    const editPage = location.pathname.includes('/profileEdit');

    const baseURL = 'https://api.mandarin.weniv.co.kr/';
    const noImage = 'Ellipse.png';

    const [photoURL, setPhotoURL] = useState(basicImg);
    const [isImageAdded, setIsImageAdded] = useState(false);
    const [file, setFile] = useState();
    const { emailValue, passwordValue } = useLocation().state || {};

    // 헤더에 문구 넣기
    usePageHandler('text', '프로필 설정');

    const {
        register,
        handleSubmit,
        setValue,
        setFocus,
        formState: { errors, isValid },
    } = useForm({
        mode: 'onSubmit',
        defaultValues: {
            userName: '',
            userID: '',
            intro: '',
        },
    });

    // 초기 렌더링 시에 포커스
    useEffect(() => {
        setFocus('userName');
    }, [setFocus]);

    // 프로필 편집일 경우, API 호출해서 데이터 받아오기
    const { data: myProfileData } = useQuery({
        queryKey: ['getMyProfileApi', token],
        queryFn: () => getMyProfileApi(token),
        enabled: !!editPage,
    });

    useEffect(() => {
        if (myProfileData) {
            const userData = myProfileData.user;
            setPhotoURL(userData.image);
            if (baseURL + noImage !== userData.image) {
                setIsImageAdded(true);
            }

            // 불러온 데이터를 화면에 렌더링
            setValue('userName', userData.username);
            setValue('userID', userData.accountname);
            setValue('intro', userData.intro);
        }
    }, [myProfileData, setValue]);

    // 업로드한 이미지 url 저장
    const handleUploadImg = async event => {
        const regex = new RegExp(/(.png|.jpg|.jpeg|.gif|.tif|.heic|bmp)/);

        const file = event.target.files[0];
        if (!file) return;

        const options = {
            maxSizeMB: 5,
        };
        const fileTypeOptions = { ...options, fileType: 'image/jpeg' };

        try {
            const compressedBlob = await imageCompression(
                file,
                regex.test(file) ? options : fileTypeOptions,
            );
            const compressedFile = new File(
                [compressedBlob],
                regex.test(file)
                    ? compressedBlob.name
                    : compressedBlob.name.split('.')[0] + '.jpeg',
                {
                    type: compressedBlob.type,
                },
            );
            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);
            reader.onloadend = () => {
                const imgData = new FormData();
                imgData.append('image', compressedFile);
                uploadImgApi(imgData, setFile);
                setPhotoURL(reader.result);
            };
            setIsImageAdded(true);
        } catch (e) {
            console.log(e);
        }
    };

    // 이미지 삭제
    const deleteImg = () => {
        setIsImageAdded(false);
        setPhotoURL(basicImg);
    };

    //계정 ID 검사
    const validateUserID = id => {
        return validAccountNameApi(id)
            .then(result => {
                if (result.message === '사용 가능한 계정ID 입니다.') {
                    return true;
                } else if (result.message === '이미 가입된 계정ID 입니다.') {
                    return false;
                } else {
                    throw new Error(result.message);
                }
            })
            .catch(error => {
                console.error(error);
                return false;
            });
    };

    // 로그인 API
    const logInMutation = useMutation({
        mutationFn: ({ emailValue, passwordValue }) =>
            authLoginApi(emailValue, passwordValue),
        onSuccess: data => {
            sessionStorage.setItem('Token', data.user.token);
            sessionStorage.setItem('AccountName', data.user.accountname);
            sessionStorage.setItem('Id', data.user._id);
            navigate('/home');
        },
    });

    // 회원가입 API
    const signUpMutation = useMutation({
        mutationFn: userData => authSignUpApi(userData),
        onSuccess: data => {
            if (data.message === '회원가입 성공') {
                logInMutation.mutate({ emailValue, passwordValue });
            } else {
                console.error(data.message);
            }
        },
    });

    // 프로필 편집 API
    const profileUpdateMutation = useMutation({
        mutationFn: ({ token, userData }) => updateProfileApi(token, userData),
        onSuccess: data => {
            sessionStorage.setItem('AccountName', data.user.accountname);
            navigate('/profile');
        },
    });

    // submit 함수
    const dataSubmit = async submitData => {
        console.log(isValid);
        //회원 가입 시 초기 프로필 설정일 경우
        if (isValid && !editPage) {
            const userData = {
                user: {
                    username: submitData.userName,
                    email: emailValue,
                    password: passwordValue,
                    accountname: submitData.userID,
                    intro: submitData.intro,
                    image: !file ? baseURL + noImage : baseURL + file,
                },
            };
            signUpMutation.mutate(userData);
        }
        // 프로필 편집일 경우
        if (isValid && editPage) {
            const userData = {
                user: {
                    username: submitData.userName,
                    accountname: submitData.userID,
                    intro: submitData.intro,
                    image:
                        !file && photoURL === basicImg
                            ? baseURL + noImage
                            : !file && photoURL
                            ? myProfileData.user.image
                            : baseURL + file,
                },
            };
            profileUpdateMutation.mutate({ token, userData });
        }
    };

    return (
        <section>
            <S.ProfileContainer>
                <form onSubmit={handleSubmit(dataSubmit)}>
                    <S.ProfileImgBox>
                        <S.ProfileImg src={photoURL} alt="프로필 이미지" />
                        {isImageAdded && (
                            <S.DeleteButton type="button" onClick={deleteImg}>
                                <S.DeleteIcon />
                            </S.DeleteButton>
                        )}
                        <S.ImgUploadBox>
                            <S.ImgUploadInput
                                type="file"
                                id="profileUpload"
                                onChange={handleUploadImg}
                            />
                            <S.ImgUploadLabel htmlFor="profileUpload">
                                <S.ImgUploadIcon />
                            </S.ImgUploadLabel>
                        </S.ImgUploadBox>
                    </S.ProfileImgBox>
                    <S.InputBox>
                        <Input
                            label={'사용자 이름'}
                            id={'userName'}
                            error={errors.userName}
                            placeholder={'2~10자 이내여야 합니다.'}
                            register={register}
                            registerOptions={{
                                required: '필수 정보를 입력하세요.',
                                minLength: {
                                    value: 2,
                                    message: '2~10자 이내여야 합니다.',
                                },
                                maxLength: {
                                    value: 10,
                                    message: '2~10자 이내여야 합니다.',
                                },
                            }}
                        />
                        <Input
                            label={'계정 ID'}
                            id={'userID'}
                            error={errors.userID}
                            placeholder={
                                '영문, 숫자, 특수문자(.),(_)만 사용 가능합니다.'
                            }
                            register={register}
                            registerOptions={{
                                required: '필수 정보를 입력하세요.',
                                pattern: {
                                    value: /^[a-zA-Z0-9._]+$/,
                                    message:
                                        '영문, 숫자, 특수문자(.),(_)만 사용 가능합니다.',
                                },
                                validate: async id => {
                                    const result = await validateUserID(id);
                                    return (
                                        result || '이미 가입된 계정ID 입니다.'
                                    );
                                },
                            }}
                        />
                        <Input
                            label={'소개'}
                            id={'intro'}
                            error={errors.intro}
                            placeholder={'자신을 소개해주세요.'}
                            register={register}
                        />
                    </S.InputBox>
                    <GradientButton
                        children={
                            editPage
                                ? '프로필 변경하기'
                                : 'Deskoration 시작하기'
                        }
                        type={'submit'}
                        gra={true}
                        width={'100%'}
                        padding={'20px'}
                    />
                </form>
            </S.ProfileContainer>
        </section>
    );
};

export default ProfileUpload;

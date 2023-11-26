import styled from 'styled-components';
import { ReactComponent as Back } from '../../assets/images/Backward.svg';
import theme from '../../styles/theme';
import { ReactComponent as Dots_vertical } from '../../assets/images/Dots_vertical.svg';

export const Dots_verticalIcon = styled(Dots_vertical)`
    width: 24px;
    height: 24px;
`;

export const DetailPostCotainer = styled.div`
    height: 100%;
`;

// 댓글창 헤더
export const DetailPostHeader = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    margin: 0 25px;
`;

// 댓글 영역
export const DetailPostUser = styled.div`
    display: flex;
    align-items: center;
    /* gap: 5px; */

    div {
        font-weight: bold;
        font-size: 16px;
    }
`;

export const BackIcon = styled(Back)`
    vertical-align: top;
`;

export const ProfileImg = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid ${props => props.theme.border};
    background-size: cover;
    background-position: center;
    box-sizing: border-box;
    margin-right: 10px;
`;

export const DetailPostMain = styled.div`
    /* overflow-y: ${props => !props.$isBottomSheet && 'scroll'}; */

    padding-bottom: 10px;
`;

export const ContentSection = styled.section`
    margin-bottom: 10px;
    > div > img {
        width: 100%;
        margin-bottom: 10px;
        border-radius: 20px;
        border: 1px solid ${props => props.theme.border};
    }

    .user-name {
        font-size: 16px;
        font-family: 'PreBold';
        margin-bottom: 10px;
    }

    p {
        word-wrap: break-word;
    }
`;

export const ContentButtonBox = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
`;

export const CommentSection = styled.section`
    padding-top: 20px;
    border-top: 1px solid #d9d9d9;
`;

export const CommentCounter = styled.div`
    color: ${theme.subFont};
    margin-bottom: 20px;
`;

export const CommentItem = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;

    &:last-child {
        margin-bottom: 0;
    }

    button {
        color: ${theme.subFont};
        font-size: 10px;
        padding: 10px 0 10px 10px;
    }
`;

export const CommentInfo = styled.div`
    display: flex;
    align-items: center;
    span {
        font-family: 'PreBold';
        font-size: 12px;
        margin-bottom: 5px;
    }

    p {
        width: 200px;
        font-size: 12px;
        word-wrap: break-word;
        overflow-wrap: break-word;
    }
`;

export const CommentInputContainer = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    padding: 15px;
    border-top: 1px solid ${props => props.theme.border};
`;

export const CommentInputBox = styled.div`
    border: 1px solid #ccc;
    border-radius: 5px;

    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding: 15px;

    &:focus-within {
        outline: 2px solid ${theme.main};
    }

    input {
        width: 100%;
        font-size: 14px;
    }

    button {
        color: ${props => props.theme.point};
        font-weight: 700;
        width: 50px;
    }
`;

export const CommentButton = styled.button`
    padding: 5px;
`;

export const FollowBtnBox = styled.div`
    position: absolute;
    top: 15px;
    right: 25px;
`;

export const BottomSheetControlButton = styled.button``;

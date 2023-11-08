# Deskoration
사람들은 일을 하기 위해, 공부를 하기 위해, 게임을 하기 위해 등등 다양한 이유로 침대보다 책상에서 더 오랜 시간을 보냅니다. 저희 데스코레이션은 오랜 시간을 책상에서 보내야 하는 여러분의 시간을 단조로움이 아닌 새로움으로 채우고자 시작했습니다.
저희 프로젝트는 데스크테리어 SNS로 사용자들은 나만의 데스크셋업을 업로드하고, 소통할 수 있습니다. 사용자들은 본인만의 데스크테리어와 실제 사용감을 공유함으로써 단순한 공간 변화를 넘어, 나만의 소중한 공간을 꾸며나갈 수 있습니다.


## 팀원
|                                                                     이예진                                                                      |                                                                        문정민                                                                         |                                                                        우준하                                                                         |                                                                     최현진                                                                      |
| :---------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------: |
| ![예니](https://github.com/FRONTENDSCHOOL7/final-14-Deskoration/assets/108519185/2106ba6a-e625-4f5b-be7f-9829bc2acde5) | ![정민](https://github.com/FRONTENDSCHOOL7/final-14-Deskoration/assets/108519185/dcd37cdc-375c-43bc-a420-dc609ee9aa4a) | ![준하](https://github.com/FRONTENDSCHOOL7/final-14-Deskoration/assets/108519185/9030e323-defa-4b38-8bd3-0fe3a34c8ce8) | ![현진](https://github.com/FRONTENDSCHOOL7/final-14-Deskoration/assets/108519185/d60c8a3d-7271-4b9c-ac4d-6144ff04494a) |
| 리더 | 디자인 | 기록 | API | 
| <a href="https://github.com/YennieJ"><img src="https://img.shields.io/badge/YennieJ-181717?style=flat-square&logo=github&logoColor=white"/></a> | <a href="https://github.com/jungmin801"><img src="https://img.shields.io/badge/jungmin801-181717?style=flat-square&logo=github&logoColor=white"/></a> | <a href="https://github.com/wooluck210"><img src="https://img.shields.io/badge/wooluck210-181717?style=flat-square&logo=github&logoColor=white"/></a> | <a href="https://github.com/Herrypi"><img src="https://img.shields.io/badge/Herrypi-181717?style=flat-square&logo=github&logoColor=white"/></a> |



## 📚 Stacks

### Development

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React-router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![styled-components](https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)

### Communication

![discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)
![google-sheets](https://img.shields.io/badge/Google%20Sheets-34A853?style=for-the-badge&logo=google-sheets&logoColor=white)
![figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)

## 기능
### 1. 이미지 등록 후 아이템을 태그할 수 있습니다.

![6  마커이동](https://github.com/FRONTENDSCHOOL7/final-14-Deskoration/assets/108519185/fd037cb0-d61d-4396-9cd7-1181517da0c3)

### 1-1 이슈

<img width="535" alt="styled" src="https://github.com/FRONTENDSCHOOL7/final-14-Deskoration/assets/108519185/70f61fdc-65c5-4ac2-95ad-5c4da07aebf8">

styled-components에서 position을 설정 했을때, 마커의 위치가 변경되며 동적인 스타일 변화로 인해 클래스 이름이 계속 변경되면서 브라우저가 스타일을 재계산 하고 그로 인해 DOM 업데이트로 렌더링이 많이 발생해 플리커링 현상을 발견했습니다.

![해결전](https://github.com/FRONTENDSCHOOL7/final-14-Deskoration/assets/108519185/4915dc77-47a5-4863-972b-9ba68e50a546)

### 2-1 문제 개선

<img width="535" alt="inline" src="https://github.com/FRONTENDSCHOOL7/final-14-Deskoration/assets/108519185/6165e771-8023-402c-a6a3-e73bb1d301b1">

인라인 스타일 사용으로 새로운 클래스 이름 생성을 피하여 DOM 삽입 과정을 거치지 않아 브라우저가 CSSOM을 업데이트하는 과정을 생략하여 스타일 계산 시간을 절약하고 메모리의 사용량을 줄여 플리커링 현상을 해결했습니다.
![해결후](https://github.com/FRONTENDSCHOOL7/final-14-Deskoration/assets/108519185/bf808ba9-690b-49dc-967b-a1675ab9474e)

## 앞으로의 리팩토링 (12월 중순)
- 시맨틱 마크업, 반응형 웹
- 라이브러리 (react-query, react-hook-form)
- API (지도)



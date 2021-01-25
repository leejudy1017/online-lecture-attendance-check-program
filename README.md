# CAPSTONE

# WEB

## 프로젝트 클론

```powershell
$ git clone https://github.com/Zih0/capstone-10.git
```

## Node.js 설치

```powershell
#Mac brew 이용

$ brew install node
```

## yarn 설치

```powershell
#Mac brew 이용
$ brew install yarn --without-node # node 가 설치되어있다면
$ brew install yarn # node 가 없다면
```

## 사용된 라이브러리 설치 (back-end)

```powershell
/
$ npm install
or
$ yarn
```

## 서버 실행

```powershell

$ yarn dev # react + node 동시에 켜기

$ yarn start # node 켜기

$ yarn backend # nodemon을 이용해 node 켜기

$ yarn frontend # 리액트 켜기
```

## 몽고DB 연동

```powershell
 /server/config/dev.js
```

![CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/_2020-12-07__5.40.33.png](CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/_2020-12-07__5.40.33.png)

mongoDB 주소 를 적는다.

## 카카오OCR API KEY 발급

[https://developers.kakao.com/](https://developers.kakao.com/)

카카오에서 api 키 발급 후, /server/routes/datas.js 카카오OCR 사용 부분에 api 키 삽입

![CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/_2020-12-07__5.44.26.png](CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/_2020-12-07__5.44.26.png)

## Python-Shell

node.js의 python-shell 이용 시, py 파일 경로 및 python 경로 설정

## 사용된 라이브러리 설치 (front-end)

```powershell
/client/

$ npm install
or
$ yarn
```

## 앱 빌드

```powershell
$ yarn build
```

## 웹페이지

### 교수님 페이지

회원가입 - 학과 선택, 신분증 인증 후 가입 처리

![CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/_2020-12-09__8.33.04.png](CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/_2020-12-09__8.33.04.png)

출석부 - 출석 프로그램으로 출석한 수업만 불러 옴.

![CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/_2020-12-09__8.33.26.png](CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/_2020-12-09__8.33.26.png)

### 학생 페이지

회원가입 - 학생증 또는 e-id에서 학번 추출

![CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/_2020-12-09__8.29.09.png](CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/_2020-12-09__8.29.09.png)

![CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/_2020-12-09__8.32.50.png](CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/_2020-12-09__8.32.50.png)

얼굴 등록 - PC의 경우, 웹캠 또는 동영상으로 등록 가능 ( 10초 녹화 ) , 모바일의 경우 핸드폰 카메라와 동영상으로 등록 가능

[react-webcam](https://github.com/mozmorris/react-webcam)

[react-dropzone](https://react-dropzone.js.org/)

![CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/_2020-12-09__8.31.49.png](CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/_2020-12-09__8.31.49.png)

수업 등록 - 수강중인 수업 등록

![CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/_2020-12-09__8.32.21.png](CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/_2020-12-09__8.32.21.png)

# AI

## 사용된 모듈

[requiremts.txt](CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/requiremts.txt)

## 사용자 얼굴 등록 시

### 사용자 얼굴 임베딩

1. 전처리
   1. dlib.get_frontal_face_detector() 을 활용하여 얼굴을 제외한 부분 제거.
   2. dlib 의 facial landmark detector을 활용하여 얼굴 위치 재 정렬
2. 임베딩
   1. openface를 활용하여 얼굴 이미지 임베딩
3. 1, 2 의 과정을 영상의 모든 프레임에 적용하여 저장

## 강의 별 모델 생성

### 모델 생성

1. 강의에 변동 여부(추가된 학생 혹은 제외된 학생) 확인
2. 변동이 있다면 DB에서 수강중인 학생 리스트 확인
3. 리스트의 학생들의 임베딩했던 데이터를 trainset에 추가
4. SVC 모델 학습
5. 모델과 라벨을 저장

### 자동화

리눅스 쉘에 다음과 같이 입력하여 crontab 설정을 연다.

```bash
$crontab -e
```

크론탭 설정의 맨 밑에 m(분) h(시간) dom(날짜) mon(개월) dow(요일)에 원하는 값을 넣고 원하는 command를 추가하여 자동적으로 실행되게 한다.

```
# m h dom dow  command
0 * * * * python3 /home/ubuntu/faceRecog/classUpdate.py
```

SVC의 경우 학습에 많은 시간이 소요되지 않음으로 매 시간 실행되도록 설정해 두었다.

# 줌 영상을 통한 학생 얼굴 구별

1. 전처리
   1. 학번 인식을 활용한 학생 화면 별 이미지 분할
   2. 강의 이름과 학번에 따른 디렉토리에 이미지 저장
2. 학생 확인
   1. 각 디렉토리를 순회하며 각 이미지를 전처리 후 임베딩.
   2. 해당 강의의 모델을 활용하여 학번 예측 후 예측 결과를 리스트에 저장
   3. 2, 3 의 과정을 디렉토리의 모든 이미지에 적용
   4. 리스트에 가장 많이 등장한 학번과 화면의 학번을 비교하여 본인 확인
3. 제스쳐 확인
   1. mediapipe를 통해 손의 landmark 위치 파악
   2. 각 랜드마크별 거리와 각도에 따라 손가락의 위치 및 형태 파악
   3. argument 로 주어진 제스처와 landmarks를 통하여 예측한 제스처가 일치하는지 확인.

# GUI

## **How to use GUI ?**

GUI 로 직접 출석체크 프로그램을 실행한다. 출석체크 프로그램을 실행하는 주체는 수업을 주관하는 교수 또는 담당자로, 이들에게 GUI 프로그램을 제공한다.

\*프로그램을 이용하기 위해서는 chul-check/professor (join) 을 통해 교수(담당자) 회원가입을 진행하고 관리자에게 권한을 부여받아야 한다.

**1. 자동 출석체크 / 수동 출석체크 선택**

**2. 출석체크**

: 자동 출석체크를 통해서 화상 강의에 참석한 학생들의 얼굴과 학번을 DB의 데이터와 대조하여 자동으로 출석체크를 진행한다.

2-1) 자동 출석체크

: 자동 출석체크를 통해서 화상 강의에 참석한 학생들의 얼굴과 학번을 DB의 데이터와 대조하여 자동으로 출석체크를 진행한다.

2-1-1) 제스쳐 인식 (\*선택)

: 학생들에게 제스쳐를 취하게 하므로써 사진이나 영상을 띄어놓는 경우를 걸러낼 수 있고, 수업의 집중도 또한 파악할 수 있다. 현재 손가락 제스쳐를 인식하도록 되어있고 1~5까지의 숫자로 인식이 가능하다.

2-2) 수동 출석체크

: 수동 출석체크를 통해서 화상 강의에 참석한 학생들의 학번으로 DB에 저장된 처음 회원가입시 등록한 학생증 사진을 가져온다. 이들의 얼굴을 교수에게 제공하고, 교수는 직접 둘의 대조,분석하여 출석체크를 수동으로 진행한다.

**3. 화면녹화**

: 약 5초가량의 화면 녹화가 이루어진다. 'q' 를 누르면 화면 녹화가 끝나고 2 에서 선택한 사항에 따라 출석체크가 이루어진다.

\*학생들의 이름은 20으로 시작되는 8자리 학번으로 지정한다.

\*높은 정확도를 위해 마스크나 모자를 쓰지 않고 얼굴 정면이 잘 보이도록 한다.

**4. 결과출력**

4-1) 자동 출석체크

: 임베딩을 통해 도출된 결과를 교수에게 명시적으로 보여주고, 해당 수업 주차의 출결정보를 DB에 업로드 한다. 학생 또한 본인의 출결정보를 웹에서 확인할 수 있다.

4-2) 수동 출석체크

: 학번으로 찾아낸 학생의 학생증 사진과 화상강의에서 출력된 사진을 교수에게 제공하여 직접 출결을 승인하도록 한다.

\*이때, 해당 학번으로 등록된 학생이 없다면 default 값으로 출석체크 프로그램의 로고가 출력된다.

## **Screenshot**

![CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/3.png](CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/3.png)

초기 이미지

( join: professor 회원가입 웹페이지연결)

![CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/4.png](CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/4.png)

DB 정보 가져오기

![CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/5.png](CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/5.png)

로그인 된 professor의 수업정보와 주차 선택

![CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/7.png](CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/7.png)

1. 자동 출석체크 / 수동 출석체크 선택

![CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/6.png](CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/6.png)

![CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/8.png](CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/8.png)

2-1) 자동 출석체크

![CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/10.png](CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/10.png)

3.  화면 녹화

![CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/11.png](CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/11.png)

4-1) 자동 출석체크 결과 화면

![CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/9.png](CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/9.png)

2-1-1) 제스쳐 인식

![CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/1.png](CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/1.png)

4-2) 수동 출석체크 결과 화면

![CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/2.png](CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/2.png)

4-2) 해당 학번의 학생정보가 존재하지 않으면

default image 로 출력됨

# **Requirements**

[requirements.txt](CAPSTONE%202d33f200735d4fa2a5e30ece2f871dc6/requirements.txt)

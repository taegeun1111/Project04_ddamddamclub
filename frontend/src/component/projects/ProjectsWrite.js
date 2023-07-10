import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import PropTypes from 'prop-types';
import {getToken} from '../common/util/login-util';
import Common from '../common/Common';
import './scss/ProjectsWrite.scss';
import { PROJECT } from '../common/config/HostConfig';
import ProjectsTitle from './main/ProjectsTitle';

const ProjectsWrite = () => {
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const tomorrowFormatted = tomorrow.toISOString();

  const [formData
    , setFormData] = useState({
    boardWriterIdx: '1',
    boardTitle: '',
    boardContent: `1. 프로젝트의 시작 동기\n\n\n2. 회의 진행/모임 방식\n\n\n3. 그외 자유기재`,
    projectType: 'Mobile Web',
    maxFront: '1',
    maxBack: '1',
    offerPeriod: tomorrowFormatted,
    projectImg: '',
  });
  const navigate = useNavigate();

  const ACCESS_TOKEN = getToken();

  const headerInfo = {
    'Authorization': 'Bearer ' + ACCESS_TOKEN
  }

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    // console.log(name + " : " + value);
  }

  const handleSubmit = () => {
    const projectJsonBlob = new Blob(
        [JSON.stringify(formData)],
        {type: 'application/json'}
    );

    const projectFormData = new FormData();
    projectFormData.append('project', projectJsonBlob);
    projectFormData.append('projectImage', $fileTag.current.files[0]);

    if (!formData.boardTitle) {
      window.alert('제목을 입력해주세요.');
      return; // 제목이 비어있으면 함수 종료
    }

    if (window.confirm("작성을 완료하시겠습니까?")) {
      fetch(PROJECT, {
        method: 'POST',
        headers: headerInfo,
        body: projectFormData,
      }).then(response => response.json())
          .then(data => {
            // setFormData(data.formData);
            // console.log("write post")
            // console.log(data);
            navigate('/projects')
          })
          .catch(error => {
            console.error(error); // Handle errors
          });
      // console.log(formData); // 예시: 콘솔에 데이터 출력
    }
  };

  const $fileTag = useRef();
  const [imgFile, setImgFile] = useState(null);

  const showThumbnailHandler = e => {

    const file = $fileTag.current.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImgFile(reader.result);
    }
    // console.log(`imgFile : ${imgFile}`)
  };

  return (
      <>
        <ProjectsTitle/>
        <Common className={'project-write-wrapper'}>

          {/* 이미지 */}
          <Grid item xs={12}>
            <div className="thumbnail-box" onClick={() => $fileTag.current.click()}>
              <img
                  src={imgFile || require('../../src_assets/image-add.png')}
                  alt="profile"
              />
            </div>
            <label className='signup-img-label' htmlFor='profile-img'>사진 추가하기</label>
            <input
                id='profile-img'
                type='file'
                accept='image/*'
                ref={$fileTag}
                style={{display: 'none'}}
                onChange={showThumbnailHandler}
            />
          </Grid>

          <section className={'write-form-wrapper'}>

            <div className={'title-input-wrapper'}>
              <h1 className={'sub-title'}>제목</h1>
              <input
                  type={"text"}
                  placeholder={'제목을 입력하세요'}
                  className={'title-text-input'}
                  name={'boardTitle'}
                  value={formData.boardTitle}
                  onChange={handleInputChange}
              />
            </div>

            <div className={'select-input-wrapper'}>
              <div className={'project-type'}>
                <div className={'sub-title'}>프로젝트 타입</div>
                <select className="subject-select"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleInputChange}
                >
                  <option value="Mobile Web">Mobile Web</option>
                  <option value="Web App">Web App</option>
                  <option value="Native App">Hybrid App</option>
                  <option value="Native App">Native App</option>
                </select>
              </div>


              <div className={'applicant'}>
                <div className={'sub-title'}>모집인원</div>
                <div className={'sub-title'}>프론트</div>
                <select className="mentee-text-input"
                        name="maxFront"
                        value={formData.maxFront}
                        onChange={handleInputChange}
                >
                  <option value="1">1명</option>
                  <option value="2">2명</option>
                  <option value="3">3명</option>
                  <option value="4">4명</option>
                  <option value="5">5명</option>
                </select>
                <div className={'sub-title'}>back</div>
                <select className="mentee-text-input"
                        name="maxBack"
                        value={formData.maxBack}
                        onChange={handleInputChange}
                >
                  <option value="1">1명</option>
                  <option value="2">2명</option>
                  <option value="3">3명</option>
                  <option value="4">4명</option>
                  <option value="5">5명</option>
                </select>
              </div>

              <div className={'offerPeriod'}>
                <h1 className={'sub-title'}>모집기간</h1>
                <input type={"datetime-local"}
                       placeholder={'기한을 입력해주세요'}
                       name="offerPeriod"
                       className={'current-text-input'}
                       value={formData.offerPeriod}
                       onChange={handleInputChange}
                />까지
              </div>
            </div>
          </section>

          <section>
                <textarea
                    className={'boardContent'}
                    name="boardContent"
                    value={formData.boardContent}
                    onChange={handleInputChange}
                />
          </section>

          <div className={'btn-wrapper'}>
            <Link to={'/projects'} className={'close-btn-a'}>
              <button className={'close-btn'}>취소하기</button>
            </Link>
            <button className={'submit-btn'}
                    onClick={handleSubmit}
            >작성완료
            </button>
          </div>
        </Common>
      </>
  );
};

export default ProjectsWrite;
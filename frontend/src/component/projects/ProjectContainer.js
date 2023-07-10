import React, {useEffect, useState, forwardRef, useImperativeHandle} from 'react';
import {useNavigate} from 'react-router-dom';
import Common from '../common/Common';
import less from '../../src_assets/less.png';
import than from '../../src_assets/than.png';
import logo from '../../src_assets/logo.png';

import ProjectsImage from './ProjectsImage';
import {PROJECT} from '../common/config/HostConfig';
import {da} from "date-fns/locale";

const ProjectContainer
    = ({
         projects
         , handleShowDetails
         , handleLikeClick
       }) => {

  return (
      <div className="project-list-container">
        {projects.map((p, index) => {
          // 현재 날짜와 게시글 작성일 간의 차이를 계산합니다
          const currentDate = new Date();
          const writeDate = new Date(p.projectDate);
          const timeDiff = Math.abs(currentDate - writeDate);
          const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
          // console.log(`new box : ${daysDiff}`)

          return (
              <section
                  className={'project-list'}
                  key={`${p.boardIdx}`}
                  onClick={() => handleShowDetails(p.boardIdx)}
              >
                <div className={'project-wrapper'}>
                  <ProjectsImage projectIdx={p.boardIdx}/>

                  <div className={'text-title'}>{p.boardTitle}</div>
                  <div className={'text-content'}>{p.boardContent}</div>
                  <div className={'project-type'}>
                    <div className={'type-text'}>
                      {p.projectType}
                    </div>
                  </div>
                  <div className={'project-completion'}>{p.completion ? '모집완료' : '모집중'}</div>
                  <div
                      className={'project-like-btn'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikeClick(p.boardIdx);
                      }}
                  >
                    <div className={'project-like'}>♥ {p.likeCount}</div>
                  </div>
                  {daysDiff <= 7 && (
                      <div className={'project-new-box'}>
                        <div className={'project-new'}>new</div>
                      </div>
                  )}
                </div>
              </section>
          );
        })}
      </div>
  );
};
export default ProjectContainer;
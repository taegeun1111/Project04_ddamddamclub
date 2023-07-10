import React, {useEffect, useState, forwardRef, useImperativeHandle} from 'react';
import {useNavigate} from 'react-router-dom';
import Common from '../common/Common';
import less from "../../src_assets/less.png";
import than from "../../src_assets/than.png";
import logo from '../../src_assets/logo.png'

import ProjectsImage from "./ProjectsImage";
import {PROJECT} from "../common/config/HostConfig";
import ProjectContainer from "./ProjectContainer";
import {useMediaQuery} from "react-responsive";
import PageNation from "../common/pageNation/PageNation";

const PopularProjects = forwardRef((
        {
          sortTitle,
          handleLikeClick,
          handleShowDetails,
          keyword,
          isLike
        },
        ref
    ) => {

      const navigate = useNavigate();
      const [projects, setProjects] = useState([]);
      const [pageNation, setPageNation] = useState([]);
      const [prevBtn, setPrevBtn] = useState(false);
      const [nextBtn, setNextBtn] = useState(false);
      //캐러셀
      const [carouselIndex, setCarouselIndex] = useState(1);
      const [clickCurrentPage, setClickCurrentPage] = useState(1);


      const currentPageHandler = (clickPageNum) => {
        // console.log(`page click: ${clickPageNum}`);
        setClickCurrentPage(clickPageNum);
      }

      useImperativeHandle(ref, () => ({
        fetchData
      }));

      const presentationScreen = useMediaQuery({
        query: "(max-width: 414px)",
      });

      let FETCH;
      let popPageSize = 3;

      if (presentationScreen) {
        popPageSize = 9;
        // console.log(`page size : ${popPageSize}`)
      }

      let popPage=carouselIndex;
      if (presentationScreen){
       popPage = clickCurrentPage;
      }
      if (!!keyword) {
        FETCH = `${PROJECT}?page=${popPage}&like=true&keyword=${keyword}&size=${popPageSize}`;
      } else {
        FETCH = `${PROJECT}?page=${popPage}&like=true&size=${popPageSize}`;
      }

      const fetchData = () => {
        fetch(FETCH, {
          method: 'GET',
          headers: {'content-type': 'application/json'}
        })
            .then(res => {
              if (res.status === 500) {
                alert('잠시 후 다시 접속해주세요.[서버오류]');
                return;
              }
              return res.json();
            })
            .then(result => {
              if (!!result) {
                // console.log(`result의 값 : `, result);
                // console.log(`projects : `, result.projects);
                // console.log(`pageInfo : `, result.pageInfo);
                setProjects(result.projects);
                setPageNation(result.pageInfo);
                // console.log(`carouselIndex : ${carouselIndex}`)
              }
            });
      };

      useEffect(() => {
        setCarouselIndex(1);
      }, [keyword]);

      useEffect(() => {
        fetchData();
      }, [carouselIndex, keyword, isLike,clickCurrentPage]);


        // 페이지 처리
        const handlePrevious = () => {
          if (pageNation.currentPage > 1) {
            // console.log(`pageNation.currentPage : ${pageNation.currentPage}`)
            setCarouselIndex(prevIndex => prevIndex - 1);
          }
        };

        let lastPage = Math.ceil(pageNation.totalCount / 3);
        if (presentationScreen){
          Math.ceil(lastPage=pageNation.totalCount/9);
        }

        const handleNext = () => {
          // console.log('handleNext')

          if (pageNation.currentPage < lastPage) {
            setCarouselIndex(prevIndex => prevIndex + 1);
            // console.log(`pageNation.currentPage : ${pageNation.currentPage}`)
          }
        };

      return (
          <Common className={'project-list-wrapper'}>

            {!presentationScreen &&
                <>
                  {pageNation.currentPage > 1 &&
                      <img src={less} alt={"less-icon"} className={'less-icon'} onClick={handlePrevious}/>
                  }

                  {pageNation.currentPage < lastPage &&
                      <img src={than} alt={"than-icon"} className={'than-icon'} onClick={handleNext}/>
                  }
                </>
            }

            <h2 className={'sort-title'}>{sortTitle}</h2>
            {projects.length > 0 ? (

                <ProjectContainer
                    projects={projects}
                    handleShowDetails={handleShowDetails}
                    handleLikeClick={handleLikeClick}
                />
            ) : (
                <p>게시글이 없습니다.</p>
            )}

            {presentationScreen &&
                <ul>
                  <PageNation
                      pageNation={pageNation}
                      currentPageHandler={currentPageHandler}
                      clickCurrentPage={clickCurrentPage}/>
                </ul>
            }

          </Common>
      );
    }
);

export default PopularProjects;

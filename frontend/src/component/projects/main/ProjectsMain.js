import React, {useState, useEffect, useRef} from 'react';
import PopularProjects from "../PopularProjects";
import Common from "../../common/Common";
import {PROJECT} from "../../common/config/HostConfig";
import {Link, useNavigate} from "react-router-dom";
import {Modal, Button} from 'react-bootstrap';
import {getToken, getUserPosition, isLogin} from "../../common/util/login-util";
import LatestProjects from "../LatestProjects";
import 'bootstrap/dist/css/bootstrap.css';
import '../scss/ProjectsMain.scss';
import {useMediaQuery} from "react-responsive";

const ProjectsMain = ({keyword}) => {

    // 토큰
    const ACCESS_TOKEN = getToken();
    const headerInfo = {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + ACCESS_TOKEN
    }
    const navigate = useNavigate();

    const childRef = useRef(null);

  const [isLike, setIsLike] = useState(false);
  const [showPopularProjects, setShowPopularProjects] = useState(true);


  // useEffect(() => {
  //   handlePageChange(likePage);
  //   // setPopularity(popularityUrl);
  // }, [likePage, popularity])

  const handleLikeClick = (projectId) => {
    // 서버에 좋아요 처리를 위한 POST 요청을 보냅니다
    fetch(PROJECT + `/like/${projectId}`, {
      method: 'POST',
      headers: headerInfo
    })
        .then(res => {
          if (res.status === 200) return res.json()
        })
        .then(data => {
          // console.log(data);
          setIsLike(!isLike);
        })
        .catch(error => {
          // console.log('Error:', error);
        });
  };


  const handleShowDetails = (projectIdx) => {
    // console.log('게시판 번호: ', projectIdx);

        if (isLogin()) {
            navigate(`/projects/detail?projectIdx=${projectIdx}`);
        } else {
            alert('로그인 후에 이용할 수 있습니다.');
            navigate('/login');
        }
    };


  useEffect(() => {
    childRef.current.fetchData();
  }, [isLike]);

  // console.log(`is login ? ${isLogin()}`);

    const handleWriteClick = () => {
        if (isLogin()) {
            navigate('/projects/write');
        } else {
            alert('로그인이 필요합니다.');
            navigate('/login');
        }
    };

  const presentationScreen = useMediaQuery({
    query: "(max-width: 414px)",
  });

  const handleSortButtonClick = (showLatest) => {
    setShowPopularProjects(showLatest);
  };

  return (
      <Common>
        <button className={'projects-write-btn'} onClick={handleWriteClick}>
          작성하기
        </button>
        {presentationScreen &&
            <>
              <div className={'project-sort-list'}>
                <button
                    onClick={() => handleSortButtonClick(true)}
                    className={'btn latest-btn'}
                >
                  최신순
                </button>

                <button
                    onClick={() => handleSortButtonClick(false)}
                    className={'btn pop-btn'}
                >
                  인기순
                </button>
              </div>
            </>
        }

        {(!presentationScreen || !showPopularProjects) &&
            <PopularProjects
                // url={popularity}
                sortTitle={'인기 프로젝트'}
                handleLikeClick={handleLikeClick}
                handleShowDetails={handleShowDetails}
                ref={childRef}
                keyword={keyword}
                isLike={isLike}
            />
        }

        {(!presentationScreen || showPopularProjects) &&

            <LatestProjects
                // url={currentUrl}
                sortTitle={'최신 프로젝트'}
                handleLikeClick={handleLikeClick}
                handleShowDetails={handleShowDetails}
                ref={childRef}
                keyword={keyword}
            />
        }
      </Common>


  );
};
export default ProjectsMain;
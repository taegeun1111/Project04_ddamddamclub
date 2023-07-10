import React, {useEffect, useState} from 'react';
import "./scss/MypageBoardList.scss";
import {BASE_URL, MYPAGE} from '../common/config/HostConfig';
import {getToken, isLogin} from "../common/util/login-util";
import PageNation from "../common/pageNation/PageNation";
import {Link, useNavigate} from "react-router-dom";
import {httpStateCatcher} from "../common/util/HttpStateCatcherWrite";
import {useMediaQuery} from "react-responsive";

/**
 * 내가 쓴 게시글 목록
 */
const MypageBoardList = () => {

  const ACCESS_TOKEN = getToken();
  const API_BASE_URL = BASE_URL + MYPAGE;
  const redirection = useNavigate();

  // headers
  const headerInfo = {
    'content-type': 'application/json',
    'Authorization': 'Bearer ' + ACCESS_TOKEN
  }

  const [boardList, setBoardList] = useState([]);
  const [pageNation, setPageNation] = useState([]);
  const [clickCurrentPage, setClickCurrentPage] = useState(1);
  const [prevBtn, setPrevBtn] = useState(false);
  const [nextBtn, setNextBtn] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(1);

  const presentationScreen = useMediaQuery({
    query: "(max-width: 414px)",
  });

  const subStringContent = (str, n) => {
    return str.length > n
      ? str.substr(0, n - 1) + "..."
      : str;
  }

  // 로그인 상태 검증 핸들러
  const loginCheckHandler = (e) => {
    // console.log(`ACCESS_TOKEN = ${ACCESS_TOKEN}`)
    if (!isLogin) {
      alert('로그인 후 이용가능합니다.');
      e.preventDefault();
      redirection('/login');
    }
  }

  //현재 페이지 설정
  const currentPageHandler = (clickPageNum) => {
    // console.log(`페이지 클릭 시 현재 페이지 번호 : ${clickPageNum}`)
    setClickCurrentPage(clickPageNum);
  }

  // 내가 쓴 게시글 목록 뿌려주기
  const asyncBoardList = async () => {
    // console.log(`ACCESS_TOKEN : ${ACCESS_TOKEN}`);

    const res = await fetch(API_BASE_URL + `/board-list?page=${clickCurrentPage}&size=10`, {
      method: 'GET',
      headers: headerInfo,
    });

    httpStateCatcher(res.status);

    // 오류 없이 값을 잘 받아왔다면
    const result = await res.json();
    const pageInfo = result.pageInfo;
    // console.log(`boardList pageInfo : `, pageInfo);
    // console.log(`result.boardList  : `, result.boardList);
    setBoardList(result.boardList);
    setPageNation(result.pageInfo);
  };

  // 첫 렌더링 시 작성 게시글 전체 출력
  useEffect(() => {
    asyncBoardList();
  }, [clickCurrentPage]);

  return (
    <div className={'mypage-list-wrapper'}>
      {boardList.length === 0 ? (
        <div>작성한 게시글이 없습니다.</div>
      ) : null}

      {boardList.map((board, i) => (
          <section className={'board-list'} key={i}>
            <div className={'board-type'}>{board.boardType}</div>
            <div className={'board-title'}>
              {
                board.boardType === 'Q&A' &&
                <Link to={`/qna/${board.boardIdx}`} onClick={loginCheckHandler}>
                  {presentationScreen
                    ? subStringContent(board.boardTitle, 28)
                    : subStringContent(board.boardTitle, 40)
                  }
                </Link>
              }
              {
                board.boardType === '멘토/멘티' &&
                <Link to={`/mentors/detail/chat/${board.boardIdx}/0`} onClick={loginCheckHandler}>
                  {presentationScreen
                    ? subStringContent(board.boardTitle, 28)
                    : subStringContent(board.boardTitle, 40)
                  }
                </Link>
              }
              {
                board.boardType === '프로젝트 모집' &&
                <Link to={`/projects/detail?projectIdx=${board.boardIdx}`} onClick={loginCheckHandler}>
                  {presentationScreen
                    ? subStringContent(board.boardTitle, 28)
                    : subStringContent(board.boardTitle, 40)
                  }
                </Link>
              }
              {
                board.boardType === '취업후기' &&
                <Link to={`/reviews/detail/${board.boardIdx}`} onClick={loginCheckHandler}>
                  {presentationScreen
                    ? subStringContent(board.boardTitle, 28)
                    : subStringContent(board.boardTitle, 40)
                  }
                </Link>
              }
            </div>
            <div className={'board-date'}>{board.boardDate}</div>
          </section>
        ))}

      {/* 페이징 */}
      <ul>
        <PageNation
          pageNation={pageNation}
          currentPageHandler={currentPageHandler}
          clickCurrentPage={clickCurrentPage}/>
      </ul>

    </div>
  );
};

export default MypageBoardList;
